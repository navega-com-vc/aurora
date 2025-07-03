import { Field, ValidationResult } from '../interfaces/field'
import { AuroraConfig, InferSchema, ORM } from '../types'
import { Validation } from '../utils/validation'

export class ArrayField<
  T extends Array<Field>,
  IsOptional extends boolean = false
> implements Field {
  constructor(
    private readonly arr: T,
    private readonly getConfig: () => AuroraConfig
  ) { }

  private readonly schema: Array<Field> = []
  private readonly validation: Record<string, Function> = {}
  private required: boolean = true

  getSchema(orm: ORM) {
    const items = this.arr.map(item =>
      typeof item.getSchema === 'function' ? item.getSchema(orm) : item
    )
    return { type: [items[0]], required: this.required }
  }

  getType(): InferSchema<T> {
    return null as any
  }

  optional(): ArrayField<T, true> {
    this.required = false
    return this as unknown as ArrayField<T, true>
  }

  validate(value: any): ValidationResult {
    if (value === undefined || value === null) {
      if (this.required === true) return { value, error: 'Field is required' }
      return { value }
    }
    if (!Array.isArray(value)) {
      return { value, error: 'Expected array' }
    }

    Validation.validate(this.validation, value)

    const errors: Record<number, string> = {}
    const validated: any[] = []
    for (let i = 0; i < this.arr.length; i++) {
      const field = this.arr[i]
      const result =
        typeof field.validate === 'function'
          ? field.validate(value[i])
          : { value: value[i] }
      validated[i] = result.value
      if (result.error) errors[i] = result.error
    }
    if (Object.keys(errors).length > 0) {
      return { value: validated, error: JSON.stringify(errors) }
    }
    return { value: validated }
  }

  min(length: number) {
    Validation.validateLengthParameter(length)
    const config = this.getConfig()
    this.validation.min = config.custom?.array?.min?.validate
      ? config.custom.array.min.validate
      : (arr: Array<any>) => {
        if (arr.length < length) {
          if (config.custom?.array?.min?.error) {
            throw config.custom.array.min.error
          }
          throw new Error(`the array "${arr.toString()}" must be greater than ${length} items`)
        }
      }
  }

  max(length: number) {
    Validation.validateLengthParameter(length)
    const config = this.getConfig()
    this.validation.max = config.custom?.array?.max?.validate
      ? config.custom.array.max.validate
      : (arr: Array<any>) => {
        if (arr.length > length) {
          if (config.custom?.array?.max?.error) {
            throw config.custom.array.max.error
          }
          throw new Error(`the array "${arr.toString()}" must be less than or equal to ${length} items`)
        }
      }
  }

  length(length: number) {
    Validation.validateLengthParameter(length)
    const config = this.getConfig()
    this.validation.length = config.custom?.array?.length?.validate
      ? config.custom.array.length.validate
      : (arr: Array<any>) => {
        if (arr.length !== length) {
          if (config.custom?.array?.length?.error) {
            throw config.custom.array.length.error
          }
          throw new Error(`the array "${arr.toString()}" must have exactly ${length} items`)
        }
      }
  }

  unique() {
    const config = this.getConfig()
    this.validation.unique = config.custom?.array?.unique?.validate
      ? config.custom.array.unique.validate
      : (arr: Array<any>) => {
        const set = new Set(arr)
        if (set.size !== arr.length) {
          if (config.custom?.array?.unique?.error) {
            throw config.custom.array.unique.error
          }
          throw new Error('the array must have only unique items')
        }
      }
  }

  includes(value: any) {
    const config = this.getConfig()
    this.validation.includes = config.custom?.array?.includes?.validate
      ? config.custom.array.includes.validate
      : (arr: Array<any>) => {
        if (!arr.includes(value)) {
          if (config.custom?.array?.includes?.error) {
            throw config.custom.array.includes.error
          }
          throw new Error(`the array must include value: ${value}`)
        }
      }
  }
}
