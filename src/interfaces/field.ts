import { ORM } from '../types'

export interface Field {
  getSchema(orm: ORM): any
  validate(value: any): void
}
