import { SiteHeader } from "@/components/SiteHeader";
import { Hero } from "@/components/Hero";
import { TryOn } from "@/components/TryOn";
import { HowItWorks } from "@/components/HowItWorks";
import { FAQ } from "@/components/FAQ";
import { SiteFooter } from "@/components/SiteFooter";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <Hero />
        <TryOn />
        <HowItWorks />
        <FAQ />
      </main>
      <SiteFooter />
    </>
  );
}
