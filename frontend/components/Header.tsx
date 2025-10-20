
import React from 'react';
import { Link } from 'react-router-dom';
import { useWallet } from '../hooks/useWallet';
import NavLink from './NavLink';

const Header: React.FC = () => {
    const { address, network, disconnectWallet } = useWallet();

    const shortAddress = address ? `${address.substring(0, 6)}...${address.substring(address.length - 4)}` : '';

    return (
        <header className="bg-dark-card/50 backdrop-blur-md border-b border-dark-border sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center space-x-8">
                        <Link to="/" className="flex items-center space-x-2">
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M12 6V4m0 16v-2M8 8l1.88 1.88M14.12 14.12 16 16m-4.24-8.49L10 8m-1.88-1.88L6 8m7.76 8.24L14 16m-1.88 1.88L10 16m-4-4h.01M16 12h.01M12 12h.01" />
                            </svg>
                            <span className="text-2xl font-bold text-slate-100">Q-Chain</span>
                        </Link>
                        {address && (
                            <nav className="hidden md:flex space-x-6">
                                <NavLink to="/dashboard">Dashboard</NavLink>
                                <NavLink to="/transactions">Transactions</NavLink>
                                <NavLink to="/mint">Mint NFT</NavLink>
                                <NavLink to="/simulation">Simulation</NavLink>
                            </nav>
                        )}
                    </div>
                    {address && (
                        <div className="flex items-center space-x-4">
                            <div className="text-right">
                                <p className="text-sm font-medium text-white">{shortAddress}</p>
                                <p className="text-xs text-green-400">{network?.name || 'Unknown Network'}</p>
                            </div>
                            <button
                                onClick={disconnectWallet}
                                className="px-4 py-2 bg-red-600 text-white font-semibold text-sm rounded-md hover:bg-red-700 transition-colors"
                            >
                                Disconnect
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
