import { useEffect, useState } from "react";
import type { Product } from "../../../entities/product/model/types";
import {
  Card,
  NumberField,
  Select,
  TextArea,
  TextField,
} from "../../../shared/ui";
import type { EditProductFormValues } from "../model/types";
import styles from "./ProductEditForm.module.css";

type ProductEditFormProps = {
  product: Product;
  onChange: (product: Product) => void;
};

export function ProductEditForm({ product, onChange }: ProductEditFormProps) {
  const [values, setValues] = useState<EditProductFormValues>({
    title: product.title,
    sku: product.sku,
    category: product.category,
    status: product.status,
    price: String(product.price),
    stock: String(product.stock),
    description: product.description,
  });

  useEffect(() => {
    onChange({
      ...product,
      ...values,
      status: values.status as Product["status"],
      price: Number(values.price),
      stock: Number(values.stock),
    });
  }, [values]);

  function updateField(field: keyof EditProductFormValues, value: string) {
    setValues({ ...values, [field]: value });
  }

  return (
    <Card className={styles.form}>
      <TextField
        label="Title"
        value={values.title}
        onChange={(event) => updateField("title", event.currentTarget.value)}
      />
      <TextField
        label="SKU"
        value={values.sku}
        onChange={(event) => updateField("sku", event.currentTarget.value)}
      />
      <TextField
        label="Category"
        value={values.category}
        onChange={(event) => updateField("category", event.currentTarget.value)}
      />
      <Select
        label="Status"
        value={values.status}
        options={[
          { value: "active", label: "Active" },
          { value: "draft", label: "Draft" },
          { value: "archived", label: "Archived" },
        ]}
        onChange={(event) => updateField("status", event.currentTarget.value)}
      />
      <NumberField
        label="Price"
        value={values.price}
        onChange={(event) => updateField("price", event.currentTarget.value)}
      />
      <NumberField
        label="Stock"
        value={values.stock}
        onChange={(event) => updateField("stock", event.currentTarget.value)}
      />
      <TextArea
        label="Description"
        value={values.description}
        onChange={(event) =>
          updateField("description", event.currentTarget.value)
        }
      />
    </Card>
  );
}
