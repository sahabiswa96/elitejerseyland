import { z } from "zod";

/**
 * Signup Schema
 */
export const signupSchema = z
  .object({
    firstName: z.string().min(2, "First name is required"),
    lastName: z.string().min(2, "Last name is required"),
    email: z.string().email("Valid email is required"),
    phone: z.string().min(8, "Valid phone is required"),
    address: z.string().min(3, "Address is required"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Confirm password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

/**
 * Login Schema
 */
export const loginSchema = z.object({
  email: z.string().email("Valid email is required"),
  password: z.string().min(1, "Password is required"),
});

/**
 * Product Schema (Admin Product API uses this)
 */
export const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),

  description: z
    .string()
    .min(5, "Description must be at least 5 characters")
    .optional(),

  price: z.number({
    required_error: "Price is required",
  }).min(0, "Price must be greater than or equal to 0"),

  image: z.string().optional(),

  category: z.string().optional(),

  stock: z
    .number({
      invalid_type_error: "Stock must be a number",
    })
    .min(0, "Stock cannot be negative")
    .optional(),
});