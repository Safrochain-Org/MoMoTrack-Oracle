# Getting started

This guide walks you through integrating MoMoTrack into your application on Safrochain testnet.

Before you begin, read [HOW_IT_WORKS.md](./HOW_IT_WORKS.md) for the full payment-to-proof flow and [DATA_SCHEMA.md](./DATA_SCHEMA.md) for payload fields.

## Prerequisites

| Requirement | Notes |
| --- | --- |
| Node.js 20+ | See [`.nvmrc`](../.nvmrc) |
| Safrochain wallet | For verifying on-chain attestations |
| Mobile Money provider account | PowerPay, Cotanipay, or supported aggregator |
| MoMoTrack API access | Request via [GitHub Issues](https://github.com/Safrochain-Org/MoMoTrack-Oracle/issues) during early access |

## Installation

```bash
npm install @safrochain/momotrack
```

For React Native or Flutter, see the platform-specific sections in the README (coming soon).

## Configuration

Create a `.env` file from the template:

```bash
cp .env.example .env
```

Required variables:

| Variable | Description |
| --- | --- |
| `MOMOTRACK_NETWORK` | `safrochain-testnet` or `safrochain-mainnet` |
| `MOMOTRACK_ORACLE_URL` | Oracle endpoint URL |
| `MOMOTRACK_PROVIDER` | `powerpay`, `cotanipay`, or custom adapter name |
| `PROVIDER_API_KEY` | Your aggregator API key (server-side only) |
| `PROVIDER_WEBHOOK_SECRET` | Webhook signing secret from your provider |

> **Security:** Never embed `PROVIDER_API_KEY` in mobile or browser client code. Provider calls belong on your backend; the MoMoTrack SDK handles ZK attestation on the client.

## Basic integration

### 1. Initialize the SDK

```typescript
import { MoMoTrack } from "@safrochain/momotrack";

const momotrack = new MoMoTrack({
  network: process.env.MOMOTRACK_NETWORK,
  oracleUrl: process.env.MOMOTRACK_ORACLE_URL,
  provider: process.env.MOMOTRACK_PROVIDER,
});
```

### 2. Attest a successful payment

After your Mobile Money provider confirms a transaction:

```typescript
const receipt = await momotrack.attest({
  transactionId: "txn_abc123",
  amount: 5000,
  currency: "CDF",
  status: "success",
  metadata: {
    orderId: "order_456",
  },
});

console.log("On-chain proof:", receipt.proofHash);
```

### 3. Verify on-chain

Query Safrochain for the attestation:

```bash
safrochaind query momotrack proof <proof-hash> \
  --node https://rpc.testnet.safrochain.com
```

Replace the query command with the CLI or REST endpoint for your network version.

## Testnet checklist

- [ ] Provider sandbox credentials configured
- [ ] Oracle URL points to testnet deployment
- [ ] SDK `network` set to `safrochain-testnet`
- [ ] Test transaction attested and visible on-chain
- [ ] Webhook signatures validated on your backend

## Integration model

MoMoTrack sits **on top of** your existing aggregator integration:

1. **You** own the PowerPay / Cotanipay API keys, webhooks, and compliance.
2. **Your backend** confirms the payment succeeded.
3. **The SDK** (on the client) generates the ZK proof and submits the attestation.
4. **The oracle** validates and relays to Safrochain.

MoMoTrack does not initiate payments or hold funds.

## Next steps

- [How it works](./HOW_IT_WORKS.md) — Full 6-step flow
- [Architecture](./ARCHITECTURE.md) — Components and deployment
- [Data schema](./DATA_SCHEMA.md) — Attestation payload reference
- [Security model](./SECURITY_MODEL.md) — Privacy and trust boundaries
- [Roadmap](./ROADMAP.md) — What ships when
- [Contributing](../CONTRIBUTING.md)
- [Security policy](../SECURITY.md)

## Need help?

Open a [GitHub Discussion](https://github.com/Safrochain-Org/MoMoTrack-Oracle/discussions) or reach the team on [Discord](https://discord.gg/safrochain).
