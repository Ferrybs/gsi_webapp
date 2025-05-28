import HomeHeroSection from "@/components/home/home-hero-section";
import HomeFeaturesSection from "@/components/home/home-features-section";
import HomeCTA from "@/components/home/home-cta";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const session = await getServerSession();

  if (session) {
    redirect("/matches");
  }

  return (
    <>
      {/* Hero Section AJustar imagem streamer*/}
      <HomeHeroSection />

      {/* Features Section */}
      <HomeFeaturesSection />

      {/* CTA Section */}
      <HomeCTA />
    </>
  );
}
