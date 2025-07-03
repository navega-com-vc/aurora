import { Field, ValidationResult } from '../interfaces/field'
import { AuroraConfig, ORM } from '../types'

export class UnionField<Fields extends Field[], IsOptional extends boolean = false> implements Field {
  constructor (
    private readonly fields: Fields,
    private readonly getConfig: () => AuroraConfig
  ) {}

  private readonly schema: Record<string, any> = {}

  getSchema (orm: ORM) {
    if (orm === ORM.MONGO) {
      return {
        ...this.fields.map(f => typeof f.getSchema === 'function' ? f.getSchema(orm) : f),
        ...this.schema,
      }
    }
    throw new Error('not supported ORM')
  }

  optional (): UnionField<Fields, true> {
    this.schema.required = false
    return this as unknown as UnionField<Fields, true>
  }

  validate (value: any): ValidationResult {
    for (const field of this.fields) {
      const result = field.validate(value)
      if (!result.error) return { value: result.value }
    }
    return { value, error: 'Value does not match any allowed type' }
  }
}
