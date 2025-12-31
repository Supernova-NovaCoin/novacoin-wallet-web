import { Outlet, NavLink } from 'react-router-dom';
import { useWalletStore } from '../hooks/useWalletStore';

export default function Layout() {
  const address = useWalletStore((state) => state.address);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-purple-400">NovaCoin</h1>
            <span className="text-sm text-gray-400">Wallet</span>
          </div>
          {address && (
            <div className="text-sm text-gray-400">
              {formatAddress(address)}
            </div>
          )}
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-1">
            <NavItem to="/">Dashboard</NavItem>
            <NavItem to="/send">Send</NavItem>
            <NavItem to="/receive">Receive</NavItem>
            <NavItem to="/staking">Staking</NavItem>
            <NavItem to="/settings">Settings</NavItem>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 border-t border-gray-700 mt-auto">
        <div className="max-w-7xl mx-auto px-4 py-4 text-center text-sm text-gray-500">
          NovaCoin Wallet v1.0.0 | Client-side only - Your keys never leave your browser
        </div>
      </footer>
    </div>
  );
}

function NavItem({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `px-4 py-3 text-sm font-medium transition-colors ${
          isActive
            ? 'text-purple-400 border-b-2 border-purple-400'
            : 'text-gray-400 hover:text-white'
        }`
      }
    >
      {children}
    </NavLink>
  );
}

function formatAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}
