import { useEffect, useState } from 'react';
import { useWalletStore } from '../hooks/useWalletStore';
import { createNova, formatNova, parseNova, Wallet } from '@novacoin/sdk';
import { decryptPrivateKey } from '../utils/crypto';

export default function Staking() {
  const { address, encryptedKey, rpcUrl } = useWalletStore();
  const [stakedAmount, setStakedAmount] = useState('0');
  const [pendingRewards, setPendingRewards] = useState('0');
  const [stakeInput, setStakeInput] = useState('');
  const [withdrawInput, setWithdrawInput] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!address) return;

    const fetchStakingInfo = async () => {
      try {
        const nova = createNova(rpcUrl);
        const info = await nova.staking.getStakingInfo(address);
        setStakedAmount(formatNova(info.stakedAmount));
        setPendingRewards(formatNova(info.pendingRewards));
      } catch (err) {
        console.error('Failed to fetch staking info:', err);
      }
    };

    fetchStakingInfo();
    const interval = setInterval(fetchStakingInfo, 30000);
    return () => clearInterval(interval);
  }, [address, rpcUrl]);

  const handleStake = async () => {
    if (!stakeInput || parseFloat(stakeInput) <= 0) {
      setError('Enter a valid amount');
      return;
    }
    if (!password) {
      setError('Password is required');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const privateKey = await decryptPrivateKey(encryptedKey!, password);
      const wallet = Wallet.fromPrivateKey(privateKey as `0x${string}`);
      const nova = createNova(rpcUrl);
      await nova.init();

      const txHash = await nova.staking.stake(wallet, parseNova(stakeInput));
      setSuccess(`Staked successfully! TX: ${txHash.slice(0, 20)}...`);
      setStakeInput('');
    } catch (err: any) {
      setError(err.message || 'Staking failed');
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async () => {
    if (!withdrawInput || parseFloat(withdrawInput) <= 0) {
      setError('Enter a valid amount');
      return;
    }
    if (!password) {
      setError('Password is required');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const privateKey = await decryptPrivateKey(encryptedKey!, password);
      const wallet = Wallet.fromPrivateKey(privateKey as `0x${string}`);
      const nova = createNova(rpcUrl);
      await nova.init();

      const txHash = await nova.staking.withdraw(wallet, parseNova(withdrawInput));
      setSuccess(`Withdrawal initiated! TX: ${txHash.slice(0, 20)}...`);
      setWithdrawInput('');
    } catch (err: any) {
      setError(err.message || 'Withdrawal failed');
    } finally {
      setLoading(false);
    }
  };

  const handleClaimRewards = async () => {
    if (!password) {
      setError('Password is required');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const privateKey = await decryptPrivateKey(encryptedKey!, password);
      const wallet = Wallet.fromPrivateKey(privateKey as `0x${string}`);
      const nova = createNova(rpcUrl);
      await nova.init();

      const txHash = await nova.staking.claimRewards(wallet);
      setSuccess(`Rewards claimed! TX: ${txHash.slice(0, 20)}...`);
    } catch (err: any) {
      setError(err.message || 'Claim failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-white">Staking</h1>

      {/* Staking Overview */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="text-sm text-gray-400 mb-1">Staked Amount</div>
          <div className="text-2xl font-bold text-white">
            {stakedAmount} <span className="text-purple-400">NOVA</span>
          </div>
        </div>
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="text-sm text-gray-400 mb-1">Pending Rewards</div>
          <div className="text-2xl font-bold text-white">
            {pendingRewards} <span className="text-green-400">NOVA</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      {error && (
        <div className="bg-red-900/50 border border-red-500 rounded-lg p-3 text-red-400 text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-900/50 border border-green-500 rounded-lg p-3 text-green-400 text-sm">
          {success}
        </div>
      )}

      {/* Stake Form */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Stake NOVA</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Amount to Stake</label>
            <input
              type="number"
              value={stakeInput}
              onChange={(e) => setStakeInput(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
              placeholder="Min: 32 NOVA"
              min="32"
            />
          </div>
          <p className="text-xs text-gray-500">
            Minimum stake is 32 NOVA. Staked tokens are locked for the unbonding period (7 days).
          </p>
        </div>
      </div>

      {/* Withdraw Form */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Withdraw Stake</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Amount to Withdraw</label>
            <input
              type="number"
              value={withdrawInput}
              onChange={(e) => setWithdrawInput(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
              placeholder="0.0"
            />
          </div>
        </div>
      </div>

      {/* Password & Actions */}
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="mb-4">
          <label className="block text-sm text-gray-400 mb-1">Password (for signing)</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
            placeholder="Enter your password"
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleStake}
            disabled={loading || !stakeInput}
            className="flex-1 py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? '...' : 'Stake'}
          </button>
          <button
            onClick={handleWithdraw}
            disabled={loading || !withdrawInput}
            className="flex-1 py-2 px-4 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? '...' : 'Withdraw'}
          </button>
          <button
            onClick={handleClaimRewards}
            disabled={loading}
            className="flex-1 py-2 px-4 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? '...' : 'Claim Rewards'}
          </button>
        </div>
      </div>
    </div>
  );
}
