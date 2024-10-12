import { z } from "zod"

export const messageSchema = z.object({
    content: z
    .string()
    .min(20)
    .max(100)
})

