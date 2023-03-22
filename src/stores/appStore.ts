import type { OnStoreCreated } from '@/mushroom-pinia-core/src/types/globalTypes';
import { defineStore } from 'pinia';
import { nextTick, watch } from 'vue';
import { PiniaStore, State, Store } from '../mushroom-pinia-core/src/';

export class CommonStore extends PiniaStore {
    @State()
    version = '1.0.0';

    set versionSuffix(value: string) {
        this.version += value;
    }
    /* c8 ignore next */
}

export const numberPropName = 111;
export const symbolPropName = Symbol('symbolPropName');

export const numberStatePropName = 222;
export const symbolStatePropName = Symbol('symbolStatePropName');

export const numberSetAccessorName = 333;
export const symbolSetAccessorName = Symbol('symbolSetAccessorName');

export const numberGetAccessorName = 444;
export const symbolGetAccessorName = Symbol('symbolGetAccessorName');

export const numberBothAccessorName = 555;
export const symbolBothAccessorName = Symbol('symbolBothAccessorName');

export const numberMethodName = 666;
export const symbolMethodName = Symbol('symbolMethodName');

/* c8 ignore start */
export const useRawPiniaStore = defineStore('rawPiniaStore', {
    state: () => {
        return { count: 0 };
    },
    actions: {
        increment() {
            this.count++;
        }
    }
});
/* c8 ignore stop */

/* c8 ignore start */
@Store()
export class NumStore extends PiniaStore implements OnStoreCreated {
    @State()
    num = 5;

    @State()
    num2 = 0;

    constructor() {
        super();

        watch(
            () => this.num,
            () => {
                console.log(4321);
            }
        );

        nextTick(() => {
            watch(
                () => this.num,
                () => {
                    console.log(1111);
                }
            );
        });
    }

    onStoreCreated() {
        watch(
            () => this.num,
            () => {
                console.log(1234);
            }
        );

        this.num2++;
    }
}
/* c8 ignore stop */

@Store<AppStore>({
    id: 'app',
    /* c8 ignore start */
    persist: {
        paths: ['count', 'version'],
        beforeRestore: ({ store }) => {
            setTimeout(() => {
                console.log(store.count);
            });
        }
    }
    /* c8 ignore stop */
})
export class AppStore extends CommonStore {
    static serialsNo = '123';

    @State()
    count = 5;

    sign = '----';

    #loginUser = 'Zhangsan';

    @State()
    [numberStatePropName] = -10;

    [numberPropName] = -100;
    [symbolPropName] = -200;

    get double() {
        return this.count * 2;
    }

    get doubleWithSign() {
        return this.sign + ' ' + this.count * 2 + ' ' + this.sign;
    }

    get loginUser() {
        return this.#loginUser;
    }

    set loginUser(value) {
        this.#loginUser = value;
    }

    set [numberSetAccessorName](value: string) {
        this.sign = 'set-numberSetAccessorName';
    }

    set [symbolSetAccessorName](value: string) {
        this.sign = 'set-symbolSetAccessorName';
    }

    get [numberGetAccessorName]() {
        return 'get-numberGetAccessorName';
    }

    get [symbolGetAccessorName]() {
        return 'get-symbolGetAccessorName';
    }

    set [numberBothAccessorName](value: string) {
        this.sign = 'set-numberBothAccessorName';
    }

    get [numberBothAccessorName]() {
        return 'get-numberBothAccessorName';
    }

    set [symbolBothAccessorName](value: string) {
        this.count = 666;
    }

    get [symbolBothAccessorName]() {
        return this.count + '!';
    }

    increment() {
        this.count++;
    }

    changeSign() {
        this.sign = '====';
    }

    changeNumberStatePropName() {
        this[numberStatePropName] = -11;
    }

    changeNumberPropName() {
        this[numberPropName] = 100;
    }

    changeSymbolPropName() {
        this[symbolPropName] = -200;
    }

    [numberMethodName]() {
        this.sign = 'method-numberMethodName';
    }

    [symbolMethodName]() {
        this.sign = 'method-symbolMethodName';
    }

    innerIncrement() {
        this.increment();
    }
}

@Store<DynamicIdStore>({
    id: function () {
        return this.id;
    }
})
export class DynamicIdStore extends PiniaStore {
    @State()
    count = 0;

    constructor(private id: string) {
        super();
    }
}

@Store()
export class ClassNameAsIdStore extends PiniaStore {
    @State()
    count = 0;

    innerPatch(value: number) {
        (<ClassNameAsIdStore>this).$patch({ count: value });
    }
}
