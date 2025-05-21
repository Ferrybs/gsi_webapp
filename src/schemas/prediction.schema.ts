import { z } from "zod";
import {
  bet_state,
  option_label,
  prediction_kind,
  template_status,
} from "@prisma/client";
import { decimalToNumber } from "./helper.schema";

// Base schemas for database entities
export const PredictionOptionSchema = z.object({
  label: z.nativeEnum(option_label),
  template_id: z.number(),
  created_at: z.preprocess(
    (arg) => (typeof arg === "string" ? new Date(arg) : arg),
    z.date(),
  ),
});

export const UserPredictionSchema = z.object({
  id: z.string(),
  user_id: z.string(),
  prediction_id: z.string(),
  option_label: z.nativeEnum(option_label),
  amount: decimalToNumber,
  created_at: z.preprocess(
    (arg) => (typeof arg === "string" ? new Date(arg) : arg),
    z.date(),
  ),
});

export const PredictionTemplateSchema = z.object({
  id: z.number(),
  affiliate_fee_pct: decimalToNumber,
  total_fee_pct: decimalToNumber,
  min_bet_amount: decimalToNumber,
  kind: z.nativeEnum(prediction_kind),
  template_status: z.nativeEnum(template_status).default("Active"),
  threshold_round: z.number(),
  created_at: z.preprocess(
    (arg) => (typeof arg === "string" ? new Date(arg) : arg),
    z.date(),
  ),
  updated_at: z.preprocess(
    (arg) => (typeof arg === "string" ? new Date(arg) : arg),
    z.date(),
  ),
  prediction_options: z.array(PredictionOptionSchema).optional(),
});

export const PredictionSchema = z.object({
  id: z.string(),
  template_id: z.number(),
  stream_match_id: z.string(),
  fees_total_collected: decimalToNumber.nullable(),
  affiliate_fees_collected: decimalToNumber.nullable(),
  site_fees_collected: decimalToNumber.nullable(),
  winning_option_label: z.string().nullable(),
  state: z.nativeEnum(bet_state).default("Open"),
  created_at: z.preprocess(
    (arg) => (typeof arg === "string" ? new Date(arg) : arg),
    z.date(),
  ),
  updated_at: z.preprocess(
    (arg) => (typeof arg === "string" ? new Date(arg) : arg),
    z.date(),
  ),
  user_predictions: z.array(UserPredictionSchema).optional(),
  prediction_templates: PredictionTemplateSchema,
});

// Enhanced schemas with calculated fields
export const EnhancedPredictionOptionSchema = PredictionOptionSchema.extend({
  betCount: z.number(),
  amount: z.number(),
  percentage: z.number(),
  odds: z.number(),
  userAmount: z.number(),
});

export const EnhancedPredictionSchema = PredictionSchema.extend({
  totalBets: z.number(),
  totalAmount: z.number(),
  options: z.array(EnhancedPredictionOptionSchema),
  userTotalBets: z.number(),
  user_bets: z.array(UserPredictionSchema).optional(),
});

export const PredictionDetailSchema = z.object({
  totalBets: z.number(),
  totalAmount: z.number(),
  options: z.array(EnhancedPredictionOptionSchema),
  userTotalBets: z.number(),
  user_bets: z.array(UserPredictionSchema).optional(),
});

// Response schemas for server actions
export const PlaceBetResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
});

// Type exports
export type Prediction = z.infer<typeof PredictionSchema>;
export type PredictionOption = z.infer<typeof PredictionOptionSchema>;
export type UserPrediction = z.infer<typeof UserPredictionSchema>;
export type PredictionTemplate = z.infer<typeof PredictionTemplateSchema>;
export type EnhancedPrediction = z.infer<typeof EnhancedPredictionSchema>;
export type EnhancedPredictionOption = z.infer<
  typeof EnhancedPredictionOptionSchema
>;

export type PredictionDetail = z.infer<typeof PredictionDetailSchema>;
export type PlaceBetResponse = z.infer<typeof PlaceBetResponseSchema>;

export type OptionLabel = option_label;
