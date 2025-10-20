
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import MintNFT from './pages/MintNFT';
import Simulation from './pages/Simulation';
import { useWallet } from './hooks/useWallet';

const App: React.FC = () => {
  const { address } = useWallet();

  return (
    <HashRouter>
      <div className="min-h-screen bg-dark-bg text-slate-200 font-sans">
        <Header />
        <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
          {address ? (
            <Routes>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/transactions" element={<Transactions />} />
              <Route path="/mint" element={<MintNFT />} />
              <Route path="/simulation" element={<Simulation />} />
              <Route path="*" element={<Navigate to="/dashboard" />} />
            </Routes>
          ) : (
            <WalletConnectPage />
          )}
        </main>
      </div>
    </HashRouter>
  );
};

const WalletConnectPage: React.FC = () => {
    const { connectWallet, loading } = useWallet();
    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] text-center animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-brand-primary to-brand-secondary text-transparent bg-clip-text">Welcome to Q-Chain</h1>
            <p className="text-slate-400 mb-8 max-w-md">The future of secure, quantum-resilient blockchain technology. Connect your wallet to begin.</p>
            <button
                onClick={connectWallet}
                disabled={loading}
                className="px-8 py-3 bg-gradient-to-r from-brand-primary to-brand-secondary text-white font-bold rounded-lg shadow-lg hover:scale-105 transform transition-transform duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading ? 'Connecting...' : 'Connect MetaMask Wallet'}
            </button>
        </div>
    );
};


export default App;