import { Field, ValidationResult } from '../interfaces/field'
import { AuroraConfig, ORM } from '../types'

export class DateField<IsOptional extends boolean = false> implements Field {
  constructor (
    private readonly getConfig: () => AuroraConfig
  ) {}
  private readonly schema: Record<string, any> = {}
  private readonly validation: Record<string, Function> = {}

  getSchema (orm: ORM) {
    if (orm === ORM.MONGO) {
      return { type: Date, required: true, ...this.schema }
    }
    throw new Error('not supported ORM')
  }

  optional (): DateField<true> {
    this.schema.required = false
    return this as unknown as DateField<true>
  }

  validate (value: any): ValidationResult {
    const required = this.schema.required !== false
    if (value === undefined || value === null) {
      if (required) return { value, error: 'Field is required' }
      return { value }
    }
    if (!(value instanceof Date) && typeof value !== 'string') {
      return { value, error: 'Expected date or date string' }
    }
    // Essa parte eu valido se a String é uma data válida (Pensando em compatibilidade com outros ORM`s, talvez seja necessário alterar isso no futuro)
    if (typeof value === 'string') {
      const d = new Date(value)
      if (isNaN(d.getTime())) return { value, error: 'Invalid date string' }
      return { value: d }
    }
    return { value }
  }

  min(minDate: Date | string): DateField<IsOptional> {
    const min = typeof minDate === 'string' ? new Date(minDate) : minDate
    const config = this.getConfig()
    this.validation.min = config.custom?.date?.min?.validate
      ? config.custom.date.min.validate
      : (value: Date) => {
        if (value < min) {
          if (config.custom?.date?.min?.error) {
            throw config.custom.date.min.error
          }
          throw new Error(`Date must be after or equal to ${min.toISOString()}`)
        }
      }
    this.schema.min = min
    return this as unknown as DateField<IsOptional>
  }

  max(maxDate: Date | string): DateField<IsOptional> {
    const max = typeof maxDate === 'string' ? new Date(maxDate) : maxDate
    const config = this.getConfig()
    this.validation.max = config.custom?.date?.max?.validate
      ? config.custom.date.max.validate
      : (value: Date) => {
        if (value > max) {
          if (config.custom?.date?.max?.error) {
            throw config.custom.date.max.error
          }
          throw new Error(`Date must be before or equal to ${max.toISOString()}`)
        }
      }
    this.schema.max = max
    return this as unknown as DateField<IsOptional>
  }

  before(date: Date | string): DateField<IsOptional> {
    const beforeDate = typeof date === 'string' ? new Date(date) : date
    const config = this.getConfig()
    this.validation.before = config.custom?.date?.before?.validate
      ? config.custom.date.before.validate
      : (value: Date) => {
        if (value >= beforeDate) {
          if (config.custom?.date?.before?.error) {
            throw config.custom.date.before.error
          }
          throw new Error(`Date must be before ${beforeDate.toISOString()}`)
        }
      }
    this.schema.before = beforeDate
    return this as unknown as DateField<IsOptional>
  }

  after(date: Date | string): DateField<IsOptional> {
    const afterDate = typeof date === 'string' ? new Date(date) : date
    const config = this.getConfig()
    this.validation.after = config.custom?.date?.after?.validate
      ? config.custom.date.after.validate
      : (value: Date) => {
        if (value <= afterDate) {
          if (config.custom?.date?.after?.error) {
            throw config.custom.date.after.error
          }
          throw new Error(`Date must be after ${afterDate.toISOString()}`)
        }
      }
    this.schema.after = afterDate
    return this as unknown as DateField<IsOptional>
  }

  between(min: Date | string, max: Date | string): DateField<IsOptional> {
    const minDate = typeof min === 'string' ? new Date(min) : min
    const maxDate = typeof max === 'string' ? new Date(max) : max
    const config = this.getConfig()
    this.validation.between = config.custom?.date?.between?.validate
      ? config.custom.date.between.validate
      : (value: Date) => {
        if (value < minDate || value > maxDate) {
          if (config.custom?.date?.between?.error) {
            throw config.custom.date.between.error
          }
          throw new Error(`Date must be between ${minDate.toISOString()} and ${maxDate.toISOString()}`)
        }
      }
    this.schema.between = [minDate, maxDate]
    return this as unknown as DateField<IsOptional>
  }

  iso(): DateField<IsOptional> {
    const config = this.getConfig()
    this.validation.iso = config.custom?.date?.iso?.validate
      ? config.custom.date.iso.validate
      : (value: Date | string) => {
        const str = value instanceof Date ? value.toISOString() : value
        // Regex to ISO 8601
        const isoRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/
        if (!isoRegex.test(str)) {
          if (config.custom?.date?.iso?.error) {
            throw config.custom.date.iso.error
          }
          throw new Error('Date must be in ISO 8601 format')
        }
      }
    this.schema.iso = true
    return this as unknown as DateField<IsOptional>
  }

  // transform(pattern: string) {} // ver se isso faz sentido (pode receber sla 2025-07-01 e transformar para 01/07/2025, o pattern tem q ser DD/MM/AAAA)
}
