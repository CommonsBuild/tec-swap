import FooterLogo from "@/public/media/logotype-white.png";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="flex items-end justify-start gap-4 container mx-auto py-10">
      <div className="mb-2">
        <Image src={FooterLogo} alt="TEC Logo" />
      </div>
      <p className="text-lg max-w-xl text-[#9CA3AF]">
        Sustainable & Ethical Design for Token Ecosystems.
      </p>
    </footer>
  );
}
