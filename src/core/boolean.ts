import { Field } from '../interfaces/field'
import { AuroraConfig, ORM } from '../types'

export class BooleanField<IsOptional extends boolean = false> implements Field {
  constructor (
    private readonly getConfig: () => AuroraConfig,
  ) {}
  private readonly schema: Record<string, any> = {}
  private readonly validation: Record<string, Function> = {}

  getSchema (orm: ORM) {
    if (orm === ORM.MONGO) {
      return { type: Boolean, required: true, ...this.schema }
    }
    throw new Error('not supported ORM')
  }

  optional (): BooleanField<true> {
    this.schema.required = false
    return this as unknown as BooleanField<true>
  }

  validate (value: any) {
    const required = this.schema.required !== false
    if (value === undefined || value === null) {
      if (required) {
        throw new Error('Field is required')
      }
    }
    if (typeof value !== 'boolean') {
      throw new Error('Expected boolean')
    }
  }

  isTrue(): BooleanField<IsOptional> {
    const config = this.getConfig()
    this.validation.isTrue = config.custom?.boolean?.isTrue?.validate
      ? config.custom.boolean.isTrue.validate
      : (value: boolean) => {
        if (value !== true) {
          if (config.custom?.boolean?.isTrue?.error) {
            throw config.custom.boolean.isTrue.error
          }
          throw new Error('Value must be true')
        }
      }
    this.schema.mustBeTrue = true
    return this as unknown as BooleanField<IsOptional>
  }

  isFalse(): BooleanField<IsOptional> {
    const config = this.getConfig()
    this.validation.isFalse = config.custom?.boolean?.isFalse?.validate
      ? config.custom.boolean.isFalse.validate
      : (value: boolean) => {
        if (value !== false) {
          if (config.custom?.boolean?.isFalse?.error) {
            throw config.custom.boolean.isFalse.error
          }
          throw new Error('Value must be false')
        }
      }
    this.schema.mustBeFalse = true
    return this as unknown as BooleanField<IsOptional>
  }
}
