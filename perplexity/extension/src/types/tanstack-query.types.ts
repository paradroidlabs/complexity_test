import type { UseQueryOptions } from "@tanstack/react-query";

export type QueryOptionsWithout<
  T,
  TQueryKey extends readonly unknown[],
  TOmitKeys extends keyof UseQueryOptions<T, Error, T, TQueryKey> =
    | "queryKey"
    | "queryFn"
    | "enabled",
> = Omit<UseQueryOptions<T, Error, T, TQueryKey>, TOmitKeys>;

export type ControlledQueryOptions<
  T,
  TQueryKey extends readonly unknown[],
  TOmitKeys extends keyof UseQueryOptions<T, Error, T, TQueryKey>,
> = QueryOptionsWithout<T, TQueryKey, "queryKey" | "queryFn" | TOmitKeys>;
