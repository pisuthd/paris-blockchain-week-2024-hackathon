"use client";

import { useMemo } from 'react';

import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import {
  WalletModalProvider,
  WalletDisconnectButton,
  WalletMultiButton
} from '@solana/wallet-adapter-react-ui';
import WalletModal from "@/components/modals/WalletModal";
import "../public/styles/style.css";
import "swiper/css";
// import "swiper/css/pagination";
// import { MetaMaskProvider } from "metamask-react";
import "tippy.js/dist/tippy.css";
import "react-modal-video/css/modal-video.css";
import BuyModal from "@/components/modals/BuyModal";
import { UnsafeBurnerWalletAdapter } from '@solana/wallet-adapter-wallets';
import BidModal from "@/components/modals/BidModal";
import PropertiesModal from "@/components/modals/PropertiesModal";
import LevelsModal from "@/components/modals/LevelsModal";
import ModeChanger from "@/components/common/ModeChanger";
import { clusterApiUrl } from '@solana/web3.js';
if (typeof window !== "undefined") {
  // Import the script only on the client side
  import("bootstrap/dist/js/bootstrap.esm").then((module) => {
    // Module is imported, you can access any exported functionality if
  });
}

// Default styles that can be overridden by your app
require('@solana/wallet-adapter-react-ui/styles.css');


export default function RootLayout({ children }) {

  const network = WalletAdapterNetwork.Devnet;

  // You can also provide a custom RPC endpoint.
  const endpoint = clusterApiUrl("devnet")

  const wallets = useMemo(
    () => [
      /**
       * Wallets that implement either of these standards will be available automatically.
       *
       *   - Solana Mobile Stack Mobile Wallet Adapter Protocol
       *     (https://github.com/solana-mobile/mobile-wallet-adapter)
       *   - Solana Wallet Standard
       *     (https://github.com/anza-xyz/wallet-standard)
       *
       * If you wish to support a wallet that supports neither of those standards,
       * instantiate its legacy wallet adapter here. Common legacy adapters can be found
       * in the npm package `@solana/wallet-adapter-wallets`.
       */
      new UnsafeBurnerWalletAdapter(),
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [network]
  );

  return (
    <html lang="en">
      <body
        itemScope
        itemType="http://schema.org/WebPage"
        className={
          "overflow-x-hidden font-body text-jacarta-500 dark:bg-jacarta-900"
        }
      >
        <ModeChanger />
        <ConnectionProvider endpoint={endpoint}>
          <WalletProvider wallets={wallets} autoConnect>
            <WalletModalProvider>
              {/* <WalletMultiButton />
            <WalletDisconnectButton /> */}
              {children}
            </WalletModalProvider>
          </WalletProvider>
        </ConnectionProvider>

        <WalletModal />
        <BuyModal />
        <BidModal />
        <PropertiesModal />
        <LevelsModal />
      </body>
    </html>
  );
}
