import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { http } from "viem";
import { optimism } from "viem/chains";

export const wagmiConfig = getDefaultConfig({
  appName: "My RainbowKit App",
  projectId: "YOUR_PROJECT_ID",
  chains: [optimism],
  transports: {
    [optimism.id]: http(
      "https://opt-mainnet.g.alchemy.com/v2/vKg3NG08KyFTBe-wbo99dGLB2qrZSy09"
    ),
  },
  ssr: true,
});
