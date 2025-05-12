import { Injectable } from '@nestjs/common'
import { Prisma, User } from 'src/generated/prisma/client'
import { PageNumberPaginationMeta, CursorPaginationMeta } from 'prisma-extension-pagination'
import * as argon2 from 'argon2'

import { PrismaService } from 'src/prisma/prisma.service'

type UserWithoutPassword = Omit<User, 'passwordHash'>

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.UserCreateInput): Promise<User> {
    data.passwordHash = await argon2.hash(data.passwordHash)
    return this.prisma.user.create({
      data,
    })
  }

  async findManyWithPage(params: {
    page: number
    limit: number
    where?: Prisma.UserWhereInput
    orderBy?: Prisma.UserOrderByWithRelationInput
  }): Promise<{ items: UserWithoutPassword[] } & PageNumberPaginationMeta<true>> {
    const { page, limit, where, orderBy } = params
    const [items, meta] = await this.prisma.user
      .paginate({
        where,
        orderBy,
        omit: { passwordHash: true },
      })
      .withPages({
        page,
        limit,
      })
    return { items, ...meta }
  }

  async findManyWithCursor(params: {
    cursor?: string
    limit: number
    where?: Prisma.UserWhereInput
    orderBy?: Prisma.UserOrderByWithRelationInput
  }): Promise<{ items: UserWithoutPassword[] } & CursorPaginationMeta> {
    const { cursor, limit, where, orderBy } = params
    const [items, meta] = await this.prisma.user
      .paginate({
        where,
        orderBy,
        omit: { passwordHash: true },
      })
      .withCursor({
        after: cursor,
        limit,
      })
    return { items, ...meta }
  }

  findOne(userWhereUniqueInput: Prisma.UserWhereUniqueInput): Promise<UserWithoutPassword | null> {
    return this.prisma.user.findUnique({
      where: userWhereUniqueInput,
      omit: { passwordHash: true },
    })
  }

  async update(params: {
    where: Prisma.UserWhereUniqueInput
    data: Prisma.UserUpdateInput
  }): Promise<UserWithoutPassword> {
    const { where, data } = params
    if (typeof data.passwordHash === 'string') {
      data.passwordHash = await argon2.hash(data.passwordHash)
    }
    return this.prisma.user.update({
      data,
      where,
      omit: { passwordHash: true },
    })
  }

  remove(where: Prisma.UserWhereUniqueInput): Promise<UserWithoutPassword> {
    return this.prisma.user.delete({
      where,
      omit: { passwordHash: true },
    })
  }
}
