/// <reference types="vite/client" />

declare module '@novacoin/sdk' {
  export interface TransactionRequest {
    to: `0x${string}`;
    value?: bigint;
    data?: `0x${string}`;
    nonce?: number;
    gasLimit?: bigint;
    maxFeePerGas?: bigint;
    maxPriorityFeePerGas?: bigint;
  }

  export interface SignedTransaction {
    hash: string;
    raw: string;
  }

  export interface StakingInfo {
    stakedAmount: bigint;
    pendingRewards: bigint;
    unlockTime: number;
  }

  export class Wallet {
    static generate(): Wallet;
    static fromPrivateKey(key: `0x${string}`): Wallet;
    readonly address: `0x${string}`;
    getPrivateKey(): string;
    signTransaction(tx: TransactionRequest, chainId: bigint): SignedTransaction;
    signMessage(message: string): string;
  }

  export interface NovaClient {
    getBalance(address: string): Promise<bigint>;
    getChainId(): Promise<bigint>;
    sendRawTransaction(raw: string): Promise<string>;
    getTransactionCount(address: string): Promise<number>;
  }

  export interface TransactionBuilder {
    buildTransfer(
      from: string,
      to: `0x${string}`,
      value: bigint
    ): Promise<TransactionRequest>;
  }

  export interface StakingManager {
    getStakingInfo(address: string): Promise<StakingInfo>;
    stake(wallet: Wallet, amount: bigint): Promise<string>;
    withdraw(wallet: Wallet, amount: bigint): Promise<string>;
    claimRewards(wallet: Wallet): Promise<string>;
  }

  export interface Nova {
    client: NovaClient;
    txBuilder: TransactionBuilder;
    staking: StakingManager;
    init(): Promise<void>;
  }

  export function createNova(rpcUrl: string): Nova;
  export function parseNova(amount: string): bigint;
  export function formatNova(amount: bigint): string;
}
