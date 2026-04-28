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
    <div className="min-h-screen bg-[#000000] text-[#e5e5e5] font-sans selection:bg-violet-500/30 overflow-x-hidden custom-scrollbar">
      
      {/* Sleek Minimalist Navbar (Arc Style) */}
      <nav className="fixed top-0 w-full z-50 bg-[#000000]/80 backdrop-blur-xl border-b border-white/[0.05]">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          
          {/* Logo Arc Style */}
          <div className="flex items-center gap-2">
            <div className="bg-[#7c3aed] text-white text-[11px] font-bold px-2 py-0.5 rounded flex items-center justify-center tracking-wide">
              Arc
            </div>
            <span className="text-white font-semibold text-sm tracking-tight">Nexus</span>
            <span className="text-[#555555] text-[10px] font-mono ml-3 uppercase tracking-[0.2em] hidden sm:inline">
              Testnet
            </span>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-6 text-[11px] uppercase tracking-widest font-medium text-[#888888]">
              <a href="#features" className="hover:text-white transition-colors">Features</a>
              <a href="#agent" className="hover:text-white transition-colors">NanoAI</a>
              <a href="https://docs.arc.network/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-white transition-colors">
                Docs <span className="text-[8px]">↗</span>
              </a>
            </div>

            {walletConnected && (
              <button 
                onClick={() => setShowQueue(!showQueue)}
                className="hidden md:flex items-center gap-2 text-xs font-medium text-[#888888] hover:text-white transition-colors relative"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
                Queue
                {txQueue.filter(tx => tx.status === 'pending').length > 0 && (
                  <span className="absolute -top-1 -right-2 flex h-3 w-3 items-center justify-center rounded-full bg-violet-600 text-[8px] text-white">
                    {txQueue.filter(tx => tx.status === 'pending').length}
                  </span>
                )}
              </button>
            )}

            {/* Wallet Info / Balance */}
            {walletConnected && balance && (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-[#111111] border border-white/10 rounded-md text-[11px] font-mono text-[#888888]">
                <span className="text-white">{balance}</span> USDC
              </div>
            )}

            <button 
              onClick={connectWallet}
              disabled={loading || walletConnected}
              className={`px-4 py-1.5 rounded-md font-medium transition-all text-xs flex items-center gap-2 ${
                walletConnected 
                ? 'bg-[#111111] border border-white/10 text-gray-300' 
                : 'bg-white text-black hover:bg-gray-200'
              }`}
            >
              {walletConnected && <div className="w-1.5 h-1.5 rounded-full bg-[#00ff00]"></div>}
              {loading ? 'Connecting...' : walletConnected ? `${userAddress.slice(0,6)}...${userAddress.slice(-4)}` : 'Connect Wallet'}
            </button>
          </div>
        </div>
      </nav>

      {/* Main Layout */}
      <div className="max-w-7xl mx-auto pt-32 pb-16 px-6 flex flex-col md:flex-row gap-12 relative z-10 min-h-[85vh]">
        
        {/* Left Side - Hero Content (Arc Left-Aligned Style) */}
        <div className={`flex-1 transition-all duration-300 ${showQueue ? 'md:pr-80' : ''}`}>
          
          {/* Live Indicator like Arc */}
          <div className="flex items-center gap-2 text-[10px] tracking-[0.2em] text-[#666666] font-mono uppercase mb-8">
            <div className="w-2 h-2 rounded-full bg-violet-600"></div>
            Live • Arc Testnet • Chain 5042002
          </div>

          <div className="mb-14">
            <h1 className="text-5xl md:text-7xl lg:text-[80px] font-bold tracking-tighter mb-6 leading-[1.05]">
              <span className="text-white">Cross-chain DeFi</span><br/>
              <span className="text-[#737373]">driven by intents.</span>
            </h1>
            <p className="text-sm md:text-base text-[#888888] max-w-xl leading-relaxed">
              Use your Unified Balance across any chain. Stop worrying about bridging, gas tokens, and liquidity fragmentation. Just tell NanoAI what you want.
            </p>
            
            <div className="flex items-center gap-4 mt-8">
              <a href="#agent" className="px-5 py-2.5 rounded-md bg-[#7c3aed] hover:bg-[#6d28d9] text-white text-sm font-medium transition-colors flex items-center gap-2">
                Launch NanoAI <span className="font-mono text-[10px]">→</span>
              </a>
              <a href="#features" className="px-5 py-2.5 rounded-md bg-[#111111] border border-white/10 text-white text-sm font-medium hover:bg-[#1a1a1a] transition-colors font-mono text-[10px] tracking-widest uppercase">
                Explore Features
              </a>
            </div>
          </div>

          {/* Arc Style Features Grid (Under Hero) */}
          <div id="features" className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-20 pt-16 border-t border-white/[0.05]">
            {/* Feature 1 */}
            <div>
              <div className="w-8 h-8 rounded bg-white/[0.03] border border-white/[0.05] flex items-center justify-center text-[#7c3aed] mb-6">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <div className="text-[10px] font-mono text-[#555555] tracking-[0.2em] mb-2 uppercase">01 / Unified Sourcing</div>
              <h3 className="text-lg font-semibold text-white mb-2 tracking-tight">Balances that merge.</h3>
              <p className="text-[#888888] text-sm leading-relaxed">Your USDC is pooled from all connected chains instantly. No manual bridging or fragmented liquidity.</p>
            </div>

            {/* Feature 2 */}
            <div>
              <div className="w-8 h-8 rounded bg-white/[0.03] border border-white/[0.05] flex items-center justify-center text-[#7c3aed] mb-6">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <div className="text-[10px] font-mono text-[#555555] tracking-[0.2em] mb-2 uppercase">02 / Arc Paymaster</div>
              <h3 className="text-lg font-semibold text-white mb-2 tracking-tight">Transact, gasless.</h3>
              <p className="text-[#888888] text-sm leading-relaxed">Powered by Arc Paymaster. Never hold native tokens (ETH, SOL, MATIC) just to pay for transactions again.</p>
            </div>

            {/* Feature 3 */}
            <div>
              <div className="w-8 h-8 rounded bg-white/[0.03] border border-white/[0.05] flex items-center justify-center text-[#7c3aed] mb-6">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              </div>
              <div className="text-[10px] font-mono text-[#555555] tracking-[0.2em] mb-2 uppercase">03 / Nano AI</div>
              <h3 className="text-lg font-semibold text-white mb-2 tracking-tight">Intents mapped perfectly.</h3>
              <p className="text-[#888888] text-sm leading-relaxed">x402 protocol with EIP-712 intents. Speak naturally, let MCP map your request to on-chain execution.</p>
            </div>
          </div>

          {/* The AI Chat Interface */}
          <div id="agent" className="mt-20 pt-16 border-t border-white/[0.05]">
            <h2 className="text-3xl font-semibold text-white tracking-tight mb-8">Execute via NanoAI</h2>
            
            <div className="bg-[#050505] border border-white/[0.05] rounded-xl overflow-hidden shadow-2xl flex flex-col h-[500px] relative">
              
              {/* Header of Chat */}
              <div className="bg-[#0a0a0a] border-b border-white/[0.05] p-4 flex items-center justify-between z-10">
                 <div className="flex items-center gap-3">
                    <div className="relative flex items-center justify-center">
                      <div className="w-1.5 h-1.5 bg-[#7c3aed] rounded-full"></div>
                      <div className="w-1.5 h-1.5 bg-[#7c3aed] rounded-full animate-ping absolute inset-0 opacity-50"></div>
                    </div>
                    <span className="text-xs font-medium text-gray-300">NanoAI System</span>
                 </div>
                 <div className="text-[10px] text-[#555555] font-mono uppercase tracking-widest">Model: Arc-MCP-v2.0</div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 custom-scrollbar">
                {messages.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    
                    <div className={`max-w-[85%] md:max-w-[75%] p-4 ${
                      msg.role === 'user' 
                        ? 'bg-[#111111] border border-white/[0.05] text-white rounded-lg' 
                        : msg.role === 'system'
                        ? 'bg-transparent border border-white/[0.05] text-[#888888] text-[11px] font-mono rounded-md'
                        : msg.role === 'success'
                        ? 'bg-[#052e16] border border-[#166534] text-[#4ade80] text-sm rounded-lg'
                        : 'bg-transparent border border-white/[0.05] text-[#e5e5e5] rounded-lg'
                    }`}>
                      
                      {msg.role === 'assistant' && (
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-4 h-4 bg-[#7c3aed] rounded-sm flex items-center justify-center text-[10px] font-bold text-white">N</div>
                          <span className="text-[10px] font-bold text-[#7c3aed] uppercase tracking-widest">NanoAI</span>
                        </div>
                      )}

                      <p className="leading-relaxed whitespace-pre-wrap text-sm">{msg.content}</p>

                      {msg.type === 'action_proposal' && (
                        <div className="mt-5 p-4 bg-[#0a0a0a] rounded-md border border-white/[0.05]">
                          <div className="flex justify-between text-xs mb-3 border-b border-white/[0.05] pb-2">
                            <span className="text-[#888888]">Unified Sourcing:</span>
                            <span className="font-mono text-white">Automatic</span>
                          </div>
                          <div className="flex justify-between text-xs mb-5">
                            <span className="text-[#888888]">Arc Paymaster (Gas):</span>
                            <span className="font-mono text-[#7c3aed]">0.00 USDC</span>
                          </div>
                          
                          <button 
                            onClick={executeUnifiedTransaction}
                            disabled={isProcessingTx || txQueue[0]?.status === 'completed'}
                            className="w-full py-2.5 bg-white text-black font-semibold rounded hover:bg-gray-200 transition-all disabled:opacity-50 flex justify-center items-center gap-2 text-xs"
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
                    <div className="bg-transparent border border-white/[0.05] rounded-lg p-4 flex gap-1.5 items-center">
                      <span className="w-1.5 h-1.5 bg-[#7c3aed] rounded-full animate-bounce"></span>
                      <span className="w-1.5 h-1.5 bg-[#7c3aed] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                      <span className="w-1.5 h-1.5 bg-[#7c3aed] rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area with Suggestions */}
              <div className="p-4 bg-[#0a0a0a] border-t border-white/[0.05] flex flex-col gap-3 z-10">
                
                {/* Quick Prompts */}
                {walletConnected && messages.length <= 2 && (
                  <div className="flex gap-2 overflow-x-auto custom-scrollbar pb-1">
                    {suggestions.map((sug, i) => (
                      <button 
                        key={i}
                        onClick={() => handleSendMessage(undefined, sug)}
                        className="whitespace-nowrap px-3 py-1.5 bg-[#111111] hover:bg-[#1a1a1a] border border-white/[0.05] rounded text-[11px] text-[#888888] transition-colors"
                      >
                        {sug}
                      </button>
                    ))}
                  </div>
                )}

                {!walletConnected ? (
                  <div className="bg-transparent border border-white/[0.05] text-[#555555] p-3 rounded text-center text-xs font-mono">
                    Please connect your Web3 wallet to interact with NanoAI.
                  </div>
                ) : (
                  <form onSubmit={(e) => handleSendMessage(e)} className="relative">
                    <div className="relative flex items-center bg-[#050505] border border-white/[0.1] rounded-md overflow-hidden focus-within:border-[#7c3aed]/50 transition-colors">
                      <input 
                        type="text" 
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Type your intent (e.g., 'Swap 500 USDC to MATIC')..." 
                        className="flex-1 bg-transparent border-none text-white px-4 py-3.5 focus:outline-none placeholder-[#555555] text-sm"
                      />
                      <button 
                        type="submit"
                        disabled={!inputValue.trim()}
                        className="bg-white text-black px-4 py-1.5 mr-2 rounded text-xs font-bold hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:bg-[#222] disabled:text-[#555]"
                      >
                        SEND
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Intent Queue Sidebar */}
        {showQueue && (
          <div className="hidden md:block w-80 fixed right-6 top-24 bottom-6 bg-[#0a0a0a] border border-white/[0.05] rounded-xl p-5 shadow-2xl overflow-y-auto custom-scrollbar z-40 animate-in slide-in-from-right-8">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/[0.05]">
              <h3 className="text-xs uppercase tracking-widest font-semibold text-[#888888] flex items-center gap-2">
                NanoAI Queue
              </h3>
              <button onClick={() => setShowQueue(false)} className="text-[#555555] hover:text-white">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            {txQueue.length === 0 ? (
              <div className="text-center text-xs text-[#555555] font-mono mt-10">
                No intents in queue.
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {txQueue.map((tx, i) => (
                  <div key={i} className="bg-[#111111] border border-white/[0.05] rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-[10px] font-mono text-[#555555]">{tx.id}</span>
                      <span className="text-[10px] text-[#555555]">{tx.time}</span>
                    </div>
                    <p className="text-xs text-[#e5e5e5] mb-4 truncate">{tx.description}</p>
                    <div className="flex items-center gap-2">
                      {tx.status === 'pending' ? (
                        <div className="flex items-center gap-1.5 text-[10px] text-amber-500 font-mono uppercase tracking-widest">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                          Pending Sign
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-[10px] text-emerald-500 font-mono uppercase tracking-widest">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
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

      {/* Footer */}
      <footer className="border-t border-white/[0.05] bg-[#000000] py-10 px-6 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-[#888888] text-[11px] uppercase tracking-widest font-mono">
          
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="bg-[#7c3aed] text-white text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center justify-center">Arc</div>
              <span className="text-white font-sans font-semibold text-xs tracking-tight">Nexus</span>
            </div>
            <span className="hidden md:block">© 2026. Built with Arc App Kit.</span>
          </div>

          <div className="flex gap-6">
            <a href="https://docs.arc.network/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Arc Docs</a>
            <a href="https://faucet.circle.com/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">USDC Faucet</a>
            <a href="#" className="hover:text-white transition-colors">Twitter</a>
            <a href="#" className="hover:text-white transition-colors">GitHub</a>
          </div>
        </div>
      </footer>
      
      {/* Scrollbar styling */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.2); }
        html { scroll-behavior: smooth; }
      `}} />
    </div>
  );
}