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
    { role: 'assistant', content: "Initialization complete. ArcNexus AI is online. I can route your Unified Balance across any network seamlessly. What is your objective?" }
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
            content: `Connection established. Address linked: ${address.slice(0,6)}...${address.slice(-4)}. Unified Liquidity detected: 3,450.00 USDC.` 
          }]);
        }
      } else {
        setMessages(prev => [...prev, { 
          role: 'system', 
          content: '⚠️ Terminal Error: Web3 Provider not found. Inject a wallet to proceed.' 
        }]);
      }
    } catch (error) {
      console.error("Wallet connection failed:", error);
      setMessages(prev => [...prev, { 
        role: 'system', 
        content: '❌ Access denied. Wallet connection rejected.' 
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
        content: `Intent parsed successfully. \n\nAction: Execute Cross-Chain Operation\nLiquidity Source: Unified USDC Pool\nGas Abstraction: Arc Paymaster (Zero Cost)\n\nAwaiting your cryptographic signature.`,
        type: 'action_proposal'
      }]);
    }, 2000);
  };

  const executeUnifiedTransaction = () => {
    setIsProcessingTx(true);
    setMessages(prev => [...prev, { role: 'system', content: 'Initiating Arc App Kit routing protocols...' }]);

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
        content: 'Operation Successful. Intent executed across networks. (TxHash: 0x8a9...4b2)' 
      }]);
    }, 3500);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-300 font-sans selection:bg-cyan-500/30 overflow-x-hidden custom-scrollbar relative">
      
      {/* Modern Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none z-0"></div>
      
      {/* Glowing Orbs */}
      <div className="fixed top-[-10%] left-[20%] w-[500px] h-[500px] bg-cyan-600/20 rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div className="fixed bottom-[-10%] right-[-5%] w-[400px] h-[400px] bg-indigo-600/20 rounded-full blur-[100px] pointer-events-none z-0"></div>

      {/* Floating Pill Navbar (Creative Redesign) */}
      <nav className="fixed top-6 left-0 right-0 z-50 mx-auto max-w-6xl px-4 transition-all duration-300">
        <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-full flex items-center justify-between p-2 shadow-2xl shadow-cyan-900/10">
          
          <div className="flex items-center gap-3 pl-4">
            <div className="relative flex items-center justify-center w-8 h-8">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-indigo-500 rounded-full blur opacity-50"></div>
              <div className="relative w-full h-full bg-slate-950 rounded-full border border-white/20 flex items-center justify-center text-cyan-400 font-black text-sm">
                X
              </div>
            </div>
            <span className="text-white font-bold tracking-wide text-lg">Arc<span className="text-cyan-400 font-light">Nexus</span></span>
          </div>
          
          <div className="flex items-center gap-3 pr-2">
            <div className="hidden lg:flex items-center gap-6 mr-4 text-xs font-semibold tracking-wider text-slate-400">
              <a href="#features" className="hover:text-cyan-400 transition-colors">Features</a>
              <a href="#console" className="hover:text-cyan-400 transition-colors">AI Console</a>
            </div>

            {walletConnected && (
              <button 
                onClick={() => setShowQueue(!showQueue)}
                className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 hover:bg-slate-800 border border-white/5 text-xs font-medium text-slate-300 transition-all relative"
              >
                <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                Active Intents
                {txQueue.filter(tx => tx.status === 'pending').length > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-cyan-500 text-[9px] font-bold text-slate-950 shadow-[0_0_10px_rgba(6,182,212,0.5)]">
                    {txQueue.filter(tx => tx.status === 'pending').length}
                  </span>
                )}
              </button>
            )}

            {walletConnected && balance && (
              <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500/10 to-indigo-500/10 border border-cyan-500/20 rounded-full text-xs font-bold text-cyan-400">
                <span>{balance}</span>
                <span className="text-slate-400 font-normal">USDC</span>
              </div>
            )}

            <button 
              onClick={connectWallet}
              disabled={loading || walletConnected}
              className={`px-6 py-2 rounded-full font-bold transition-all text-xs flex items-center gap-2 ${
                walletConnected 
                ? 'bg-slate-800 border border-emerald-500/30 text-emerald-400' 
                : 'bg-gradient-to-r from-cyan-500 to-indigo-500 text-white hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:scale-105'
              }`}
            >
              {walletConnected && <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]"></div>}
              {loading ? 'Authenticating...' : walletConnected ? `${userAddress.slice(0,6)}...${userAddress.slice(-4)}` : 'Connect Core'}
            </button>
          </div>
        </div>
      </nav>

      {/* Main Layout */}
      <div className="max-w-7xl mx-auto pt-40 pb-20 px-6 flex flex-col xl:flex-row gap-12 relative z-10">
        
        {/* Center/Left - Hero Content (Creative Layout) */}
        <div className={`flex-1 flex flex-col justify-center transition-all duration-500 ${showQueue ? 'xl:pr-[350px]' : ''}`}>
          
          <div className="text-center xl:text-left mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-[10px] uppercase tracking-[0.2em] font-bold text-cyan-400 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
              Powered by Arc Network
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6 leading-[1.1]">
              <span className="text-slate-100">DeFi executed by</span><br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500">Pure Intents.</span>
            </h1>
            
            <p className="text-base text-slate-400 max-w-2xl mx-auto xl:mx-0 leading-relaxed">
              No more bridging. No more gas tokens. ArcNexus AI abstracts the complexity of Web3. Command cross-chain operations using your <span className="text-cyan-400 font-semibold">Unified Balance</span> through natural language.
            </p>
          </div>

          {/* Floating Chat Console (The Core Feature) */}
          <div id="console" className="w-full max-w-4xl mx-auto xl:mx-0 bg-slate-900/50 backdrop-blur-2xl border border-white/10 rounded-2xl overflow-hidden shadow-[0_0_50px_-15px_rgba(6,182,212,0.15)] relative">
            
            {/* Console Header */}
            <div className="bg-slate-950/80 p-3 flex items-center justify-between border-b border-white/5">
               <div className="flex items-center gap-4">
                  <div className="flex gap-1.5 ml-2">
                    <div className="w-3 h-3 rounded-full bg-slate-700"></div>
                    <div className="w-3 h-3 rounded-full bg-slate-700"></div>
                    <div className="w-3 h-3 rounded-full bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.8)]"></div>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400 uppercase tracking-widest">Nexus Terminal v2.0</span>
               </div>
               <div className="flex items-center gap-2 px-2 py-0.5 rounded bg-white/5 border border-white/10">
                 <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                 <span className="text-[9px] font-bold text-emerald-500 uppercase">System Online</span>
               </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 h-[400px] flex flex-col gap-6 custom-scrollbar bg-gradient-to-b from-transparent to-slate-950/50">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  
                  <div className={`max-w-[90%] md:max-w-[80%] p-4 rounded-2xl ${
                    msg.role === 'user' 
                      ? 'bg-gradient-to-br from-cyan-600 to-indigo-600 text-white rounded-br-sm shadow-lg' 
                      : msg.role === 'system'
                      ? 'bg-slate-800/50 border border-slate-700 text-slate-400 text-[11px] font-mono rounded-md'
                      : msg.role === 'success'
                      ? 'bg-emerald-950/50 border border-emerald-500/30 text-emerald-400 text-sm rounded-bl-sm'
                      : 'bg-slate-800/80 border border-slate-700 text-slate-200 rounded-bl-sm shadow-md'
                  }`}>
                    
                    {msg.role === 'assistant' && (
                      <div className="flex items-center gap-2 mb-3 border-b border-slate-700/50 pb-2">
                        <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest">ArcNexus Agent</span>
                      </div>
                    )}

                    <p className="leading-relaxed whitespace-pre-wrap text-sm">{msg.content}</p>

                    {msg.type === 'action_proposal' && (
                      <div className="mt-5 p-4 bg-slate-950 rounded-xl border border-cyan-500/20 shadow-inner">
                        <div className="flex justify-between items-center text-xs mb-3">
                          <span className="text-slate-500 flex items-center gap-2">
                            <svg className="w-4 h-4 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                            Routing Protocol
                          </span>
                          <span className="font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded">App Kit Unified</span>
                        </div>
                        <div className="flex justify-between items-center text-xs mb-5">
                          <span className="text-slate-500 flex items-center gap-2">
                            <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            Gas Estimate
                          </span>
                          <span className="font-mono font-bold text-emerald-400">0.00 USDC</span>
                        </div>
                        
                        <button 
                          onClick={executeUnifiedTransaction}
                          disabled={isProcessingTx || txQueue[0]?.status === 'completed'}
                          className={`w-full py-3 rounded-lg font-bold text-xs transition-all flex justify-center items-center gap-2 ${
                            txQueue[0]?.status === 'completed' 
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                            : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                          } disabled:opacity-70`}
                        >
                          {isProcessingTx ? (
                            <span className="animate-pulse flex items-center gap-2">
                              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Processing Signature...
                            </span>
                          ) : txQueue[0]?.status === 'completed' ? (
                            <>Execution Finalized ✓</>
                          ) : (
                            <>Authorize Execution</>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-slate-800/80 border border-slate-700 rounded-lg p-4 flex gap-2 items-center shadow-md">
                    <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                    <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-slate-950/80 border-t border-white/5 relative z-10">
              
              {walletConnected && messages.length <= 2 && (
                <div className="flex gap-2 overflow-x-auto custom-scrollbar pb-3">
                  {suggestions.map((sug, i) => (
                    <button 
                      key={i}
                      onClick={() => handleSendMessage(undefined, sug)}
                      className="whitespace-nowrap px-4 py-2 bg-slate-800/50 hover:bg-cyan-500/10 border border-slate-700 hover:border-cyan-500/30 rounded-lg text-xs text-slate-300 transition-all shadow-sm"
                    >
                      {sug}
                    </button>
                  ))}
                </div>
              )}

              {!walletConnected ? (
                <div className="bg-slate-900/50 border border-slate-800 text-slate-500 p-4 rounded-xl text-center text-xs font-mono flex items-center justify-center gap-3">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                  Authentication required to broadcast intents.
                </div>
              ) : (
                <form onSubmit={(e) => handleSendMessage(e)} className="relative">
                  <div className="relative flex items-center bg-slate-900 border border-slate-700 rounded-xl overflow-hidden focus-within:border-cyan-500/50 focus-within:shadow-[0_0_20px_rgba(6,182,212,0.1)] transition-all">
                    <input 
                      type="text" 
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="Enter operational intent (e.g., 'Stake 500 USDC on Optimism')..." 
                      className="flex-1 bg-transparent border-none text-white px-5 py-4 focus:outline-none placeholder-slate-600 text-sm"
                    />
                    <button 
                      type="submit"
                      disabled={!inputValue.trim()}
                      className="bg-cyan-500 text-slate-950 px-5 py-2 mr-2 rounded-lg text-xs font-bold hover:bg-cyan-400 transition-colors disabled:opacity-50 disabled:bg-slate-800 disabled:text-slate-500 flex items-center gap-2"
                    >
                      EXECUTE <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Right Side - Floating Holographic Queue */}
        {showQueue && (
          <div className="hidden xl:block w-[320px] fixed right-8 top-32 bottom-8 bg-slate-900/60 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 shadow-[0_0_40px_-10px_rgba(0,0,0,0.5)] overflow-y-auto custom-scrollbar z-40 animate-in slide-in-from-right-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
                  <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>
                </div>
                <h3 className="text-sm font-bold text-white tracking-wide">
                  Active Registry
                </h3>
              </div>
              <button onClick={() => setShowQueue(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            {txQueue.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-40 text-center border-2 border-dashed border-slate-800 rounded-xl">
                <svg className="w-8 h-8 text-slate-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 12H4" /></svg>
                <span className="text-xs text-slate-500 font-medium">Registry is empty</span>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {txQueue.map((tx, i) => (
                  <div key={i} className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-4 hover:border-indigo-500/30 transition-colors relative overflow-hidden group">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-cyan-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-[10px] font-mono font-bold bg-slate-900 px-2 py-1 rounded text-cyan-400">{tx.id}</span>
                      <span className="text-[10px] text-slate-500 font-medium">{tx.time}</span>
                    </div>
                    
                    <p className="text-sm text-slate-200 mb-4 font-medium leading-snug">{tx.description}</p>
                    
                    <div className="flex items-center">
                      {tx.status === 'pending' ? (
                        <div className="flex items-center gap-2 px-2.5 py-1 bg-amber-500/10 border border-amber-500/20 rounded-md text-[10px] text-amber-400 font-bold uppercase tracking-wider w-full justify-center">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                          Awaiting Signature
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-md text-[10px] text-emerald-400 font-bold uppercase tracking-wider w-full justify-center">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
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

      {/* Futuristic Feature Cards */}
      <section id="features" className="py-24 px-6 relative z-10 border-t border-slate-800/50 bg-slate-950/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Underlying Architecture</h2>
            <p className="text-sm text-slate-400 max-w-xl mx-auto">Powered by the cutting-edge Arc App Kit, delivering a gasless, chain-abstracted experience.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "Unified Balances",
                icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
                desc: "USDC liquidity is aggregated instantly across all integrated networks. Eradicating the need for manual bridges.",
                color: "from-cyan-500 to-blue-500"
              },
              {
                title: "Paymaster Sponsored",
                icon: "M13 10V3L4 14h7v7l9-11h-7z",
                desc: "Gas fees are completely abstracted. Execute transactions without ever holding native tokens like ETH or SOL.",
                color: "from-indigo-500 to-purple-500"
              },
              {
                title: "MCP Integration",
                icon: "M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
                desc: "Model Context Protocol translates natural language straight into secure, verifiable smart contract calls.",
                color: "from-fuchsia-500 to-pink-500"
              }
            ].map((feat, i) => (
              <div key={i} className="group relative bg-slate-900 border border-slate-800 rounded-2xl p-8 hover:bg-slate-800/80 transition-all duration-300 overflow-hidden">
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${feat.color} opacity-5 blur-[50px] group-hover:opacity-20 transition-opacity`}></div>
                
                <div className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-slate-300 mb-6 group-hover:scale-110 transition-transform shadow-lg">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={feat.icon} /></svg>
                </div>
                
                <h3 className="text-lg font-bold text-slate-200 mb-3">{feat.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 py-10 px-6 relative z-10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-slate-500 text-xs font-medium">
          
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-cyan-500 to-indigo-500 flex items-center justify-center font-bold text-white text-[10px]">X</div>
            <span className="text-slate-300 font-bold">ArcNexus AI</span>
            <span className="hidden md:inline-block ml-4 text-slate-600">Built for the Global Web3 Hackathon</span>
          </div>

          <div className="flex gap-6">
            <a href="#" className="hover:text-cyan-400 transition-colors">Documentation</a>
            <a href="#" className="hover:text-cyan-400 transition-colors">GitHub Repository</a>
            <a href="#" className="hover:text-cyan-400 transition-colors">Arc Faucet</a>
          </div>
        </div>
      </footer>
      
      {/* Scrollbar styling */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(6, 182, 212, 0.2); border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(6, 182, 212, 0.5); }
        html { scroll-behavior: smooth; }
      `}} />
    </div>
  );
}