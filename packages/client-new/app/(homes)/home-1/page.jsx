import Footer1 from "@/components/footer/Footer1";
import Header1 from "@/components/headers/Header1";
import Categories from "@/components/homes/common/Categories";
import Collections from "@/components/homes/common/Collections"; 
import Hotbids from "@/components/homes/home-1/Hotbids";
import Process from "@/components/homes/common/Process";

import dynamic from 'next/dynamic'

const Hero = dynamic(() => import('@/components/homes/home-1/Hero'), { ssr: false })


export const metadata = {
  title: "SilverSurfer | Ride the Silver Wave",
};
export default function HomePage1() {
  return (
    <>
      <Header1 />
      <main>
        <Hero />
      </main>
    </>
  );
}
