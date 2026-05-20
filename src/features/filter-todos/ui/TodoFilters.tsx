import type { TodoFilters as TodoFiltersModel } from "../../../entities/todo/model/types";
import { Button } from "../../../shared/ui/Button";
import { Field } from "../../../shared/ui/Field";
import { Select } from "../../../shared/ui/Select";

type TodoFiltersProps = {
  value: TodoFiltersModel;
  onChange: (filters: TodoFiltersModel) => void;
};

export function TodoFilters({ value, onChange }: TodoFiltersProps) {
  return (
    <div className="filters">
      <Field label="Search">
        <input
          className="control"
          onChange={(event) =>
            onChange({ ...value, search: event.target.value })
          }
          placeholder="Type to search"
          value={value.search}
        />
      </Field>

      <Field label="Status">
        <Select
          onChange={(status: any) => onChange({ ...value, status })}
          options={[
            { label: "All", value: "all" },
            { label: "Active", value: "active" },
            { label: "Done", value: "done" },
          ]}
          value={value.status}
        />
      </Field>

      <Button onClick={() => onChange({ search: "", status: "all" })}>
        Reset
      </Button>
    </div>
  );
}
