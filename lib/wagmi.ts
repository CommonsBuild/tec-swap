import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { http } from "viem";
import { optimism } from "viem/chains";

export const wagmiConfig = getDefaultConfig({
  appName: "TEC Swap",
  projectId: process.env.NEXT_PUBLIC_REOWN_PROJECT_ID!,
  chains: [optimism],
  transports: {
    [optimism.id]: http(
      "https://opt-mainnet.g.alchemy.com/v2/vKg3NG08KyFTBe-wbo99dGLB2qrZSy09"
    ),
  },
  ssr: true,
});
