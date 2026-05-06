import { Group, Paper, Select, TextInput } from "@mantine/core";
import type { ClientFilters } from "../../../entities/client/model/types";

type ClientFiltersFormProps = {
  filters: ClientFilters;
  onChange: (filters: ClientFilters) => void;
};

export function ClientFiltersForm({
  filters,
  onChange,
}: ClientFiltersFormProps) {
  return (
    <Paper p="md" withBorder>
      <Group align="end">
        <TextInput
          label="Search"
          placeholder="Name or company"
          value={filters.search}
          onChange={(event) =>
            onChange({
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
            onChange({
              ...filters,
              status: (value ?? "all") as ClientFilters["status"],
            })
          }
        />
      </Group>
    </Paper>
  );
}
