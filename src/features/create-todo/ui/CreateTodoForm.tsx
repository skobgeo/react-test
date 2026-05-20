import { useState } from "react";
import type { CreateTodoPayload } from "../../../entities/todo/model/types";
import { Button } from "../../../shared/ui/Button";
import { Field } from "../../../shared/ui/Field";
import { Select } from "../../../shared/ui/Select";
import { createTodoSchema } from "../model/schema";

type CreateTodoFormProps = {
  onCreate: (payload: CreateTodoPayload) => Promise<void> | void;
};

export function CreateTodoForm({ onCreate }: CreateTodoFormProps) {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("normal");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [assignee, setAssignee] = useState("");
  const [notify, setNotify] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleCreateClick() {
    setError("");
    setSubmitting(true);

    const values = {
      title,
      priority,
      description,
      dueDate,
      assignee,
      notify,
    };

    try {
      await createTodoSchema.validate(values);
    } catch (reason: any) {
      setError(reason.message ?? "Could not create todo");
      setSubmitting(false);
      return;
    } finally {
      setSubmitting(false);
    }

    // @ts-ignore
    await onCreate(values);
    setTitle("");
  }

  return (
    <div className="createForm">
      <Field error={error} label="New todo">
        <input
          className="control"
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Write a todo"
          value={title}
        />
      </Field>

      <Field label="Description">
        <input
          className="control"
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Optional details"
          value={description}
        />
      </Field>

      <Field label="Priority">
        <Select
          onChange={(value: any) => setPriority(value)}
          options={[
            { label: "Low", value: "low" },
            { label: "Normal", value: "normal" },
            { label: "High", value: "high" },
          ]}
          value={priority}
        />
      </Field>

      <Field label="Due date">
        <input
          className="control"
          onChange={(event) => setDueDate(event.target.value)}
          type="date"
          value={dueDate}
        />
      </Field>

      <Field label="Assignee">
        <input
          className="control"
          onChange={(event) => setAssignee(event.target.value)}
          placeholder="Owner"
          value={assignee}
        />
      </Field>

      <label className="checkboxField">
        <input
          checked={notify}
          onChange={(event) => setNotify(event.target.checked)}
          type="checkbox"
        />
        Notify owner
      </label>

      <Button disabled={submitting} onClick={handleCreateClick} type="button">
        {submitting ? "Creating..." : "Create"}
      </Button>
    </div>
  );
}
