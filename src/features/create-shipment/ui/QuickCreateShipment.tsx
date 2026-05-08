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

  async function handleCreateClick() {
    await onCreate(customer, destination);
    setCustomer("");
    setDestination("");
  }

  return (
    <div className={styles.panel}>
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
      <Button type="button" onClick={handleCreateClick}>
        Create shipment
      </Button>
    </div>
  );
}
