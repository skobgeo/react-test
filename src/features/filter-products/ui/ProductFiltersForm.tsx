import type { ProductFilters } from "../../../entities/product/model/types";
import { Card, Select, TextField } from "../../../shared/ui";
import styles from "./ProductFiltersForm.module.css";

type ProductFiltersFormProps = {
  filters: ProductFilters;
  onChange: (filters: ProductFilters) => void;
};

export function ProductFiltersForm({
  filters,
  onChange,
}: ProductFiltersFormProps) {
  return (
    <Card className={styles.form}>
      <TextField
        label="Search"
        placeholder="Title or SKU"
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
        options={[
          { value: "all", label: "All" },
          { value: "active", label: "Active" },
          { value: "draft", label: "Draft" },
          { value: "archived", label: "Archived" },
        ]}
        onChange={(event) =>
          onChange({
            ...filters,
            status: event.currentTarget.value as ProductFilters["status"],
          })
        }
      />
      <TextField
        label="Category"
        value={filters.category}
        onChange={(event) =>
          onChange({
            ...filters,
            category: event.currentTarget.value,
          })
        }
      />
    </Card>
  );
}
