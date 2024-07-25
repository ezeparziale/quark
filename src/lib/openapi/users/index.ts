import { ZodOpenApiPathsObject } from "zod-openapi"

import { createUser } from "./create-user"
import { deleteUser } from "./delete-user"
import { listUsers } from "./list-users"
import { readUser } from "./read-user"
import { updatePartialUser, updateUser } from "./update-user"

export const usersPaths: ZodOpenApiPathsObject = {
  "/api/v1/users": {
    get: listUsers,
    post: createUser,
  },
  "/api/v1/users/{userId}": {
    get: readUser,
    delete: deleteUser,
    patch: updatePartialUser,
    put: updateUser,
  },
}
