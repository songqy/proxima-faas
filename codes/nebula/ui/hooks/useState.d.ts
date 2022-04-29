export declare type Payload<T> = T | ((val: T) => T) | undefined;
declare const useState: <T>(initialState: T | (() => Promise<T>) | (() => T)) => [T, (payload: Payload<T>) => void];
export default useState;
