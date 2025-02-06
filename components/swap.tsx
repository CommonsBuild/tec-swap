"use client";

import { Input } from "@/components/ui/input";
import {
  useTokenBalances,
  useTokenSymbols,
  useFeePercentages,
  useTokenDecimals,
  useMakeSellOrder,
  useMakeBuyOrder,
  useCollateralTokenApproval,
  useBondingCurvePrice,
  useIsAmountValid,
} from "@/hooks/blockchain";
import { useCallback, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useAccount } from "wagmi";
import { formatBalance, formatFeePercentage } from "@/lib/utils";
import { parseUnits, formatUnits } from "viem";
import { Card } from "@/components/ui/card";
import { ArrowUp, ArrowUpDown } from "lucide-react";
import {
  showSuccessToast,
  showDestructiveToast,
} from "@/components/custom-toast";
import { ConnectButtonSwap } from "./connect-button";
import { wagmiConfig } from "@/lib/wagmi";

enum SwapState {
  IDLE = "idle",
  APPROVING = "approving",
  APPROVED = "approved",
  SIGNING = "signing",
  PENDING = "pending",
}

export default function Swap() {
  const { address, chain } = useAccount();

  const isChainSupported = wagmiConfig.chains.some(
    (supportedChain) => chain?.id === supportedChain.id
  );

  const [amount, setAmount] = useState<string>("");
  const [isBuy, setIsBuy] = useState<boolean>(true);
  const [receiveAmount, setReceiveAmount] = useState<string>("");
  const [swapState, setSwapState] = useState<SwapState>(SwapState.IDLE);

  const { collateralTokenSymbol, tecTokenSymbol } = useTokenSymbols();
  const { collateralTokenBalance, tecTokenBalance, refetch } = useTokenBalances(
    address as `0x${string}`
  );
  const { buyFeePercentage, sellFeePercentage } = useFeePercentages();
  const { collateralTokenDecimals, tecTokenDecimals } = useTokenDecimals();

  const executeSellOrder = useMakeSellOrder(
    address as `0x${string}`,
    parseUnits(amount, tecTokenDecimals),
    refetch
  );

  const executeBuyOrder = useMakeBuyOrder(
    address as `0x${string}`,
    parseUnits(amount, collateralTokenDecimals)
  );

  const expectedReturn = useBondingCurvePrice(
    isBuy
      ? parseUnits(amount, collateralTokenDecimals)
      : parseUnits(amount, tecTokenDecimals),
    isBuy ? "buy" : "sell"
  );

  const { approve, isPending } = useCollateralTokenApproval(
    parseUnits(amount, collateralTokenDecimals),
    async () => {
      setSwapState(SwapState.SIGNING);
      try {
        await executeBuyOrder();
        await refetch();
        showSuccessToast({
          title: "Success",
          description: "Swap completed successfully!",
        });
      } catch (err) {
        console.error("Error during buy order:", err);
        if (err instanceof Error && err.message.includes("rejected")) {
          showDestructiveToast({
            title: "Transaction Cancelled",
            description: "You rejected the transaction",
          });
        } else {
          showDestructiveToast({
            title: "Error",
            description: "Failed to complete swap",
          });
        }
      } finally {
        setSwapState(SwapState.IDLE);
      }
    }
  );

  const handleBuyOrder = useCallback(async () => {
    try {
      setSwapState(SwapState.APPROVING);
      await approve();
    } catch (err) {
      console.error("Error during buy order approval:", err);
      if (err instanceof Error && err.message.includes("rejected")) {
        showDestructiveToast({
          title: "Transaction Cancelled",
          description: "You rejected the approval",
        });
      } else {
        showDestructiveToast({
          title: "Error",
          description: "Failed to approve token",
        });
      }
    } finally {
      setSwapState(SwapState.IDLE);
    }
  }, [approve]);

  const handleSellOrder = useCallback(async () => {
    try {
      setSwapState(SwapState.SIGNING);
      await executeSellOrder();
      await refetch();
      showSuccessToast({
        title: "Success",
        description: "Sell order completed successfully!",
      });
    } catch (err) {
      console.error("Error during sell order:", err);
      if (err instanceof Error && err.message.includes("rejected")) {
        showDestructiveToast({
          title: "Transaction Cancelled",
          description: "You rejected the transaction",
        });
      } else {
        showDestructiveToast({
          title: "Error",
          description: "Failed to complete sell order",
        });
      }
    } finally {
      setSwapState(SwapState.IDLE);
    }
  }, [executeSellOrder, refetch]);

  const swapAction = useCallback(
    async () => await (isBuy ? handleBuyOrder() : handleSellOrder()),
    [isBuy, handleBuyOrder, handleSellOrder]
  );

  const isAmountValid = useIsAmountValid(
    amount,
    isBuy ? collateralTokenBalance : tecTokenBalance
  );

  const isButtonDisabled = useCallback(() => {
    return (
      !address || isPending || swapState !== SwapState.IDLE || !isAmountValid
    );
  }, [address, isPending, swapState, isAmountValid]);

  const buttonTexts: Record<string, () => boolean> = {
    "Connect Wallet": () => !address,
    "Approving...": () => swapState === SwapState.APPROVING,
    Approved: () => swapState === SwapState.APPROVED,
    "Waiting for signature...": () => swapState === SwapState.SIGNING,
    "Processing...": () => swapState === SwapState.PENDING,
    Swap: () => true,
  };

  const getButtonText = () => {
    for (const text in buttonTexts) {
      if (buttonTexts[text as keyof typeof buttonTexts]()) {
        return text;
      }
    }
  };

  useEffect(() => {
    if (expectedReturn) {
      const parsedExpectedReturn = isBuy
        ? formatUnits(expectedReturn, tecTokenDecimals)
        : formatUnits(expectedReturn, collateralTokenDecimals);
      setReceiveAmount(parsedExpectedReturn);
    } else {
      setReceiveAmount("");
    }
  }, [expectedReturn, isBuy, collateralTokenDecimals, tecTokenDecimals]);

  return (
    <div className="space-y-6 w-full">
      <div className="flex items-center justify-between gap-4 p-4 bg-blue-950/30 rounded-lg backdrop-blur-sm border border-blue-900/50 font-chakra font-base text-lg font-semibold">
        <div className="flex items-center gap-2">
          <span className="text-blue-400 min-w-24 truncate">Entry Tribute</span>
          <span className="text-tec-yellow">
            {formatFeePercentage(buyFeePercentage, collateralTokenDecimals)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-blue-400">Exit Tribute</span>
          <span className="text-tec-yellow">
            {formatFeePercentage(sellFeePercentage, tecTokenDecimals)}
          </span>
        </div>
      </div>

      <Card className="bg-blue-950/30 border-blue-900/50 backdrop-blur-sm">
        <div className="p-6 space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-xl uppercase  text-tec-yellow font-semibold font-bay">
                  You Send
                </span>
              </div>
              <div className="flex gap-4">
                <Input
                  value={amount}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d*\.?\d*$/.test(value)) {
                      setAmount(value);
                    }
                  }}
                  placeholder="0"
                  className="h-10 font-chakra text-tec-yellow font-bold bg-transparent border-blue-900/50 text-lg md:text-xl focus:ring-tec-yellow active:ring-tec-yellow focus-visible:ring-tec-yellow"
                />
                <Button
                  variant="outline"
                  className="border-blue-900/50 text-tec-yellow/80 h-10 font-bay font-semibold text-lg min-w-20 px-2"
                >
                  {isBuy ? collateralTokenSymbol : tecTokenSymbol}
                </Button>
              </div>
              <div className="text-sm text-blue-500 flex items-center justify-start gap-2">
                <p className="uppercase font-chakra font-semibold text-lg">
                  Balance:{" "}
                  {formatBalance(
                    isBuy ? collateralTokenBalance : tecTokenBalance
                  )}
                </p>
                <button
                  className="px-2 py-0.5 rounded-non bg-blue-400 text-blue-800 text-sm font-semibold  hover:bg-tec-yellow hover:text-black"
                  onClick={() =>
                    setAmount(isBuy ? collateralTokenBalance : tecTokenBalance)
                  }
                >
                  MAX
                </button>
              </div>
            </div>

            <div className="flex justify-center hover:cursor-pointer">
              <button
                onClick={() => {
                  setIsBuy(!isBuy);
                  setAmount("");
                  setReceiveAmount("");
                }}
                className="hidden sm:block rounded-full bg-blue-950/50 hover:bg-blue-900/50 h-12 w-12 p-1 active:bg-blue-950/50 focus:bg-blue-950/50 touch-none"
              >
                <ArrowUp className="h-6 w-6 text-blue-400 mx-auto transform hover:rotate-180 transition-transform duration-300 hover:stroke-tec-yellow" />
              </button>
              <button
                onClick={() => {
                  setIsBuy(!isBuy);
                  setAmount("");
                  setReceiveAmount("");
                }}
                className="block sm:hidden rounded-full bg-blue-950/50 hover:bg-blue-900/50 h-12 w-12 p-1 active:bg-blue-950/50 focus:bg-blue-950/50 touch-none"
              >
                <ArrowUpDown className="h-6 w-6 text-blue-400 mx-auto" />
              </button>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-lg uppercase  text-tec-yellow font-semibold font-bay">
                  You Receive
                </span>
              </div>
              <div className="flex gap-4">
                <Input
                  value={receiveAmount}
                  onChange={(e) => setReceiveAmount(e.target.value)}
                  placeholder="0"
                  className="h-10 font-chakra text-tec-yellow font-bold bg-transparent border-blue-900/50 text-lg md:text-xl focus:ring-tec-yellow active:ring-tec-yellow focus-visible:ring-tec-yellow"
                  disabled
                />
                <Button
                  variant="outline"
                  className="border-blue-900/50 text-tec-yellow/80 h-10 font-bay font-semibold text-lg min-w-20 px-2"
                >
                  {isBuy ? tecTokenSymbol : collateralTokenSymbol}
                </Button>
              </div>
              <div className="text-sm text-blue-500 flex items-center justify-start gap-2">
                <p className="uppercase font-chakra font-semibold text-lg">
                  Balance:{" "}
                  {formatBalance(
                    isBuy ? tecTokenBalance : collateralTokenBalance
                  )}
                </p>
              </div>{" "}
            </div>
          </div>
          {!address || !isChainSupported ? (
            <ConnectButtonSwap />
          ) : (
            <Button
              className="w-full bg-tec-yellow text-blue-900 hover:opacity-90 rounded-none uppercase font-chakra text-xl font-semibold tracking-wider h-12"
              onClick={swapAction}
              disabled={isButtonDisabled()}
            >
              {getButtonText()}
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}
