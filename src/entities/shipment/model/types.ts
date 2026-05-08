export type ShipmentStatus =
  | "draft"
  | "scheduled"
  | "in_transit"
  | "blocked"
  | "delivered";

export type ShipmentPriority = "low" | "normal" | "high" | "critical";

export type ShipmentLine = {
  id: string;
  sku: string;
  name: string;
  quantity: number;
  weightKg: number;
  temperature: "ambient" | "chilled" | "frozen";
};

export type Checkpoint = {
  id: string;
  city: string;
  plannedAt: string;
  completed: boolean;
};

export type Shipment = {
  id: string;
  reference: string;
  customer: string;
  origin: string;
  destination: string;
  carrier: string;
  status: ShipmentStatus;
  priority: ShipmentPriority;
  eta: string;
  createdAt: string;
  value: number;
  owner: string;
  notes: string;
  lines: ShipmentLine[];
  checkpoints: Checkpoint[];
};

export type ShipmentFilters = {
  search: string;
  status: "all" | ShipmentStatus;
  priority: "all" | ShipmentPriority;
  delayedOnly: boolean;
};

export type ShipmentSort = {
  field: "eta" | "value" | "priority";
  direction: "asc" | "desc";
};

export type ShipmentListResponse = {
  items: Shipment[];
  page: number;
  pageSize: number;
  total: number;
};
