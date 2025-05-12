import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  NotFoundException,
} from '@nestjs/common'
import { UsersService } from './users.service'
import { Prisma } from 'src/generated/prisma/client'
import { ZodValidationPipe } from 'nestjs-zod'
import { UserCreateInputSchema, UserUpdateInputSchema } from 'src/generated/prisma/zod'
import { createFindManyQuerySchema } from 'src/common/schemas/find-many-query.schema'
import { createIdOnlyParamsSchema } from 'src/common/schemas/id-only-params.schema'
import { z } from 'zod'

const FindManyQuerySchema = createFindManyQuerySchema(Object.values(Prisma.UserScalarFieldEnum))
type FindManyQuery = z.infer<typeof FindManyQuerySchema>

const IdOnlyParamsSchema = createIdOnlyParamsSchema(['id'])
type IdOnlyParams = z.infer<typeof IdOnlyParamsSchema>

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body(new ZodValidationPipe(UserCreateInputSchema)) data: Prisma.UserCreateInput) {
    return this.usersService.create(data)
  }

  @Get()
  findMany(@Query(new ZodValidationPipe(FindManyQuerySchema)) query: FindManyQuery) {
    const { page, cursor, limit, sort, order } = query
    const orderBy = sort ? { [sort]: order } : undefined
    if (page) {
      return this.usersService.findManyWithPage({ page, limit, orderBy })
    }
    return this.usersService.findManyWithCursor({ cursor, limit, orderBy })
  }

  @Get(':id')
  async findOne(@Param(new ZodValidationPipe(IdOnlyParamsSchema)) params: IdOnlyParams) {
    const { id } = params
    const item = await this.usersService.findOne({ id })
    if (!item) {
      throw new NotFoundException()
    }
  }

  @Patch(':id')
  async update(
    @Param(new ZodValidationPipe(IdOnlyParamsSchema)) params: IdOnlyParams,
    @Body(new ZodValidationPipe(UserUpdateInputSchema)) data: Prisma.UserUpdateInput,
  ) {
    const { id } = params
    const item = await this.usersService.update({ where: { id }, data })
    if (!item) {
      throw new NotFoundException()
    }
  }

  @Delete(':id')
  async remove(@Param(new ZodValidationPipe(IdOnlyParamsSchema)) params: IdOnlyParams) {
    const { id } = params
    const item = await this.usersService.remove({ id })
    if (!item) {
      throw new NotFoundException()
    }
  }
}
