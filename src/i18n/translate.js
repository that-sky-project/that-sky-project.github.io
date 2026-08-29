function lookup(table, key) {
  return key.split('.').reduce((node, part) => {
    if (node && typeof node === 'object' && part in node) return node[part]
    return undefined
  }, table)
}

function interpolate(value, vars) {
  if (typeof value !== 'string' || !vars) return value
  return value.replace(/\{(\w+)\}/g, (match, name) =>
    name in vars ? String(vars[name]) : match
  )
}

// table: active locale strings; fallback: default (en) strings.
export function translate(table, fallback, key, vars) {
  let value = lookup(table, key)

  if (value === undefined) {
    if (import.meta.env?.DEV) console.warn(`[i18n] missing key: ${key}`)
    value = lookup(fallback, key)
  }

  if (value === undefined) return key
  return interpolate(value, vars)
}
