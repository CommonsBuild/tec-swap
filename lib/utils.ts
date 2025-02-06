import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { formatUnits } from "viem";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function addBigInt(a: bigint | undefined, b: bigint | undefined) {
  if (a === undefined) {
    return b;
  }
  if (b === undefined) {
    return a;
  }
  return a + b;
}

export function formatFeePercentage(
  feePercentage: bigint | undefined,
  decimals: number
): string {
  if (!feePercentage) return "0%";
  const formattedPercentage = formatUnits(feePercentage, decimals);
  return `${(parseFloat(formattedPercentage) * 100).toFixed(0)}%`;
}

export function formatBalance(balance: string | undefined): string {
  if (!balance) return "0";
  return parseFloat(balance).toFixed(4);
}

export function applyFee(
  amount: bigint | undefined,
  fee: bigint | undefined
): bigint | undefined {
  if (amount === undefined || fee === undefined) {
    return undefined;
  }
  return amount - (amount * fee) / 10n ** 18n;
}
