import { z } from 'zod'

export function createFindManyQuerySchema<T extends string>(fieldNames: T[]) {
  return z
    .object({
      page: z.number().int().positive().optional(),
      cursor: z.string().cuid2().optional(),
      limit: z.number().int().min(1).max(500).default(10),
      // filter: z.string(), // [TODO]
      sort: z.enum(fieldNames as [T, ...T[]]).optional(),
      order: z.enum(['asc', 'desc']).default('asc'),
    })
    .strict()
    .refine((data) => !(data.page && data.cursor), {
      // [FIXME] use `is` package to check if both are present
      message: 'Cannot use both page and cursor at the same time',
    })
}
