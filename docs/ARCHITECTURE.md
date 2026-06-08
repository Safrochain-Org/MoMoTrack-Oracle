# Architecture

MoMoTrack Oracle bridges Mobile Money payment events and Safrochain on-chain proofs. This document describes the main components and trust boundaries.

## System overview

```text
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  End-user app   │     │  Your backend    │     │  MM aggregator  │
│  (MoMoTrack SDK)│────▶│  (provider API)  │────▶│  PowerPay, etc. │
└────────┬────────┘     └──────────────────┘     └─────────────────┘
         │ ZK attestation
         ▼
┌─────────────────┐     ┌─────────────────┐
│ MoMoTrack Oracle│────▶│   Safrochain    │
│   (this repo)   │     │  proof module   │
└─────────────────┘     └─────────────────┘
```

## Components

### MoMoTrack SDK (client)

Runs in the end-user application (web, React Native, or Flutter).

| Responsibility | Details |
| --- | --- |
| Capture payment result | Receives transaction outcome from your app layer |
| ZK proof generation | Proves payment validity without exposing phone number |
| Oracle submission | Sends signed attestation payload to the oracle |

The SDK never holds provider API keys. Those stay on your server.

### Your backend

| Responsibility | Details |
| --- | --- |
| Provider integration | Initiates and confirms Mobile Money transactions |
| Webhook handling | Validates provider callbacks with signature verification |
| Business logic | Maps payments to orders, users, or escrow contracts |

### MoMoTrack Oracle

The oracle service in this repository.

| Responsibility | Details |
| --- | --- |
| Attestation validation | Verifies SDK signatures and ZK proofs |
| Deduplication | Rejects replayed transaction IDs |
| On-chain write | Submits proof records to Safrochain |
| Provider registry | Maps aggregator adapters to attestation schemas |

### Safrochain proof module

On-chain module that stores immutable payment proofs consumable by dApps, escrow contracts, and reconciliation tools.

## Data flow

1. User completes a Mobile Money payment through your provider integration.
2. Your backend confirms the transaction via provider API or webhook.
3. Your app invokes the SDK with the transaction result (no raw phone number).
4. SDK generates a ZK proof and submits an attestation to the oracle.
5. Oracle validates the payload and writes the proof to Safrochain.
6. Your app or smart contract reads the on-chain proof for settlement.

## Trust model

| Actor | Trust assumption |
| --- | --- |
| End user | Controls their device; SDK runs locally |
| Your backend | Holds provider credentials; must secure webhooks |
| MoMoTrack Oracle | Validates proofs; does not store PII |
| Safrochain validators | Standard Cosmos SDK consensus guarantees |

## Privacy

- Phone numbers and MSISDNs are never sent to the oracle in plaintext.
- ZK proofs are generated on the client device.
- Oracle logs must not contain PII; see [SECURITY.md](../SECURITY.md).

## Extensibility

New Mobile Money providers implement the shared adapter interface:

```text
ProviderAdapter
├── validateWebhook(payload, signature) → boolean
├── normalizeTransaction(raw) → AttestationInput
└── providerId() → string
```

Submit new adapters via pull request. Start with the [provider request issue template](../.github/ISSUE_TEMPLATE/provider_request.yml).

## Related repositories

| Repository | Role |
| --- | --- |
| [safrochain-node](https://github.com/Safrochain-Org/safrochain-node) | Safrochain Layer 1 and on-chain modules |
| [MoMoTrack-Oracle](https://github.com/Safrochain-Org/MoMoTrack-Oracle) | Oracle service and SDK (this repo) |
