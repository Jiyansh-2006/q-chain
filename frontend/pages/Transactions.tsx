
import React, { useState } from 'react';
import Card from '../components/Card';
import { Transaction } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import { useWallet } from '../hooks/useWallet';
import { ethers } from 'ethers';

const mockHistory: Transaction[] = [
    { hash: '0xabc...', from: '0x123...', to: '0x456...', amount: '150.00 QTOK', timestamp: Date.now() - 3600000, status: 'Completed' },
    { hash: '0xdef...', from: '0x123...', to: '0x789...', amount: '50.25 QTOK', timestamp: Date.now() - 7200000, status: 'Completed' },
    { hash: '0xghi...', from: '0x123...', to: '0xabc...', amount: '1000.00 QTOK', timestamp: Date.now() - 86400000, status: 'Failed' },
];

const Transactions: React.FC = () => {
    const { signer, qTokenBalance, refreshBalance } = useWallet();
    const [toAddress, setToAddress] = useState('');
    const [amount, setAmount] = useState('');
    const [isPqc, setIsPqc] = useState(false);
    const [loading, setLoading] = useState(false);
    const [txHash, setTxHash] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setTxHash(null);
        if (!signer || !toAddress || !amount) {
            setError("Please fill all fields.");
            return;
        }

        if (!ethers.isAddress(toAddress)) {
            setError("Invalid recipient address.");
            return;
        }

        setLoading(true);
        try {
            // This is a mock transaction for UI purposes
            console.log(`Simulating transaction of ${amount} QTOK to ${toAddress} with PQC: ${isPqc}`);
            await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate network delay
            const mockTxHash = `0x${[...Array(64)].map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`;
            setTxHash(mockTxHash);
            
            // In a real app, you would do:
            // const qTokenContract = new ethers.Contract(QTOKEN_CONTRACT_ADDRESS, QTOKEN_ABI, signer);
            // const tx = await qTokenContract.transfer(toAddress, ethers.parseUnits(amount, 18));
            // setTxHash(tx.hash);
            // await tx.wait();

            setToAddress('');
            setAmount('');
            await refreshBalance(); // Refresh balance after tx
        } catch (err: any) {
            setError(err.message || "Transaction failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-white">Transactions</h1>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card title="Send QTokens" className="lg:col-span-1">
                    <form onSubmit={handleSend} className="space-y-4">
                        <div>
                            <label htmlFor="toAddress" className="block text-sm font-medium text-slate-300">Recipient Address</label>
                            <input
                                id="toAddress"
                                type="text"
                                value={toAddress}
                                onChange={(e) => setToAddress(e.target.value)}
                                placeholder="0x..."
                                className="w-full mt-1 px-3 py-2 bg-dark-bg border border-dark-border rounded-md text-white focus:ring-brand-primary focus:border-brand-primary"
                            />
                        </div>
                        <div>
                            <label htmlFor="amount" className="block text-sm font-medium text-slate-300">Amount</label>
                            <input
                                id="amount"
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="0.0"
                                className="w-full mt-1 px-3 py-2 bg-dark-bg border border-dark-border rounded-md text-white focus:ring-brand-primary focus:border-brand-primary"
                            />
                            <p className="text-xs text-slate-400 mt-1">Balance: {qTokenBalance} QTOK</p>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-slate-300">PQC-Secured</span>
                            <button
                                type="button"
                                onClick={() => setIsPqc(!isPqc)}
                                className={`${isPqc ? 'bg-brand-primary' : 'bg-slate-600'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}
                            >
                                <span className={`${isPqc ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`} />
                            </button>
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-2 px-4 bg-gradient-to-r from-brand-primary to-brand-secondary text-white font-bold rounded-lg shadow-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? <LoadingSpinner size="sm" /> : 'Send'}
                        </button>
                        {error && <p className="text-sm text-red-400">{error}</p>}
                        {txHash && <p className="text-sm text-green-400">Success! Tx: {txHash.substring(0, 15)}...</p>}
                    </form>
                </Card>

                <Card title="Transaction History" className="lg:col-span-2">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-dark-border">
                            <thead className="bg-dark-bg">
                                <tr>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-slate-400 uppercase">Hash</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-slate-400 uppercase">To</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-slate-400 uppercase">Amount</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-slate-400 uppercase">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-dark-border">
                                {mockHistory.map((tx) => (
                                    <tr key={tx.hash}>
                                        <td className="px-4 py-3 text-sm text-slate-300 font-mono">{tx.hash.substring(0, 10)}...</td>
                                        <td className="px-4 py-3 text-sm text-slate-300 font-mono">{tx.to.substring(0, 10)}...</td>
                                        <td className="px-4 py-3 text-sm text-white font-semibold">{tx.amount}</td>
                                        <td className="px-4 py-3 text-sm">
                                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${tx.status === 'Completed' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                                {tx.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Transactions;
