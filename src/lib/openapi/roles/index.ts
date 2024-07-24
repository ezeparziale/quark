import { ZodOpenApiPathsObject } from "zod-openapi"

import { createRole } from "./create-role"
import { deleteRole } from "./delete-role"
import { listRoles } from "./list-roles"
import { readRole } from "./read-role"
import { updatePartialRole, updateRole } from "./update-role"

export const rolesPaths: ZodOpenApiPathsObject = {
  "/api/v1/roles": {
    get: listRoles,
    post: createRole,
  },
  "/api/v1/roles/{roleId}": {
    get: readRole,
    delete: deleteRole,
    patch: updatePartialRole,
    put: updateRole,
  },
}
