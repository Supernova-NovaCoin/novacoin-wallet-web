import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Address, Hex } from '@novacoin/sdk';

interface WalletState {
  // State
  isInitialized: boolean;
  address: Address | null;
  encryptedKey: string | null;
  balance: bigint;
  network: 'mainnet' | 'testnet';
  rpcUrl: string;

  // Actions
  initialize: (address: Address, encryptedKey: string) => void;
  setBalance: (balance: bigint) => void;
  setNetwork: (network: 'mainnet' | 'testnet') => void;
  setRpcUrl: (url: string) => void;
  lock: () => void;
  reset: () => void;
}

const DEFAULT_RPC_URLS = {
  mainnet: 'https://rpc.novacoin.io',
  testnet: 'https://testnet-rpc.novacoin.io',
};

export const useWalletStore = create<WalletState>()(
  persist(
    (set) => ({
      // Initial state
      isInitialized: false,
      address: null,
      encryptedKey: null,
      balance: 0n,
      network: 'testnet',
      rpcUrl: DEFAULT_RPC_URLS.testnet,

      // Actions
      initialize: (address, encryptedKey) =>
        set({
          isInitialized: true,
          address,
          encryptedKey,
        }),

      setBalance: (balance) => set({ balance }),

      setNetwork: (network) =>
        set({
          network,
          rpcUrl: DEFAULT_RPC_URLS[network],
        }),

      setRpcUrl: (rpcUrl) => set({ rpcUrl }),

      lock: () =>
        set({
          // Keep address but clear sensitive data
        }),

      reset: () =>
        set({
          isInitialized: false,
          address: null,
          encryptedKey: null,
          balance: 0n,
        }),
    }),
    {
      name: 'novacoin-wallet',
      partialize: (state) => ({
        isInitialized: state.isInitialized,
        address: state.address,
        encryptedKey: state.encryptedKey,
        network: state.network,
        rpcUrl: state.rpcUrl,
      }),
    }
  )
);

// Hook for accessing balance as formatted string
export function useFormattedBalance() {
  const balance = useWalletStore((state) => state.balance);
  return formatBalance(balance);
}

function formatBalance(wei: bigint): string {
  const decimals = 18n;
  const divisor = 10n ** decimals;
  const integerPart = wei / divisor;
  const fractionalPart = wei % divisor;

  if (fractionalPart === 0n) {
    return integerPart.toString();
  }

  const fracStr = fractionalPart.toString().padStart(18, '0').slice(0, 4);
  return `${integerPart}.${fracStr}`;
}
