import { Field } from '../interfaces/field'
import { AuroraConfig, InferSchema, ORM } from '../types'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class ObjectField<T extends Record<string, Field>, IsOptional extends boolean = false> implements Field {
  constructor (
    readonly obj: T,
    private readonly getConfig: () => AuroraConfig,
  ) {}

  private readonly schema: Record<string, any> = {}

  getSchema (orm: ORM) {
    for (const [key, value] of Object.entries(this.obj)) {
      this.schema[key] = typeof value.getSchema === 'function' ? value.getSchema(orm) : value
    }
    return { ...this.schema }
  }

  getType (): InferSchema<T> {
    return null as any
  }

  optional (): ObjectField<T, true> {
    this.schema.required = false
    return this as unknown as ObjectField<T, true>
  }

  validate(value: any) {
    if (value === undefined || value === null) {
      if (this.schema.required !== false) {
        throw new Error('Field is required')
      }
    }
    if (typeof value !== 'object' || Array.isArray(value)) {
      throw new Error('Expected object')
    }
    for (const [key, field] of Object.entries(this.obj)) {
      field.validate(value[key])
    }
  }

  strict() {} // não aceita campos extras
}
