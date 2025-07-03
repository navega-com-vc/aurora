import { Field, ValidationResult } from '../interfaces/field'
import { AuroraConfig, ORM } from '../types'
import { Validation } from '../utils/validation'

export class NumberField<IsOptional extends boolean = false> implements Field {
  constructor (
    private readonly getConfig: () => AuroraConfig
  ) {}
  private readonly schema: Record<string, any> = {}
  private readonly validation: Record<string, Function> = {}

  public required: boolean = true
  getSchema (orm: ORM) {
    if (orm === ORM.MONGO) {
      return { type: Number, required: true, ...this.schema }
    }
    throw new Error('not supported ORM')
  }

  optional (): NumberField<true> {
    this.schema.required = false
    return this as unknown as NumberField<true>
  }

  validate (value: any): ValidationResult {
    const required = this.schema.required !== false
    if (value === undefined || value === null) {
      if (required) return { value, error: 'Field is required' }
      return { value }
    }
    if (typeof value !== 'number') {
      return { value, error: 'Expected number' }
    }

    Validation.validate(this.validation, value)

    return { value }
  }

  min(minValue: number): NumberField<IsOptional> {
    Validation.validateLengthParameter(minValue)
    const config = this.getConfig()
    this.validation.min = config.custom?.number?.min?.validate
      ? config.custom.number.min.validate
      : (value: number) => {
        if (value < minValue) {
          if (config.custom?.number?.min?.error) {
            throw config.custom.number.min.error
          }
          throw new Error(`Value must be greater than or equal to ${minValue}`)
        }
      }
    this.schema.min = minValue
    return this as unknown as NumberField<IsOptional>
  }

  max(maxValue: number): NumberField<IsOptional> {
    Validation.validateLengthParameter(maxValue)
    const config = this.getConfig()
    this.validation.max = config.custom?.number?.max?.validate
      ? config.custom.number.max.validate
      : (value: number) => {
        if (value > maxValue) {
          if (config.custom?.number?.max?.error) {
            throw config.custom.number.max.error
          }
          throw new Error(`Value must be less than or equal to ${maxValue}`)
        }
      }
    this.schema.max = maxValue
    return this as unknown as NumberField<IsOptional>
  }

  integer(): NumberField<IsOptional> {
    const config = this.getConfig()
    this.validation.integer = config.custom?.number?.integer?.validate
      ? config.custom.number.integer.validate
      : (value: number) => {
        if (!Number.isInteger(value)) {
          if (config.custom?.number?.integer?.error) {
            throw config.custom.number.integer.error
          }
          throw new Error('Value must be an integer')
        }
      }
    this.schema.integer = true
    return this as unknown as NumberField<IsOptional>
  }

  positive(): NumberField<IsOptional> {
    const config = this.getConfig()
    this.validation.positive = config.custom?.number?.positive?.validate
      ? config.custom.number.positive.validate
      : (value: number) => {
        if (value < 0) {
          if (config.custom?.number?.positive?.error) {
            throw config.custom.number.positive.error
          }
          throw new Error('Value must be positive')
        }
      }
    this.schema.positive = true
    return this as unknown as NumberField<IsOptional>
  }

  negative(): NumberField<IsOptional> {
    const config = this.getConfig()
    this.validation.negative = config.custom?.number?.negative?.validate
      ? config.custom.number.negative.validate
      : (value: number) => {
        if (value >= 0) {
          if (config.custom?.number?.negative?.error) {
            throw config.custom.number.negative.error
          }
          throw new Error('Value must be negative')
        }
      }
    this.schema.negative = true
    return this as unknown as NumberField<IsOptional>
  }

  oneOf(values: Array<number>): NumberField<IsOptional> {
    const config = this.getConfig()
    this.validation.oneOf = config.custom?.number?.oneOf?.validate
      ? config.custom.number.oneOf.validate
      : (value: number) => {
        if (!values.includes(value)) {
          if (config.custom?.number?.oneOf?.error) {
            throw config.custom.number.oneOf.error
          }
          throw new Error(`Value must be one of: ${values.join(', ')}`)
        }
      }
    this.schema.oneOf = values
    return this as unknown as NumberField<IsOptional>
  }
}
