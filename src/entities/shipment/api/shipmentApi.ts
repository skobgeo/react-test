import { http } from "../../../shared/api/http";
import type {
  Shipment,
  ShipmentFilters,
  ShipmentListResponse,
  ShipmentSort,
} from "../model/types";

export async function getShipments(
  page: number,
  filters: ShipmentFilters,
  sort: ShipmentSort,
): Promise<ShipmentListResponse> {
  const response = await http.get<ShipmentListResponse>("/shipments", {
    params: {
      page,
      search: filters.search,
      status: filters.status,
      priority: filters.priority,
      delayedOnly: filters.delayedOnly,
      sortField: sort.field,
      sortDirection: sort.direction,
    },
  });

  return response.data;
}

export async function getShipment(id: string): Promise<Shipment> {
  const response = await http.get<Shipment>(`/shipments/${id}`);
  return response.data;
}

export async function createShipment(
  payload: Omit<Shipment, "id" | "createdAt">,
) {
  const response = await http.post<Shipment>("/shipments", payload);
  return response.data;
}

export async function updateShipment(id: string, payload: Partial<Shipment>) {
  const response = await http.patch<Shipment>(`/shipments/${id}`, payload);
  return response.data;
}
