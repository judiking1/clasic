import HeroSection from "@/components/home/HeroSection";
import MarqueeSection from "@/components/home/MarqueeSection";
import CompanyIntro from "@/components/home/CompanyIntro";
import ServicesSection from "@/components/home/ServicesSection";
import FeaturedPortfolio from "@/components/home/FeaturedPortfolio";
import ProcessSection from "@/components/home/ProcessSection";
import StatsCounter from "@/components/home/StatsCounter";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import CTASection from "@/components/home/CTASection";
import { getFeaturedPortfolios } from "@/actions/portfolio";

export default async function HomePage() {
  const featuredPortfolios = await getFeaturedPortfolios();

  return (
    <main>
      <HeroSection />
      <MarqueeSection />
      <CompanyIntro />
      <ServicesSection />
      <FeaturedPortfolio portfolios={featuredPortfolios} />
      <ProcessSection />
      <StatsCounter />
      <TestimonialsSection />
      <CTASection />
    </main>
  );
}
