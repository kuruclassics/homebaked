import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import Services from "@/components/Services";
import Showcase from "@/components/Showcase";
import WhyHomeBaked from "@/components/WhyHomeBaked";
import Testimonials from "@/components/Testimonials";
import Pricing from "@/components/Pricing";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <main className="relative">
      <Navbar />
      <Hero />
      <HowItWorks />
      <Services />
      <Showcase />
      <WhyHomeBaked />
      <Testimonials />
      <Pricing />
      <FinalCTA />
      <Footer />
    </main>
  );
}
