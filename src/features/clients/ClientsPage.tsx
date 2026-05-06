import {
  Badge,
  Button,
  Group,
  Loader,
  NumberInput,
  Paper,
  Select,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router";
import { createClient, getClients } from "./api";
import type { Client, ClientFilters, ClientStatus } from "./types";

const initialFilters: ClientFilters = {
  search: "",
  status: "all",
};

const statusColor: Record<ClientStatus, string> = {
  active: "teal",
  paused: "yellow",
  archived: "gray",
};

export function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [filters, setFilters] = useState(initialFilters);
  const [filterLabel, setFilterLabel] = useState("All clients");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [newName, setNewName] = useState("");
  const [newCompany, setNewCompany] = useState("");
  const [newRevenue, setNewRevenue] = useState<number | string>(0);
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

  async function handleCreateClient() {
    const created = await createClient({
      name: newName,
      company: newCompany,
      email: `${newName.toLowerCase().replaceAll(" ", ".")}@example.com`,
      status: "active",
      revenue: Number(newRevenue),
      notes: "",
    });

    clients.unshift(created);
    setClients(clients);
    setNewName("");
    setNewCompany("");
    setNewRevenue(0);
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

      <Paper p="md" withBorder>
        <Group align="end">
          <TextInput
            label="Search"
            placeholder="Name or company"
            value={filters.search}
            onChange={(event) =>
              setFilters({
                ...filters,
                search: event.currentTarget.value,
              })
            }
          />
          <Select
            label="Status"
            value={filters.status}
            data={[
              { value: "all", label: "All" },
              { value: "active", label: "Active" },
              { value: "paused", label: "Paused" },
              { value: "archived", label: "Archived" },
            ]}
            onChange={(value) =>
              setFilters({
                ...filters,
                status: (value ?? "all") as ClientFilters["status"],
              })
            }
          />
        </Group>
      </Paper>

      <Paper p="md" withBorder>
        <Group align="end">
          <TextInput
            label="New client name"
            value={newName}
            onChange={(event) => setNewName(event.currentTarget.value)}
          />
          <TextInput
            label="Company"
            value={newCompany}
            onChange={(event) => setNewCompany(event.currentTarget.value)}
          />
          <NumberInput
            label="Revenue"
            value={newRevenue}
            onChange={setNewRevenue}
          />
          <Button onClick={handleCreateClient}>Create</Button>
        </Group>
      </Paper>

      <Paper withBorder>
        {clients.map((client, index) => (
          <Link className="clientRow" to={`/clients/${client.id}`} key={index}>
            <Group justify="space-between">
              <div>
                <Text fw={600}>{client.name}</Text>
                <Text c="dimmed" size="sm">
                  {client.company} · {client.email}
                </Text>
              </div>
              <Group gap="xs">
                <Badge color={statusColor[client.status]}>
                  {client.status}
                </Badge>
                <Text fw={600}>${client.revenue.toLocaleString()}</Text>
              </Group>
            </Group>
          </Link>
        ))}
      </Paper>

      <div ref={sentinelRef} />

      {loading && (
        <Group justify="center">
          <Loader size="sm" />
        </Group>
      )}
    </Stack>
  );
}
