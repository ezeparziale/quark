import * as z from "zod"
import "zod-openapi/extend"

import { listQuerySchema } from "./api"

const userId = z
  .number()
  .describe("The unique identifier of the user.")
  .openapi({ example: 1 })

export const userPathParamSchema = z.object({
  userId,
})

export const userSchema = z.object({
  id: userId,
  email: z
    .string()
    .email("Please add a valid email")
    .describe("The user's email address.")
    .openapi({ example: "user@example.com" }),
  username: z
    .string()
    .trim()
    .min(1, "Username must contain at least 1 character")
    .max(255, "Username must contain at most 255 characters")
    .describe("The user's unique username.")
    .openapi({ example: "john_doe" }),
  isActive: z
    .boolean()
    .describe("Indicates if the user is active.")
    .openapi({ example: true }),
  isAdmin: z
    .boolean()
    .describe("Indicates if the user has admin privileges.")
    .openapi({ example: false }),
  emailVerified: z
    .boolean()
    .describe("Indicates if the user's email address has been verified.")
    .openapi({ example: true }),
  image: z
    .string()
    .describe("The URL of the user's avatar image.")
    .openapi({ example: "https://my-domain/user-avatar.png" }),
  createdAt: z
    .date()
    .describe("The date and time when the user was created.")
    .openapi({ example: new Date("2024-05-26T01:36:52.676Z") }),
  updatedAt: z
    .date()
    .describe("The date and time when the user was last updated.")
    .openapi({ example: new Date("2024-07-26T01:36:52.676Z") }),
})

export const userCreateServerActionSchema = userSchema.omit({
  id: true,
  image: true,
  createdAt: true,
  updatedAt: true,
})

export const userEditServerActionSchema = userSchema.omit({
  image: true,
  createdAt: true,
  updatedAt: true,
})

export const userOutputSchema = userSchema

export const userCreateSchema = userSchema
  .omit({
    id: true,
    image: true,
    createdAt: true,
    updatedAt: true,
  })
  .partial({
    isActive: true,
    isAdmin: true,
    emailVerified: true,
  })

export const userUpdateSchema = z.object({
  ...userCreateSchema.shape,
})

export const userUpdatePartialSchema = userUpdateSchema.partial()

export const userListQuerySchema = listQuerySchema.extend({
  isActive: z
    .preprocess((val) => {
      if (typeof val === "string") {
        if (val.toLowerCase() === "true") return true
        if (val.toLowerCase() === "false") return false
      }
      return val
    }, z.boolean())
    .optional()
    .describe("Filter users based on their active status.")
    .openapi({
      param: {
        examples: {
          all: {
            summary: "All",
            description: "Show all users, regardless of their active status.",
            value: null,
          },
          active: {
            summary: "Active",
            description: "Show only users who are currently active.",
            value: true,
          },
          inactive: {
            summary: "Inactive",
            description: "Show only users who are currently inactive.",
            value: false,
          },
        },
      },
    }),
})
