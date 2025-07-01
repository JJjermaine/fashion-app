import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import HowItWorks from '@/components/HowItWorks';
import Showcase from '@/components/Showcase';
import CTA from '@/components/CTA';
import Footer from '@/components/Footer';

export default function HomePage() {
  return (
    <main className="bg-black text-white overflow-x-hidden">
      <Header />
      <Hero />
      <Features />
      <HowItWorks />
      <Showcase />
      <CTA />
      <Footer />
    </main>
  );
}