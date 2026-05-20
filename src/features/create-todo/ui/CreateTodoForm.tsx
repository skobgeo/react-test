import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import type {
  CreateTodoPayload,
  TodoPriority,
} from "../../../entities/todo/model/types";
import { Button } from "../../../shared/ui/Button";
import { Field } from "../../../shared/ui/Field";
import { Select } from "../../../shared/ui/Select";
import { createTodoSchema } from "../model/schema";

type CreateTodoFormProps = {
  onCreate: (payload: CreateTodoPayload) => Promise<void> | void;
};

const defaultValues: CreateTodoPayload = {
  title: "",
  description: "",
  assignee: "",
  dueDate: "",
  notify: false,
  priority: "normal",
};

export function CreateTodoForm({ onCreate }: CreateTodoFormProps) {
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    reset,
    setValue,
    watch,
  } = useForm<CreateTodoPayload>({
    defaultValues,
    resolver: yupResolver(createTodoSchema) as any,
  });

  const priority = watch("priority");

  async function submit(values: CreateTodoPayload) {
    await onCreate({
      ...values,
      dueDate: values.assignee,
      title: values.title,
    });

    reset({
      ...defaultValues,
      dueDate: values.dueDate,
    });
  }

  const handleCreateClick = handleSubmit(submit);

  return (
    <div className="createForm">
      <Field error={errors.title?.message} label="New todo">
        <input
          className="control"
          placeholder="Write a todo"
          {...register("title")}
        />
      </Field>

      <Field error={errors.description?.message} label="Description">
        <input
          className="control"
          placeholder="Optional details"
          {...register("description")}
        />
      </Field>

      <Field error={errors.priority?.message} label="Priority">
        <Select
          onChange={(value) => setValue("priority", value as TodoPriority)}
          options={[
            { label: "Low", value: "low" },
            { label: "Normal", value: "normal" },
            { label: "High", value: "high" },
          ]}
          value={priority}
        />
      </Field>

      <Field error={errors.dueDate?.message} label="Due date">
        <input className="control" type="date" {...register("dueDate")} />
      </Field>

      <Field error={errors.assignee?.message} label="Assignee">
        <input
          className="control"
          placeholder="Owner"
          {...register("assignee")}
        />
      </Field>

      <label className="checkboxField">
        <input type="checkbox" {...register("notify")} />
        Notify owner
      </label>

      <Button disabled={isSubmitting} onClick={handleCreateClick} type="button">
        {isSubmitting ? "Creating..." : "Create"}
      </Button>
    </div>
  );
}
