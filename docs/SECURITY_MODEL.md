# Security model

MoMoTrack is a verification oracle, not a payment rail. This document describes what the system protects, what it does not guarantee, and how trust is distributed across participants.

## Design principles

1. **No custody** — MoMoTrack never holds, routes, or settles funds.
2. **Minimal on-chain data** — Only fields required for verification are stored on Safrochain.
3. **Client-side privacy** — Sensitive identifiers are processed and masked on the user device.
4. **Cryptographic verifiability** — Every on-chain record links to a signed, provable attestation.
5. **Transparency** — Open-source code (MIT) for public audit.
6. **Opt-in** — Only transactions explicitly sent through the SDK are attested.

## Trust boundaries

```text
┌──────────────────────────────────────────────────────────────┐
│  TRUSTED BY DEVELOPER                                        │
│  • Aggregator API keys                                       │
│  • Backend webhook verification                              │
│  • Business logic (when to call SDK)                         │
└──────────────────────────────────────────────────────────────┘
                              │
┌──────────────────────────────────────────────────────────────┐
│  TRUSTED BY END USER                                         │
│  • Their device (SDK + ZK runs locally)                      │
│  • Wallet / signing key                                      │
└──────────────────────────────────────────────────────────────┘
                              │
┌──────────────────────────────────────────────────────────────┐
│  TRUSTED BY ECOSYSTEM                                        │
│  • MoMoTrack oracle (validation + relay integrity)           │
│  • Safrochain consensus (immutability of recorded proofs)    │
└──────────────────────────────────────────────────────────────┘
```

## Threat model

### In scope

| Threat | Mitigation |
| --- | --- |
| Plaintext phone number leakage | ZK proofs / commitments on client; no MSISDN in oracle or chain payloads |
| Forged attestation without payment | ZK proof binds to transaction digest; optional aggregator cache cross-check |
| Replay of old attestations | Oracle deduplication on `transactionId` + `provider` + `network` |
| Unauthorized oracle submissions | Payload signature verification |
| Oracle impersonation on-chain | Oracle signing key registered in contract; verify `oracleSignature` |
| Man-in-the-middle on SDK → oracle | TLS 1.2+; certificate pinning recommended for mobile |
| Log injection of PII | Structured logging policy; redaction in oracle service |

### Out of scope

| Scenario | Owner |
| --- | --- |
| Aggregator API compromise | Developer + provider |
| User device fully compromised | End user (standard mobile threat model) |
| Dishonest developer skipping SDK | Application layer; MoMoTrack cannot force attestation |
| Regulatory compliance for MoMo operations | Developer ↔ licensed aggregator |
| Safrochain validator set compromise | Safrochain network governance |

## Zero-knowledge layer

The ZK layer proves statements about a payment **without revealing raw identifiers**.

### Target statements (v1)

- A payment with reference `R` occurred with amount `A` at time `T`.
- Parties `S` and `Rcv` participated (as commitments, not plaintext).
- The proof was generated from data consistent with the signed transaction digest.

### Implementation phases

| Phase | Approach | Privacy level |
| --- | --- | --- |
| **Alpha** | Pedersen commitments + hash binding | Hides MSISDN; simpler audit surface |
| **Beta** | zk-SNARK circuit for full payment statement | Stronger proof; larger client bundle |
| **GA** | Final circuit audited by third party | Production grade |

Exact library selection (e.g. circom, arkworks, bellman) will be documented in release notes.

## Oracle security

### Validation pipeline

```text
Receive → TLS terminate → rate limit → signature verify → ZK verify
       → dedupe → sanity check → [optional cache check] → relay → respond
```

### Operational controls

| Control | Purpose |
| --- | --- |
| Rate limiting per signer / IP | Abuse prevention |
| mTLS or API key (operator config) | Restrict oracle ingress in private deployments |
| Redundant nodes | Availability; no single point of failure |
| Key rotation | Oracle signing keys rotatable on-chain |
| Failed tx not relayed | Chain only records validated successes |

### What oracle logs may contain

- Request ID, timestamp, network, provider
- Transaction reference, amount, currency (no MSISDN)
- Validation result, proof hash, on-chain tx hash
- Error codes (no raw proof bytes in production logs)

## On-chain security

The Safrochain module or contract is intentionally minimal:

- Small attack surface for audit
- Low gas / fee footprint for high-volume attestations
- Events for off-chain indexers without storing excess data
- Oracle public key allowlist or module parameter for signer verification

Consumers must verify:

1. Proof exists on expected contract address for their network.
2. `oracleSignature` matches a registered oracle key.
3. `transactionRef` matches their business record.
4. ZK public inputs match their expected commitment scheme.

## Developer responsibilities

| Responsibility | Recommendation |
| --- | --- |
| API key storage | Secrets manager; never in client bundles |
| Webhook verification | Validate aggregator signatures server-side |
| When to call SDK | Only after your backend confirms success |
| Key management | Use hardware-backed keys on mobile where possible |
| On-chain verification | Pin contract addresses per network in config |

## Reporting vulnerabilities

Do **not** file public issues for security findings.

Email [security@safrochain.com](mailto:security@safrochain.com). See [SECURITY.md](../SECURITY.md) for disclosure timeline and safe harbor policy.

## Related documents

- [HOW_IT_WORKS.md](./HOW_IT_WORKS.md) — End-to-end flow
- [DATA_SCHEMA.md](./DATA_SCHEMA.md) — Payload and privacy mapping
- [SECURITY.md](../SECURITY.md) — Vulnerability reporting process
