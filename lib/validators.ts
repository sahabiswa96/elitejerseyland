import { z } from "zod";

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

export const loginSchema = z.object({
  email: z.string().email("Valid email is required"),
  password: z.string().min(1, "Password is required"),
});


// ✅ NEW: Product Schema (FIX FOR YOUR BUILD ERROR)
export const productSchema = z.object({
  name: z.string().min(2, "Product name is required"),
  slug: z.string().min(2, "Slug is required"),
  category: z.string().min(2, "Category is required"),
  subcategory: z.string().optional(),
  team: z.string().optional(),
  price: z.number().min(1, "Price is required"),
  oldPrice: z.number().optional(),
  mainImage: z.string().min(1, "Main image is required"),
  stock: z.number().int().nonnegative("Stock must be 0 or more"),
});