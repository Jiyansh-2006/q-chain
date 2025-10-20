
import React, { useState } from 'react';
import Card from '../components/Card';
import { useWallet } from '../hooks/useWallet';
import LoadingSpinner from '../components/LoadingSpinner';
import { NFT } from '../types';

const MintNFT: React.FC = () => {
    const { signer, nfts, refreshBalance } = useWallet();
    const [loading, setLoading] = useState(false);
    const [mintedNft, setMintedNft] = useState<NFT | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleMint = async () => {
        setError(null);
        setMintedNft(null);
        if (!signer) {
            setError("Wallet not connected.");
            return;
        }

        setLoading(true);
        try {
            // This is a mock mint for UI purposes
            console.log("Simulating NFT mint...");
            await new Promise(resolve => setTimeout(resolve, 2000));
            const newId = nfts.length + 1;
            const newNft: NFT = {
                id: newId.toString(),
                name: `QuantumID #${newId}`,
                description: 'A new unique QuantumID.',
                image: `https://picsum.photos/seed/${signer.address}${newId}/300`,
            };
            setMintedNft(newNft);
            
            // In a real app:
            // const nftContract = new ethers.Contract(QUANTUMID_CONTRACT_ADDRESS, QUANTUMID_ABI, signer);
            // const tx = await nftContract.safeMint(signer.address);
            // await tx.wait();
            
            await refreshBalance(); // This will refresh the NFT list as well
        } catch (err: any) {
            setError(err.message || "Minting failed.");
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-white">Mint QuantumID NFT</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <Card title="Create New ID">
                    <div className="text-center">
                        <div className="w-48 h-48 mx-auto bg-dark-bg border-2 border-dashed border-dark-border rounded-lg flex items-center justify-center mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        </div>
                        <p className="text-slate-400 mb-4">Mint a new unique and secure QuantumID NFT. Metadata will be stored on IPFS.</p>
                        <button
                            onClick={handleMint}
                            disabled={loading}
                            className="w-full py-2 px-4 bg-gradient-to-r from-brand-primary to-brand-secondary text-white font-bold rounded-lg shadow-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? <LoadingSpinner size="sm" /> : 'Mint Now'}
                        </button>
                         {error && <p className="text-sm text-red-400 mt-2">{error}</p>}
                         {mintedNft && <p className="text-sm text-green-400 mt-2">Success! Minted {mintedNft.name}.</p>}
                    </div>
                </Card>
                <Card title="My Collection" className="md:col-span-2">
                    {nfts.length > 0 ? (
                         <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                            {nfts.map((nft) => (
                                <div key={nft.id} className="rounded-lg overflow-hidden border border-dark-border group transform hover:-translate-y-1 transition-transform">
                                    <img src={nft.image} alt={nft.name} className="w-full h-auto aspect-square object-cover" />
                                    <div className="p-3">
                                        <p className="font-bold text-sm text-white truncate group-hover:text-brand-primary">{nft.name}</p>
                                        <p className="text-xs text-slate-400 truncate">{nft.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-slate-400 text-center py-8">Your NFT collection is empty.</p>
                    )}
                </Card>
            </div>
        </div>
    );
};

export default MintNFT;
