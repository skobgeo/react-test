import type {
  Checkpoint,
  Shipment,
  ShipmentLine,
  ShipmentPriority,
  ShipmentStatus,
} from "../../entities/shipment/model/types";

const statuses: ShipmentStatus[] = [
  "draft",
  "scheduled",
  "in_transit",
  "blocked",
  "delivered",
];

const priorities: ShipmentPriority[] = ["low", "normal", "high", "critical"];

const customers = [
  "Northstar Retail",
  "Beacon Medical",
  "Copperline Foods",
  "Summit Parts",
  "Orbit Home",
  "Apex Industrial",
  "Riverbank Studio",
  "Signal Works",
];

const cities = [
  "Chicago, IL",
  "Denver, CO",
  "Phoenix, AZ",
  "Seattle, WA",
  "Atlanta, GA",
  "Boston, MA",
  "Dallas, TX",
  "Portland, OR",
];

const carriers = [
  "Roadline",
  "BluePeak Freight",
  "Metro Haul",
  "ColdChain Express",
];

function makeLines(index: number): ShipmentLine[] {
  return Array.from({ length: (index % 4) + 1 }, (_, lineIndex) => ({
    id: `${index}-${lineIndex}`,
    sku: `SKU-${1000 + index * 7 + lineIndex}`,
    name: ["Valve kit", "Display stand", "Insulated crate", "Sensor pack"][
      lineIndex % 4
    ],
    quantity: 3 + ((index + lineIndex) % 9),
    weightKg: 8 + lineIndex * 4 + (index % 5),
    temperature:
      lineIndex % 3 === 0
        ? "ambient"
        : lineIndex % 3 === 1
          ? "chilled"
          : "frozen",
  }));
}

function makeCheckpoints(index: number): Checkpoint[] {
  return Array.from({ length: 3 }, (_, checkpointIndex) => ({
    id: `${index}-cp-${checkpointIndex}`,
    city: cities[(index + checkpointIndex) % cities.length],
    plannedAt: new Date(
      2026,
      index % 12,
      ((index + checkpointIndex) % 25) + 1,
    ).toISOString(),
    completed: checkpointIndex < index % 3,
  }));
}

export const shipments: Shipment[] = Array.from({ length: 84 }, (_, index) => {
  const number = index + 1;
  const lines = makeLines(number);
  const origin = cities[index % cities.length];
  const destination = cities[(index + 3) % cities.length];

  return {
    id: String(number),
    reference: `SHP-${String(7300 + number).padStart(5, "0")}`,
    customer: customers[index % customers.length],
    origin,
    destination,
    carrier: carriers[index % carriers.length],
    status: statuses[index % statuses.length],
    priority: priorities[index % priorities.length],
    eta: new Date(2026, index % 12, (index % 26) + 2).toISOString(),
    createdAt: new Date(2026, index % 12, (index % 26) + 1).toISOString(),
    value: 12000 + index * 1370,
    owner: ["Marta", "Ilya", "Nora", "Chen"][index % 4],
    notes:
      index % 6 === 0
        ? "Customer requires dock appointment confirmation before dispatch."
        : "Standard routing with daily exception monitoring.",
    lines,
    checkpoints: makeCheckpoints(number),
  };
});
