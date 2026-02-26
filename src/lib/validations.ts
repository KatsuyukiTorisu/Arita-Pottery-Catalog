import { z } from 'zod';

export const signupSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(7, 'Phone number is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  age: z.number().int().min(1).max(120).optional(),
  gender: z.string().optional(),
  address: z.string().optional(),
  occupation: z.string().optional(),
});

export const loginSchema = z.object({
  phone: z.string().min(1, 'Phone is required'),
  password: z.string().min(1, 'Password is required'),
});

export const productSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  description: z.string().optional(),
  images: z.array(z.string().url()).optional().default([]),
  price: z.number().positive().optional(),
  category: z.string().optional(),
  tags: z.array(z.string()).optional().default([]),
  isPublished: z.boolean().optional().default(false),
  visibilityMode: z.enum(['PUBLIC', 'MEMBERS_ONLY', 'WHITELIST']).optional().default('PUBLIC'),
});

export const companySchema = z.object({
  name: z.string().min(1, 'Company name is required'),
  description: z.string().optional(),
  location: z.string().optional(),
  images: z.array(z.string().url()).optional().default([]),
});

export const accountUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  age: z.number().int().min(1).max(120).optional(),
  gender: z.string().optional(),
  address: z.string().optional(),
  occupation: z.string().optional(),
});

export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ProductInput = z.infer<typeof productSchema>;
export type CompanyInput = z.infer<typeof companySchema>;
export type AccountUpdateInput = z.infer<typeof accountUpdateSchema>;
