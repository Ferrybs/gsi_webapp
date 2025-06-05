import { z } from "zod";

export const decimalToNumber = z.preprocess((val) => {
  if (
    val != null &&
    typeof val === "object" &&
    val !== null &&
    "toNumber" in val &&
    typeof (val as { toNumber: unknown }).toNumber === "function"
  ) {
    return (val as { toNumber: () => number }).toNumber();
  }
  if (typeof val === "string" && !isNaN(Number(val))) {
    return Number(val);
  }
  return val;
}, z.number());

export const stringToDate = z.preprocess(
  (arg) =>
    typeof arg === "string" ? new Date(arg) : arg instanceof Date ? arg : arg,
  z.date(),
);
