import * as z from "zod"

export enum ActivityType {
  SIGN_IN = "SIGN_IN",
  SIGN_OUT = "SIGN_OUT",
  SIGN_UP = "SIGN_UP",
  DELETE_ACCOUNT = "DELETE_ACCOUNT",
  DELETE_USER = "DELETE_USER",
  RESET_PASSWORD = "RESET_PASSWORD",
  SET_TEMPORARY_PASSWORD = "SET_TEMPORARY_PASSWORD",
  REMOVE_ROLE = "REMOVE_ROLE",
  REQUEST_CHANGE_EMAIL = "REQUEST_CHANGE_EMAIL",
  ADD_TOOL_FAVORITE = "ADD_TOOL_FAVORITE",
  REMOVE_TOOL_FAVORITE = "REMOVE_TOOL_FAVORITE",
  UPDATE_USER = "UPDATE_USER",
  UPDATE_USERNAME = "UPDATE_USERNAME",
  SEND_FEEDBACK = "SEND_FEEDBACK",
  CREATE_USER = "CREATE_USER",
  ADD_ROLE = "ADD_ROLE",
  UPDATE_USER_METADATA = "UPDATE_USER_METADATA",
  UPDATE_USER_PROFILE = "UPDATE_USER_PROFILE",
}

export const activityLogSchema = z.object({
  id: z.number().int(),
  userId: z.number().int(),
  action: z.nativeEnum(ActivityType),
  createdAt: z.date(),
})
