import { z } from "zod";

/**
 * SIGNUP
 */
export const signupSchema = z
  .object({
    firstName: z.string().min(2),
    lastName: z.string().min(2),
    email: z.string().email(),
    phone: z.string().min(8),
    address: z.string().min(3),
    password: z.string().min(6),
    confirmPassword: z.string().min(6),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

/**
 * LOGIN
 */
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

/**
 * PRODUCT
 */
export const productSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  category: z.string().min(1),

  subcategory: z.string().optional(),
  team: z.string().optional(),

  price: z.coerce.number().min(1),
  oldPrice: z.coerce.number().optional(),

  mainImage: z.string().min(1),

  stock: z.coerce.number().optional(),

  sizes: z.string().min(1),
  galleryImages: z.string().min(1),
});