import { delay, HttpResponse, http } from "msw";
import type { Shipment } from "../../entities/shipment/model/types";
import { shipments } from "./data";

const pageSize = 12;

function shouldFailRandomly() {
  return Math.random() < 0.5;
}

export const handlers = [
  http.get("/api/shipments", async ({ request }) => {
    await delay(250);

    const url = new URL(request.url);
    const page = Number(url.searchParams.get("page") ?? "1");
    const search = url.searchParams.get("search")?.toLowerCase() ?? "";
    const status = url.searchParams.get("status") ?? "all";
    const priority = url.searchParams.get("priority") ?? "all";
    const delayedOnly = url.searchParams.get("delayedOnly") === "true";
    const sortField = url.searchParams.get("sortField") ?? "eta";
    const sortDirection = url.searchParams.get("sortDirection") ?? "asc";

    const filtered = shipments.filter((shipment) => {
      const matchesSearch =
        shipment.reference.toLowerCase().includes(search) ||
        shipment.customer.toLowerCase().includes(search) ||
        shipment.destination.toLowerCase().includes(search);
      const matchesStatus = status === "all" || shipment.status === status;
      const matchesPriority =
        priority === "all" || shipment.priority === priority;
      const matchesDelay =
        !delayedOnly ||
        (shipment.status !== "delivered" &&
          new Date(shipment.eta).getTime() < Date.now());

      return matchesSearch && matchesStatus && matchesPriority && matchesDelay;
    });

    filtered.sort((left, right) => {
      const leftValue =
        sortField === "value" ? left.value : new Date(left.eta).getTime();
      const rightValue =
        sortField === "value" ? right.value : new Date(right.eta).getTime();

      return sortDirection === "desc"
        ? rightValue - leftValue
        : leftValue - rightValue;
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

  http.get("/api/shipments/:id", async ({ params }) => {
    await delay(200);

    if (shouldFailRandomly()) {
      return HttpResponse.json(
        { message: "Backend failed while loading shipment" },
        { status: 500 },
      );
    }

    const shipment = shipments.find((item) => item.id === params.id);
    if (!shipment) {
      return HttpResponse.json(
        { message: "Shipment not found" },
        { status: 404 },
      );
    }

    return HttpResponse.json(shipment);
  }),

  http.post("/api/shipments", async ({ request }) => {
    await delay(300);

    const body = (await request.json()) as Partial<Shipment>;

    if (!body.customer?.trim()) {
      return HttpResponse.json(
        { message: "Customer is required" },
        { status: 400 },
      );
    }

    if (body.customer.toLowerCase().includes("fail")) {
      return HttpResponse.json(
        { message: "Backend failed while creating customer" },
        { status: 500 },
      );
    }

    const duplicate = shipments.some(
      (shipment) =>
        shipment.reference.toLowerCase() ===
        body.reference?.trim().toLowerCase(),
    );

    if (duplicate) {
      return HttpResponse.json(
        { message: "Shipment with this reference already exists" },
        { status: 409 },
      );
    }

    const shipment: Shipment = {
      id: crypto.randomUUID(),
      reference: body.reference?.trim() || `SHP-${Date.now()}`,
      customer: body.customer.trim(),
      origin: body.origin?.trim() || "Chicago, IL",
      destination: body.destination?.trim() || "Unassigned",
      carrier: body.carrier?.trim() || "Unassigned",
      status: body.status ?? "draft",
      priority: body.priority ?? "normal",
      eta: body.eta ?? new Date().toISOString(),
      createdAt: new Date().toISOString(),
      value: Number(body.value ?? 0),
      owner: body.owner ?? "Ops Desk",
      notes: body.notes ?? "",
      lines: body.lines ?? [],
      checkpoints: body.checkpoints ?? [],
    };

    shipments.unshift(shipment);
    return HttpResponse.json(shipment, { status: 201 });
  }),

  http.patch("/api/shipments/:id", async ({ params, request }) => {
    await delay(350);

    const index = shipments.findIndex((shipment) => shipment.id === params.id);
    if (index === -1) {
      return HttpResponse.json(
        { message: "Shipment not found" },
        { status: 404 },
      );
    }

    const body = (await request.json()) as Record<string, unknown>;

    if (shouldFailRandomly()) {
      return HttpResponse.json(
        { message: "Backend failed while saving shipment" },
        { status: 500 },
      );
    }

    if (
      String(body.reference ?? "")
        .toLowerCase()
        .includes("fail")
    ) {
      return HttpResponse.json(
        { message: "Backend rejected this reference" },
        { status: 500 },
      );
    }

    shipments[index] = {
      ...shipments[index],
      ...body,
      id: shipments[index].id,
    };

    return HttpResponse.json(shipments[index]);
  }),
];
