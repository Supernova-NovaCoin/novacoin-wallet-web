import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wallet } from '@novacoin/sdk';
import { useWalletStore } from '../hooks/useWalletStore';
import { encryptPrivateKey } from '../utils/crypto';

export default function Welcome() {
  const navigate = useNavigate();
  const initialize = useWalletStore((state) => state.initialize);
  const [mode, setMode] = useState<'choice' | 'create' | 'import'>('choice');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [privateKey, setPrivateKey] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const wallet = Wallet.generate();
      const encryptedKey = await encryptPrivateKey(wallet.getPrivateKey(), password);
      initialize(wallet.address, encryptedKey);
      navigate('/');
    } catch (err) {
      setError('Failed to create wallet');
    } finally {
      setLoading(false);
    }
  };

  const handleImport = async () => {
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    if (!privateKey.startsWith('0x') || privateKey.length !== 66) {
      setError('Invalid private key format');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const wallet = Wallet.fromPrivateKey(privateKey as `0x${string}`);
      const encryptedKey = await encryptPrivateKey(privateKey, password);
      initialize(wallet.address, encryptedKey);
      navigate('/');
    } catch (err) {
      setError('Invalid private key');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-purple-400 mb-2">NovaCoin</h1>
          <p className="text-gray-400">Secure Web Wallet</p>
        </div>

        {/* Choice Mode */}
        {mode === 'choice' && (
          <div className="bg-gray-800 rounded-lg p-6 space-y-4">
            <h2 className="text-xl font-semibold text-white text-center mb-6">
              Get Started
            </h2>
            <button
              onClick={() => setMode('create')}
              className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors"
            >
              Create New Wallet
            </button>
            <button
              onClick={() => setMode('import')}
              className="w-full py-3 px-4 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors"
            >
              Import Existing Wallet
            </button>
            <p className="text-xs text-gray-500 text-center mt-4">
              Your private keys are encrypted and stored locally in your browser.
              They are never sent to any server.
            </p>
          </div>
        )}

        {/* Create Mode */}
        {mode === 'create' && (
          <div className="bg-gray-800 rounded-lg p-6 space-y-4">
            <h2 className="text-xl font-semibold text-white">Create New Wallet</h2>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                placeholder="Enter password (min 8 characters)"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                placeholder="Confirm password"
              />
            </div>
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <div className="flex gap-3">
              <button
                onClick={() => setMode('choice')}
                className="flex-1 py-2 px-4 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleCreate}
                disabled={loading}
                className="flex-1 py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create Wallet'}
              </button>
            </div>
          </div>
        )}

        {/* Import Mode */}
        {mode === 'import' && (
          <div className="bg-gray-800 rounded-lg p-6 space-y-4">
            <h2 className="text-xl font-semibold text-white">Import Wallet</h2>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Private Key</label>
              <input
                type="password"
                value={privateKey}
                onChange={(e) => setPrivateKey(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500 font-mono"
                placeholder="0x..."
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                placeholder="Enter password to encrypt"
              />
            </div>
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <div className="flex gap-3">
              <button
                onClick={() => setMode('choice')}
                className="flex-1 py-2 px-4 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleImport}
                disabled={loading}
                className="flex-1 py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors disabled:opacity-50"
              >
                {loading ? 'Importing...' : 'Import Wallet'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
