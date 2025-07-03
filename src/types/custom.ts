export type Rule = Partial<{
  error: Error
  validate: Function
}>

export type AuroraCustom = Partial<{
  string: Partial<{
    min: Rule
    max: Rule
    length: Rule
    email: Rule
    url: Rule
    uuid: Rule
    regex: Rule
    startsWith: Rule
    endsWith: Rule
    enum: Rule
    trim: Rule
  }>
  number: Partial<{
    min: Rule
    max: Rule
    integer: Rule
    positive: Rule
    negative: Rule
    oneOf: Rule
  }>
  boolean: Partial<{
    isTrue: Rule
    isFalse: Rule
  }>
  object: Partial<{
    strict: Rule
  }>
  date: Partial<{
    min: Rule
    max: Rule
    before: Rule
    after: Rule
    between: Rule
    iso: Rule
  }>
  array: Partial<{
    min: Rule
    max: Rule
    length: Rule
    unique: Rule
    includes: Rule
  }>
}>