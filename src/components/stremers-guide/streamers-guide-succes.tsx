import { Card, CardContent } from "../ui/card";

function StremersGuideSuccess() {
  return (
    <section className="mb-16">
      <h2 className="text-3xl font-bold mb-8">Streamer Success Stories</h2>
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="bg-card/30 border-border/30">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="font-bold text-primary">MG</span>
              </div>
              <div>
                <h4 className="font-bold">MaxGaming</h4>
                <p className="text-sm text-foreground/70">50K+ followers</p>
              </div>
            </div>
            <p className="text-foreground/80 mb-4">
              "Since integrating CS2 Bits, my viewer retention has increased by
              40%. The interactive challenges keep my audience engaged
              throughout the entire stream."
            </p>
            <div className="flex items-center gap-2">
              <div className="text-primary font-bold">+35%</div>
              <div className="text-sm text-foreground/70">
                viewer engagement
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/30 border-border/30">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="font-bold text-primary">FS</span>
              </div>
              <div>
                <h4 className="font-bold">FragStar</h4>
                <p className="text-sm text-foreground/70">120K+ followers</p>
              </div>
            </div>
            <p className="text-foreground/80 mb-4">
              "My subscribers love the betting system. It's created a whole new
              level of excitement during matches, and I've seen a significant
              boost in my channel's revenue."
            </p>
            <div className="flex items-center gap-2">
              <div className="text-primary font-bold">+45%</div>
              <div className="text-sm text-foreground/70">
                subscription growth
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/30 border-border/30">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="font-bold text-primary">NV</span>
              </div>
              <div>
                <h4 className="font-bold">NovaPlays</h4>
                <p className="text-sm text-foreground/70">80K+ followers</p>
              </div>
            </div>
            <p className="text-foreground/80 mb-4">
              "The custom challenges have completely transformed my streams. My
              community is more active than ever, and I've attracted many new
              viewers because of the unique experience."
            </p>
            <div className="flex items-center gap-2">
              <div className="text-primary font-bold">+60%</div>
              <div className="text-sm text-foreground/70">chat activity</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

export default StremersGuideSuccess;
