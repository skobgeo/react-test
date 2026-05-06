import { Button, Group, NumberInput, Paper, TextInput } from "@mantine/core";
import { useState } from "react";
import { createClient } from "../../../entities/client/api/clientApi";
import type { Client } from "../../../entities/client/model/types";

type CreateClientFormProps = {
  onCreated: (client: Client) => void;
};

export function CreateClientForm({ onCreated }: CreateClientFormProps) {
  const [newName, setNewName] = useState("");
  const [newCompany, setNewCompany] = useState("");
  const [newRevenue, setNewRevenue] = useState<number | string>(0);

  async function handleCreateClient() {
    try {
      const created = await createClient({
        name: newName,
        company: newCompany,
        email: `${newName.toLowerCase().replaceAll(" ", ".")}@example.com`,
        status: "active",
        revenue: Number(newRevenue),
        notes: "",
      });

      onCreated(created);
    } catch {
      onCreated({
        id: `local-${Date.now()}`,
        name: "",
        company: "",
        email: "",
        status: "active",
        revenue: 0,
        createdAt: new Date().toISOString(),
        notes: "",
      });
    }

    setNewName("");
    setNewCompany("");
    setNewRevenue(0);
  }

  return (
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
  );
}
