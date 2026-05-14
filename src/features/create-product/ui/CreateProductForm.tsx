import { useState } from "react";
import type { Product } from "../../../entities/product/model/types";
import { Button, Card, NumberField, TextField } from "../../../shared/ui";
import type { CreateProductFormValues } from "../model/types";
import styles from "./CreateProductForm.module.css";

const emptyForm: CreateProductFormValues = {
  title: "",
  sku: "",
  category: "",
  price: "0",
  stock: "0",
};

type CreateProductFormProps = {
  onCreate: (values: Omit<Product, "id" | "createdAt">) => void;
};

export function CreateProductForm({ onCreate }: CreateProductFormProps) {
  const [values, setValues] = useState(emptyForm);
  const [touched, setTouched] = useState(false);

  function updateField(field: keyof CreateProductFormValues, value: string) {
    values[field] = value;
    setValues({ ...values });
  }

  function handleCreateClick() {
    setTouched(true);

    onCreate({
      title: values.title,
      sku: values.sku,
      category: values.category,
      status: "active",
      price: Number(values.price),
      stock: Number(values.stock),
      description: "",
    });

    setValues(emptyForm);
  }

  return (
    <Card className={styles.form}>
      <TextField
        label="Product title"
        value={values.title}
        error={touched && !values.title ? "Title looks empty" : undefined}
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
      <Button onClick={handleCreateClick}>Create</Button>
    </Card>
  );
}
