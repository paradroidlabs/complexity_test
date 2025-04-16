export type FilterModelByType<
  T extends readonly any[],
  Type extends string,
> = Extract<T[number], { type: Type }>;

export type ExtractCode<T extends { code: string }> = T["code"];
