export type Class<T = any> = abstract new (...args: any[]) => T;
export type NormalClass<T = any> = new (...args: any[]) => T;

export interface MethodDescriptor {
    configurable: boolean;
    enumerable: boolean;
    writable: boolean;
    value: Function;
}

export type Equal<X, Y> = (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2 ? true : false;

export type ReadonlyProps<T extends Record<string | symbol | number, any>> = {
    [P in keyof T as Equal<Readonly<{ [K in P]: T[K] }>, { [K in P]: T[K] }> extends true ? P : never]: T[P];
};

export type NonReadonlyProps<T extends Record<string | symbol | number, any>> = {
    [P in keyof T as Equal<Readonly<{ [K in P]: T[K] }>, { [K in P]: T[K] }> extends true ? never : P]: T[P];
};

type PiniaKeys = '$id' | '$state' | '$patch' | '$reset' | '$subscribe' | '$onAction' | '$dispose';

export type States<T extends Record<string | symbol | number, any>> = NonReadonlyProps<{
    [P in keyof T as P extends PiniaKeys ? never : T[P] extends (...args: any[]) => any ? never : P]: T[P];
}>;

export type Getters<T extends Record<string | symbol | number, any>> = ReadonlyProps<{
    [P in keyof T as P extends PiniaKeys ? never : T[P] extends (...args: any[]) => any ? never : P]: T[P];
}>;

export type Actions<T extends Record<string | symbol | number, any>> = {
    [P in keyof T as P extends PiniaKeys ? never : T[P] extends (...args: any[]) => any ? P : never]: T[P];
};
