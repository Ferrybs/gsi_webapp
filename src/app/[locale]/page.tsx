import HomeHeader from "@/components/home/layout/home-header";
import HomeHeroSection from "@/components/home/home-hero-section";
import HomeFeaturesSection from "@/components/home/home-features-section";
import HomeCTA from "@/components/home/home-cta";
import HomeFooter from "@/components/home/layout/home-footer";

export default function HomePage() {
  return (
    <>
      {/* Navbar */}
      <HomeHeader />

      {/* Hero Section AJustar imagem streamer*/}
      <HomeHeroSection />

      {/* Features Section */}
      <HomeFeaturesSection />

      {/* CTA Section */}
      <HomeCTA />

      {/* Footer */}
      <HomeFooter />
    </>
  );
}
