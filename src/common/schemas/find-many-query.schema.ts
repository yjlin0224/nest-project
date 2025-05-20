import { z } from 'zod'
import is from '@sindresorhus/is'

export function createFindManyQuerySchema<T extends string>(fieldNames: T[]) {
  const preprocessNumber = (value: unknown) => {
    if (is.numericString(value)) {
      const parsed = Number.parseInt(value, 10)
      if (Number.isSafeInteger(parsed)) {
        return parsed
      }
    }
    return value
  }
  return z
    .object({
      page: z.preprocess(preprocessNumber, z.number().int().positive()).optional(),
      cursor: z.string().cuid2().optional(),
      limit: z.preprocess(preprocessNumber, z.number().int().min(1).max(500)).default(10),
      // filter: z.string(), // [TODO]
      sort: z.enum(fieldNames as [T, ...T[]]).optional(),
      order: z.enum(['asc', 'desc']).default('asc'),
    })
    .strict()
    .refine((data) => !(is.number(data.page) && is.string(data.cursor)), {
      message: 'Cannot use both page and cursor at the same time',
    })
}
