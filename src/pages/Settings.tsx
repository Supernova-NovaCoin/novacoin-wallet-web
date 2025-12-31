import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWalletStore } from '../hooks/useWalletStore';
import { decryptPrivateKey } from '../utils/crypto';

export default function Settings() {
  const navigate = useNavigate();
  const { address, encryptedKey, network, rpcUrl, setNetwork, setRpcUrl, reset } = useWalletStore();
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [privateKey, setPrivateKey] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [customRpc, setCustomRpc] = useState(rpcUrl);

  const handleExportKey = async () => {
    if (!password) {
      setError('Password is required');
      return;
    }

    try {
      const key = await decryptPrivateKey(encryptedKey!, password);
      setPrivateKey(key);
      setShowPrivateKey(true);
      setError('');
    } catch (err) {
      setError('Invalid password');
    }
  };

  const handleNetworkChange = (newNetwork: 'mainnet' | 'testnet') => {
    setNetwork(newNetwork);
  };

  const handleRpcChange = () => {
    setRpcUrl(customRpc);
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset the wallet? This will delete all local data.')) {
      reset();
      navigate('/');
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-white">Settings</h1>

      {/* Network Settings */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Network</h2>
        <div className="space-y-4">
          <div className="flex gap-4">
            <button
              onClick={() => handleNetworkChange('mainnet')}
              className={`flex-1 py-2 px-4 rounded-lg transition-colors ${
                network === 'mainnet'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
              }`}
            >
              Mainnet
            </button>
            <button
              onClick={() => handleNetworkChange('testnet')}
              className={`flex-1 py-2 px-4 rounded-lg transition-colors ${
                network === 'testnet'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
              }`}
            >
              Testnet
            </button>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Custom RPC URL</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={customRpc}
                onChange={(e) => setCustomRpc(e.target.value)}
                className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500 font-mono text-sm"
              />
              <button
                onClick={handleRpcChange}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Account Info */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Account</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Address</label>
            <div className="bg-gray-700 rounded-lg p-3">
              <div className="text-sm text-purple-400 font-mono break-all">{address}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Export Private Key */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Export Private Key</h2>
        <div className="space-y-4">
          <p className="text-sm text-gray-400">
            Warning: Never share your private key with anyone. Anyone with your private key can access your funds.
          </p>

          {!showPrivateKey ? (
            <>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                  placeholder="Enter your password"
                />
              </div>
              {error && <p className="text-red-400 text-sm">{error}</p>}
              <button
                onClick={handleExportKey}
                className="w-full py-2 px-4 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors"
              >
                Show Private Key
              </button>
            </>
          ) : (
            <>
              <div className="bg-red-900/20 border border-red-500 rounded-lg p-4">
                <div className="text-sm text-gray-400 mb-1">Private Key</div>
                <div className="text-sm text-red-400 font-mono break-all">{privateKey}</div>
              </div>
              <button
                onClick={() => {
                  setShowPrivateKey(false);
                  setPrivateKey('');
                  setPassword('');
                }}
                className="w-full py-2 px-4 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                Hide Private Key
              </button>
            </>
          )}
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-gray-800 rounded-lg p-6 border border-red-500/50">
        <h2 className="text-lg font-semibold text-red-400 mb-4">Danger Zone</h2>
        <p className="text-sm text-gray-400 mb-4">
          This will permanently delete your wallet from this browser. Make sure you have backed up your private key.
        </p>
        <button
          onClick={handleReset}
          className="w-full py-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
        >
          Reset Wallet
        </button>
      </div>
    </div>
  );
}
