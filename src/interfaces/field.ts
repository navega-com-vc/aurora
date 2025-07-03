import { ORM } from "../types"

export interface ValidationResult {
  value: any
  error?: string
}

export interface Field {
  getSchema(orm: ORM): any
  validate(value: any): ValidationResult
}
