import {
  NumberInput,
  Paper,
  Select,
  Stack,
  Textarea,
  TextInput,
} from "@mantine/core";
import type { Client } from "../../../entities/client/model/types";

type ClientEditFormProps = {
  client: Client;
  onChange: (client: Client) => void;
};

export function ClientEditForm({ client, onChange }: ClientEditFormProps) {
  return (
    <Paper p="md" withBorder>
      <Stack>
        <TextInput
          label="Name"
          value={client.name}
          onChange={(event) => {
            client.name = event.currentTarget.value;
            onChange(client);
          }}
        />
        <TextInput
          label="Company"
          value={client.company}
          onChange={(event) =>
            onChange({
              ...client,
              company: event.currentTarget.value,
            })
          }
        />
        <TextInput
          label="Email"
          value={client.email}
          onChange={(event) =>
            onChange({
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
            onChange({
              ...client,
              status: value as Client["status"],
            })
          }
        />
        <NumberInput
          label="Revenue"
          value={client.revenue}
          onChange={(value) =>
            onChange({
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
            onChange({
              ...client,
              notes: event.currentTarget.value,
            })
          }
        />
      </Stack>
    </Paper>
  );
}
