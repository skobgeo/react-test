import { z } from "zod";

export const rawClientSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  company: z.string().min(1),
  status: z.enum(["active", "paused", "archived"]),
  revenue: z.number().nonnegative(),
});

export type RawClient = z.infer<typeof rawClientSchema>;

export type CompanyClientStats = {
  company: string;
  activeClients: number;
  totalRevenue: number;
  averageRevenue: number;
  clientNames: string[];
};

export function buildCompanyClientStats(
  rawClients: unknown[],
): CompanyClientStats[] {
  const clients = rawClients.map((client) => rawClientSchema.parse(client));

  return clients.map((client) => ({
    company: client.company,
    activeClients: client.status === "active" ? 1 : 0,
    totalRevenue: client.revenue,
    averageRevenue: client.revenue,
    clientNames: [client.name],
  }));
}
