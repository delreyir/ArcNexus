
# 🟢 ArcNexus AI

**Cross-Chain DeFi, Driven by Intents.**
Abstracting liquidity fragmentation and gas fees using the Arc App Kit and MCP AI.

---

## 📖 About The Project

ArcNexus AI is a next-generation Web3 agent built on the **Arc Testnet**. It eliminates the friction of traditional DeFi (bridging, swapping, and native gas tokens) by translating natural language intents into seamless cross-chain executions.

Instead of navigating complex UIs, users simply tell the AI what they want to achieve. ArcNexus pools their **Unified Balance** across multiple chains (Arbitrum, Optimism, Solana, Base) and executes the transaction with **Zero Gas Fees** via the Arc Paymaster.

## ✨ Features

* 🧠 **AI Intent Execution (MCP)**: Uses the Model Context Protocol to translate user chat prompts (e.g., *"Buy 1 ETH on Base"*) into smart contract calls.
* 💱 **Unified Balance**: Instantly aggregates the user's USDC liquidity across all supported networks. No manual bridging required.
* ⛽ **Zero Gas Experience**: Fully sponsored transactions using the Circle Arc Paymaster. Users never need to hold native tokens (ETH, SOL, MATIC) to transact.
* 🎨 **Modern, Sleek UI**: A premium, neo-brutalism inspired chat interface designed for the ultimate user experience.

## 🛠️ Built With

This project heavily leverages the **Arc Network** ecosystem and modern frontend technologies:

* [**Arc App Kit**](https://docs.arc.network/) - For Unified Balances and Paymaster Gas Sponsorship.
* [**Viem (v2)**](https://viem.sh/) - For robust wallet interactions and Ethereum RPCs.
* [**Next.js (App Router)**](https://nextjs.org/) - For the React framework and UI architecture.
* **Tailwind CSS** - For rapid, responsive, and sleek styling.
* **AI Model Context Protocol (MCP)** - For intelligent intent parsing.

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

Ensure you have Node.js installed and a Web3 Wallet (like MetaMask or Rabby) configured in your browser.

### Installation

1. **Clone the repo**

        git clone [https://github.com/delreyir/ArcNexus.git](https://github.com/delreyir/ArcNexus.git)

2. **Navigate to the project directory**

        cd arcnexus-ai

3. **Install NPM packages**

        npm install

4. **Run the development server**

        npm run dev

5. **Open the app**
   Navigate to `http://localhost:3000` in your browser.

## 🧪 Testing on Arc Testnet

To fully test ArcNexus AI, you will need Testnet USDC on supported chains.

1. Get testnet USDC from the [**Official Circle Faucet**](https://faucet.circle.com/).
2. Connect your wallet to ArcNexus.
3. Chat with the AI to execute cross-chain operations using your Unified Balance.

## 📄 License

Distributed under the MIT License.
EOF