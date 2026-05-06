import type { Client, ClientStatus } from "../features/clients/types";

const statuses: ClientStatus[] = ["active", "paused", "archived"];
const companies = [
  "Northstar Labs",
  "Riverbank Studio",
  "Apex Retail",
  "Beacon Health",
  "Copperline Foods",
  "Orbit Logistics",
  "Signal Works",
  "Summit Finance",
];

export const clients: Client[] = Array.from({ length: 72 }, (_, index) => {
  const number = index + 1;
  return {
    id: String(number),
    name: `Client ${number}`,
    company: companies[index % companies.length],
    email: `client${number}@example.com`,
    status: statuses[index % statuses.length],
    revenue: 3000 + index * 470,
    createdAt: new Date(2025, index % 12, (index % 27) + 1).toISOString(),
    notes:
      index % 5 === 0
        ? "Requires manual approval for contract changes."
        : "Regular account with quarterly check-ins.",
  };
});
