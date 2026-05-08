import type {
  Checkpoint,
  Shipment,
  ShipmentLine,
} from "../../../entities/shipment/model/types";
import { Button } from "../../../shared/ui/Button";
import {
  Field,
  SelectInput,
  TextArea,
  TextInput,
} from "../../../shared/ui/FormControls";
import styles from "./ShipmentEditForm.module.css";

type ShipmentEditFormProps = {
  shipment: Shipment;
  onChange: (patch: Partial<Shipment>) => void;
};

const statuses: Shipment["status"][] = [
  "draft",
  "scheduled",
  "in_transit",
  "blocked",
  "delivered",
];

const priorities: Shipment["priority"][] = [
  "low",
  "normal",
  "high",
  "critical",
];

const temperatures: ShipmentLine["temperature"][] = [
  "ambient",
  "chilled",
  "frozen",
];

export function ShipmentEditForm({
  shipment,
  onChange,
}: ShipmentEditFormProps) {
  const totalWeight = shipment.lines.reduce(
    (sum, line) => sum + Number(line.weightKg) * Number(line.quantity),
    0,
  );
  const hasInvalidQuantity = shipment.lines.some(
    (line) => Number(line.quantity) < 0,
  );

  function updateLine(id: string, patch: Partial<ShipmentLine>) {
    onChange({
      lines: shipment.lines.map((line) =>
        line.id === id ? { ...line, ...patch } : line,
      ),
    });
  }

  function updateCheckpoint(id: string, patch: Partial<Checkpoint>) {
    onChange({
      checkpoints: shipment.checkpoints.map((checkpoint) =>
        checkpoint.id === id ? { ...checkpoint, ...patch } : checkpoint,
      ),
    });
  }

  function addLine() {
    onChange({
      lines: [
        ...shipment.lines,
        {
          id: crypto.randomUUID(),
          sku: "",
          name: "",
          quantity: 1,
          weightKg: 0,
          temperature: "ambient",
        },
      ],
    });
  }

  function removeLine(id: string) {
    shipment.lines.splice(
      shipment.lines.findIndex((line) => line.id === id),
      1,
    );
    onChange({ lines: shipment.lines });
  }

  function addCheckpoint() {
    onChange({
      checkpoints: [
        ...shipment.checkpoints,
        {
          id: crypto.randomUUID(),
          city: "",
          plannedAt: new Date().toISOString(),
          completed: false,
        },
      ],
    });
  }

  function removeCheckpoint(id: string) {
    onChange({
      checkpoints: shipment.checkpoints.filter(
        (checkpoint) => checkpoint.id !== id,
      ),
    });
  }

  return (
    <div className={styles.form}>
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>Shipment details</h2>
          <span>{Math.round(totalWeight)} kg planned</span>
        </div>

        <div className={styles.grid}>
          <Field label="Reference">
            <TextInput
              value={shipment.reference}
              onChange={(event) =>
                onChange({ reference: event.currentTarget.value })
              }
            />
          </Field>
          <Field label="Customer">
            <TextInput
              value={shipment.customer}
              onChange={(event) =>
                onChange({ customer: event.currentTarget.value })
              }
            />
          </Field>
          <Field label="Carrier">
            <TextInput
              value={shipment.carrier}
              onChange={(event) =>
                onChange({ carrier: event.currentTarget.value })
              }
            />
          </Field>
          <Field label="Origin">
            <TextInput
              value={shipment.origin}
              onChange={(event) =>
                onChange({ origin: event.currentTarget.value })
              }
            />
          </Field>
          <Field label="Destination">
            <TextInput
              value={shipment.destination}
              onChange={(event) =>
                onChange({ destination: event.currentTarget.value })
              }
            />
          </Field>
          <Field label="ETA">
            <TextInput
              type="date"
              value={shipment.eta.slice(0, 10)}
              onChange={(event) => onChange({ eta: event.currentTarget.value })}
            />
          </Field>
          <Field label="Status">
            <SelectInput
              value={shipment.status}
              onChange={(event) =>
                onChange({
                  status: event.currentTarget.value as Shipment["status"],
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
              value={shipment.priority}
              onChange={(event) =>
                onChange({
                  priority: event.currentTarget.value as Shipment["priority"],
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
          <Field label="Declared value">
            <TextInput
              type="number"
              value={shipment.value}
              onChange={(event) =>
                onChange({ value: Number(event.currentTarget.value) })
              }
            />
          </Field>
        </div>

        <Field label="Notes">
          <TextArea
            value={shipment.notes}
            onChange={(event) => onChange({ notes: event.currentTarget.value })}
          />
        </Field>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>Line items</h2>
          <Button type="button" variant="secondary" onClick={addLine}>
            Add line
          </Button>
        </div>
        <div className={styles.error}>
          {hasInvalidQuantity ? "Quantity cannot be negative" : ""}
        </div>

        {shipment.lines.map((line) => (
          <div className={styles.lineRow} key={line.id}>
            <Field label="SKU">
              <TextInput
                value={line.sku}
                onChange={(event) =>
                  updateLine(line.id, { sku: event.currentTarget.value })
                }
              />
            </Field>
            <Field label="Item">
              <TextInput
                value={line.name}
                onChange={(event) =>
                  updateLine(line.id, { name: event.currentTarget.value })
                }
              />
            </Field>
            <Field label="Qty">
              <TextInput
                type="number"
                value={line.quantity}
                onChange={(event) =>
                  updateLine(line.id, {
                    quantity: Number(event.currentTarget.value),
                  })
                }
              />
            </Field>
            <Field label="Weight">
              <TextInput
                type="number"
                value={line.weightKg}
                onChange={(event) =>
                  updateLine(line.id, {
                    weightKg: Number(event.currentTarget.value),
                  })
                }
              />
            </Field>
            <Field label="Temperature">
              <SelectInput
                value={line.temperature}
                onChange={(event) =>
                  updateLine(line.id, {
                    temperature: event.currentTarget
                      .value as ShipmentLine["temperature"],
                  })
                }
              >
                {temperatures.map((temperature) => (
                  <option key={temperature} value={temperature}>
                    {temperature}
                  </option>
                ))}
              </SelectInput>
            </Field>
            <Button
              type="button"
              variant="ghost"
              onClick={() => removeLine(line.id)}
            >
              Remove
            </Button>
          </div>
        ))}
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>Route checkpoints</h2>
          <Button type="button" variant="secondary" onClick={addCheckpoint}>
            Add checkpoint
          </Button>
        </div>

        {shipment.checkpoints.map((checkpoint) => (
          <div className={styles.checkpointRow} key={checkpoint.id}>
            <Field label="City">
              <TextInput
                value={checkpoint.city}
                onChange={(event) =>
                  updateCheckpoint(checkpoint.id, {
                    city: event.currentTarget.value,
                  })
                }
              />
            </Field>
            <Field label="Planned date">
              <TextInput
                type="date"
                value={checkpoint.plannedAt.slice(0, 10)}
                onChange={(event) =>
                  updateCheckpoint(checkpoint.id, {
                    plannedAt: event.currentTarget.value,
                  })
                }
              />
            </Field>
            <Field label="Completed">
              <SelectInput
                value={String(checkpoint.completed)}
                onChange={(event) =>
                  updateCheckpoint(checkpoint.id, {
                    completed: Boolean(event.currentTarget.value),
                  })
                }
              >
                <option value="false">No</option>
                <option value="true">Yes</option>
              </SelectInput>
            </Field>
            <Button
              type="button"
              variant="ghost"
              onClick={() => removeCheckpoint(checkpoint.id)}
            >
              Remove
            </Button>
          </div>
        ))}
      </section>
    </div>
  );
}
