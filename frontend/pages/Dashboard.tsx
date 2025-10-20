
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useWallet } from '../hooks/useWallet';
import { FraudAlert, NFT } from '../types';
import Card from '../components/Card';
import LoadingSpinner from '../components/LoadingSpinner';
import { getFraudAlerts } from '../services/geminiService';

const Dashboard: React.FC = () => {
    const { address, qTokenBalance, nfts, loading: walletLoading } = useWallet();
    const [alerts, setAlerts] = useState<FraudAlert[]>([]);
    const [alertsLoading, setAlertsLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchAlerts = async () => {
            setAlertsLoading(true);
            const fetchedAlerts = await getFraudAlerts();
            setAlerts(fetchedAlerts);
            setAlertsLoading(false);
        };
        fetchAlerts();
    }, []);

    // Fix: Cannot find namespace 'JSX'. Replaced JSX.Element with React.ReactElement.
    const QuickAction: React.FC<{ to: string, label: string, icon: React.ReactElement }> = ({ to, label, icon }) => (
        <Link to={to} className="flex flex-col items-center justify-center p-4 bg-dark-border/50 rounded-lg hover:bg-dark-border transition-colors text-center">
            <div className="text-brand-primary mb-2">{icon}</div>
            <span className="text-sm font-semibold text-slate-200">{label}</span>
        </Link>
    );

    const severityColor = (severity: 'Low' | 'Medium' | 'High') => {
        switch (severity) {
            case 'High': return 'bg-red-500/20 text-red-400 border-red-500';
            case 'Medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500';
            case 'Low': return 'bg-blue-500/20 text-blue-400 border-blue-500';
        }
    }

    if (walletLoading) {
        return <div className="flex justify-center items-center h-64"><LoadingSpinner size="lg" /></div>;
    }

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-white">Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card title="QToken Balance">
                    <p className="text-4xl font-bold text-white">{qTokenBalance} <span className="text-xl text-brand-secondary">QTOK</span></p>
                    <p className="text-sm text-slate-400">Connected: {address?.substring(0, 10)}...</p>
                </Card>
                <Card title="Quick Actions" className="md:col-span-2">
                    <div className="grid grid-cols-3 gap-4">
                        <QuickAction to="/mint" label="Mint QuantumID" icon={<MintIcon />} />
                        <QuickAction to="/transactions" label="Send Transaction" icon={<SendIcon />} />
                        <QuickAction to="/simulation" label="Simulate Attack" icon={<ShieldIcon />} />
                    </div>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card title="My QuantumID NFTs">
                    {nfts.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            {nfts.map((nft: NFT) => (
                                <div key={nft.id} className="rounded-lg overflow-hidden border border-dark-border">
                                    <img src={nft.image} alt={nft.name} className="w-full h-auto aspect-square object-cover" />
                                    <div className="p-2 bg-dark-card">
                                        <p className="font-bold text-sm text-white truncate">{nft.name}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-slate-400">You don't own any QuantumID NFTs yet.</p>
                    )}
                </Card>
                
                <Card title="AI Fraud Alerts" icon={<AlertIcon />}>
                    {alertsLoading ? <LoadingSpinner /> : (
                         <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
                            {alerts.map((alert, index) => (
                                <div key={index} className={`p-3 rounded-lg border ${severityColor(alert.severity)}`}>
                                    <div className="flex justify-between items-start">
                                        <p className="text-sm font-semibold">{alert.reason}</p>
                                        <span className="text-xs font-mono px-2 py-1 rounded bg-slate-700">{alert.severity}</span>
                                    </div>
                                    <p className="text-xs text-slate-500 mt-1 font-mono">{alert.transactionHash.substring(0, 20)}...</p>
                                </div>
                            ))}
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
};

// Icons
const MintIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l1.09 2.18L15 6l-2.18 1.09L11 9.27l-1.82-2.18L7 6l2.18-1.09L11 3zM12 11l1.09 2.18L15 14l-2.18 1.09L11 17.27l-1.82-2.18L7 14l2.18-1.09L11 11z" /></svg>;
const SendIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>;
const ShieldIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 20.944A12.02 12.02 0 0012 22a12.02 12.02 0 009-1.056v-1.028a3.03 3.03 0 00-2.148-2.824l-1.02-1.824a3.03 3.03 0 00-2.824-2.148H12M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const AlertIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>;

export default Dashboard;
