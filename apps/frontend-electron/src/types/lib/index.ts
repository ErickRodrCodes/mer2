
/**
 * Ensures that a string is not empty as a type constraint.
 * This is useful for ensuring that certain string values are not empty.
 * @template T - The string type to check
 * @returns The string type if it is not empty, otherwise never
 * @example
 * ```typescript
 * type Example = NonEmptyString<'Hello'>; // 'Hello'
 * type Example2 = NonEmptyString<''>; // never
 * ```typescript
 * @see {@link MethodReturnType}
 */
export type NonEmptyString<T extends string> = T extends '' ? never : T;

/**
 * Unwraps a Promise type if it is a Promise, otherwise returns the type as is
 * @template T - The type to unwrap
 * @returns The unwrapped type if T is a Promise, otherwise T
 * @example
 * ```typescript
 * type Example = Promise<string>;
 * type Result = UnwrapPromise<Example>; // string
 * ```
 */
export type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;

/**
 * Extracts the return type of a method from an object type, unwrapping any Promise
 * to avoid double Promise wrapping
 * @template T - The object type containing the method
 * @template M - The method name (key) of the object type
 * @returns The return type of the method, unwrapped from Promise if applicable
 * @example
 * ```typescript
 * type Example = {
 *   methodA: () => Promise<string>;
 *  methodB: () => number;
 * }
 *
 * type ResultA = MethodReturnType<Example, 'methodA'>; // string
 * type ResultB = MethodReturnType<Example, 'methodB'>; // number
 * ```
 * @see {@link UnwrapPromise}
 * @see {@link NonEmptyString}
 *
 */
export type MethodReturnType<T, M extends keyof T> = T[M] extends (
  ...args: any[]
) => infer R
  ? Promise<UnwrapPromise<R>>
  : never;

/**
 * Utility type to transform a method return type of any object type to a Promise.
 *
 * @template Obj - The type of the object containing the method.
 * @template T - The method name (key) of the object type.
 * @returns The return type of the object's method, inferred and wrapped in a Promise.
 *
 * @example
 * type MyClass = {
 *   foo: () => number;
 *   bar: (x: string) => Promise<string>;
 * };
 *
 * type FooAsync = AsyncReturnType<MyClass, 'foo'>; // Promise<number>
 * type BarAsync = AsyncReturnType<MyClass, 'bar'>; // Promise<string>
 *
 * // Still works for DB:
 * type SomeAsync = AsyncReturnType<DB, 'someMethod'>;
 *
 * @see {@link UnwrapPromise}
 */
export type AsyncReturnType<
  Obj extends Record<string, any>,
  T extends keyof Obj
> = Obj[T] extends (...args: any[]) => infer R
  ? Promise<UnwrapPromise<R>>
  : never;

/**
 * Utility type that creates a new type with the same methods as the given object type,
 * but with their return types wrapped in a Promise.
 * This is useful for ensuring that all methods in the given type are treated as asynchronous,
 * such as when exposing methods via IPC or preload scripts.
 *
 * @template Obj - The type of the object whose methods will be wrapped.
 * @returns A new type with the same methods as Obj, but with their return types wrapped in a Promise.
 *
 * @example
 * type MyClass = {
 *   foo: (x: number) => string;
 *   bar: () => Promise<boolean>;
 * };
 *
 * type MyClassAsync = PreloadAsync<MyClass>;
 * // {
 * //   foo: (x: number) => Promise<string>;
 * //   bar: () => Promise<boolean>;
 * // }
 *
 * // For DB:
 * type PreloadDBAsync = PreloadAsync<DB>;
 *
 * @see {@link AsyncReturnType}
 */
export type AsyncifyMethodsOf<Obj extends Record<string, any>> = {
  [K in keyof Obj]: Obj[K] extends (...args: infer Args) => any
    ? (...args: Args) => AsyncReturnType<Obj, K>
    : never;
};

/**
 * Define the parameters for a new IPC main handler.
 * @param T - The type of the object to handle.
 * @param T.method - The method to handle.
 * @param T.callbackFn - The callback function to handle.
 */
export type IpcMainHandlerParams<T extends object> = {
  method: NonEmptyString<Extract<keyof T, string>>;
  callbackFn: (...args: any[]) => any;
};


export interface LoggedUserInfo {
  technicianFirstName: string | null,
  technicianLastName: string | null,
  technicianCode: string,
  isLoggedIn: boolean,
}

/**
 * Utility type to extract the public method names (keys whose values are functions)
 * from a class or object type T, as a union of string literal types.
 *
 * @template T - The class or object type to extract method names from.
 * @example
 * type DBMethodNames = PublicMethodNamesOf<DB>;
 * // 'dropIntakeFormTables' | 'listTables' | ...
 */
export type PublicMethodNamesOf<T> = {
  [K in keyof T]: T[K] extends (...args: any[]) => any ? K : never
}[keyof T];


