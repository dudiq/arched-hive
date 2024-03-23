import {errorFactory} from "@repo/errors";

export const {AdapterErrors} = errorFactory('AdapterErrors', {
  UnexpectedError: 'Unexpected error type',
})

export type AdapterErrorsInstances = InstanceType<
  typeof AdapterErrors[keyof typeof AdapterErrors]
>
