import { z } from "zod";

export const decimalToNumber = z.preprocess((val) => {
  if (val != null && typeof (val as any).toNumber === "function") {
    return (val as any).toNumber();
  }
  if (typeof val === "string" && !isNaN(Number(val))) {
    return Number(val);
  }
  return val;
}, z.number());

export const stringToDate = z.preprocess(
  (arg) =>
    typeof arg === "string"
      ? new Date(arg)
      : typeof arg === "undefined"
        ? null
        : arg,
  z.date(),
);
