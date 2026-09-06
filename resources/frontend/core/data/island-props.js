const DATASET_PARSERS = {
  boolean: parseBoolean,
  number: parseNumber,
  string: String,
}

export function parseBoolean(value, name = 'value') {
  if (value === 'true' || value === true) return true
  if (value === 'false' || value === false) return false

  throw new TypeError(`${name} must be true or false.`)
}

export function parseNumber(value, name = 'value') {
  const number = typeof value === 'number' ? value : Number(value)

  if (value === '' || !Number.isFinite(number)) {
    throw new TypeError(`${name} must be a finite number.`)
  }

  return number
}

export function readDataset(dataset, schema) {
  return Object.fromEntries(
    Object.entries(schema)
      .filter(([name]) => Object.hasOwn(dataset, name))
      .map(([name, type]) => [name, parseDatasetValue(dataset[name], type, name)]),
  )
}

export function parseJsonProps(source) {
  let value

  try {
    value = JSON.parse(source)
  } catch (error) {
    throw new TypeError('Island props must contain valid JSON.', { cause: error })
  }

  if (value === null || Array.isArray(value) || typeof value !== 'object') {
    throw new TypeError('Island props JSON must contain an object.')
  }

  return value
}

function parseDatasetValue(value, type, name) {
  const parser = DATASET_PARSERS[type]

  if (!parser) {
    throw new TypeError(`Unsupported dataset type for ${name}: ${type}.`)
  }

  return parser(value, name)
}
