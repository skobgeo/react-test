import * as yup from "yup";

export const createTodoSchema = yup.object({
  title: yup.string().required("Title is required"),
  priority: yup.string().oneOf(["low", "normal", "high"]).required(),
});
