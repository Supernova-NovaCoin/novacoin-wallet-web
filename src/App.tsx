import { Routes, Route, Navigate } from 'react-router-dom';
import { useWalletStore } from './hooks/useWalletStore';
import Layout from './components/Layout';
import Welcome from './pages/Welcome';
import Dashboard from './pages/Dashboard';
import Send from './pages/Send';
import Receive from './pages/Receive';
import Staking from './pages/Staking';
import Settings from './pages/Settings';

function App() {
  const { isInitialized } = useWalletStore();

  return (
    <Routes>
      {!isInitialized ? (
        <>
          <Route path="/" element={<Welcome />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </>
      ) : (
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="send" element={<Send />} />
          <Route path="receive" element={<Receive />} />
          <Route path="staking" element={<Staking />} />
          <Route path="settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      )}
    </Routes>
  );
}

export default App;
