import * as yup from "yup";

export const schema = yup.object().shape({
  title: yup
    .string()
    .min(5, "Title must be at least 5 characters long.")
    .matches(/^(?!\s*$).+/, "Title cannot be empty or contain only spaces")
    .required("Title is required."),
  text: yup
    .string()
    .min(10, "Text must be at least 10 characters long.")
    .matches(/^(?!\s*$).+/, "Text cannot be empty or contain only spaces")
    .required("Text is required."),
});

export const schemaEdit = yup.object().shape({
  editTitle: yup
    .string()
    .matches(/^(?!\s*$).+/, "Title cannot be empty or contain only spaces")
    .required("Title is required."),
  editText: yup
    .string()
    .matches(/^(?!\s*$).+/, "Text cannot be empty or contain only spaces")
    .required("Text is required."),
});
