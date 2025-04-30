"use client";
import Image from "next/image";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Card, CardContent } from "../ui/card";
import { useTranslation } from "react-i18next";

function HomeHeroSection() {
  const { t } = useTranslation();
  return (
    <section className="container mx-auto px-4 py-12 md:py-20">
      <div className="grid md:grid-cols-2 gap-8 items-center">
        <div className="space-y-6">
          <h1 className="text-5xl md:text-7xl font-bold leading-tight">
            <span className="block">{t("hero.challenge")}</span>
            <span className="block">{t("hero.predict")}</span>
            <span className="block">{t("hero.engage")}</span>
          </h1>
          <p className="text-xl text-foreground/80">
            {t("hero.engage_streamer")}
          </p>
          <Button className="bg-primary hover:bg-primary/90 text-foreground text-lg px-8 py-6">
            {t("hero.live_cs2")}
          </Button>
        </div>

        <div className="relative">
          <div className="relative rounded-xl overflow-hidden border border-border/30">
            <Image
              src="https://placehold.co/600x400?text=Stream"
              alt="CS2 Gameplay"
              width={600}
              height={400}
              className="w-full object-cover"
              unoptimized
            />

            {/* Live Overlay */}
            <div className="absolute top-4 left-4 flex items-center gap-2">
              <Badge className="bg-primary text-foreground text-sm ">
                {t("hero.live")}
              </Badge>
              <span className="bg-card/50 px-2 py-1 rounded text-sm">0:23</span>
            </div>

            {/* Game Info */}
            <div className="absolute top-4 left-4 mt-12">
              <div className="bg-card/50 px-3 py-2 rounded">
                <div className="text-sm">DUST2</div>
                <div className="font-bold">K/D 0.8</div>
              </div>
            </div>

            {/* Challenge Card */}
            <div className="absolute top-4 right-4 w-56">
              <Card className="bg-card/80 border-0">
                <CardContent className="px-4">
                  <div className="flex items-center gap-4 mb-2">
                    <div className="bg-primary w-5 h-5 rotate-45"></div>
                    <span className="font-medium">Desafio</span>
                  </div>
                  <p className="text-lg font-bold mb-4">
                    Matar + de 30.5 nessa partida
                  </p>
                  <Button className="w-full bg-primary hover:bg-primary/90">
                    Enviar
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Betting Card */}
            <div className="absolute bottom-4 right-4 w-56">
              <Card className="bg-card/80 border-0">
                <CardContent className="px-4">
                  <div className="flex items-center gap-4 mb-2">
                    <div className="bg-primary w-5 h-5 rotate-45"></div>
                    <span className="font-medium">Quem vai vencer?</span>
                  </div>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between">
                      <span>Streamer</span>
                      <span>3,25</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Adversarios</span>
                      <span>1,40</span>
                    </div>
                  </div>
                  <Button className="w-full bg-primary hover:bg-primary/90">
                    Apostar
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HomeHeroSection;
