import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useWalletStore, useFormattedBalance } from '../hooks/useWalletStore';
import { createNova } from '@novacoin/sdk';

export default function Dashboard() {
  const { address, rpcUrl, setBalance } = useWalletStore();
  const formattedBalance = useFormattedBalance();
  const [loading, setLoading] = useState(true);
  const [recentTxs, setRecentTxs] = useState<any[]>([]);

  useEffect(() => {
    if (!address) return;

    const fetchBalance = async () => {
      try {
        const nova = createNova(rpcUrl);
        const balance = await nova.client.getBalance(address);
        setBalance(balance);
      } catch (err) {
        console.error('Failed to fetch balance:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBalance();
    const interval = setInterval(fetchBalance, 15000);
    return () => clearInterval(interval);
  }, [address, rpcUrl, setBalance]);

  return (
    <div className="space-y-6">
      {/* Balance Card */}
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="text-sm text-gray-400 mb-1">Total Balance</div>
        <div className="text-4xl font-bold text-white mb-1">
          {loading ? '...' : formattedBalance} <span className="text-purple-400">NOVA</span>
        </div>
        <div className="text-sm text-gray-500">
          {address}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <ActionCard
          to="/send"
          icon="arrow-up"
          label="Send"
          color="bg-blue-600"
        />
        <ActionCard
          to="/receive"
          icon="arrow-down"
          label="Receive"
          color="bg-green-600"
        />
        <ActionCard
          to="/staking"
          icon="layers"
          label="Stake"
          color="bg-purple-600"
        />
        <ActionCard
          to="/settings"
          icon="settings"
          label="Settings"
          color="bg-gray-600"
        />
      </div>

      {/* Recent Transactions */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Recent Activity</h2>
        {recentTxs.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No recent transactions</p>
            <p className="text-sm mt-2">Your transaction history will appear here</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentTxs.map((tx) => (
              <TransactionItem key={tx.hash} tx={tx} />
            ))}
          </div>
        )}
      </div>

      {/* Network Info */}
      <div className="bg-gray-800 rounded-lg p-4 flex items-center justify-between text-sm">
        <span className="text-gray-400">Network</span>
        <span className="text-purple-400">NovaCoin Testnet</span>
      </div>
    </div>
  );
}

function ActionCard({
  to,
  icon,
  label,
  color,
}: {
  to: string;
  icon: string;
  label: string;
  color: string;
}) {
  return (
    <Link
      to={to}
      className={`${color} rounded-lg p-4 text-center hover:opacity-90 transition-opacity`}
    >
      <div className="text-2xl mb-2">
        {icon === 'arrow-up' && '↑'}
        {icon === 'arrow-down' && '↓'}
        {icon === 'layers' && '◇'}
        {icon === 'settings' && '⚙'}
      </div>
      <div className="text-sm font-medium text-white">{label}</div>
    </Link>
  );
}

function TransactionItem({ tx }: { tx: any }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-gray-700 last:border-0">
      <div>
        <div className="text-white">{tx.type}</div>
        <div className="text-sm text-gray-500">{tx.date}</div>
      </div>
      <div className="text-right">
        <div className={tx.amount > 0 ? 'text-green-400' : 'text-red-400'}>
          {tx.amount > 0 ? '+' : ''}{tx.amount} NOVA
        </div>
        <div className="text-sm text-gray-500">{tx.status}</div>
      </div>
    </div>
  );
}
