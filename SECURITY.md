# Security Policy

## Supported versions

Security fixes are applied to the latest release on `main` and the most recent tagged release. Older versions receive fixes at maintainer discretion.

| Version | Supported |
| --- | --- |
| `main` (latest) | Yes |
| Latest tagged release | Yes |
| Older releases | Best effort |

## Reporting a vulnerability

**Do not open a public GitHub issue for security vulnerabilities.**

Report privately so we can investigate and patch before disclosure.

| Channel | Details |
| --- | --- |
| **Email** | [security@safrochain.com](mailto:security@safrochain.com) |
| **Subject** | `[MoMoTrack-Oracle] Brief description` |
| **PGP** | Available on request |

### What to include

- Description of the vulnerability and impact
- Steps to reproduce or a proof of concept
- Affected versions or commit SHA
- Suggested fix (optional)
- Your contact information for follow-up

### What we protect

MoMoTrack handles payment attestations and privacy-sensitive metadata. Reports involving any of the following are especially important:

- Exposure of phone numbers, MSISDNs, or other PII outside ZK proofs
- Oracle manipulation or unauthorized on-chain writes
- Authentication bypass on oracle endpoints
- Weak or missing webhook signature verification for provider callbacks
- Hardcoded secrets or API keys in the repository or release artifacts
- Denial-of-service vectors against the oracle service

## Response timeline

| Stage | Target |
| --- | --- |
| Initial acknowledgment | 2 business days |
| Severity assessment | 5 business days |
| Fix or mitigation plan | 15 business days (critical may be faster) |
| Coordinated disclosure | After patch is available |

We may request additional information. If we cannot reproduce the issue, we will work with you to clarify.

## Disclosure policy

- We practice **coordinated disclosure**.
- We will not disclose your identity without permission.
- Credit is given in the advisory and `CHANGELOG.md` when desired.
- Public disclosure should wait until a fix is released, unless the issue is already public.

## Safe harbor

We support good-faith security research on MoMoTrack Oracle within these boundaries:

- Do not access data that is not yours.
- Do not degrade service for other users.
- Do not exploit findings beyond what is needed to demonstrate impact.
- Stop and report when you discover sensitive user data.

Research that follows this policy will not be pursued as a legal matter by Safrochain.

## Security best practices for integrators

- Store Mobile Money API keys in a secrets manager, not in client-side code.
- Run the SDK ZK proof step on the end-user device; never send raw phone numbers to your backend.
- Verify on-chain attestations against your expected Safrochain contract address.
- Pin SDK and oracle versions in production.
- Rotate provider credentials on a regular schedule.

## Dependencies

We monitor dependencies via [Dependabot](.github/dependabot.yml) and CI security audits. Report supply-chain concerns to the same security email.
