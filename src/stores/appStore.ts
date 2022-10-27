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

@Store({ id: 'app' })
export class AppStore extends CommonStore {
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
