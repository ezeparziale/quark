import z from "@/lib/zod"

export enum ActivityType {
  SIGN_IN = "SIGN_IN",
  SIGN_OUT = "SIGN_OUT",
  SIGN_UP = "SIGN_UP",
}

export const activityLogSchema = z.object({
  id: z.number().int(),
  userId: z.number().int(),
  action: z.nativeEnum(ActivityType),
  createdAt: z.date(),
})
