"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import Image from "next/image";

export function ConnectButtonTECHeader() {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        const ready = mounted && authenticationStatus !== "loading";
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus || authenticationStatus === "authenticated");

        return (
          <div
            {...(!ready && {
              "aria-hidden": true,
              style: {
                opacity: 0,
                pointerEvents: "none",
                userSelect: "none",
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <button
                    onClick={openConnectModal}
                    type="button"
                    className="bg-tec-yellow text-black px-5 py-2 font-baiJamjuree font-bold min-w-56 "
                  >
                    {"Connect Wallet".toUpperCase()}
                  </button>
                );
              }

              if (chain.unsupported) {
                return (
                  <button
                    onClick={openChainModal}
                    type="button"
                    className="bg-red-500 text-white px-5 py-2 font-baiJamjuree font-bold min-w-56"
                  >
                    Wrong network
                  </button>
                );
              }

              return (
                <div className="bg-tec-yellow text-black justify-center py-2 font-baiJamjuree font-bold min-w-56 flex items-center gap-2">
                  <button onClick={openChainModal} type="button">
                    {chain.hasIcon && chain.iconUrl && (
                      <Image
                        alt={chain.name ?? "Chain icon"}
                        src={chain.iconUrl}
                        width={24}
                        height={24}
                      />
                    )}
                  </button>

                  <button onClick={openAccountModal} type="button">
                    {account.displayName}
                    {account.displayBalance
                      ? ` (${account.displayBalance})`
                      : ""}
                  </button>
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
}

export function ConnectButtonSwap() {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        const ready = mounted && authenticationStatus !== "loading";
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus || authenticationStatus === "authenticated");

        return (
          <div
            {...(!ready && {
              "aria-hidden": true,
              style: {
                opacity: 0,
                pointerEvents: "none",
                userSelect: "none",
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <button
                    onClick={openConnectModal}
                    type="button"
                    className="w-full bg-tec-yellow text-blue-900 hover:opacity-90 rounded-none uppercase font-chakra text-xl font-semibold tracking-wider py-2 h-12"
                  >
                    {"Connect Wallet".toUpperCase()}
                  </button>
                );
              }

              if (chain.unsupported) {
                return (
                  <button
                    onClick={openChainModal}
                    type="button"
                    className="w-full bg-red-500 text-white px-5 py-2 font-baiJamjuree font-bold py-2 h-12"
                  >
                    Wrong network
                  </button>
                );
              }

              return (
                <div className="bg-tec-yellow text-black justify-center py-2 font-baiJamjuree font-bold min-w-56 flex items-center gap-2">
                  <button onClick={openChainModal} type="button">
                    {chain.hasIcon && chain.iconUrl && (
                      <Image
                        alt={chain.name ?? "Chain icon"}
                        src={chain.iconUrl}
                        width={24}
                        height={24}
                      />
                    )}
                  </button>

                  <button onClick={openAccountModal} type="button">
                    {account.displayName}
                    {account.displayBalance
                      ? ` (${account.displayBalance})`
                      : ""}
                  </button>
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
}
