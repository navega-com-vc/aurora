import { ArrayField, BooleanField, DateField, IdField, NumberField, ObjectField, StringField, TypeField } from '../core'
import { Field } from '../interfaces/field'
import { InferSchema } from '../types'
import { AuroraConfig } from '../types/config'

export class Aurora<T extends Record<string, Field> = {}> {
  private readonly schema: { [key: string]: any } = {}

  constructor(
    private readonly instanceConfig?: AuroraConfig,
  ) { }

  static config: AuroraConfig = {}

  static setConfig(config: AuroraConfig) {
    Aurora.config = config
  }

  private getError(): AuroraConfig {
    const merged: AuroraConfig = { ...Aurora.config }
    const keys = ['string', 'number', 'boolean', 'date', 'array', 'object'] as const

    const rulesMap: Record<string, string[]> = {
      string: ['min'],
      number: ['min', 'max', 'integer', 'positive', 'negative', 'oneOf'],
      boolean: ['isTrue', 'isFalse'],
      object: ['strict'],
      date: ['min', 'max', 'before', 'after', 'between', 'iso'],
      array: ['min', 'max', 'length', 'unique', 'includes'],
    }

    for (const key of keys) {
      const globalObj = Aurora.config.custom?.[key] as Record<string, any> || {}
      const instanceObj = this.instanceConfig?.custom?.[key] as Record<string, any> || {}
      const rules = rulesMap[key] || []

      const mergedRules: Record<string, any> = { ...globalObj }
      for (const rule of rules) {
        mergedRules[rule] = {
          ...(globalObj?.[rule] || {}),
          ...(instanceObj?.[rule] || {}),
        }
      }
      if (!merged.custom) merged.custom = {}
      merged.custom[key] = mergedRules
    }
    return merged
  }

  string(): StringField {
    return new StringField(() => this.getError())
  }

  number(): NumberField {
    return new NumberField(() => this.getError())
  }

  boolean(): BooleanField {
    return new BooleanField(() => this.getError())
  }

  date(): DateField {
    return new DateField(() => this.getError())
  }

  id(idType: any, reference: string): IdField {
    return new IdField(idType, reference, () => this.getError())
  }

  array<Arr extends Array<Field>>(arr: Arr): ArrayField<Arr> {
    return new ArrayField(arr, () => this.getError())
  }

  object<Obj extends Record<string, Field>>(obj: Obj): ObjectField<Obj> {
    return new ObjectField<Obj>(obj, () => this.getError())
  }

  type(): TypeField {
    return new TypeField(() => this.getError())
  }

  getSchema() {
    return this.schema
  }

  getType(): InferSchema<T> {
    return null as any
  }
  // TODO: add this in Field Classes
  // .when(otherField: string, options: { is: any, then: Field, otherwise: Field }) // condition
}
