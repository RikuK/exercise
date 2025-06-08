import { z } from "zod";

/**
 * Hedgehog interface shared between server and client
 */
export const baseHedgehogSchema = z.object({
  id: z.number(),
  name: z.string().min(1, "Name is required"),
});

export const hedgehogSchema = baseHedgehogSchema.extend({
  age: z.number().int().nonnegative("Age must be 0 or greater"),
  sex: z.enum(["male", "female", "unknown"]),
  coordinates: z.tuple([
    z.number(),
    z.number()
  ]),
});

export const newHedgehogSchema = hedgehogSchema.omit({ id: true });

export type Hedgehog = z.infer<typeof hedgehogSchema>;
export type HedgehogListItem = Pick<Hedgehog, 'id' | 'name'>;
export type NewHedgehog = z.infer<typeof newHedgehogSchema>;
