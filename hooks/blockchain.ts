import {
  useBalance,
  useReadContract,
  useReadContracts,
  useWriteContract,
} from "wagmi";
import { formatUnits, parseAbi } from "viem";
import contracts from "@/contracts.json";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { addBigInt, applyFee } from "@/lib/utils";
import {
  showDestructiveToast,
  showSuccessToast,
} from "@/components/custom-toast";

const tecTokenContract = {
  address: contracts.tecToken.address as `0x${string}`,
  abi: parseAbi(contracts.tecToken.abi),
};

const collateralTokenContract = {
  address: contracts.collateralToken.address as `0x${string}`,
  abi: parseAbi(contracts.collateralToken.abi),
};

const bondingCurveContract = {
  address: contracts.bondingCurve.address as `0x${string}`,
  abi: parseAbi(contracts.bondingCurve.abi),
};

const formulaContract = {
  address: contracts.formula.address as `0x${string}`,
  abi: parseAbi(contracts.formula.abi),
};

export const useTokenDecimals = () => {
  const result = useReadContracts({
    contracts: [
      {
        ...collateralTokenContract,
        functionName: "decimals",
      },
      {
        ...tecTokenContract,
        functionName: "decimals",
      },
    ],
  });

  return {
    collateralTokenDecimals: result.data?.[0]?.result
      ? parseInt(result.data[0].result.toString())
      : 18,
    tecTokenDecimals: result.data?.[1]?.result
      ? parseInt(result.data[1].result.toString())
      : 18,
  };
};

export const useTokenSymbols = () => {
  const result = useReadContracts({
    contracts: [
      {
        ...collateralTokenContract,
        functionName: "symbol",
      },
      {
        ...tecTokenContract,
        functionName: "symbol",
      },
    ],
  });

  const collateralTokenSymbol = result.data?.[0]?.result
    ? result.data[0].result.toString()
    : "";
  const tecTokenSymbol = result.data?.[1]?.result
    ? result.data[1].result.toString()
    : "";

  return { collateralTokenSymbol, tecTokenSymbol };
};

export const useTokenBalances = (address: `0x${string}`) => {
  const { collateralTokenDecimals, tecTokenDecimals } = useTokenDecimals();
  const result = useReadContracts({
    contracts: [
      {
        ...collateralTokenContract,
        functionName: "balanceOf",
        args: [address as `0x${string}`],
      },
      {
        ...tecTokenContract,
        functionName: "balanceOf",
        args: [address as `0x${string}`],
      },
    ],
  });

  const collateralTokenBalance = result.data?.[0]?.result
    ? formatUnits(result.data[0].result as bigint, collateralTokenDecimals)
    : "0";
  const tecTokenBalance = result.data?.[1]?.result
    ? formatUnits(result.data[1].result as bigint, tecTokenDecimals)
    : "0";

  return {
    collateralTokenBalance,
    tecTokenBalance,
    refetch: result.refetch,
  };
};

export const useFeePercentages = () => {
  const result = useReadContracts({
    contracts: [
      {
        ...bondingCurveContract,
        functionName: "buyFeePct",
      },
      {
        ...bondingCurveContract,
        functionName: "sellFeePct",
      },
    ],
  });

  const buyFeePercentage = result.data?.[0]?.result
    ? (result.data[0].result as bigint)
    : undefined;
  const sellFeePercentage = result.data?.[1]?.result
    ? (result.data[1].result as bigint)
    : undefined;

  return { buyFeePercentage, sellFeePercentage };
};

export const useCollateralTokenApproval = (
  amount: bigint,
  onApproved: () => Promise<void>
) => {
  const { writeContractAsync } = useWriteContract();
  const [isPending, setIsPending] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const hasExecutedRef = useRef(false);

  const approve = useCallback(async () => {
    try {
      setIsPending(true);
      setError(null);
      await writeContractAsync(
        {
          ...collateralTokenContract,
          functionName: "approve",
          args: [contracts.bondingCurve.address as `0x${string}`, amount],
        },
        {
          onSuccess: () => {
            setIsConfirmed(true);
            setIsPending(false);
          },
          onError: (error) => {
            setIsPending(false);
            if (error.message.includes("User rejected")) {
              showDestructiveToast({
                title: "Error",
                description: "Transaction was rejected",
              });
            } else {
              setError(error as Error);
            }
          },
        }
      );
    } catch (error) {
      setIsPending(false);
      if (error instanceof Error && error.message.includes("User rejected")) {
        showDestructiveToast({
          title: "Error",
          description: "Transaction was rejected",
        });
      } else {
        setError(error as Error);
      }
    }
  }, [amount, writeContractAsync]);

  useEffect(() => {
    if (isConfirmed && !hasExecutedRef.current) {
      hasExecutedRef.current = true;
      onApproved();
    }
  }, [isConfirmed, onApproved]);

  return { approve, isPending, isConfirmed, error };
};

export const useMakeBuyOrder = (address: `0x${string}`, amount: bigint) => {
  const { writeContractAsync } = useWriteContract();

  const executeBuyOrder = async () => {
    try {
      await writeContractAsync(
        {
          ...bondingCurveContract,
          functionName: "makeBuyOrder",
          args: [
            address as `0x${string}`,
            contracts.collateralToken.address as `0x${string}`,
            amount,
            0n,
          ],
        },
        {
          onSuccess: () => {
            showSuccessToast({
              title: "Success",
              description: "Swap completed successfully!",
            });
          },
          onSettled: () => {
            showSuccessToast({
              title: "Success",
              description: "Swap completed successfully!",
            });
          },
          onError: (error) => {
            if (error.message.includes("User rejected the request")) {
              showDestructiveToast({
                title: "Error",
                description: "Transaction was rejected",
              });
              return;
            }
            showDestructiveToast({
              title: "Error",
              description: "Swap failed!",
            });
            return;
          },
        }
      );
    } catch (error) {
      if (error instanceof Error && error.message.includes("User rejected")) {
        showDestructiveToast({
          title: "Error",
          description: "Transaction was rejected",
        });
        return;
      }
      showDestructiveToast({
        title: "Error",
        description: "Swap failed!",
      });
      return;
    }
  };

  return executeBuyOrder;
};

export const useMakeSellOrder = (
  address: `0x${string}`,
  amount: bigint,
  onSuccess?: () => unknown
) => {
  const { writeContractAsync } = useWriteContract();

  const executeSellOrder = async () => {
    try {
      await writeContractAsync(
        {
          ...bondingCurveContract,
          functionName: "makeSellOrder",
          args: [
            address as `0x${string}`,
            contracts.collateralToken.address as `0x${string}`,
            amount,
            0n,
          ],
        },
        {
          onSuccess: async () => {
            if (onSuccess) await onSuccess();
            showSuccessToast({
              title: "Success",
              description: "Swap completed successfully!",
            });
          },
          onSettled: () => {
            showSuccessToast({
              title: "Success",
              description: "Swap completed successfully!",
            });
          },
          onError: () => {
            showDestructiveToast({
              title: "Error",
              description: "Transaction was rejected",
            });
            return;
          },
        }
      );
    } catch (error) {
      if (error instanceof Error && error.message.includes("User rejected")) {
        showDestructiveToast({
          title: "Error",
          description: "Transaction was rejected",
        });
        return;
      }
      showDestructiveToast({
        title: "Error",
        description: "Swap failed!",
      });
      return;
    }
  };

  return executeSellOrder;
};

export const useIsAmountValid = (
  sellAmount: string,
  tokenBalance: string | undefined
) => {
  return useMemo(() => {
    const parsedSellAmount = parseFloat(sellAmount);
    const parsedTokenBalance = parseFloat(tokenBalance || "0");

    const decimalPlaces = sellAmount.includes(".")
      ? sellAmount.split(".")[1].length
      : 0;

    return (
      parsedSellAmount > 0 &&
      parsedSellAmount <= parsedTokenBalance &&
      decimalPlaces <= 18
    );
  }, [sellAmount, tokenBalance]);
};

export const useBondingCurvePrice = (
  amount: bigint,
  type: "buy" | "sell"
): bigint => {
  const { buyFeePercentage, sellFeePercentage } = useFeePercentages();

  const balance = useBalance({
    address: contracts.reserve.address as `0x${string}`,
    token: contracts.collateralToken.address as `0x${string}`,
  });

  const result = useReadContracts({
    contracts: [
      {
        ...tecTokenContract,
        functionName: "totalSupply",
      },
      {
        ...bondingCurveContract,
        functionName: "getCollateralToken",
        args: [contracts.collateralToken.address as `0x${string}`],
      },
    ],
  });

  const totalSupply = result.data?.[0]?.result as bigint;
  const virtualSupply = (result.data?.[1]?.result as bigint[])?.[1];
  const virtualBalance = (result.data?.[1]?.result as bigint[])?.[2];
  const reserveRatio = (result.data?.[1]?.result as bigint[])?.[3];

  const buyArgs = [
    addBigInt(totalSupply, virtualSupply),
    addBigInt(balance.data?.value, virtualBalance),
    reserveRatio,
    applyFee(amount, buyFeePercentage!),
  ];

  const sellArgs = [
    addBigInt(totalSupply, virtualSupply),
    addBigInt(balance.data?.value, virtualBalance),
    reserveRatio,
    amount || 0n,
  ];

  const expectedReturn = useReadContract({
    ...formulaContract,
    functionName:
      type === "sell" ? "calculateSaleReturn" : "calculatePurchaseReturn",
    args: type === "sell" ? sellArgs : buyArgs,
  });
  if (type === "sell") {
    const amountLessFee = applyFee(
      expectedReturn.data as bigint,
      sellFeePercentage!
    );
    return amountLessFee ? amountLessFee : 0n;
  }

  return expectedReturn.data ? (expectedReturn.data as bigint) : 0n;
};
