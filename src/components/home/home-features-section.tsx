"use client";
import { Target, Trophy, Zap } from "lucide-react";
import { useTranslation } from "react-i18next";

function HomeFeaturesSection() {
  const { t } = useTranslation();
  return (
    <section className="container mx-auto px-4 py-16">
      <div className="grid md:grid-cols-3 gap-8">
        <div className="bg-card/30 p-6 rounded-xl border border-border/30 flex items-start gap-4">
          <div className="bg-primary/20 p-3 rounded-lg">
            <Zap className="text-primary h-6 w-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold mb-2">
              {t("features.interact_live")}
            </h3>
            <p className="text-foreground/70">
              {t("features.interact_streamer")}
            </p>
          </div>
        </div>

        <div className="bg-card/30 p-6 rounded-xl border border-border/30 flex items-start gap-4">
          <div className="bg-primary/20 p-3 rounded-lg">
            <Trophy className="text-primary h-6 w-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold mb-2">
              {t("features.challenges")}
            </h3>
            <p className="text-foreground/70">
              {t("features.challenges_live")}
            </p>
          </div>
        </div>

        <div className="bg-card/30 p-6 rounded-xl border border-border/30 flex items-start gap-4">
          <div className="bg-primary/20 p-3 rounded-lg">
            <Target className="text-primary h-6 w-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold mb-2">
              {t("features.custom_challenges")}
            </h3>
            <p className="text-foreground/70">
              {t("features.unique_challenges")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HomeFeaturesSection;
