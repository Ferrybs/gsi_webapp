"use server";

import { prisma } from "@/lib/prisma";
import { PointPackageSchema } from "@/schemas/point-package.schema";

export async function getPointPackagesAction() {
  try {
    const packages = await prisma.point_packages.findMany({
      where: {
        active: true,
      },
      orderBy: {
        points_amount: "asc",
      },
    });

    return packages.map((pkg) => PointPackageSchema.parse(pkg));
  } catch (error) {
    console.error("Error fetching point packages:", error);
    return [];
  }
}
