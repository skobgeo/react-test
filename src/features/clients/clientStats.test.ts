import { describe, expect, it } from "vitest";
import { buildCompanyClientStats } from "./clientStats";

describe("buildCompanyClientStats", () => {
  it("groups clients by normalized company name and aggregates revenue", () => {
    expect(
      buildCompanyClientStats([
        {
          id: "1",
          name: " Alice ",
          company: "Acme",
          status: "active",
          revenue: 100,
        },
        {
          id: "2",
          name: "Bob",
          company: " acme ",
          status: "paused",
          revenue: 50,
        },
        {
          id: "3",
          name: "Cara",
          company: "Beacon",
          status: "active",
          revenue: 300,
        },
      ]),
    ).toEqual([
      {
        company: "Beacon",
        activeClients: 1,
        totalRevenue: 300,
        averageRevenue: 300,
        clientNames: ["Cara"],
      },
      {
        company: "Acme",
        activeClients: 1,
        totalRevenue: 150,
        averageRevenue: 75,
        clientNames: ["Alice", "Bob"],
      },
    ]);
  });

  it("rejects invalid records with zod validation", () => {
    expect(() =>
      buildCompanyClientStats([
        {
          id: "",
          name: "",
          company: "Acme",
          status: "active",
          revenue: -10,
        },
      ]),
    ).toThrow();
  });
});
