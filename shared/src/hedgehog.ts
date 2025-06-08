import { z } from "zod";

/**
 * Hedgehog interface shared between server and client
 */
export const baseHedgehogSchema = z.object({
  id: z.number(),
  name: z.string().min(1, "Name is required").max(32).regex(/^[A-Za-zÀ-ž ]+$/, {
    message: 'Only letters and spaces allowed',
  }),
});

export const hedgehogSchema = baseHedgehogSchema.extend({
  age: z.number().int().min(0).max(99),
  sex: z.enum(["male", "female", "unknown"]),
  coordinates: z.tuple([
    z.number().min(-180).max(180), // longitude
    z.number().min(-90).max(90),   // latitude
  ]),
});

export const newHedgehogSchema = hedgehogSchema.omit({ id: true });

export type Hedgehog = z.infer<typeof hedgehogSchema>;
export type HedgehogListItem = Pick<Hedgehog, 'id' | 'name'>;
export type NewHedgehog = z.infer<typeof newHedgehogSchema>;
