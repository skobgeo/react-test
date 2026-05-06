import { Badge, Group, Paper, Text } from "@mantine/core";
import { Link } from "react-router";
import { statusColor } from "../../../pages/clients/model/statusColor";
import type { Client } from "../model/types";

type ClientListProps = {
  clients: Client[];
};

export function ClientList({ clients }: ClientListProps) {
  return (
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
              <Badge color={statusColor[client.status]}>{client.status}</Badge>
              <Text fw={600}>${client.revenue.toLocaleString()}</Text>
            </Group>
          </Group>
        </Link>
      ))}
    </Paper>
  );
}
