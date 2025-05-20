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
  HttpCode,
} from '@nestjs/common'
import { UsersService } from './users.service'
import {
  UserFindManyQuery,
  userFindManyQueryPipe,
  userCreateBodyPipe,
  userUpdateBodyPipe,
  UserCreateBody,
  UserUpdateBody,
  userParamsPipe,
  UserParams,
  userChangePasswordBodyPipe,
  UserChangePasswordBody,
} from 'src/users/users.schema'
import is from '@sindresorhus/is'
import { RemoveQuery, removeQueryPipe } from 'src/common/schemas/remove-query.schema'

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @HttpCode(201)
  async create(@Body(userCreateBodyPipe) data: UserCreateBody) {
    return this.usersService.create(data)
  }

  @Get()
  @HttpCode(200)
  async findMany(@Query(userFindManyQueryPipe) query: UserFindManyQuery) {
    const { page, cursor, limit, sort, order } = query
    const orderBy = sort ? { [sort]: order } : undefined
    if (is.number(page)) {
      return this.usersService.findManyWithPage({ page, limit, orderBy })
    }
    return this.usersService.findManyWithCursor({ cursor, limit, orderBy })
  }

  @Get(':id')
  @HttpCode(200)
  async findOne(@Param(userParamsPipe) params: UserParams) {
    const { id } = params
    return this.usersService.findOne({ id })
  }

  @Patch(':id')
  @HttpCode(200)
  async update(
    @Param(userParamsPipe) params: UserParams,
    @Body(userUpdateBodyPipe) data: UserUpdateBody,
  ) {
    const { id } = params
    return this.usersService.update({ where: { id }, data })
  }

  @Delete(':id')
  @HttpCode(200)
  async remove(
    @Param(userParamsPipe) params: UserParams,
    @Query(removeQueryPipe) query: RemoveQuery,
  ) {
    console.log(query.permanently)
    const { id } = params
    return this.usersService.remove({ id }, query.permanently)
  }

  @Post(':id/change-password')
  @HttpCode(204)
  async changePassword(
    @Param(userParamsPipe) params: UserParams,
    @Body(userChangePasswordBodyPipe) data: UserChangePasswordBody,
  ) {
    const { id } = params
    return this.usersService.changePassword({ where: { id }, data })
  }
}
