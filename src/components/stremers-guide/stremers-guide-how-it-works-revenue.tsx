"use client";
import { FaCoins } from "react-icons/fa";
import { IoIosLink } from "react-icons/io";
import { useTranslation } from "react-i18next";

export default function StreamerGuideHowItWorksRevenue() {
  const { t } = useTranslation();

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div>
        <h3 className="text-2xl font-bold mb-4">
          {t("howItWorks.revenue.modelTitle")}
        </h3>
        <ol className="space-y-6">
          <li className="flex gap-4">
            <FaCoins className="text-primary mt-1 h-6 w-6" />
            <div>
              <p className="text-foreground/70">
                {t("howItWorks.revenue.point1")}
              </p>
            </div>
          </li>
          <li className="flex gap-4">
            <FaCoins className="text-primary mt-1 h-6 w-6" />
            <div>
              <p className="text-foreground/70">
                {t("howItWorks.revenue.point2")}
              </p>
            </div>
          </li>
        </ol>
      </div>

      <div className="bg-card/30 rounded-xl p-6 border border-border/30">
        <h3 className="text-xl font-bold mb-4">
          {t("howItWorks.revenue.integrationTitle")}
        </h3>
        <ul className="space-y-3">
          <li className="flex items-start gap-2">
            <IoIosLink className="h-6 w-6 text-primary shrink-0" />
            <div>
              <p className="text-ms text-foreground/70">
                {t("howItWorks.revenue.integrationPoint1")}
              </p>
            </div>
          </li>
          <li className="flex items-start gap-2">
            <IoIosLink className="h-6 w-6 text-primary shrink-0" />
            <div>
              <p className="text-ms text-foreground/70">
                {t("howItWorks.revenue.integrationPoint2")}
              </p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
}
