import { stream_provider } from "@prisma/client";
import { z } from "zod";

export const contactFormSchema = z.object({
  name: z.string().min(2).max(50),
  platform: z.nativeEnum(stream_provider),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;
