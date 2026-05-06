import {
  Badge,
  Button,
  Group,
  Loader,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { getClient, updateClient } from "../../entities/client/api/clientApi";
import type { Client } from "../../entities/client/model/types";
import { ClientEditForm } from "../../features/edit-client/ui/ClientEditForm";

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

      <ClientEditForm client={client} onChange={setClient} />
    </Stack>
  );
}
