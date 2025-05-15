"use client";

import type { PointPackage } from "@/schemas/point-package.schema";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatPrice } from "@/lib/utils";
import { useTranslation } from "react-i18next";

interface PackageSelectorProps {
  packages: PointPackage[];
  selectedPackage: PointPackage | null;
  onSelect: (pkg: PointPackage) => void;
}

export function PackageSelector({
  packages,
  selectedPackage,
  onSelect,
}: PackageSelectorProps) {
  const { t } = useTranslation();

  if (packages.length === 0) {
    return (
      <div className="text-center py-4">{t("purchase.loading_packages")}</div>
    );
  }

  const calculateBonusPercentage = (pkg: PointPackage) => {
    if (pkg.bonus_points === 0) return 0;
    return Math.round((pkg.bonus_points / pkg.points_amount) * 100);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">{t("purchase.select_package")}</h3>
      <RadioGroup
        value={selectedPackage?.id.toString()}
        onValueChange={(value) => {
          const pkg = packages.find((p) => p.id.toString() === value);
          if (pkg) onSelect(pkg);
        }}
        className="grid grid-cols-2 gap-4 max-h-[400px] overflow-y-auto pr-1"
      >
        {packages.map((pkg) => {
          const bonusPercentage = calculateBonusPercentage(pkg);
          return (
            <div key={pkg.id} className="relative">
              <RadioGroupItem
                value={pkg.id.toString()}
                id={`package-${pkg.id}`}
                className="sr-only"
              />
              <Label
                htmlFor={`package-${pkg.id}`}
                className="cursor-pointer block"
              >
                <Card
                  className={`h-full transition-all ${
                    selectedPackage?.id === pkg.id
                      ? "border-primary bg-primary/5"
                      : ""
                  }`}
                >
                  <CardContent className="p-4 flex flex-col h-full">
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-bold text-lg">
                        {formatCurrency(pkg.points_amount)}
                      </span>
                      {bonusPercentage > 0 && (
                        <Badge className="bg-green-500">
                          +{bonusPercentage}%
                        </Badge>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground mb-2">
                      {pkg.points_amount} {t("purchase.points")}
                    </div>
                    <div className="mt-auto font-semibold">
                      {formatPrice(pkg.price, pkg.currency)}
                    </div>
                    {pkg.bonus_points > 0 && (
                      <div className="text-xs text-green-500 mt-1">
                        +{formatCurrency(pkg.bonus_points)}{" "}
                        {t("purchase.bonus")}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </Label>
            </div>
          );
        })}
      </RadioGroup>
    </div>
  );
}
