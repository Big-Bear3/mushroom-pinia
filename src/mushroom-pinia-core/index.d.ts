import type { PiniaPluginContext, StoreOnActionListener, SubscriptionCallback, _DeepPartial } from 'pinia';
import type { Serializer, StorageLike } from 'pinia-plugin-persistedstate';
import type { App, UnwrapRef, WatchOptions } from 'vue';

export type Class<T = any> = abstract new (...args: any[]) => T;
export type NormalClass<T = any> = new (...args: any[]) => T;

export const mushroomPinia: { install: (app: App) => void };

export type StoreOptions<T extends Record<string | symbol | number, any>> = {
    id?: string | ((instance: T) => string);
    persist?: boolean | PersistedStateOptions<T> | PersistedStateOptions<T>[];
} & ThisType<T>;

export type StateOptions = {
    noBak?: boolean;
};

export interface OnStoreCreated {
    onStoreCreated(): void;
}

export function Store<T extends Record<string | symbol | number, any>>(storeOptions?: StoreOptions<T>): ClassDecorator;
export function State(stateOptions?: StateOptions): PropertyDecorator;

export abstract class PiniaStore {
    $id: string;
    $state: UnwrapRef<States<this>>;
    $patch(partialState: _DeepPartial<UnwrapRef<States<this>>>): void;
    $patch<F extends (state: UnwrapRef<States<this>>) => any>(stateMutator: ReturnType<F> extends Promise<any> ? never : F): void;
    $reset(): void;
    $subscribe(
        callback: SubscriptionCallback<States<this>>,
        options?: {
            detached?: boolean;
        } & WatchOptions
    ): () => void;
    $onAction(
        callback: StoreOnActionListener<string, States<this>, Getters<this>, Actions<this>>,
        detached?: boolean
    ): () => void;
    $dispose(): void;
    $hydrate: (opts?: { runHooks?: boolean }) => void;
    $persist: () => void;
}

export type States<T extends Record<string | symbol | number, any>> = NonReadonlyProps<{
    [P in keyof T as P extends PiniaKeys ? never : T[P] extends (...args: any[]) => any ? never : P]: T[P];
}>;

export type Getters<T extends Record<string | symbol | number, any>> = ReadonlyProps<{
    [P in keyof T as P extends PiniaKeys ? never : T[P] extends (...args: any[]) => any ? never : P]: T[P];
}>;

export type Actions<T extends Record<string | symbol | number, any>> = {
    [P in keyof T as P extends PiniaKeys ? never : T[P] extends (...args: any[]) => any ? P : never]: T[P];
};

interface PersistedStateOptions<T extends Record<string | symbol | number, any>> {
    key?: string;
    storage?: StorageLike;
    paths?: (keyof States<T>)[];
    serializer?: Serializer;
    beforeRestore?: (context: PiniaPluginContext<string, States<T>, Getters<T>, Actions<T>>) => void;
    afterRestore?: (context: PiniaPluginContext<string, States<T>, Getters<T>, Actions<T>>) => void;
    debug?: boolean;
}

type Equal<X, Y> = (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2 ? true : false;

type ReadonlyProps<T extends Record<string | symbol | number, any>> = {
    [P in keyof T as Equal<Readonly<{ [K in P]: T[K] }>, { [K in P]: T[K] }> extends true ? P : never]: T[P];
};

type NonReadonlyProps<T extends Record<string | symbol | number, any>> = {
    [P in keyof T as Equal<Readonly<{ [K in P]: T[K] }>, { [K in P]: T[K] }> extends true ? never : P]: T[P];
};

type PiniaKeys = '$id' | '$state' | '$patch' | '$reset' | '$subscribe' | '$onAction' | '$dispose' | '$hydrate' | '$persist';
