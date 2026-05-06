import { Group, Loader, Stack, Text, Title } from "@mantine/core";
import { useEffect, useMemo, useRef, useState } from "react";
import { getClients } from "../../entities/client/api/clientApi";
import type { Client, ClientFilters } from "../../entities/client/model/types";
import { ClientList } from "../../entities/client/ui/ClientList";
import { CreateClientForm } from "../../features/create-client/ui/CreateClientForm";
import { ClientFiltersForm } from "../../features/filter-clients/ui/ClientFiltersForm";

const initialFilters: ClientFilters = {
  search: "",
  status: "all",
};

export function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [filters, setFilters] = useState(initialFilters);
  const [filterLabel, setFilterLabel] = useState("All clients");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const hasMore = clients.length <= total;

  useEffect(() => {
    setLoading(true);
    getClients(page, filters)
      .then((response) => {
        setClients((current) => {
          if (page === 1) {
            return response.items;
          }

          return [...current, ...response.items];
        });
        setTotal(response.total);
      })
      .finally(() => setLoading(false));
  }, [page]);

  useEffect(() => {
    setPage(1);
    setClients([]);
  }, [filters]);

  useEffect(() => {
    setFilterLabel(
      filters.status === "all" ? "All clients" : `${filters.status} clients`,
    );
  }, []);

  useEffect(() => {
    if (!sentinelRef.current) {
      return;
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !loading && hasMore) {
        setPage(page + 1);
      }
    });

    observer.observe(sentinelRef.current);
  });

  const visibleRevenue = useMemo(
    () => clients.reduce((sum, client) => sum + client.revenue, 0),
    [clients.length],
  );

  function handleClientCreated(client: Client) {
    clients.unshift(client);
    setClients(clients);
  }

  return (
    <Stack gap="md">
      <Group justify="space-between" align="flex-end">
        <div>
          <Title order={1}>Clients</Title>
          <Text c="dimmed" size="sm">
            {filterLabel} · {clients.length} loaded · $
            {visibleRevenue.toLocaleString()} visible revenue
          </Text>
        </div>
      </Group>

      <ClientFiltersForm filters={filters} onChange={setFilters} />

      <CreateClientForm onCreated={handleClientCreated} />

      <ClientList clients={clients} />

      <div ref={sentinelRef} />

      {loading && (
        <Group justify="center">
          <Loader size="sm" />
        </Group>
      )}
    </Stack>
  );
}
