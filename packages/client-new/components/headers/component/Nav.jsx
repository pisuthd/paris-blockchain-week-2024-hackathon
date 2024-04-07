"use client";
import { explore, homes, pages, resources } from "@/data/menu";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  WalletModalProvider,
  WalletDisconnectButton,
  WalletMultiButton
} from '@solana/wallet-adapter-react-ui';

export default function Nav() {
  const pathname = usePathname();
  const isActiveParentMenu = (menus) => {
    return menus.some(
      (elm) => elm.href.split("/")[1] == pathname.split("/")[1]
    );
  };
  return (
    <>

      <li className="group">
        <Link
          href="/"
          className={`flex items-center justify-between py-3.5 font-display text-base  ${pathname === "/"
              ? "text-accent dark:text-accent"
              : "text-jacarta-700 dark:text-white"
            }  hover:text-accent focus:text-accent dark:hover:text-accent dark:focus:text-accent lg:px-5`}
        >
          Home
        </Link>
      </li>
      <li className="group">
        <Link
          href="/mint"
          className={`flex items-center justify-between py-3.5 font-display text-base  ${pathname === "/mint"
              ? "text-accent dark:text-accent"
              : "text-jacarta-700 dark:text-white"
            }  hover:text-accent focus:text-accent dark:hover:text-accent dark:focus:text-accent lg:px-5`}
        >
          Mint Now
        </Link>
      </li>
 
      <li className="group ml-10">
        <WalletMultiButton/>
      </li>
    </>
  );
}
