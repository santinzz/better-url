import { z } from 'zod/v4'

export const formSchema = z.object({
  url: z.url('Enter a valid URL'),
  alias: z.string().optional(),
})

export type FormSchema = z.infer<typeof formSchema>