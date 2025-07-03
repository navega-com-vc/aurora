import { Field, ValidationResult } from '../interfaces/field'
import { AuroraConfig, ORM } from '../types'
import { Validation } from '../utils/validation'

export class IdField<IsOptional extends boolean = false> implements Field {
  constructor(
    private readonly idType: any,
    private readonly reference: string,
    private readonly getConfig: () => AuroraConfig
  ) { }
  private readonly schema: Record<string, any> = {}
  private readonly validation: Record<string, Function> = {}

  getSchema(orm: ORM) {
    if (orm === ORM.MONGO) {
      return { type: this.idType, ref: this.reference, required: true, ...this.schema }
    }
    throw new Error('not supported ORM')
  }

  optional(): IdField<true> {
    this.schema.required = false
    return this as unknown as IdField<true>
  }

  validate(value: any): ValidationResult {
    const required = this.schema.required !== false

    Validation.validate(this.validation, value)

    if (value === undefined || value === null) {
      if (required) return { value, error: 'Field is required' }
      return { value }
    }
    if (typeof value !== 'string') {
      return { value, error: 'Expected string' }
    }
    return { value }
  }

  uuid() {}
  custom(fn: Function) {}
}
