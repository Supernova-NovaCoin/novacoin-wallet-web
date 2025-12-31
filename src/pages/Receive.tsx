import { useState } from 'react';
import { useWalletStore } from '../hooks/useWalletStore';

export default function Receive() {
  const address = useWalletStore((state) => state.address);
  const [copied, setCopied] = useState(false);

  const copyAddress = async () => {
    if (!address) return;
    await navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold text-white mb-6">Receive NOVA</h1>

      <div className="bg-gray-800 rounded-lg p-6 text-center">
        {/* QR Code Placeholder */}
        <div className="w-48 h-48 mx-auto bg-white rounded-lg flex items-center justify-center mb-6">
          <div className="text-gray-400 text-sm">
            [QR Code]
            <br />
            <span className="text-xs">{formatAddress(address || '')}</span>
          </div>
        </div>

        {/* Address */}
        <div className="mb-4">
          <div className="text-sm text-gray-400 mb-2">Your Address</div>
          <div className="bg-gray-700 rounded-lg p-3">
            <div className="text-sm text-purple-400 font-mono break-all">
              {address}
            </div>
          </div>
        </div>

        {/* Copy Button */}
        <button
          onClick={copyAddress}
          className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors"
        >
          {copied ? 'Copied!' : 'Copy Address'}
        </button>

        {/* Info */}
        <p className="text-xs text-gray-500 mt-4">
          Only send NOVA or NovaCoin-compatible tokens to this address.
          Sending other cryptocurrencies may result in permanent loss.
        </p>
      </div>
    </div>
  );
}

function formatAddress(address: string): string {
  if (!address) return '';
  return `${address.slice(0, 10)}...${address.slice(-8)}`;
}
