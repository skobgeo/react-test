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
  Textarea,
  TextInput,
  Title,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { getClient, updateClient } from "./api";
import type { Client } from "./types";

export function ClientDetailsPage() {
  const { clientId } = useParams();
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!clientId) {
      return;
    }

    getClient(clientId).then((response) => {
      setClient(response);
      setLoading(false);
    });
  }, [clientId]);

  async function handleSave() {
    if (!client) {
      return;
    }

    setSaving(true);
    const updated = await updateClient(client.id, client);
    setClient(updated);
    setSaving(false);
  }

  if (loading) {
    return (
      <Group justify="center" p="xl">
        <Loader />
      </Group>
    );
  }

  if (!client) {
    return <Text>Client not found</Text>;
  }

  return (
    <Stack gap="md">
      <Group justify="space-between">
        <div>
          <Text component={Link} to="/" size="sm">
            Back to clients
          </Text>
          <Title order={1}>{client.name}</Title>
          <Badge>{client.status}</Badge>
        </div>
        <Button loading={saving} onClick={handleSave}>
          Save
        </Button>
      </Group>

      <Paper p="md" withBorder>
        <Stack>
          <TextInput
            label="Name"
            value={client.name}
            onChange={(event) => {
              client.name = event.currentTarget.value;
              setClient(client);
            }}
          />
          <TextInput
            label="Company"
            value={client.company}
            onChange={(event) =>
              setClient({
                ...client,
                company: event.currentTarget.value,
              })
            }
          />
          <TextInput
            label="Email"
            value={client.email}
            onChange={(event) =>
              setClient({
                ...client,
                email: event.currentTarget.value,
              })
            }
          />
          <Select
            label="Status"
            value={client.status}
            data={[
              { value: "active", label: "Active" },
              { value: "paused", label: "Paused" },
              { value: "archived", label: "Archived" },
            ]}
            onChange={(value) =>
              setClient({
                ...client,
                status: value as Client["status"],
              })
            }
          />
          <NumberInput
            label="Revenue"
            value={client.revenue}
            onChange={(value) =>
              setClient({
                ...client,
                revenue: Number(value),
              })
            }
          />
          <Textarea
            label="Notes"
            minRows={4}
            value={client.notes}
            onChange={(event) =>
              setClient({
                ...client,
                notes: event.currentTarget.value,
              })
            }
          />
        </Stack>
      </Paper>
    </Stack>
  );
}
