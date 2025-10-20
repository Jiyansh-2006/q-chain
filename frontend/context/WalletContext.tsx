import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { BrowserProvider, ethers } from "ethers";

interface WalletContextType {
  account: string | null;
  chainId: string | null;
  provider: BrowserProvider | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  installed: boolean;
}

const WalletContext = createContext<WalletContextType>({
  account: null,
  chainId: null,
  provider: null,
  connect: async () => {},
  disconnect: () => {},
  installed: false,
});

export const WalletProvider = ({ children }: { children: React.ReactNode }) => {
  const [account, setAccount] = useState<string | null>(null);
  const [chainId, setChainId] = useState<string | null>(null);
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && (window as any).ethereum) {
      setInstalled(true);
      const eth = (window as any).ethereum;
      const prov = new BrowserProvider(eth);
      setProvider(prov);

      prov.listAccounts().then(async (accs) => {
        if (accs && accs.length > 0) setAccount(accs[0].address);
      });

      prov.getNetwork().then((net) => setChainId(net.chainId.toString()));

      eth.on("accountsChanged", (accs: string[]) => {
        setAccount(accs.length > 0 ? accs[0] : null);
      });

      eth.on("chainChanged", (hexId: string) => {
        setChainId(parseInt(hexId, 16).toString());
      });
    }
  }, []);

  const connect = useCallback(async () => {
    try {
      if (!(window as any).ethereum) {
        alert("MetaMask not installed!");
        return;
      }
      const eth = (window as any).ethereum;
      const accounts = await eth.request({ method: "eth_requestAccounts" });
      const prov = new BrowserProvider(eth);
      setProvider(prov);
      setAccount(accounts[0]);
      const net = await prov.getNetwork();
      setChainId(net.chainId.toString());
    } catch (err) {
      console.error("Connection failed:", err);
    }
  }, []);

  const disconnect = useCallback(() => {
    setAccount(null);
    setProvider(null);
    setChainId(null);
  }, []);

  return (
    <WalletContext.Provider value={{ account, chainId, provider, connect, disconnect, installed }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => useContext(WalletContext);
