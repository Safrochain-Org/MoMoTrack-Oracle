# Contributing to MoMoTrack Oracle

Thank you for helping build verifiable Mobile Money infrastructure for Africa. This guide explains how to contribute effectively, what we review, and how to get changes merged.

## TL;DR

1. Fork the repo and branch from `main`.
2. Install dependencies and run `npm run verify` locally.
3. Open a Pull Request with a clear summary and test plan.
4. CI must pass; a maintainer reviews; squash-merge on approval.

## What we welcome

| Contribution | Examples |
| --- | --- |
| **Bug fixes** | Oracle submission errors, SDK edge cases, provider adapter fixes |
| **Provider adapters** | New Mobile Money aggregator integrations |
| **Documentation** | Setup guides, architecture notes, code examples |
| **Tests** | Unit, integration, and contract tests for oracle flows |
| **Performance** | Latency improvements, batch attestation, caching |
| **Security hardening** | Input validation, rate limiting, ZK circuit review |

## What we will likely close

- Changes that expose phone numbers or PII without a ZK privacy layer.
- Provider adapters that embed hardcoded API keys or secrets.
- Large refactors without an open issue discussing scope.
- Drive-by formatting changes with no functional or docs improvement.
- PRs that skip `npm run verify` and fail CI.

## Getting started

### Prerequisites

- Node.js 20+ (see [`.nvmrc`](./.nvmrc))
- npm 10+
- Git

### Setup

```bash
git clone https://github.com/<your-fork>/MoMoTrack-Oracle.git
cd MoMoTrack-Oracle
nvm use
npm install
npm run verify
```

Copy environment templates before running locally:

```bash
cp .env.example .env
```

Never commit `.env` or real API keys.

## Branching and commits

- Branch off `main`.
- Use short prefixes: `feat/`, `fix/`, `docs/`, `chore/`, `test/`, `ci/`.
- One logical change per branch. Smaller PRs review faster.

We use **Conventional Commits** for merge subjects:

```text
type(scope): short description

Optional body: what and why, not how.
```

| Type | When to use |
| --- | --- |
| `feat` | New feature or provider adapter |
| `fix` | Bug fix |
| `docs` | Documentation only |
| `test` | Tests only |
| `refactor` | Code change without behavior change |
| `chore` | Tooling, deps, CI |
| `ci` | CI workflow changes |
| `security` | Security-related fix |

Examples:

```text
feat(powerpay): add webhook signature verification
fix(sdk): handle empty transaction status
docs(getting-started): add testnet configuration
```

## Pull request checklist

Before requesting review, confirm:

- [ ] `npm run verify` passes locally
- [ ] New code includes tests where behavior changed
- [ ] Public APIs are documented in `docs/` or JSDoc
- [ ] No secrets, API keys, or PII in commits
- [ ] `CHANGELOG.md` updated for user-facing changes
- [ ] PR description includes **Summary**, **Why**, and **Test plan**

Use the [pull request template](.github/pull_request_template.md).

## Code style

- Match existing patterns in the file you edit.
- TypeScript: strict mode, explicit return types on public APIs.
- Prefer small, focused functions over large abstractions.
- Comments explain *why*, not *what* the code already shows.

Run formatters and linters before pushing:

```bash
npm run lint
npm run format:check
```

## Provider adapter guidelines

When adding a Mobile Money provider:

1. Open an issue using the [provider request template](.github/ISSUE_TEMPLATE/provider_request.yml) first.
2. Implement adapter behind the shared provider interface.
3. Document required env vars in `.env.example` (names only, no values).
4. Add integration tests with mocked provider responses.
5. Never log raw phone numbers or payment credentials.

## Testing

```bash
npm test              # unit tests
npm run test:integration   # integration tests (when available)
npm run verify        # full local verification suite
```

Integration tests that hit real provider APIs must be opt-in via env flags and must not run in CI by default.

## Security contributions

See [SECURITY.md](./SECURITY.md). Do **not** file public issues for vulnerabilities. Email `security@safrochain.com` instead.

We credit reporters in the security advisory when they wish to be named.

## Code of conduct

This project follows the [Contributor Covenant](./CODE_OF_CONDUCT.md). Be respectful, constructive, and inclusive.

## Questions

- **Usage questions**: [GitHub Discussions](https://github.com/Safrochain-Org/MoMoTrack-Oracle/discussions) or [Discord](https://discord.gg/safrochain)
- **Bug reports**: [Issue tracker](https://github.com/Safrochain-Org/MoMoTrack-Oracle/issues/new?template=bug_report.yml)
- **Feature ideas**: [Feature request template](.github/ISSUE_TEMPLATE/feature_request.yml)

Maintainers aim to respond within a few business days.
