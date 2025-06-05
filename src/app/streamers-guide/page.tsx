import StreamersGuideHeader from "@/components/stremers-guide/layout/streamers-guide-header";
import StremersGuideHero from "@/components/stremers-guide/streamers-guide-hero";
import StreamerGuideHowItWorks from "@/components/stremers-guide/stremers-guide-how-it-works";
import StremersGuideBenefits from "@/components/stremers-guide/stremers-guide-benefits";
import StreamersGuideCTA from "@/components/stremers-guide/streamers-guide-cta";

export default function StreamerGuidePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <StreamersGuideHeader />

      {/* Main Content */}
      <main className="container mx-auto py-12 px-4">
        {/* Hero Section */}
        <StremersGuideHero />
        {/* Benefits Section */}
        <StremersGuideBenefits />
        {/* How It Works Section */}
        <StreamerGuideHowItWorks />
        {/* CTA Section */}
        <StreamersGuideCTA />
      </main>
    </div>
  );
}
