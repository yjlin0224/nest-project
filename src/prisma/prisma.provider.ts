import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common'
import { PrismaClient } from 'src/generated/prisma/client'
import { existsExtension, softDeleteExtension, paginationExtension } from './prisma.extensions'

@Injectable()
export class PrismaProvider extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private static initialized = false

  constructor() {
    super({
      omit: {
        user: {
          passwordHash: true,
        },
      },
    })
  }

  async onModuleInit() {
    if (!PrismaProvider.initialized) {
      PrismaProvider.initialized = true
      await this.$connect()
    }
  }

  async onModuleDestroy() {
    if (PrismaProvider.initialized) {
      PrismaProvider.initialized = false
      await this.$disconnect()
    }
  }

  withExtensions() {
    return this.$extends(existsExtension)
      .$extends(softDeleteExtension)
      .$extends(paginationExtension)
  }
}
