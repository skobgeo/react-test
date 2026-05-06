import { z } from "zod";

export const createClientSchema = z.object({
  name: z.string(),
  company: z.string(),
  revenue: z.number(),
});

export type CreateClientFormValues = z.infer<typeof createClientSchema>;
