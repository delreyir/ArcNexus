'use client';

import React, { useState, useRef, useEffect } from 'react';

// Types dial TypeScript
type Message = {
  role: string;
  content: string;
  type?: string;
};

export default function App() {
  const [walletConnected, setWalletConnected] = useState(false);
  const [userAddress, setUserAddress] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Chat State
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Hello! I am ArcNexus AI. I can swap, bridge, or invest across chains using your Unified Balance. What is your intent today?" }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isProcessingTx, setIsProcessingTx] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
      // Kan-checkiw wesh l'user m-installi MetaMask awla Rabby f l'Browser
      if (typeof window !== 'undefined' && (window as any).ethereum) {
        
        // Hna katlanci l'Popup dial l'Wallet bsse7 bach l'user y-accepti!
        const accounts = await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
        
        if (accounts && accounts.length > 0) {
          const address = accounts[0];
          setUserAddress(address);
          setWalletConnected(true);
          
          setMessages(prev => [...prev, { 
            role: 'system', 
            content: `Wallet connected securely. Address: ${address.slice(0,6)}...${address.slice(-4)}. Unified Balance active: 3,450 USDC (Arbitrum, Optimism, Solana).` 
          }]);
        }
      } else {
        // Ila makan m-installi 7ta wallet, kangolouha lih f l'chat
        setMessages(prev => [...prev, { 
          role: 'system', 
          content: '⚠️ Web3 Wallet not found. Please install MetaMask or Rabby to use ArcNexus.' 
        }]);
      }
    } catch (error) {
      console.error("Wallet connection failed:", error);
      // Ila l'user sed l'popup w ma-acceptach
      setMessages(prev => [...prev, { 
        role: 'system', 
        content: '❌ Wallet connection rejected by user.' 
      }]);
    } finally {
      setLoading(false);
    }
  };

  // Handle AI Chat
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || !walletConnected) return;

    const userMsg = inputValue;
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setInputValue('');
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `I'll execute that for you. \n\nTarget: Buy ETH on Base.\nFunds: Pooling 2,000 USDC from your Unified Balance.\nGas Fees: $0.00 (Sponsored by Arc Paymaster).\n\nPlease approve this transaction.`,
        type: 'action_proposal'
      }]);
    }, 2000);
  };

  const executeUnifiedTransaction = () => {
    setIsProcessingTx(true);
    setMessages(prev => [...prev, { role: 'system', content: 'Sourcing liquidity and executing via Arc App Kit...' }]);

    setTimeout(() => {
      setIsProcessingTx(false);
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
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-white text-sm shadow-[0_0_15px_rgba(34,211,238,0.2)]">
              N
            </div>
            <h1 className="text-lg font-semibold tracking-tight text-white mr-1">
              Arc<span className="text-cyan-400 font-normal">Nexus</span>
            </h1>
            
            {/* Live Arc Testnet Badge - Navbar */}
            <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 bg-white/5 border border-white/10 rounded-full cursor-default">
              <div className="w-1.5 h-1.5 rounded-full bg-[#00ff00] shadow-[0_0_8px_rgba(0,255,0,0.8)]"></div>
              <span className="text-[11px] text-gray-300 font-medium">Live on Arc testnet</span>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-xs font-medium text-gray-500">
            <a href="#features" className="hover:text-cyan-400 transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-cyan-400 transition-colors">Architecture</a>
            <a href="#agent" className="hover:text-cyan-400 transition-colors">AI Agent</a>
            
            <a 
              href="https://docs.arc.network/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center gap-1 hover:text-cyan-300 transition-colors"
            >
              Docs
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
            </a>
            
            <a 
              href="https://faucet.circle.com/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center gap-1 hover:text-blue-300 transition-colors"
            >
              Faucet
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
            </a>
          </div>

          <button 
            onClick={connectWallet}
            disabled={loading || walletConnected}
            className={`px-4 py-2 rounded-full font-medium transition-all text-xs flex items-center gap-2 ${
              walletConnected 
              ? 'bg-cyan-500/10 border border-cyan-500/20 text-cyan-400' 
              : 'bg-white text-black hover:bg-gray-200 shadow-[0_0_15px_rgba(255,255,255,0.1)]'
            }`}
          >
            {walletConnected && <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></div>}
            {loading ? 'Connecting...' : walletConnected ? `${userAddress.slice(0,6)}...${userAddress.slice(-4)}` : 'Connect Wallet'}
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-16 px-6 z-10">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/5 text-[10px] uppercase tracking-widest font-semibold text-cyan-400 mb-8 backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse"></span>
            Arc App Kit & MCP Integration
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400 tracking-tighter mb-6 leading-[1.1]">
            Cross-Chain DeFi, <br/> Driven by <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Intents.</span>
          </h1>
          
          <p className="text-sm md:text-base text-gray-500 mb-10 max-w-xl mx-auto leading-relaxed">
            Stop worrying about bridges, gas tokens, and liquidity fragmentation. Just tell ArcNexus what you want, and our AI executes it using your <strong className="text-gray-300 font-medium">Unified Balance</strong>.
          </p>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-3">
            <a href="#agent" className="w-full md:w-auto px-6 py-2.5 rounded-full bg-white text-black text-sm font-semibold hover:scale-105 transition-transform shadow-[0_0_20px_rgba(255,255,255,0.1)]">
              Launch Agent
            </a>
            <a href="https://docs.arc.network/" target="_blank" rel="noopener noreferrer" className="w-full md:w-auto px-6 py-2.5 rounded-full bg-transparent border border-white/10 text-white text-sm font-medium hover:bg-white/5 transition-colors flex items-center justify-center gap-2">
              Read Documentation
            </a>
          </div>
        </div>

        {/* Floating Stats Bar */}
        <div className="max-w-4xl mx-auto mt-20 grid grid-cols-2 md:grid-cols-4 gap-3">
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
      </section>

      {/* Features Grid Section */}
      <section id="features" className="py-20 px-6 relative z-10 bg-black">
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

      {/* AI Agent Application Section */}
      <section id="agent" className="py-20 px-6 relative z-10">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-white mb-3">Talk to ArcNexus</h2>
            <p className="text-sm text-gray-500">Experience the future of Web3 interactions. Connect your wallet and type your intent.</p>
          </div>

          {/* The AI Chat Interface */}
          <div className="bg-[#050505] border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col h-[500px] relative">
            
            {/* Header of Chat */}
            <div className="bg-[#0a0a0a] border-b border-white/5 p-3 flex items-center justify-between z-10">
               <div className="flex items-center gap-2">
                  <div className="relative flex items-center justify-center">
                    <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                    <div className="w-2 h-2 bg-cyan-500 rounded-full animate-ping absolute inset-0"></div>
                  </div>
                  <span className="text-xs font-medium text-gray-300">Agent Online</span>
               </div>
               <div className="text-[10px] text-gray-600 font-mono">Model: Arc-MCP-v1.2</div>
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
                          <span className="text-gray-500">Execution Cost:</span>
                          <span className="font-mono text-white font-medium">2,000.00 USDC</span>
                        </div>
                        <div className="flex justify-between text-xs mb-4">
                          <span className="text-gray-500">Gas Fees:</span>
                          <span className="font-mono text-emerald-400">0.00 USDC</span>
                        </div>
                        
                        <button 
                          onClick={executeUnifiedTransaction}
                          disabled={isProcessingTx}
                          className="w-full py-2 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition-all disabled:opacity-50 flex justify-center items-center gap-2 text-xs"
                        >
                          {isProcessingTx ? (
                            <span className="animate-pulse">Processing via ArcKit...</span>
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

            {/* Input Area */}
            <div className="p-3 bg-[#050505] border-t border-white/5 z-10">
              {!walletConnected ? (
                <div className="bg-white/5 border border-white/10 text-gray-400 p-3 rounded-xl text-center text-xs">
                  Please connect your wallet to interact with the AI.
                </div>
              ) : (
                <form onSubmit={handleSendMessage} className="relative group">
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
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.2); }
        html { scroll-behavior: smooth; }
      `}} />
    </div>
  );
}