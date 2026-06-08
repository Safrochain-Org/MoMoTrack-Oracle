# Data schema

This document defines the data structures exchanged between the SDK, oracle, and Safrochain on-chain module. Field names and types may evolve before `v1.0.0`; breaking changes will be noted in [CHANGELOG.md](../CHANGELOG.md).

## Overview

```text
Aggregator response  →  SDK input  →  Attestation payload  →  Oracle record  →  On-chain proof
```

Each layer strips or transforms sensitive fields. Only the minimum required for verification reaches the chain.

## SDK input (application → SDK)

Your app passes the aggregator transaction result to the SDK after a successful payment.

```typescript
interface AttestInput {
  /** Aggregator transaction ID or reference */
  transactionId: string;

  /** Amount in minor units (e.g. centimes) */
  amount: number;

  /** ISO 4217 currency code */
  currency: string;

  /** Only `success` is attested on-chain by default */
  status: "success" | "pending" | "failed";

  /** Unix timestamp (seconds) from aggregator */
  timestamp: number;

  /** Sender MSISDN: used locally for ZK proof, never sent in plaintext */
  senderMsisdn: string;

  /** Receiver MSISDN: used locally for ZK proof, never sent in plaintext */
  receiverMsisdn: string;

  /** Optional app-level metadata (hashed or omitted on-chain if large) */
  metadata?: Record<string, string>;
}
```

## ZK proof envelope (device-local)

Generated on the client. Exact circuit depends on implementation phase.

```typescript
interface ZkProofEnvelope {
  /** Proof bytes (SNARK) or commitment + opening */
  proof: string;

  /** Public inputs visible to oracle and verifiers */
  publicInputs: {
    /** Commitment to sender identifier */
    senderCommitment: string;

    /** Commitment to receiver identifier */
    receiverCommitment: string;

    /** Hash of transactionId + amount + timestamp + status */
    transactionDigest: string;
  };

  /** Proof system identifier, e.g. `groth16-v1`, `pedersen-v1` */
  scheme: string;
}
```

## Attestation payload (SDK → oracle)

Submitted via `POST /v1/attest` (see [ORACLE_API.md](./ORACLE_API.md) when published).

```json
{
  "version": "1",
  "network": "safrochain-testnet",
  "provider": "powerpay",
  "transaction": {
    "id": "txn_abc123",
    "amount": "5000",
    "currency": "CDF",
    "status": "success",
    "timestamp": 1717843200
  },
  "zk": {
    "scheme": "pedersen-v1",
    "proof": "<base64>",
    "publicInputs": {
      "senderCommitment": "0x...",
      "receiverCommitment": "0x...",
      "transactionDigest": "0x..."
    }
  },
  "signature": "<base64-or-hex>",
  "signer": "safro1..."
}
```

### Field rules

| Field | Rule |
| --- | --- |
| `amount` | String integer in minor units; no floats |
| `timestamp` | Unix seconds; must be within oracle clock skew window |
| `status` | Only `success` accepted for on-chain relay by default |
| `signature` | Signs canonical JSON of `version` through `zk` |
| `signer` | Safrochain bech32 address or app-configured key ID |

## Oracle validation record (internal)

Stored off-chain for deduplication and audit. **Must not contain raw MSISDNs.**

```typescript
interface OracleValidationRecord {
  id: string;
  transactionId: string;
  network: string;
  provider: string;
  amount: string;
  currency: string;
  timestamp: number;
  proofHash: string;
  signer: string;
  validatedAt: number;
  onChainTxHash?: string;
  status: "validated" | "relayed" | "rejected";
  rejectReason?: string;
}
```

## On-chain proof record

Minimal storage on Safrochain. Emitted as event + state entry.

```typescript
interface OnChainProof {
  /** Unique proof identifier (content-addressed or sequential) */
  proofId: string;

  /** Aggregator transaction reference */
  transactionRef: string;

  /** Amount in minor units */
  amount: string;

  /** ISO 4217 */
  currency: string;

  /** Block time or attested timestamp */
  timestamp: number;

  /** ZK public commitments */
  senderCommitment: string;
  receiverCommitment: string;

  /** Oracle attestation signature */
  oracleSignature: string;

  /** Provider identifier */
  provider: string;
}
```

### On-chain event (conceptual)

```json
{
  "type": "momotrack/proof_recorded",
  "attributes": {
    "proof_id": "proof_7f3a...",
    "transaction_ref": "txn_abc123",
    "amount": "5000",
    "currency": "CDF",
    "provider": "powerpay"
  }
}
```

## Error response schema (oracle)

```json
{
  "error": {
    "code": "invalid_proof",
    "message": "ZK proof verification failed",
    "requestId": "req_9b2c..."
  }
}
```

| Code | HTTP | Meaning |
| --- | --- | --- |
| `invalid_payload` | 400 | Missing or malformed fields |
| `invalid_signature` | 401 | Signature verification failed |
| `invalid_proof` | 422 | ZK proof rejected |
| `duplicate_attestation` | 409 | Transaction already recorded |
| `provider_mismatch` | 422 | Provider not registered for network |
| `relay_failed` | 502 | On-chain submission failed |

## Privacy mapping

| Data | SDK | Oracle logs | On-chain |
| --- | --- | --- | --- |
| Raw MSISDN | Local only | Never | Never |
| ZK commitments | In payload | Hashed refs only | Yes |
| Amount, currency | Yes | Yes | Yes |
| Transaction ID | Yes | Yes | Yes |
| App metadata | Optional | Redacted | Hash or omit |

## Versioning

| `version` field | Semantics |
| --- | --- |
| `1` | Initial public schema (this document) |

SDK and oracle must reject unsupported `version` values with `invalid_payload`.
