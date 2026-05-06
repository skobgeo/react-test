import { delay, HttpResponse, http } from "msw";
import type { Client } from "../features/clients/types";
import { clients } from "./data";

const pageSize = 12;

export const handlers = [
  http.get("/api/clients", async ({ request }) => {
    await delay(250);

    const url = new URL(request.url);
    const page = Number(url.searchParams.get("page") ?? "1");
    const search = url.searchParams.get("search")?.toLowerCase() ?? "";
    const status = url.searchParams.get("status") ?? "all";

    const filtered = clients.filter((client) => {
      const matchesSearch =
        client.name.toLowerCase().includes(search) ||
        client.company.toLowerCase().includes(search);
      const matchesStatus = status === "all" || client.status === status;

      return matchesSearch && matchesStatus;
    });

    const start = (page - 1) * pageSize;
    const items = filtered.slice(start, start + pageSize);

    return HttpResponse.json({
      items,
      page,
      pageSize,
      total: filtered.length,
    });
  }),

  http.get("/api/clients/:id", async ({ params }) => {
    await delay(200);

    const client = clients.find((item) => item.id === params.id);
    if (!client) {
      return HttpResponse.json(
        { message: "Client not found" },
        { status: 404 },
      );
    }

    return HttpResponse.json(client);
  }),

  http.post("/api/clients", async ({ request }) => {
    await delay(300);

    const body = (await request.json()) as {
      name?: string;
      company?: string;
      email?: string;
      status?: string;
      revenue?: number;
      notes?: string;
    };

    if (!body.name?.trim()) {
      return HttpResponse.json(
        { message: "Name is required" },
        { status: 400 },
      );
    }

    const duplicate = clients.some(
      (client) => client.name.toLowerCase() === body.name?.trim().toLowerCase(),
    );

    if (duplicate) {
      return HttpResponse.json(
        { message: "Client with this name already exists" },
        { status: 409 },
      );
    }

    const client: Client = {
      id: crypto.randomUUID(),
      name: body.name.trim(),
      company: body.company?.trim() || "Unknown",
      email: body.email?.trim() || "unknown@example.com",
      status:
        body.status === "paused" || body.status === "archived"
          ? body.status
          : "active",
      revenue: Number(body.revenue ?? 0),
      createdAt: new Date().toISOString(),
      notes: body.notes ?? "",
    };

    clients.unshift(client);
    return HttpResponse.json(client, { status: 201 });
  }),

  http.patch("/api/clients/:id", async ({ params, request }) => {
    await delay(350);

    const index = clients.findIndex((client) => client.id === params.id);
    if (index === -1) {
      return HttpResponse.json(
        { message: "Client not found" },
        { status: 404 },
      );
    }

    const body = (await request.json()) as Record<string, unknown>;

    if (
      String(body.name ?? "")
        .toLowerCase()
        .includes("fail")
    ) {
      return HttpResponse.json(
        { message: "Backend rejected this client name" },
        { status: 500 },
      );
    }

    clients[index] = {
      ...clients[index],
      ...body,
      id: clients[index].id,
    };

    return HttpResponse.json(clients[index]);
  }),
];
