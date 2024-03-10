import {useMemo} from 'react';

import {getInstances} from '@repo/service';

export function useInject<T>(...args: Parameters<typeof getInstances<T>>): ReturnType<typeof getInstances<T>> {
  return useMemo(() => {
    return getInstances<T>(...args)
  }, [])
}
