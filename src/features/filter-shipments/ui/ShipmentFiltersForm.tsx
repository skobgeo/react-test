import type {
  ShipmentFilters,
  ShipmentPriority,
  ShipmentStatus,
} from "../../../entities/shipment/model/types";
import {
  Checkbox,
  Field,
  SelectInput,
  TextInput,
} from "../../../shared/ui/FormControls";
import styles from "./ShipmentFiltersForm.module.css";

type ShipmentFiltersFormProps = {
  filters: ShipmentFilters;
  onChange: (filters: ShipmentFilters) => void;
};

const statuses: Array<"all" | ShipmentStatus> = [
  "all",
  "draft",
  "scheduled",
  "in_transit",
  "blocked",
  "delivered",
];

const priorities: Array<"all" | ShipmentPriority> = [
  "all",
  "low",
  "normal",
  "high",
  "critical",
];

export function ShipmentFiltersForm({
  filters,
  onChange,
}: ShipmentFiltersFormProps) {
  return (
    <div className={styles.panel}>
      <Field label="Search">
        <TextInput
          placeholder="Reference, customer, destination"
          value={filters.search}
          onChange={(event) =>
            onChange({ ...filters, search: event.currentTarget.value })
          }
        />
      </Field>

      <Field label="Status">
        <SelectInput
          value={filters.status}
          onChange={(event) =>
            onChange({
              ...filters,
              status: event.currentTarget.value as ShipmentFilters["status"],
            })
          }
        >
          {statuses.map((status) => (
            <option key={status} value={status}>
              {status.replace("_", " ")}
            </option>
          ))}
        </SelectInput>
      </Field>

      <Field label="Priority">
        <SelectInput
          value={filters.priority}
          onChange={(event) =>
            onChange({
              ...filters,
              priority: event.currentTarget.value as "all" | ShipmentPriority,
            })
          }
        >
          {priorities.map((priority) => (
            <option key={priority} value={priority}>
              {priority}
            </option>
          ))}
        </SelectInput>
      </Field>

      <Checkbox
        aria-label="Delayed only"
        checked={filters.delayedOnly}
        onChange={(event) =>
          onChange({ ...filters, delayedOnly: event.currentTarget.checked })
        }
      />
    </div>
  );
}
