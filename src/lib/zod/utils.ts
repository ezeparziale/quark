import type { ZodObject } from "zod"

type ZodSchemaFields = { [K: string]: ZodSchemaFields | true }
type DirtyZodSchemaFields = { [K: string]: DirtyZodSchemaFields | symbol }

const PRIMITIVE = Symbol("primitive")

const _proxyHandler = {
  get(fields: DirtyZodSchemaFields, key: string | symbol) {
    if (key === "then" || typeof key !== "string") {
      return
    }
    if (!fields[key]) {
      fields[key] = PRIMITIVE
    }
    return fields[key] === PRIMITIVE ? {} : new Proxy({}, _proxyHandler)
  },
}

function _clean(fields: DirtyZodSchemaFields) {
  const cleaned: ZodSchemaFields = {}
  Object.keys(fields).forEach((k) => {
    const val = fields[k]
    cleaned[k] = val === PRIMITIVE ? true : _clean(val as DirtyZodSchemaFields)
  })
  return cleaned
}

export function getZodSchemaFields(schema: ZodObject): ZodSchemaFields {
  const fields = {}
  schema.safeParse(new Proxy(fields, _proxyHandler))
  return _clean(fields)
}
