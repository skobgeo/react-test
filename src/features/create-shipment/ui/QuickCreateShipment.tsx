import { useState } from "react";
import { Button } from "../../../shared/ui/Button";
import { Field, TextInput } from "../../../shared/ui/FormControls";
import styles from "./QuickCreateShipment.module.css";

type QuickCreateShipmentProps = {
  onCreate: (customer: string, destination: string) => Promise<void>;
};

export function QuickCreateShipment({ onCreate }: QuickCreateShipmentProps) {
  const [customer, setCustomer] = useState("");
  const [destination, setDestination] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await onCreate(customer, destination);
    setCustomer("");
    setDestination("");
  }

  return (
    <form className={styles.panel} onSubmit={handleSubmit}>
      <Field label="New customer">
        <TextInput
          value={customer}
          onChange={(event) => setCustomer(event.currentTarget.value)}
        />
      </Field>
      <Field label="Destination">
        <TextInput
          value={destination}
          onChange={(event) => setDestination(event.currentTarget.value)}
        />
      </Field>
      <Button type="submit">Create shipment</Button>
    </form>
  );
}
