export class AuroraError extends Error {
  constructor (
    readonly message: string,
  ) {
    super(message)
  }
}
