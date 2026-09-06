import { describe, expect, it } from 'vitest'

import {
  parseBoolean,
  parseJsonProps,
  parseNumber,
  readDataset,
} from '../../../../resources/frontend/core/data/island-props.js'

describe('island props', () => {
  it('parses explicit boolean values without truthy coercion', () => {
    expect(parseBoolean('true')).toBe(true)
    expect(parseBoolean('false')).toBe(false)
    expect(() => parseBoolean('yes', 'enabled')).toThrow('enabled must be true or false.')
  })

  it('accepts only finite non-empty numbers', () => {
    expect(parseNumber('12.5')).toBe(12.5)
    expect(() => parseNumber('', 'limit')).toThrow('limit must be a finite number.')
    expect(() => parseNumber('Infinity', 'limit')).toThrow('limit must be a finite number.')
  })

  it('reads only declared dataset properties', () => {
    const result = readDataset(
      { enabled: 'false', ignored: 'value', limit: '25', name: 'orders' },
      { enabled: 'boolean', limit: 'number', missing: 'string', name: 'string' },
    )

    expect(result).toEqual({ enabled: false, limit: 25, name: 'orders' })
  })

  it('rejects unknown dataset types', () => {
    expect(() => readDataset({ value: '{}' }, { value: 'json' })).toThrow(
      'Unsupported dataset type for value: json.',
    )
  })

  it('parses complex props only from a JSON object', () => {
    expect(parseJsonProps('{"filters":["active"],"page":2}')).toEqual({
      filters: ['active'],
      page: 2,
    })
    expect(() => parseJsonProps('["not","props"]')).toThrow(
      'Island props JSON must contain an object.',
    )
    expect(() => parseJsonProps('{broken')).toThrow('Island props must contain valid JSON.')
  })
})
