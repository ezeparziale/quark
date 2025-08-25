import { ZodOpenApiPathsObject } from "zod-openapi"

import { createToken } from "./create-token"
import { deleteToken } from "./delete-token"
import { listTokens } from "./list-tokens"
import { readToken } from "./read-token"
import { updatePartialToken, updateToken } from "./update-token"

export const tokensPaths: ZodOpenApiPathsObject = {
  "/api/v1/tokens": {
    get: listTokens,
    post: createToken,
  },
  "/api/v1/tokens/{tokenId}": {
    delete: deleteToken,
    get: readToken,
    patch: updatePartialToken,
    put: updateToken,
  },
}
