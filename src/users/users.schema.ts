import { createFindManyQuerySchema } from 'src/common/schemas/find-many-query.schema'
import { createIdOnlyParamsSchema } from 'src/common/schemas/id-only-params.schema'
import { z } from 'zod'
import { UserCreateInputSchema, UserUpdateInputSchema } from 'src/generated/prisma/zod'
import { ZodValidationPipe } from 'nestjs-zod'
import { Prisma, User } from 'src/generated/prisma/client'

type UserSortableField = Exclude<Prisma.UserScalarFieldEnum, 'passwordHash' | 'profileImagePath'>
const userSortableFields = Object.values(Prisma.UserScalarFieldEnum).filter(
  (field) => field !== 'passwordHash' && field !== 'profileImagePath',
) as UserSortableField[]

const PasswordSchema = z
  .string()
  .length(64)
  .regex(/^[a-f0-9]+$/)

export const UserParamsSchema = createIdOnlyParamsSchema(['id'])
export type UserParams = z.infer<typeof UserParamsSchema>
export const userParamsPipe = new ZodValidationPipe(UserParamsSchema)

export const UserCreateBodySchema = UserCreateInputSchema.extend({
  password: PasswordSchema,
})
export type UserCreateBody = z.infer<typeof UserCreateBodySchema>
export const userCreateBodyPipe = new ZodValidationPipe(UserCreateInputSchema)

export const UserFindManyQuerySchema = createFindManyQuerySchema(userSortableFields)
export type UserFindManyQuery = z.infer<typeof UserFindManyQuerySchema>
export const userFindManyQueryPipe = new ZodValidationPipe(UserFindManyQuerySchema)

export const UserUpdateBodySchema = UserUpdateInputSchema
export type UserUpdateBody = z.infer<typeof UserUpdateBodySchema>
export const userUpdateBodyPipe = new ZodValidationPipe(UserUpdateInputSchema)

export const UserChangePasswordBodySchema = z
  .object({
    oldPassword: PasswordSchema,
    newPassword: PasswordSchema,
  })
  .strict()
  .refine((data) => data.oldPassword !== data.newPassword, {
    message: 'New password must be different from old password',
  })
export type UserChangePasswordBody = z.infer<typeof UserChangePasswordBodySchema>
export const userChangePasswordBodyPipe = new ZodValidationPipe(UserChangePasswordBodySchema)

export type UserWithoutPassword = Omit<User, 'passwordHash'>
