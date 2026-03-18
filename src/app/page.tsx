import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/home/HeroSection";
import MarqueeSection from "@/components/home/MarqueeSection";
import CompanyIntro from "@/components/home/CompanyIntro";
import FeaturedPortfolio from "@/components/home/FeaturedPortfolio";
import StatsCounter from "@/components/home/StatsCounter";
import CTASection from "@/components/home/CTASection";
import { getFeaturedPortfolios } from "@/actions/portfolio";

export default async function HomePage() {
  const featuredPortfolios = await getFeaturedPortfolios();

  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <MarqueeSection />
        <CompanyIntro />
        <FeaturedPortfolio portfolios={featuredPortfolios} />
        <StatsCounter />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
