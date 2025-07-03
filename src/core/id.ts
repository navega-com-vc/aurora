import { Field } from '../interfaces/field'
import { AuroraConfig, ORM } from '../types'
import { Validation } from '../utils/validation'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class IdField<IsOptional extends boolean = false> implements Field {
  constructor(
    private readonly idType: any,
    private readonly reference: string,
    private readonly getConfig: () => AuroraConfig,
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

  validate(value: any) {
    const required = this.schema.required !== false

    Validation.validate(this.validation, value)

    if (value === undefined || value === null) {
      if (required) {
        throw new Error('Field is required')
      }
    }
    if (typeof value !== this.idType) {
      throw new Error(`Expected ${this.idType}`)
    }
  }

  uuid() { }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  custom(fn: Function) { }
}
