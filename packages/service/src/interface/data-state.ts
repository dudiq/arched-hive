import { makeAutoObservable } from 'mobx';

import { isErr } from '@repo/result';

import type { Result } from '@repo/result';

export class DataState<T, E = unknown> {
  data?: T = undefined;
  error?: E = undefined;

  isLoading: boolean;

  constructor(args?: { data?: T; isLoading?: boolean; error?: E }) {
    this.data = args?.data;
    this.isLoading = args?.isLoading ?? true;
    this.error = args?.error;

    makeAutoObservable(this);
  }

  get isDataLoaded(): boolean {
    if (this.isLoading) return false;
    return !!this.data;
  }

  get isError(): boolean {
    return !!this.error;
  }

  start(): void {
    this.isLoading = true;
    this.error = undefined;
  }

  setResult(res: Result<T, E>): void {
    const isError = isErr(res);
    if (isError) {
      this.data = undefined;
      this.error = res.error;
    }
    if (!isError) {
      this.error = undefined;
      this.data = res.data;
    }
  }

  finish(): void {
    this.isLoading = false;
  }
}
