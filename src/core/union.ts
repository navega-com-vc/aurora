import { Field } from '../interfaces/field'
import { AuroraConfig, ORM } from '../types'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class UnionField<Fields extends Field[], IsOptional extends boolean = false> implements Field {
  constructor (
    private readonly fields: Fields,
    private readonly getConfig: () => AuroraConfig,
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

  validate(value: any) {
    const required = this.schema.required !== false
    if (value === undefined || value === null) {
      if (required) {
        throw new Error('Field is required')
      }
      return
    }

    for (const field of this.fields) {
      field.validate(value)
    }
  }
}
