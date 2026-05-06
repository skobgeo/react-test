import { http } from "../../../shared/api/http";
import type { Client, ClientFilters, ClientListResponse } from "../model/types";

export async function getClients(
  page: number,
  filters: ClientFilters,
): Promise<ClientListResponse> {
  const response = await http.get<ClientListResponse>("/clients", {
    params: {
      page,
      search: filters.search,
      status: filters.status,
    },
  });

  return response.data;
}

export async function getClient(id: string): Promise<Client> {
  const response = await http.get<Client>(`/clients/${id}`);
  return response.data;
}

export async function createClient(payload: Omit<Client, "id" | "createdAt">) {
  const response = await http.post<Client>("/clients", payload);
  return response.data;
}

export async function updateClient(id: string, payload: Partial<Client>) {
  const response = await http.patch<Client>(`/clients/${id}`, payload);
  return response.data;
}
