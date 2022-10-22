export type Class<T = any> = abstract new (...args: any[]) => T;
export type NormalClass<T = any> = new (...args: any[]) => T;

export interface MethodDescriptor {
    configurable: boolean;
    enumerable: boolean;
    writable: boolean;
    value: Function;
}
