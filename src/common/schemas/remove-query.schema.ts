import { z } from 'zod'
import is from '@sindresorhus/is'
import { ZodValidationPipe } from 'nestjs-zod'

const preprocessBoolean = (value: unknown) => {
  if (is.string(value)) {
    if (['1', 't', 'T', 'true', 'TRUE', 'True'].includes(value)) {
      return true
    }
  }
  return false
}

export const RemoveQuerySchema = z
  .object({
    permanently: z.preprocess(preprocessBoolean, z.boolean()).default(false),
  })
  .strict()
export type RemoveQuery = z.infer<typeof RemoveQuerySchema>
export const removeQueryPipe = new ZodValidationPipe(RemoveQuerySchema)
