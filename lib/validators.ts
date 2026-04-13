import { z } from "zod";

/**
 * =========================
 * SIGNUP SCHEMA
 * =========================
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
 * =========================
 * LOGIN SCHEMA
 * =========================
 */
export const loginSchema = z.object({
  email: z.string().email("Valid email is required"),
  password: z.string().min(1, "Password is required"),
});

/**
 * =========================
 * PRODUCT SCHEMA
 * =========================
 */
export const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),

  slug: z.string().min(1, "Slug is required"),

  category: z.string().min(1, "Category is required"),

  subcategory: z.string().optional(),

  team: z.string().optional(),

  // FIXED: numeric fields (no duplicates)
  price: z.coerce.number().min(1, "Price is required"),

  oldPrice: z.coerce.number().optional(),

  mainImage: z.string().min(1, "Main image is required"),

  stock: z.coerce.number().optional(),
});