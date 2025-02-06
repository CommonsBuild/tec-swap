import Footer from "@/components/footer";
import Header from "@/components/header";
import Swap from "@/components/swap";
import BackgroundGradiend from "@/public/media/bg-image.png";
import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white relative overflow-hidden flex flex-col justify-between ga">
      <div className="w-full bg-transparent z-0 absolute bottom-0 left-0 select-none">
        <Image
          src={BackgroundGradiend}
          alt="TEC background gradient"
          draggable={false}
        />
      </div>
      <Header />
      <div className="max-w-2xl w-full mx-auto min-h-[80vh] h-full pt-24 px-4 gap-8 flex flex-col">
        <p className="text-center text-2xl font-bold font-bay">
          TEC Swap is a new interface to interact with the TEC Augmented Bonding
          Curve (ABC), allowing you to seamlessly mint or burn TEC using rETH
        </p>
        <p className="text-center text-lg font-bay">
          A percentage of each transaction (tribute) flows into the TEC Common
          Pool, supporting the community and its mission as a sustainable
          funding stream.
        </p>
        <Swap />
      </div>
      <Footer />
    </main>
  );
}
