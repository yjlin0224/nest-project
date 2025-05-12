import { z } from 'zod'

export function createIdOnlyParamsSchema<T extends string>(paramNames: T[]) {
  return z
    .object(
      paramNames.reduce(
        (result, paramName) => {
          result[paramName] = z.string().cuid2()
          return result
        },
        {} as Record<T, z.ZodString>,
      ),
    )
    .strict()
}
