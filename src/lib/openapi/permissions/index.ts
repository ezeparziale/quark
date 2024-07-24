import { ZodOpenApiPathsObject } from "zod-openapi"

import { createPermission } from "./create-permission"
import { deletePermission } from "./delete-permission"
import { listPermissions } from "./list-permissions"
import { readPermission } from "./read-permission"
import { updatePartialPermission, updatePermission } from "./update-permission"

export const permissionsPaths: ZodOpenApiPathsObject = {
  "/api/v1/permissions": {
    get: listPermissions,
    post: createPermission,
  },
  "/api/v1/permissions/{permissionId}": {
    get: readPermission,
    delete: deletePermission,
    patch: updatePartialPermission,
    put: updatePermission,
  },
}
