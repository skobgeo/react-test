import { z } from "zod";

export const editClientSchema = z.object({
  name: z.string(),
  company: z.string(),
  email: z.string(),
  status: z.enum(["active", "paused", "archived"]),
  revenue: z.number(),
  notes: z.string(),
});

export type EditClientFormValues = z.infer<typeof editClientSchema>;
