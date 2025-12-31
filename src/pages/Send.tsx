import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWalletStore } from '../hooks/useWalletStore';
import { createNova, parseNova, Wallet } from '@novacoin/sdk';
import { decryptPrivateKey } from '../utils/crypto';

export default function Send() {
  const navigate = useNavigate();
  const { address, encryptedKey, rpcUrl } = useWalletStore();
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [txHash, setTxHash] = useState('');

  const handleSend = async () => {
    if (!recipient.startsWith('0x') || recipient.length !== 42) {
      setError('Invalid recipient address');
      return;
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      setError('Invalid amount');
      return;
    }

    if (!password) {
      setError('Password is required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Decrypt private key
      const privateKey = await decryptPrivateKey(encryptedKey!, password);
      const wallet = Wallet.fromPrivateKey(privateKey as `0x${string}`);

      // Create transaction
      const nova = createNova(rpcUrl);
      await nova.init();

      const tx = await nova.txBuilder.buildTransfer(
        address!,
        recipient as `0x${string}`,
        parseNova(amount)
      );

      const chainId = await nova.client.getChainId();
      const signedTx = wallet.signTransaction(tx, chainId);
      const hash = await nova.client.sendRawTransaction(signedTx.raw);

      setTxHash(hash);
    } catch (err: any) {
      setError(err.message || 'Transaction failed');
    } finally {
      setLoading(false);
    }
  };

  if (txHash) {
    return (
      <div className="max-w-md mx-auto">
        <div className="bg-gray-800 rounded-lg p-6 text-center">
          <div className="text-4xl mb-4">✓</div>
          <h2 className="text-xl font-semibold text-white mb-2">Transaction Sent!</h2>
          <p className="text-gray-400 text-sm mb-4">
            Your transaction has been submitted to the network.
          </p>
          <div className="bg-gray-700 rounded p-3 mb-4">
            <div className="text-xs text-gray-400 mb-1">Transaction Hash</div>
            <div className="text-sm text-purple-400 font-mono break-all">{txHash}</div>
          </div>
          <button
            onClick={() => navigate('/')}
            className="w-full py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold text-white mb-6">Send NOVA</h1>

      <div className="bg-gray-800 rounded-lg p-6 space-y-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">Recipient Address</label>
          <input
            type="text"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500 font-mono"
            placeholder="0x..."
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">Amount (NOVA)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
            placeholder="0.0"
            step="0.0001"
            min="0"
          />
        </div>

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
          onClick={handleSend}
          disabled={loading}
          className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
        >
          {loading ? 'Sending...' : 'Send NOVA'}
        </button>
      </div>
    </div>
  );
}
