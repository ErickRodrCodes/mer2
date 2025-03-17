import { ipcMain, ipcRenderer } from 'electron';
import {
  AsyncifyMethodsOf,
  IpcMainHandlerParams,
  MethodReturnType,
  NonEmptyString,
  PublicMethodNamesOf,
  UnwrapPromise,
} from '../../types/lib';

/**
 * Invokes an IPC renderer method by name, strongly typed to the methods of the given class/object.
 * Useful for calling backend methods from the renderer process in a type-safe way, especially when exposing class methods via preload.
 *
 * @template T - The type of the object/class whose methods are being invoked.
 * @template M - The method name (key) of the object type.
 * @param method - The name of the method to invoke (must be a key of T).
 * @param args - The arguments to pass to the method.
 * @returns A promise resolving to the unwrapped return type of the method.
 *
 * @example
 * // Suppose you have a DB class with a method 'getUserById'
 * type DB = {
 *   getUserById: (id: string) => Promise<User>;
 * };
 *
 * // In your preload script:
 * const user = await createIpcRendererInvokerFrom<DB>('getUserById', '123');
 * //    ^? user: User
 *
 * // With a custom class:
 * class MyService {
 *   doSomething(x: number): Promise<string> { ... }
 * }
 *
 * const result = await createIpcRendererInvokerFrom<MyService>('doSomething', 42);
 * //    ^? result: string
 *
 * @see {@link MethodReturnType}
 * @see {@link UnwrapPromise}
 * @see {@link AsyncifyMethodsOf}
 */
export async function createIpcRendererInvokerFrom<
  T extends object,
  M extends NonEmptyString<Extract<keyof T, string>> = NonEmptyString<
    Extract<keyof T, string>
  >
>(method: M, ...args: any[]): Promise<UnwrapPromise<MethodReturnType<T, M>>> {
  return await ipcRenderer.invoke(method, ...args);
}

/**
 * Create a new IPC main handler for a given public method of a class.
 * @param params - The method and callback function to handle.
 * @param params.method - The method to handle.
 * @param params.callbackFn - The callback function to handle.
 * @template T - The type of the object to handle.
 *
 * @example
 * ```typescript
 * createIpcMainHandlerOf<CustomClass>({
 *   method: 'MethodOfTheClass',
 *   callbackFn: customClass.MethodOfTheClass.bind(customClass),
 * });
 * ```
 * @returns void if the callback function is not async.
 */
export function createIpcMainHandlerOf<T extends object>(
  params: IpcMainHandlerParams<T>
): void {
  ipcMain.handle(params.method, (_event, ...args) => {
    const result = params.callbackFn(...args);
    console.log('IpcMainHandlerParams of ', params.method, 'result', result);
    return result;
  });
}

export function registerIpcMainHandlers<T extends object>(
  classInstance: T,
  methodNames: readonly Extract<PublicMethodNamesOf<T>, string>[]
) {
  for (const method of methodNames) {
    const fn = classInstance[method];
    if (typeof fn === 'function') {
      createIpcMainHandlerOf<T>({
        method: method as any, // NonEmptyString<Extract<keyof T, string>>
        callbackFn: fn.bind(classInstance),
      });
    }
  }
}


/**
 * Creates a proxy object that exposes async wrappers for the specified public methods of a class or object.
 * Each method in the returned object will call createIpcRendererInvokerFrom with the correct method name and arguments,
 * enabling type-safe, DRY IPC invocations from the renderer process to the main process.
 *
 * @template T - The class or object type whose methods are being proxied.
 * @param methodNames - A readonly array of method names (keys of T) to expose as async IPC invokers.
 * @returns An object with the same method names, each as an async function returning a Promise of the correct type.
 *
 * @example
 * import { with_DB_AllowedMethodNames } from '../../main/data-layer/db-allowed-keys';
 * import { DB } from '../../main/data-layer/db';
 *
 * const dbMethods = createIpcRendererProxyFor<DB>(with_DB_AllowedMethodNames);
 * // dbMethods.listTables() returns Promise<TableList>
 * // dbMethods.addNewTechnician(tech) returns Promise<ResultType>
 *
 * // Used in contextBridge:
 * contextBridge.exposeInMainWorld('MedicalRecordAPI', dbMethods);
 */
export function createIpcRendererProxyFor<T extends object>(methodNames: ReadonlyArray<keyof T>) {
  const proxy: Partial<AsyncifyMethodsOf<T>> = {};
  for (const method of methodNames) {
    proxy[method] = (async (...args: any[]) =>
      await createIpcRendererInvokerFrom<T>(method as any, ...args)
    ) as AsyncifyMethodsOf<T>[typeof method];
  }
  return proxy as AsyncifyMethodsOf<T>;
}