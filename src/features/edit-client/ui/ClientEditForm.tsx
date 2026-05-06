import { zodResolver } from "@hookform/resolvers/zod";
import {
  NumberInput,
  Paper,
  Select,
  Stack,
  Textarea,
  TextInput,
} from "@mantine/core";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import type { Client } from "../../../entities/client/model/types";
import { type EditClientFormValues, editClientSchema } from "../model/schema";

type ClientEditFormProps = {
  client: Client;
  onChange: (client: Client) => void;
};

export function ClientEditForm({ client, onChange }: ClientEditFormProps) {
  const form = useForm<EditClientFormValues>({
    resolver: zodResolver(editClientSchema),
    defaultValues: client,
  });

  useEffect(() => {
    const subscription = form.watch((values) => {
      onChange({
        ...client,
        ...values,
        status: values.status as Client["status"],
        revenue: Number(values.revenue),
      });
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <Paper p="md" withBorder>
      <Stack>
        <TextInput label="Name" {...form.register("name")} />
        <TextInput label="Company" {...form.register("company")} />
        <TextInput label="Email" {...form.register("email")} />
        <Controller
          control={form.control}
          name="status"
          render={({ field }) => (
            <Select
              label="Status"
              value={field.value}
              data={[
                { value: "active", label: "Active" },
                { value: "paused", label: "Paused" },
                { value: "archived", label: "Archived" },
              ]}
              onChange={field.onChange}
            />
          )}
        />
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
        <Textarea label="Notes" minRows={4} {...form.register("notes")} />
      </Stack>
    </Paper>
  );
}
