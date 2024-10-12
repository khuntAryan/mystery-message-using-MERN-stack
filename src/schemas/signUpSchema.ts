import { z } from "zod";

export const validateUserNameSchema = z
    .string()
    .min(3)
    .max(20)

export const signUpSchema = z.object({
    username:validateUserNameSchema,
    email:z.string().email(),
    password:z.string().min(6).max(20),
})

