# Roadmap

Public implementation plan for MoMoTrack Oracle. Dates are targets, not commitments. Track progress via [GitHub Issues](https://github.com/Safrochain-Org/MoMoTrack-Oracle/issues) and [milestones](https://github.com/Safrochain-Org/MoMoTrack-Oracle/milestones).

## Vision

Make every successful Mobile Money payment in Africa verifiable on Safrochain with one SDK import, without replacing existing aggregator relationships or handling funds.

## Phases

### Phase 0 — Open source foundation ✅

| Item | Status |
| --- | --- |
| MIT license, CONTRIBUTING, SECURITY, CODE_OF_CONDUCT | Done |
| GitHub issue/PR templates and CI | Done |
| Architecture and flow documentation | Done |
| Data schema and security model docs | Done |

### Phase 1 — SDK alpha (TypeScript)

| Item | Status |
| --- | --- |
| `@safrochain/momotrack` package scaffold | Planned |
| `MoMoTrack` client with `attest()` API | Planned |
| Pedersen commitment ZK layer (alpha) | Planned |
| Unit tests + ESLint + Vitest | Planned |
| `examples/node-basic` | Planned |

**Exit criteria:** Successful testnet attestation from Node.js example.

### Phase 2 — Oracle MVP

| Item | Status |
| --- | --- |
| `POST /v1/attest` endpoint | Planned |
| Signature + ZK validation | Planned |
| Deduplication and rate limiting | Planned |
| Safrochain relay integration | Planned |
| Docker Compose local dev stack | Planned |
| Oracle integration tests | Planned |

**Exit criteria:** End-to-end flow from SDK to on-chain event on testnet.

### Phase 3 — On-chain module

| Item | Status |
| --- | --- |
| Cosmos SDK / CosmWasm proof module | Planned |
| `momotrack/proof_recorded` events | Planned |
| CLI + REST query commands | Planned |
| Oracle key allowlist governance | Planned |
| Contract address registry in docs | Planned |

**Exit criteria:** Third party can verify proof without MoMoTrack team involvement.

### Phase 4 — Provider adapters

| Provider | Status |
| --- | --- |
| PowerPay | Planned |
| Cotanipay | Planned |
| Generic webhook adapter interface | Planned |
| Optional aggregator cache cross-check | Planned |

**Exit criteria:** Two production aggregators with documented setup guides.

### Phase 5 — Multi-platform SDK

| Platform | Status |
| --- | --- |
| React Native | Planned |
| Flutter | Planned |
| Browser / WASM ZK | Planned |

**Exit criteria:** Same attestation flow on iOS, Android, and web.

### Phase 6 — Production hardening

| Item | Status |
| --- | --- |
| zk-SNARK circuit (audited) | Planned |
| CodeQL + secret scanning in CI | Planned |
| npm publish workflow | Planned |
| Multi-node oracle deployment guide | Planned |
| Monitoring dashboard + alerts | Planned |
| `v1.0.0` release | Planned |

**Exit criteria:** Mainnet deployment with published SLA and runbook.

## Documentation roadmap

| Document | Phase |
| --- | --- |
| [HOW_IT_WORKS.md](./HOW_IT_WORKS.md) | 0 ✅ |
| [DATA_SCHEMA.md](./DATA_SCHEMA.md) | 0 ✅ |
| [SECURITY_MODEL.md](./SECURITY_MODEL.md) | 0 ✅ |
| `ORACLE_API.md` | 2 |
| `PROVIDERS.md` | 4 |
| `NETWORKS.md` | 3 |
| `RUNBOOK.md` | 6 |

## How to influence the roadmap

1. **Vote with issues** — Open a [feature request](https://github.com/Safrochain-Org/MoMoTrack-Oracle/issues/new?template=feature_request.yml).
2. **Provider priority** — File a [provider request](https://github.com/Safrochain-Org/MoMoTrack-Oracle/issues/new?template=provider_request.yml).
3. **Contribute code** — See [CONTRIBUTING.md](../CONTRIBUTING.md); pick an unassigned Phase 1–2 issue.

## Versioning policy

| Tag | Meaning |
| --- | --- |
| `v0.x.y` | Pre-release; API may change |
| `v1.0.0` | Stable SDK + oracle API; semver thereafter |

Breaking schema changes increment the `version` field in attestation payloads and are documented in [CHANGELOG.md](../CHANGELOG.md).
