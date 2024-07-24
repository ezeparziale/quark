import type { ZodSchema } from "zod"

type ZodSchemaFields = { [K: string]: ZodSchemaFields | true }
type DirtyZodSchemaFields = { [K: string]: DirtyZodSchemaFields }

const _proxyHandler = {
  get(fields: DirtyZodSchemaFields, key: string | symbol) {
    if (key === "then" || typeof key !== "string") {
      return
    }
    if (!fields[key]) {
      fields[key] = new Proxy({}, _proxyHandler)
    }
    return fields[key]
  },
}

function _clean(fields: DirtyZodSchemaFields) {
  const cleaned: ZodSchemaFields = {}
  Object.keys(fields).forEach((k) => {
    const val = fields[k]
    cleaned[k] = Object.keys(val).length ? _clean(val) : true
  })
  return cleaned
}

export function getZodSchemaFields(schema: ZodSchema): ZodSchemaFields {
  const fields = {}
  schema.safeParse(new Proxy(fields, _proxyHandler))
  return _clean(fields)
}
