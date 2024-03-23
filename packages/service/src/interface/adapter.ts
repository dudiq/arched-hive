import { resultErr} from '@repo/result';

import {AdapterErrors} from "../core/adapter.errors";

import type {DomainError, ErrorConstructable} from '@repo/errors';
import type { Result } from '@repo/result';

type Options = {
  Error?: ErrorConstructable<DomainError>
}

type Handle<A> = (...args: any[]) => Promise<Result<A, DomainError>>


export function Adapter<T>(
  handle: Handle<T>,
  opt?: Options
): (...args: Parameters<Handle<T>>) => ReturnType<Handle<T>> {
  return async (...args: Parameters<Handle<T>>): ReturnType<Handle<T>> => {
    try {
      const res = await handle(...args);
      return res;
    } catch (e) {
      const error = opt?.Error ? new opt.Error(e) : new AdapterErrors.UnexpectedError(e)
      return resultErr(error);
    }
  }
}

