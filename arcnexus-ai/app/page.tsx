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
    { role: 'assistant', content: "Hello! I am ArcNexus AI. I can swap, bridge, or invest across chains using your Unified Balance. What is your intent today?" }
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
            content: `Wallet connected securely. Address: ${address.slice(0,6)}...${address.slice(-4)}. Unified Balance active: 3,450.00 USDC (Arbitrum, Optimism, Solana).` 
          }]);
        }
      } else {
        setMessages(prev => [...prev, { 
          role: 'system', 
          content: '⚠️ Web3 Wallet not found. Please install MetaMask or Rabby to use ArcNexus.' 
        }]);
      }
    } catch (error) {
      console.error("Wallet connection failed:", error);
      setMessages(prev => [...prev, { 
        role: 'system', 
        content: '❌ Wallet connection rejected by user.' 
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
      const newTxId = `tx-${Math.floor(Math.random() * 10000)}`;
      setTxQueue(prev => [{
        id: newTxId,
        description: msgToSend,
        status: 'pending',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }, ...prev]);

      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `I'll execute that for you. \n\nTarget: Cross-chain Execution.\nFunds: Pooling required USDC from your Unified Balance.\nGas Fees: $0.00 (Sponsored by Arc Paymaster).\n\nPlease approve this transaction.`,
        type: 'action_proposal'
      }]);
    }, 2000);
  };

  const executeUnifiedTransaction = () => {
    setIsProcessingTx(true);
    setMessages(prev => [...prev, { role: 'system', content: 'Sourcing liquidity and executing via Arc App Kit...' }]);

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
        content: 'Success. Cross-chain intent executed seamlessly. (Tx Hash: 0x8a9...4b2)' 
      }]);
    }, 3500);
  };

  return (
    <div className="min-h-screen bg-black text-gray-300 font-sans selection:bg-cyan-500/30 overflow-x-hidden custom-scrollbar">
      {/* Global Subtle Background Elements */}
      <div className="fixed top-[-20%] left-1/2 -translate-x-1/2 w-[60%] h-[400px] bg-cyan-900/20 blur-[120px] pointer-events-none rounded-full"></div>
      <div className="fixed bottom-[-10%] left-[-10%] w-[40%] h-[400px] bg-blue-900/20 blur-[120px] pointer-events-none rounded-full"></div>

      {/* Sleek Navbar */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-black/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-white text-sm shadow-[0_0_15px_rgba(34,211,238,0.2)]">
              N
            </div>
            <h1 className="text-lg font-semibold tracking-tight text-white mr-1">
              Arc<span className="text-cyan-400 font-normal">Nexus</span>
            </h1>
            
            {/* Live Arc Testnet Badge */}
            <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 bg-white/5 border border-white/10 rounded-full cursor-default">
              <div className="w-1.5 h-1.5 rounded-full bg-[#00ff00] shadow-[0_0_8px_rgba(0,255,0,0.8)]"></div>
              <span className="text-[11px] text-gray-300 font-medium">Live on Arc testnet</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-6 text-xs font-medium text-gray-500 mr-4">
              <a href="#features" className="hover:text-cyan-400 transition-colors">Features</a>
              <a href="https://docs.arc.network/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-cyan-300 transition-colors">
                Docs
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
              </a>
            </div>

            {walletConnected && (
              <button 
                onClick={() => setShowQueue(!showQueue)}
                className="hidden md:flex items-center gap-2 text-xs font-medium text-gray-400 hover:text-white transition-colors relative"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
                Intent Queue
                {txQueue.filter(tx => tx.status === 'pending').length > 0 && (
                  <span className="absolute -top-1 -right-2 flex h-3 w-3 items-center justify-center rounded-full bg-cyan-500 text-[8px] text-white">
                    {txQueue.filter(tx => tx.status === 'pending').length}
                  </span>
                )}
              </button>
            )}

            {/* Wallet Info / Balance */}
            {walletConnected && balance && (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-xs font-medium text-cyan-400">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                {balance} USDC
              </div>
            )}

            <button 
              onClick={connectWallet}
              disabled={loading || walletConnected}
              className={`px-4 py-2 rounded-full font-medium transition-all text-xs flex items-center gap-2 ${
                walletConnected 
                ? 'bg-white/5 border border-white/10 text-gray-300' 
                : 'bg-white text-black hover:bg-gray-200 shadow-[0_0_15px_rgba(255,255,255,0.1)]'
              }`}
            >
              {walletConnected && <div className="w-1.5 h-1.5 rounded-full bg-[#00ff00]"></div>}
              {loading ? 'Connecting...' : walletConnected ? `${userAddress.slice(0,6)}...${userAddress.slice(-4)}` : 'Connect Wallet'}
            </button>
          </div>
        </div>
      </nav>

      {/* Main Layout with optional Sidebar */}
      <div className="max-w-7xl mx-auto pt-24 pb-16 px-6 flex gap-6 relative z-10 min-h-[85vh]">
        
        {/* Left Side - Main Content */}
        <div className={`flex-1 transition-all duration-300 ${showQueue ? 'md:pr-80' : ''}`}>
          
          <div className="text-center mb-10 pt-10">
            <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400 tracking-tighter mb-4">
              Cross-Chain DeFi, <br/> Driven by Intents.
            </h1>
            <p className="text-sm text-gray-500 max-w-xl mx-auto">
              Just tell ArcNexus what you want, and our AI executes it across any chain using your <strong className="text-gray-300 font-medium">Unified Balance</strong>.
            </p>
          </div>

          {/* The AI Chat Interface */}
          <div className="max-w-3xl mx-auto bg-[#050505] border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col h-[550px] relative">
            
            {/* Header of Chat */}
            <div className="bg-[#0a0a0a] border-b border-white/5 p-3 flex items-center justify-between z-10">
               <div className="flex items-center gap-2">
                  <div className="relative flex items-center justify-center">
                    <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                    <div className="w-2 h-2 bg-cyan-500 rounded-full animate-ping absolute inset-0"></div>
                  </div>
                  <span className="text-xs font-medium text-gray-300">NanoAI Online</span>
               </div>
               <div className="text-[10px] text-gray-600 font-mono">Model: Arc-MCP-v2.0</div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4 custom-scrollbar">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2`}>
                  
                  <div className={`max-w-[85%] md:max-w-[75%] rounded-xl p-4 ${
                    msg.role === 'user' 
                      ? 'bg-white text-black shadow-lg' 
                      : msg.role === 'system'
                      ? 'bg-white/5 border border-white/5 text-gray-400 text-xs font-mono'
                      : msg.role === 'success'
                      ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm'
                      : 'bg-[#0f0f0f] border border-white/5 text-gray-300'
                  }`}>
                    
                    {msg.role === 'assistant' && (
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm">🤖</span>
                        <span className="text-[10px] font-bold text-cyan-500 uppercase tracking-widest">ArcNexus</span>
                      </div>
                    )}

                    <p className="leading-relaxed whitespace-pre-wrap text-xs md:text-sm">{msg.content}</p>

                    {msg.type === 'action_proposal' && (
                      <div className="mt-4 p-3 bg-black/50 rounded-lg border border-white/5">
                        <div className="flex justify-between text-xs mb-2">
                          <span className="text-gray-500">Unified Sourcing:</span>
                          <span className="font-mono text-white font-medium">Automatic</span>
                        </div>
                        <div className="flex justify-between text-xs mb-4">
                          <span className="text-gray-500">Arc Paymaster (Gas):</span>
                          <span className="font-mono text-emerald-400">0.00 USDC</span>
                        </div>
                        
                        <button 
                          onClick={executeUnifiedTransaction}
                          disabled={isProcessingTx || txQueue[0]?.status === 'completed'}
                          className="w-full py-2 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition-all disabled:opacity-50 flex justify-center items-center gap-2 text-xs"
                        >
                          {isProcessingTx ? (
                            <span className="animate-pulse">Processing via ArcKit...</span>
                          ) : txQueue[0]?.status === 'completed' ? (
                            <>Transaction Completed ✓</>
                          ) : (
                            <>Confirm Execution</>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-[#0f0f0f] border border-white/5 rounded-xl p-3 flex gap-1.5 items-center">
                    <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                    <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area with Suggestions */}
            <div className="p-3 bg-[#050505] border-t border-white/5 z-10 flex flex-col gap-3">
              
              {/* Quick Prompts */}
              {walletConnected && messages.length <= 2 && (
                <div className="flex gap-2 overflow-x-auto custom-scrollbar pb-1">
                  {suggestions.map((sug, i) => (
                    <button 
                      key={i}
                      onClick={() => handleSendMessage(undefined, sug)}
                      className="whitespace-nowrap px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-[10px] text-gray-300 transition-colors"
                    >
                      {sug}
                    </button>
                  ))}
                </div>
              )}

              {!walletConnected ? (
                <div className="bg-white/5 border border-white/10 text-gray-400 p-3 rounded-xl text-center text-xs">
                  Please connect your Web3 wallet to interact with NanoAI.
                </div>
              ) : (
                <form onSubmit={(e) => handleSendMessage(e)} className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                  <div className="relative flex items-center bg-[#0a0a0a] border border-white/10 rounded-xl overflow-hidden shadow-2xl">
                    <input 
                      type="text" 
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="Type your intent (e.g., 'Swap 500 USDC to MATIC')..." 
                      className="flex-1 bg-transparent border-none text-white px-4 py-3 focus:outline-none placeholder-gray-600 text-xs md:text-sm"
                    />
                    <button 
                      type="submit"
                      disabled={!inputValue.trim()}
                      className="bg-white text-black px-3 py-1.5 mr-2 rounded-lg font-medium hover:bg-gray-200 transition-colors disabled:opacity-50 flex items-center justify-center"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Right Side - Intent Queue Sidebar */}
        {showQueue && (
          <div className="hidden md:block w-80 fixed right-6 top-24 bottom-6 bg-[#050505] border border-white/10 rounded-2xl p-5 shadow-2xl overflow-y-auto custom-scrollbar z-40 animate-in slide-in-from-right-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                NanoAI Intent Queue
              </h3>
              <button onClick={() => setShowQueue(false)} className="text-gray-500 hover:text-white">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            {txQueue.length === 0 ? (
              <div className="text-center text-xs text-gray-600 mt-10">
                No intents in queue.<br/>Start chatting with the AI.
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {txQueue.map((tx, i) => (
                  <div key={i} className="bg-[#0a0a0a] border border-white/5 rounded-xl p-3">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[10px] font-mono text-gray-500">{tx.id}</span>
                      <span className="text-[10px] text-gray-500">{tx.time}</span>
                    </div>
                    <p className="text-xs text-gray-300 mb-3 truncate">{tx.description}</p>
                    <div className="flex items-center gap-2">
                      {tx.status === 'pending' ? (
                        <div className="flex items-center gap-1.5 px-2 py-1 bg-amber-500/10 border border-amber-500/20 rounded text-[9px] text-amber-400 font-medium uppercase tracking-wider">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                          Pending Sign
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 px-2 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded text-[9px] text-emerald-400 font-medium uppercase tracking-wider">
                          <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                          Executed
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

      {/* Floating Stats Bar */}
      <div className="max-w-4xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-3 relative z-10 mb-20">
        {[
          { label: 'Supported Chains', value: '12+' },
          { label: 'Gas Fees Paid', value: '$0.00' },
          { label: 'Execution Time', value: '< 3s' },
          { label: 'Success Rate', value: '99.9%' }
        ].map((stat, i) => (
          <div key={i} className="bg-[#050505]/80 backdrop-blur-md border border-white/5 rounded-xl p-5 text-center hover:border-cyan-500/20 transition-colors">
            <h3 className="text-2xl font-semibold text-white tracking-tight mb-1">{stat.value}</h3>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Features Grid Section */}
      <section id="features" className="py-20 px-6 relative z-10 bg-black border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-2xl md:text-3xl font-semibold text-white tracking-tight mb-3">Under the Hood</h2>
            <p className="text-sm text-gray-500 max-w-lg mx-auto">ArcNexus utilizes the full stack of Arc App Kit to deliver a seamless Web2-like experience.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Feature 1 */}
            <div className="group bg-[#050505] border border-white/5 rounded-2xl p-6 hover:border-cyan-500/30 transition-all duration-300 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 mb-5 border border-cyan-500/20">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <h3 className="text-sm font-semibold text-white mb-2">Unified Balance</h3>
              <p className="text-gray-500 text-xs leading-relaxed">Your USDC is pooled from all connected chains instantly. No more manual bridging or fragmented liquidity.</p>
            </div>

            {/* Feature 2 */}
            <div className="group bg-[#050505] border border-white/5 rounded-2xl p-6 hover:border-blue-500/30 transition-all duration-300 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 mb-5 border border-blue-500/20">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <h3 className="text-sm font-semibold text-white mb-2">Zero Gas Fees</h3>
              <p className="text-gray-500 text-xs leading-relaxed">Powered by the Arc Paymaster. Users never have to hold native tokens (ETH, SOL) to pay for transactions.</p>
            </div>

            {/* Feature 3 */}
            <div className="group bg-[#050505] border border-white/5 rounded-2xl p-6 hover:border-indigo-500/30 transition-all duration-300 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-5 border border-indigo-500/20">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              </div>
              <h3 className="text-sm font-semibold text-white mb-2">AI Intent Execution</h3>
              <p className="text-gray-500 text-xs leading-relaxed">Integrated with Model Context Protocol (MCP). The agent translates natural language into smart contract calls.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-black py-8 px-6 relative z-10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-gray-600 text-xs">
          
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-md bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center font-bold text-white text-[10px]">N</div>
                <span className="text-gray-300 font-semibold text-sm">ArcNexus</span>
              </div>
              
              {/* Live Arc Testnet Badge - Footer */}
              <div className="flex items-center gap-2 px-2.5 py-1 bg-white/5 border border-white/10 rounded-full cursor-default">
                <div className="w-1.5 h-1.5 rounded-full bg-[#00ff00] shadow-[0_0_8px_rgba(0,255,0,0.8)]"></div>
                <span className="text-[10px] text-gray-400 font-medium">Live on Arc testnet</span>
              </div>
            </div>
            <span className="hidden md:block text-gray-600">© 2026. Built with Arc App Kit.</span>
          </div>

          <div className="flex gap-5">
            <a href="https://docs.arc.network/" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition-colors">Arc Docs</a>
            <a href="https://faucet.circle.com/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">USDC Faucet</a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300 transition-colors">Twitter</a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300 transition-colors">GitHub</a>
          </div>
        </div>
      </footer>
      
      {/* Scrollbar styling */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.2); }
        html { scroll-behavior: smooth; }
      `}} />
    </div>
  );
}