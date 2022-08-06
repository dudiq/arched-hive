import { errorFactory } from './error-factory'

describe('error-service', () => {
  const { MyErrorClasses } = errorFactory('MyErrorClasses', {
    Test: 'this is test message',
    Second: 'second',
  })

  type MyErrorsInstances = InstanceType<typeof MyErrorClasses[keyof typeof MyErrorClasses]>

  type CheckResult = {
    error: MyErrorsInstances
  }

  it('should create error with origin error', () => {
    const originError = new Error('origin')

    const instance = new MyErrorClasses.Test(originError)

    expect(instance.message).toBe('this is test message | origin')
    expect(instance.error).toBe(originError)
  })

  it('should create error without any error', () => {
    const instance = new MyErrorClasses.Test()

    expect(instance.message).toBe('this is test message')
    expect(instance.error).toBeUndefined()
  })

  it('should check instance type', () => {
    const error = new MyErrorClasses.Test()
    const res: CheckResult = {
      error,
    }
    expect(res.error.message).toBe('this is test message')
  })

  it('should check instanceof for detect errors', () => {
    const error = new MyErrorClasses.Test()

    expect(error instanceof MyErrorClasses.Test).toBeTruthy()
    expect(error instanceof MyErrorClasses.Second).toBeFalsy()
  })
})
