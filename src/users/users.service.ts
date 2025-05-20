import { HttpCode, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common'
import { Prisma } from 'src/generated/prisma/client'
import { PageNumberPaginationMeta, CursorPaginationMeta } from 'prisma-extension-pagination'
import * as argon2 from 'argon2'
import * as R from 'remeda'

import { PrismaService } from 'src/prisma/prisma.service'
import {
  UserChangePasswordBody,
  UserCreateBody,
  UserUpdateBody,
  UserWithoutPassword,
} from 'src/users/users.schema'
import is from '@sindresorhus/is'

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(data: UserCreateBody): Promise<UserWithoutPassword> {
    const passwordHash = await argon2.hash(data.password)
    return this.prisma.user.create({
      data: {
        ...R.omit(data, ['password']),
        passwordHash,
      },
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
    })
  }

  async update(params: {
    where: Prisma.UserWhereUniqueInput
    data: UserUpdateBody
  }): Promise<UserWithoutPassword> {
    const { where, data } = params
    return this.prisma.user.update({
      data,
      where,
    })
  }

  async remove(
    where: Prisma.UserWhereUniqueInput,
    permanently: boolean,
  ): Promise<UserWithoutPassword> {
    const user = await this.prisma.user.findUnique({
      where,
      select: { deletedAt: true },
    })
    if (!is.plainObject(user)) {
      throw new NotFoundException()
    }
    if (permanently) {
      return this.prisma.user.delete({
        where,
      })
    }
    if (is.date(user.deletedAt)) {
      throw new UnauthorizedException('User already deleted')
    }
    return this.prisma.user.update({
      where,
      data: { deletedAt: new Date() },
    })
  }

  async changePassword(params: {
    where: Prisma.UserWhereUniqueInput
    data: UserChangePasswordBody
  }): Promise<void> {
    const { where, data } = params
    const user = await this.prisma.user.findUnique({
      where,
      select: { passwordHash: true },
    })
    if (!is.plainObject(user)) {
      throw new NotFoundException()
    }
    const { passwordHash } = user
    const isPasswordValid = await argon2.verify(passwordHash, data.oldPassword)
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password')
    }
    const newPasswordHash = await argon2.hash(data.newPassword)
    await this.prisma.user.update({
      where,
      data: {
        passwordHash: newPasswordHash,
      },
    })
  }
}
