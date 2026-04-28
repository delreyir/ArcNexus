'use client';

import React, { useState, useRef, useEffect } from 'react';

// Types dial TypeScript
type Message = {
  role: string;
  content: string;
  type?: string;
};

type IntentTx = {
  id: string;
  description: string;
  status: 'pending' | 'completed';
  time: string;
};

export default function App() {
  const [walletConnected, setWalletConnected] = useState(false);
  const [userAddress, setUserAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [balance, setBalance] = useState<string | null>(null);
  const [showQueue, setShowQueue] = useState(false);
  
  // Chat & Transactions State
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "ArcNexus is online. I route your Unified Balance across any network seamlessly using natural language. What is your objective today?" }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isProcessingTx, setIsProcessingTx] = useState(false);
  const [txQueue, setTxQueue] = useState<IntentTx[]>([]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Quick prompt suggestions
  const suggestions = [
    "Bridge 500 USDC to Base",
    "Swap 1 ETH to MATIC",
    "Stake 1000 USDC on Arbitrum"
  ];

  // Auto-scroll chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // ==========================================
  // REAL WEB3 WALLET CONNECTION LOGIC (EIP-1193)
  // ==========================================
  const connectWallet = async () => {
    setLoading(true);
    try {
      if (typeof window !== 'undefined' && (window as any).ethereum) {
        const accounts = await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
        
        if (accounts && accounts.length > 0) {
          const address = accounts[0];
          setUserAddress(address);
          setWalletConnected(true);
          setBalance("3,450.00"); // Simulated Unified Balance
          
          setMessages(prev => [...prev, { 
            role: 'system', 
            content: `Identity verified. Connected: ${address.slice(0,6)}...${address.slice(-4)}. Unified Balance unlocked: 3,450.00 USDC.` 
          }]);
        }
      } else {
        setMessages(prev => [...prev, { 
          role: 'system', 
          content: '⚠️ Error: No Web3 provider detected. Please install a wallet.' 
        }]);
      }
    } catch (error) {
      console.error("Wallet connection failed:", error);
      setMessages(prev => [...prev, { 
        role: 'system', 
        content: '❌ Connection aborted by user.' 
      }]);
    } finally {
      setLoading(false);
    }
  };

  // Handle AI Chat
  const handleSendMessage = (e?: React.FormEvent, customMsg?: string) => {
    if (e) e.preventDefault();
    const msgToSend = customMsg || inputValue;
    if (!msgToSend.trim() || !walletConnected) return;

    setMessages(prev => [...prev, { role: 'user', content: msgToSend }]);
    setInputValue('');
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      
      // Add to pending queue
      const newTxId = `TX-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      setTxQueue(prev => [{
        id: newTxId,
        description: msgToSend,
        status: 'pending',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }, ...prev]);

      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `Intent constructed. \n\nTarget: Cross-Chain Execution\nSource: Unified USDC Balance\nGas Fee: $0.00 (Sponsored)\n\nAwaiting your signature.`,
        type: 'action_proposal'
      }]);
    }, 2000);
  };

  const executeUnifiedTransaction = () => {
    setIsProcessingTx(true);
    setMessages(prev => [...prev, { role: 'system', content: 'Broadcasting intent via Arc App Kit...' }]);

    setTimeout(() => {
      setIsProcessingTx(false);
      
      // Update queue to completed
      setTxQueue(prev => prev.map((tx, idx) => 
        idx === 0 ? { ...tx, status: 'completed' } : tx
      ));

      // Deduct fake balance for realism
      setBalance("1,450.00");

      setMessages(prev => [...prev, { 
        role: 'success', 
        content: 'Execution Complete. Intent settled across chains. (TxHash: 0x8a9...4b2)' 
      }]);
    }, 3500);
  };

  return (
    <div className="min-h-screen bg-[#000000] text-[#f4f4f5] font-sans selection:bg-[#00df9a]/30 overflow-x-hidden custom-scrollbar relative">
      
      {/* Background Noise/Texture (Subtle) */}
      <div className="fixed inset-0 opacity-[0.02] mix-blend-screen pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] z-0"></div>

      {/* Top Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-[#000000]/80 backdrop-blur-md border-b border-[#222222]">
        <div className="max-w-[1400px] mx-auto px-6 h-[72px] flex items-center justify-between">
          
          {/* Left Side: Logo & Main Links */}
          <div className="flex items-center gap-10">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <span className="text-white font-medium text-xl tracking-tight">ArcNexus</span>
              <div className="w-2.5 h-2.5 bg-[#00df9a] rounded-sm"></div>
            </div>
            
            {/* Nav Links */}
            <div className="hidden lg:flex items-center gap-8 text-[13px] font-medium text-[#888888]">
              <a href="#features" className="hover:text-white transition-colors">Features</a>
              <a href="#console" className="hover:text-white transition-colors">NanoAI</a>
              <a href="https://docs.arc.network/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Architecture</a>
              <a href="https://faucet.circle.com/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Faucet</a>
            </div>
          </div>
          
          {/* Right Side: Actions */}
          <div className="flex items-center gap-6">
            
            {walletConnected && (
              <button 
                onClick={() => setShowQueue(!showQueue)}
                className="hidden md:flex items-center gap-2 text-[13px] font-medium text-[#888888] hover:text-white transition-colors"
              >
                Intent Queue
                {txQueue.filter(tx => tx.status === 'pending').length > 0 && (
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#00df9a] text-[9px] font-bold text-black">
                    {txQueue.filter(tx => tx.status === 'pending').length}
                  </span>
                )}
              </button>
            )}

            {walletConnected && balance && (
              <div className="hidden sm:flex items-center gap-1 text-[13px] font-mono text-[#888888]">
                <span className="text-white">{balance}</span> USDC
              </div>
            )}

            <button 
              onClick={connectWallet}
              disabled={loading || walletConnected}
              className={`px-5 py-2 rounded-md font-semibold transition-all text-[13px] flex items-center gap-2 ${
                walletConnected 
                ? 'bg-[#111111] border border-[#333333] text-white hover:bg-[#1a1a1a]' 
                : 'bg-[#00df9a] text-black hover:bg-[#00c285]'
              }`}
            >
              {walletConnected && <div className="w-1.5 h-1.5 rounded-full bg-[#00df9a] shadow-[0_0_8px_rgba(0,223,154,0.8)]"></div>}
              {loading ? 'Authenticating...' : walletConnected ? `${userAddress.slice(0,6)}...${userAddress.slice(-4)}` : 'Connect Wallet'}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section (Arc Style Typography, Unique Content) */}
      <div className="relative pt-[160px] pb-[80px] px-6 z-10 flex flex-col justify-center min-h-[70vh] max-w-[1400px] mx-auto">
        <div className="w-full max-w-[900px]">
          
          {/* Top Badge (Live Indicator Arc Style) */}
          <div className="flex items-center gap-3 mb-8 text-[10px] md:text-[11px] font-mono tracking-[0.2em] text-[#666666] uppercase">
            <span className="w-2 h-2 rounded-full bg-[#00df9a] animate-pulse"></span>
            Live • Arc Testnet • Chain 5042002
          </div>

          {/* Headline (Arc Typography: White + Grey, Tight Tracking) */}
          <h1 className="text-[55px] sm:text-[75px] md:text-[90px] font-semibold tracking-[-0.04em] leading-[1.05] mb-6">
            <span className="text-white">Cross-chain liquidity</span><br/>
            <span className="text-[#555555]">prompted into reality.</span>
          </h1>

          {/* Subtext */}
          <p className="text-[#888888] text-[16px] md:text-[18px] max-w-[650px] leading-relaxed font-light mb-10">
            Stop navigating complex bridges. Aggregate your USDC Unified Balance and execute gasless, cross-network operations through a conversational AI agent.
          </p>

          {/* Actions & Terminal Text */}
          <div className="flex items-center gap-5 flex-wrap">
            <button 
              onClick={() => {
                document.getElementById('console')?.scrollIntoView({behavior: 'smooth'});
              }} 
              className="px-7 py-3.5 rounded-md bg-[#00df9a] text-black font-semibold text-[14px] hover:bg-[#00c285] transition-colors flex items-center gap-2"
            >
              Launch NanoAI <span className="font-mono text-[11px]">→</span>
            </button>
            
            <a 
              href="#features" 
              className="px-7 py-3.5 rounded-md border border-[#333333] text-white font-medium text-[14px] hover:bg-[#111111] transition-colors"
            >
              Explore Protocol
            </a>
            
            {/* Terminal little text */}
            <div className="hidden sm:flex items-center gap-2 text-[#555555] font-mono text-[10px] tracking-widest uppercase ml-2">
              ↳ ~ &lt; 3S <span className="text-[#00df9a]">FINALITY</span>
            </div>
          </div>

        </div>
      </div>

      {/* Main App Section (Chat + Queue) */}
      <div id="console" className="max-w-[1200px] mx-auto px-6 pb-32 flex flex-col xl:flex-row gap-8 relative z-10 pt-10">
        
        {/* Chat Console (Brutalist/Clean Style) */}
        <div className="flex-1 bg-[#050505] border border-[#222222] rounded-2xl overflow-hidden shadow-2xl flex flex-col h-[600px] relative">
          
          {/* Console Header */}
          <div className="bg-[#0a0a0a] border-b border-[#222222] p-4 flex items-center justify-between z-10">
             <div className="flex items-center gap-3">
                <div className="flex gap-1.5 ml-1">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#333333]"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-[#333333]"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-[#00df9a]"></div>
                </div>
                <span className="text-[13px] font-medium text-white tracking-wide ml-2">NanoAI Console</span>
             </div>
             <div className="text-[11px] text-[#666666] font-mono tracking-widest uppercase">Arc-MCP-v2.0</div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 md:p-8 flex flex-col gap-6 custom-scrollbar bg-[#000000]">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                
                <div className={`max-w-[90%] md:max-w-[80%] p-5 rounded-2xl ${
                  msg.role === 'user' 
                    ? 'bg-[#111111] border border-[#222222] text-white rounded-br-sm' 
                    : msg.role === 'system'
                    ? 'bg-transparent border border-[#222222] text-[#888888] text-[12px] font-mono rounded-md'
                    : msg.role === 'success'
                    ? 'bg-[#00df9a]/10 border border-[#00df9a]/30 text-[#00df9a] text-[14px] rounded-bl-sm'
                    : 'bg-[#0a0a0a] border border-[#222222] text-[#e5e5e5] rounded-bl-sm shadow-lg'
                }`}>
                  
                  {msg.role === 'assistant' && (
                    <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#222222]">
                      <div className="w-5 h-5 bg-[#00df9a] rounded-sm flex items-center justify-center text-[10px] font-black text-black">N</div>
                      <span className="text-[11px] font-bold text-[#00df9a] uppercase tracking-widest">NanoAI</span>
                    </div>
                  )}

                  <p className="leading-relaxed whitespace-pre-wrap text-[15px] font-light">{msg.content}</p>

                  {msg.type === 'action_proposal' && (
                    <div className="mt-6 p-5 bg-[#050505] rounded-xl border border-[#333333]">
                      <div className="flex justify-between items-center text-[13px] mb-3">
                        <span className="text-[#888888]">Routing Method:</span>
                        <span className="font-mono text-white bg-[#111111] border border-[#222222] px-2 py-1 rounded">Unified Balance</span>
                      </div>
                      <div className="flex justify-between items-center text-[13px] mb-6">
                        <span className="text-[#888888]">Arc Paymaster (Gas):</span>
                        <span className="font-mono font-medium text-[#00df9a]">0.00 USDC</span>
                      </div>
                      
                      <button 
                        onClick={executeUnifiedTransaction}
                        disabled={isProcessingTx || txQueue[0]?.status === 'completed'}
                        className={`w-full py-3.5 rounded-lg font-semibold text-[13px] transition-all flex justify-center items-center gap-2 ${
                          txQueue[0]?.status === 'completed' 
                          ? 'bg-[#111111] text-[#00df9a] border border-[#00df9a]/30' 
                          : 'bg-[#ffffff] hover:bg-[#e5e5e5] text-black'
                        } disabled:opacity-50`}
                      >
                        {isProcessingTx ? (
                          <span className="animate-pulse flex items-center gap-2">Processing intent...</span>
                        ) : txQueue[0]?.status === 'completed' ? (
                          <>Execution Finalized ✓</>
                        ) : (
                          <>Sign & Execute</>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-[#0a0a0a] border border-[#222222] rounded-lg p-5 flex gap-2 items-center">
                  <span className="w-2 h-2 bg-[#00df9a] rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-[#00df9a] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                  <span className="w-2 h-2 bg-[#00df9a] rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-5 bg-[#050505] border-t border-[#222222] relative z-10">
            
            {walletConnected && messages.length <= 2 && (
              <div className="flex gap-2 overflow-x-auto custom-scrollbar pb-4">
                {suggestions.map((sug, i) => (
                  <button 
                    key={i}
                    onClick={() => handleSendMessage(undefined, sug)}
                    className="whitespace-nowrap px-4 py-2 bg-[#111111] hover:bg-[#1a1a1a] border border-[#333333] rounded-full text-[12px] text-[#aaaaaa] hover:text-white transition-all"
                  >
                    {sug}
                  </button>
                ))}
              </div>
            )}

            {!walletConnected ? (
              <div className="bg-[#111111] border border-[#333333] text-[#888888] p-4 rounded-xl text-center text-[13px] flex items-center justify-center gap-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                Connect your wallet to start interacting with NanoAI.
              </div>
            ) : (
              <form onSubmit={(e) => handleSendMessage(e)} className="relative">
                <div className="relative flex items-center bg-[#0a0a0a] border border-[#333333] rounded-xl overflow-hidden focus-within:border-[#00df9a]/50 transition-all">
                  <input 
                    type="text" 
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Enter natural language intent..." 
                    className="flex-1 bg-transparent border-none text-white px-5 py-4 focus:outline-none placeholder-[#555555] text-[15px] font-light"
                  />
                  <button 
                    type="submit"
                    disabled={!inputValue.trim()}
                    className="bg-[#00df9a] text-black px-5 py-2 mr-2 rounded-lg text-[13px] font-bold hover:bg-[#00c285] transition-colors disabled:opacity-50 disabled:bg-[#222222] disabled:text-[#555555] flex items-center gap-2"
                  >
                    SEND <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Right Side - Intent Queue Sidebar */}
        {showQueue && (
          <div className="w-full xl:w-[350px] bg-[#050505] border border-[#222222] rounded-2xl p-6 shadow-2xl overflow-y-auto custom-scrollbar xl:h-[600px]">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-[14px] font-medium text-white tracking-wide flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#00df9a]"></div>
                Active Registry
              </h3>
              <button onClick={() => setShowQueue(false)} className="text-[#666666] hover:text-white transition-colors xl:hidden">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            {txQueue.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-40 text-center border border-dashed border-[#333333] rounded-xl bg-[#0a0a0a]">
                <span className="text-[13px] text-[#666666] font-light">Registry is empty</span>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {txQueue.map((tx, i) => (
                  <div key={i} className="bg-[#0a0a0a] border border-[#222222] rounded-xl p-5 hover:border-[#333333] transition-colors relative overflow-hidden">
                    
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-[11px] font-mono font-medium text-[#888888]">{tx.id}</span>
                      <span className="text-[11px] text-[#555555]">{tx.time}</span>
                    </div>
                    
                    <p className="text-[14px] text-[#e5e5e5] mb-5 font-light leading-snug">{tx.description}</p>
                    
                    <div className="flex items-center">
                      {tx.status === 'pending' ? (
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-[#111111] border border-[#333333] rounded-md text-[11px] text-[#888888] font-medium w-full justify-center">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#00df9a] animate-pulse"></span>
                          Awaiting Signature
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-[#00df9a]/10 border border-[#00df9a]/20 rounded-md text-[11px] text-[#00df9a] font-medium w-full justify-center">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                          Network Confirmed
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Feature Sections (Brutalist List Style) */}
      <section id="features" className="py-24 px-6 border-t border-[#222222] bg-[#050505]">
        <div className="max-w-[1000px] mx-auto">
          <div className="mb-16 md:mb-24">
            <h2 className="text-3xl md:text-5xl font-medium text-white mb-6 tracking-tight">System Capabilities.</h2>
            <p className="text-[16px] text-[#888888] max-w-2xl font-light leading-relaxed">Powered by the cutting-edge Arc App Kit, delivering a gasless, chain-abstracted experience directly through conversation.</p>
          </div>

          <div className="flex flex-col gap-4">
            {[
              {
                title: "Unified Sourcing",
                desc: "USDC liquidity is aggregated instantly across all integrated networks. Eradicating the need for manual bridges."
              },
              {
                title: "Arc Paymaster",
                desc: "Gas fees are completely abstracted. Execute transactions without ever holding native tokens like ETH or SOL."
              },
              {
                title: "Intent Execution",
                desc: "Model Context Protocol translates natural language straight into secure, verifiable smart contract calls."
              }
            ].map((feat, i) => (
              <div key={i} className="flex flex-col md:flex-row md:items-center gap-6 md:gap-12 p-8 bg-[#000000] border border-[#222222] rounded-xl hover:bg-[#0a0a0a] transition-colors group">
                <div className="text-[#00df9a] font-mono text-[14px]">0{i+1}</div>
                <div className="w-full md:w-1/3">
                  <h3 className="text-xl font-medium text-white tracking-tight">{feat.title}</h3>
                </div>
                <div className="w-full md:w-2/3">
                  <p className="text-[#888888] text-[15px] font-light leading-relaxed group-hover:text-[#aaaaaa] transition-colors">{feat.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#222222] bg-[#000000] py-12 px-6">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-[#666666] text-[13px] font-medium">
          
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 bg-[#00df9a] rounded-sm"></div>
            <span className="text-white font-medium text-base tracking-tight">ArcNexus</span>
            <span className="hidden md:inline-block ml-4 text-[#555555] font-light">© 2026. Global Web3 Hackathon.</span>
          </div>

          <div className="flex gap-4 sm:gap-6 items-center flex-wrap">
            {/* Arc Testnet Badge */}
            <div className="flex items-center gap-2 px-3 py-1.5 border border-[#222222] rounded-full text-[11px] font-mono tracking-widest text-[#555555] uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00df9a] animate-pulse"></span>
              Arc Testnet
            </div>
            
            {/* Chain ID Badge */}
            <div className="hidden sm:flex items-center px-3 py-1.5 border border-[#222222] rounded-full text-[11px] font-mono tracking-widest text-[#555555] uppercase">
              Chain: 5042002
            </div>

            <a href="https://faucet.circle.com/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors ml-2">Faucet</a>
          </div>
        </div>
      </footer>
      
      {/* Scrollbar styling */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 5px; height: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #333333; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #555555; }
        html { scroll-behavior: smooth; }
      `}} />
    </div>
  );
}