# NovaCoin Web Wallet

Browser-based cryptocurrency wallet for NovaCoin.

## Features

- Create and import wallets
- Send and receive NOVA tokens
- Staking operations (deposit, withdraw, claim rewards)
- Multiple network support (mainnet, testnet, custom RPC)
- Client-side encryption for key storage
- Transaction history

## Tech Stack

- React 18 + TypeScript
- Vite build tool
- Tailwind CSS
- Zustand state management
- @novacoin/sdk for blockchain interaction

## Development

### Prerequisites

- Node.js >= 18
- pnpm (recommended) or npm

### Setup

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

### Environment Variables

Create `.env.local`:

```env
VITE_DEFAULT_RPC_URL=https://rpc.novacoin.io
VITE_CHAIN_ID=1
```

## Project Structure

```
src/
├── components/       # Reusable React components
│   └── Layout.tsx    # Main app layout with navigation
├── pages/            # Route pages
│   ├── Welcome.tsx   # Create/Import wallet
│   ├── Dashboard.tsx # Balance and quick actions
│   ├── Send.tsx      # Send transactions
│   ├── Receive.tsx   # Display address
│   ├── Staking.tsx   # Staking operations
│   └── Settings.tsx  # Network and wallet settings
├── hooks/            # Custom React hooks
│   └── useWalletStore.ts  # Zustand wallet state
├── utils/            # Utility functions
│   └── crypto.ts     # PBKDF2 + AES-GCM encryption
└── styles/           # CSS and Tailwind config
```

## Security

- Private keys are encrypted with PBKDF2 + AES-GCM
- Keys never leave the browser
- Password required for all signing operations
- No tracking or analytics

## Related Repositories

- [novacoin](https://github.com/novacoin/novacoin) - Core Blockchain
- [novacoin-sdk-ts](https://github.com/novacoin/novacoin-sdk-ts) - TypeScript SDK
- [novacoin-docs](https://github.com/novacoin/novacoin-docs) - Documentation

## License

MIT License
