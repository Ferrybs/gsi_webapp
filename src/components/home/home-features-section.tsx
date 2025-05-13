"use client";
import { Trophy, Zap } from "lucide-react";
import { useTranslation } from "react-i18next";
import HomeFeatureItem from "./home-feature-item";
import { Ak47 } from "../icons/ak47-icon";

function HomeFeaturesSection() {
  const { t } = useTranslation();
  return (
    <section className="container mx-auto px-4 py-16">
      <div className="grid md:grid-cols-3 gap-8">
        <HomeFeatureItem
          icon={<Zap className="text-primary h-8 w-8" />}
          title={t("features.interact_live")}
          desc={t("features.interact_streamer")}
        />
        <HomeFeatureItem
          icon={<Trophy className="text-primary h-8 w-8" />}
          title={t("features.challenges")}
          desc={t("features.challenges_live")}
        />
        <HomeFeatureItem
          icon={<Ak47 className="text-primary h-8 w-8 p-0 m-0" />}
          title={t("features.exchange_points")}
          desc={t("features.points_for_skins")}
        />
      </div>
    </section>
  );
}

export default HomeFeaturesSection;
