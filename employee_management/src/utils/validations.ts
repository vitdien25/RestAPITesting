import * as yup from "yup";
import { Gender } from "../types/employee";

const phoneRegExp = /^[+]?[\d\s\-()]{10,15}$/;

export const employeeCreateSchema = yup.object().shape({
  fullName: yup
    .string()
    .required("Full name is required")
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name cannot exceed 100 characters"),
  email: yup
    .string()
    .required("Email is required")
    .email("Please enter a valid email address"),
  dateOfBirth: yup
    .string()
    .required("Date of birth is required")
    .matches(/^\d{4}-\d{2}-\d{2}$/, "Date format must be YYYY-MM-DD"),
  gender: yup
    .string()
    .required("Gender is required")
    .oneOf(
      [Gender.MALE, Gender.FEMALE, Gender.OTHER],
      "Gender must be MALE, FEMALE, or OTHER"
    ),
  phoneNumber: yup
    .string()
    .required("Phone number is required")
    .matches(phoneRegExp, "Please enter a valid phone number"),
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters")
    .max(50, "Password cannot exceed 50 characters"),
});

export const employeeUpdateSchema = yup.object().shape({
  fullName: yup
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name cannot exceed 100 characters"),
  dateOfBirth: yup
    .string()
    .matches(/^\d{4}-\d{2}-\d{2}$/, "Date format must be YYYY-MM-DD"),
  gender: yup
    .string()
    .oneOf(
      [Gender.MALE, Gender.FEMALE, Gender.OTHER],
      "Gender must be MALE, FEMALE, or OTHER"
    ),
  phoneNumber: yup
    .string()
    .matches(phoneRegExp, "Please enter a valid phone number"),
});

export type EmployeeCreateFormData = yup.InferType<typeof employeeCreateSchema>;
export type EmployeeUpdateFormData = yup.InferType<typeof employeeUpdateSchema>;
