// Define a type transformer to wrap return types
type WrapReturnType<T, W> = T extends (...args: infer Args) => infer Return
  ? (
      ...args: Args
    ) => W extends (value: Return) => infer WrappedReturn
      ? WrappedReturn
      : never
  : never;

/**
 * Generic type to transform methods of any class with a custom wrapper function.
 * Useful for electron preloads and IPC main invokers
 */
export type TransformMethods<T, W extends (value: any) => any> = {
  [K in keyof T]: WrapReturnType<T[K], W>;
};

export type CptText = {
  PK_cptcode: string;
  selectedOptions: string[];
};
