import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Group, NumberInput, Paper, TextInput } from "@mantine/core";
import { Controller, useForm } from "react-hook-form";
import { createClient } from "../../../entities/client/api/clientApi";
import type { Client } from "../../../entities/client/model/types";
import {
  type CreateClientFormValues,
  createClientSchema,
} from "../model/schema";

type CreateClientFormProps = {
  onCreated: (client: Client) => void;
};

export function CreateClientForm({ onCreated }: CreateClientFormProps) {
  const form = useForm<CreateClientFormValues>({
    resolver: zodResolver(createClientSchema),
    defaultValues: {
      name: "",
      company: "",
      revenue: 0,
    },
  });

  async function handleCreateClient(values: CreateClientFormValues) {
    try {
      const created = await createClient({
        name: values.name,
        company: values.company,
        email: `${values.name.toLowerCase().replaceAll(" ", ".")}@example.com`,
        status: "active",
        revenue: values.revenue,
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

    form.reset();
  }

  return (
    <Paper p="md" withBorder>
      <Group align="end">
        <TextInput label="New client name" {...form.register("name")} />
        <TextInput label="Company" {...form.register("company")} />
        <Controller
          control={form.control}
          name="revenue"
          render={({ field }) => (
            <NumberInput
              label="Revenue"
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />
        <Button onClick={form.handleSubmit(handleCreateClient)}>Create</Button>
      </Group>
    </Paper>
  );
}
