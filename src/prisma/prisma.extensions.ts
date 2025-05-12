import { Prisma } from '@prisma/client'
import assert from 'node:assert'
import { pagination as createPaginationExtension } from 'prisma-extension-pagination'
import { createSoftDeleteExtension } from 'prisma-extension-soft-delete'

export const existsExtension = Prisma.defineExtension({
  name: 'exists',
  model: {
    $allModels: {
      async exists<T>(this: T, where: Prisma.Args<T, 'count'>['where']): Promise<boolean> {
        const context = Prisma.getExtensionContext(this)
        assert('count' in context)
        assert(typeof context.count === 'function')
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        const count = (await context.count({ where, take: 1 })) as number
        return count > 0
      },
    },
  },
})

export const softDeleteExtension = createSoftDeleteExtension({
  models: {
    User: true,
  },
  defaultConfig: {
    field: 'deletedAt',
    createValue(deleted: boolean) {
      return deleted ? new Date() : null
    },
  },
})

export const paginationExtension = createPaginationExtension({
  pages: {
    limit: 10,
    includePageCount: true,
  },
  cursor: {
    limit: 10,
    getCursor: (item: { id: string }) => item.id,
  },
})
