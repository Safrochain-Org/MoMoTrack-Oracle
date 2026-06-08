# MoMoTrack

**On-chain Mobile Money Verification for Africa**

MoMoTrack allows P2P, remittance, tontine, and DeFi applications to turn Mobile Money payments into immutable proofs on Safrochain. It eliminates manual proofs and trust issues.

## Features
- Support for major aggregators (PowerPay, Cotanipay, and more)
- Zero-Knowledge proofs on the client device for phone number privacy
- Automatic on-chain recording of transaction status, amount, and timestamp
- Lightweight SDK for mobile and web
- Fully open source and free to use

## How It Works
1. Developer integrates their chosen Mobile Money provider normally (using their own API keys).
2. Adds the MoMoTrack SDK to their application.
3. On successful transaction, the SDK captures the result, applies ZK-proof, securely forwards to the oracle, and records on Safrochain.

## SDK Installation

```bash
npm install @safrochain/momotrack
# or equivalent for Flutter / React Native
