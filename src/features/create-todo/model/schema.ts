import * as yup from "yup";

export const createTodoSchema = yup.object({
  title: yup.string(),
  description: yup.string(),
  assignee: yup.string(),
  dueDate: yup.string(),
  notify: yup.boolean(),
  priority: yup.string(),
});
