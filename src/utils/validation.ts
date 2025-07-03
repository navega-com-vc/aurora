export namespace Validation {
  export function validate(obj: Record<string, Function>, value: any){
    Object.keys(obj).forEach((key) => {
      const validator = obj[key]
      if (typeof validator === 'function') {
        validator(value)
      }
    })
  }

  export function validateLengthParameter(length: number) {
    if (typeof length !== 'number' || length < 0) {
      throw new Error('min must be a positive number')
    }
  }
}