This is package for declare and manipulate errors

how to use:
> declare at the top of your module/service/etc_file
```
  const { MyErrorClasses } = errorFactory('MyErrorClasses', {
    Test: 'this is test message',
    Second: 'second',
  })

  export type MyErrorsInstances = InstanceType<typeof MyErrorClasses[keyof typeof MyErrorClasses]>
```

> then in code all you need is just do this:
```
  import {MyErrorsInstances, MyErrorClasses} from '...'
  type CheckResult = {
    error: MyErrorsInstances
  }

  function someFunction() {
    // do some stuff

    const res: CheckResult = {
      error: new MyErrorClasses.Test()
    }

    return res
  }
```
