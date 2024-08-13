import * as yup from "yup";

export const userSchema = yup.object().shape({
  username: yup
    .string()
    .min(6, "Username must be at least 6 characters")
    .required("Username is required."),
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required."),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(12, "Password must be at most 12 characters")
    .required("Password is required."),
});

export const loginSchema = yup.object().shape({
  email: yup
    .string()
    .email("Please enter a valid email address, including '@'.")
    .required("Email is required."),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required."),
});
