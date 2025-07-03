/* global URL */
import { Field } from '../interfaces/field'
import { AuroraConfig, ORM } from '../types'
import { Validation } from '../utils/validation'

export class StringField<IsOptional extends boolean = false> implements Field {
  constructor(
    private readonly getConfig: () => AuroraConfig,
  ) { }
  private readonly schema: Record<string, any> = {}
  private readonly validation: Record<string, Function> = {}

  getSchema(orm: ORM) {
    if (orm === ORM.MONGO) {
      return { type: String, required: true, ...this.schema }
    }
    throw new Error('not supported ORM')
  }

  optional(): StringField<true> {
    this.schema.required = false
    return this as unknown as StringField<true>
  }

  validate(value: any) {
    const required = this.schema.required !== false
    if (value === undefined || value === null) {
      if (required) {
        throw new Error('Field is required')
      }
      return
    }
    if (typeof value !== 'string') {
      throw new Error('Expected string')
    }
    Validation.validate(this.validation, value)
  }

  min(length: number): StringField<IsOptional> {
    Validation.validateLengthParameter(length)
    const config = this.getConfig()
    
    this.validation.min = config.custom?.string?.min?.validate
      ? config.custom?.string?.min?.validate
      : (string: string) => {
        if (string.length < length) {
          if (config.custom?.string?.min?.error) {
            throw config.custom?.string.min.error
          }

          throw new Error(`the sentence "${string}" must be greater than ${length} characters`)
        }
      }
    this.schema.minLength = length
    return this as unknown as StringField<IsOptional>
  }

  max(length: number): StringField<IsOptional> {
    Validation.validateLengthParameter(length)
    const config = this.getConfig()
    this.validation.max = config.custom?.string?.max?.validate
      ? config.custom.string.max.validate
      : (string: string) => {
        if (string.length > length) {
          if (config.custom?.string?.max?.error) {
            throw config.custom.string.max.error
          }
          throw new Error(`the sentence "${string}" must be less than or equal to ${length} characters`)
        }
      }
    this.schema.maxLength = length
    return this as unknown as StringField<IsOptional>
  }

  length(length: number): StringField<IsOptional> {
    Validation.validateLengthParameter(length)
    const config = this.getConfig()
    this.validation.length = config.custom?.string?.length?.validate
      ? config.custom.string.length.validate
      : (string: string) => {
        if (string.length !== length) {
          if (config.custom?.string?.length?.error) {
            throw config.custom.string.length.error
          }
          throw new Error(`the sentence "${string}" must have exactly ${length} characters`)
        }
      }
    this.schema.length = length
    return this as unknown as StringField<IsOptional>
  }

  email(): StringField<IsOptional> {
    const config = this.getConfig()
    this.validation.email = config.custom?.string?.email?.validate
      ? config.custom.string.email.validate
      : (string: string) => {
        const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/
        if (!emailRegex.test(string)) {
          if (config.custom?.string?.email?.error) {
            throw config.custom.string.email.error
          }
          throw new Error('Invalid email format')
        }
      }
    this.schema.email = true
    return this as unknown as StringField<IsOptional>
  }

  url(): StringField<IsOptional> {
    const config = this.getConfig()
    this.validation.url = config.custom?.string?.url?.validate
      ? config.custom.string.url.validate
      : (string: string) => {
        try {
          new URL(string)
        } catch {
          if (config.custom?.string?.url?.error) {
            throw config.custom.string.url.error
          }
          throw new Error('Invalid URL format')
        }
      }
    this.schema.url = true
    return this as unknown as StringField<IsOptional>
  }

  uuid(): StringField<IsOptional> {
    const config = this.getConfig()
    this.validation.uuid = config.custom?.string?.uuid?.validate
      ? config.custom.string.uuid.validate
      : (string: string) => {
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
        if (!uuidRegex.test(string)) {
          if (config.custom?.string?.uuid?.error) {
            throw config.custom.string.uuid.error
          }
          throw new Error('Invalid UUID format')
        }
      }
    this.schema.uuid = true
    return this as unknown as StringField<IsOptional>
  }

  regex(pattern: RegExp): StringField<IsOptional> {
    const config = this.getConfig()
    this.validation.regex = config.custom?.string?.regex?.validate
      ? config.custom.string.regex.validate
      : (string: string) => {
        if (!pattern.test(string)) {
          if (config.custom?.string?.regex?.error) {
            throw config.custom.string.regex.error
          }
          throw new Error(`String does not match the required pattern ${pattern}`)
        }
      }
    this.schema.regex = pattern
    return this as unknown as StringField<IsOptional>
  }

  startsWith(prefix: string): StringField<IsOptional> {
    const config = this.getConfig()
    this.validation.startsWith = config.custom?.string?.startsWith?.validate
      ? config.custom.string.startsWith.validate
      : (string: string) => {
        if (!string.startsWith(prefix)) {
          if (config.custom?.string?.startsWith?.error) {
            throw config.custom.string.startsWith.error
          }
          throw new Error(`String must start with "${prefix}"`)
        }
      }
    this.schema.startsWith = prefix
    return this as unknown as StringField<IsOptional>
  }

  endsWith(suffix: string): StringField<IsOptional> {
    const config = this.getConfig()
    this.validation.endsWith = config.custom?.string?.endsWith?.validate
      ? config.custom.string.endsWith.validate
      : (string: string) => {
        if (!string.endsWith(suffix)) {
          if (config.custom?.string?.endsWith?.error) {
            throw config.custom.string.endsWith.error
          }
          throw new Error(`String must end with "${suffix}"`)
        }
      }
    this.schema.endsWith = suffix
    return this as unknown as StringField<IsOptional>
  }

  enum(value: object): StringField<IsOptional> {
    const config = this.getConfig()
    this.validation.enum = config.custom?.string?.enum?.validate
      ? config.custom.string.enum.validate
      : (string: string) => {
        const values = Object.values(value)
        if (!values.includes(string)) {
          if (config.custom?.string?.enum?.error) {
            throw config.custom.string.enum.error
          }
          throw new Error(`String must be one of: ${values.join(', ')}`)
        }
      }
    this.schema.enum = value
    return this as unknown as StringField<IsOptional>
  }

  trim(): StringField<IsOptional> {
    const config = this.getConfig()
    this.validation.trim = config.custom?.string?.trim?.validate
      ? config.custom.string.trim.validate
      : (string: string) => {
        if (string.trim() !== string) {
          if (config.custom?.string?.trim?.error) {
            throw config.custom.string.trim.error
          }
          throw new Error('String must not have leading or trailing whitespace')
        }
      }
    this.schema.trim = true
    return this as unknown as StringField<IsOptional>
  }
}
