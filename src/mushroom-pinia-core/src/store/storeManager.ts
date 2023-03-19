import type { Class } from 'src/types/globalTypes';
import type { PiniaStore } from './PiniaStore';

export class StoreManager {
    private static _instance: StoreManager;

    static readonly originalClassPropName = '__mp_class';
    static readonly originalInstancePropName = '__mp_instance';

    /** 类和类与其父类中@State()装饰器装饰的成员变量名的映射 */
    private classToStateMemberNames = new Map<Class, string[]>();

    /** 类和类与其父类中的set访问器名的映射 */
    private classToSetAccessorNames = new Map<Class, (string | symbol)[]>();

    /** 类和类与其父类中的get访问器名的映射 */
    private classToGetAccessorNames = new Map<Class, (string | symbol)[]>();

    /** 类和类与其父类中同时拥有set、get的访问器名的映射 */
    private classToBothAccessorNames = new Map<Class, (string | symbol)[]>();

    /** 类和类与其父类中的方法名名的映射 */
    private classToMethodNames = new Map<Class, (string | symbol)[]>();

    /** store id和pinia store实例的映射 */
    private idToPiniaStore = new Map<string, PiniaStore>();

    addStateMemberName(c: Class, stateMemberName: string): void {
        let stateMemberNames = this.classToStateMemberNames.get(c);
        if (!stateMemberNames) {
            stateMemberNames = [];
            this.classToStateMemberNames.set(c, stateMemberNames);
        }
        stateMemberNames.push(stateMemberName);
    }

    getStateMemberNames(c: Class): string[] {
        const allStateMemberNames = new Set<string>();

        let currentClass = c;
        while (currentClass) {
            const currentClassStateMemberNames = this.classToStateMemberNames.get(currentClass);
            if (currentClassStateMemberNames) {
                for (const stateMemberName of currentClassStateMemberNames.reverse()) {
                    allStateMemberNames.add(stateMemberName);
                }
            }

            currentClass = Object.getPrototypeOf(currentClass);
        }
        return Array.from(allStateMemberNames).reverse();
    }

    addAccessorAndMethodNames(c: Class): void {
        const allSetAccessorNames = new Set<string | symbol>();
        const allGetAccessorNames = new Set<string | symbol>();
        const allBothAccessorNames = new Set<string | symbol>();
        const allMethodNames = new Set<string | symbol>();

        let currentClass = c;
        while (currentClass && currentClass.prototype) {
            const currentClassMethodNames = Reflect.ownKeys(currentClass.prototype);
            for (const methodName of currentClassMethodNames.reverse()) {
                const methodType = this.getMethodType(currentClass, methodName);
                switch (methodType) {
                    case 'set':
                        allSetAccessorNames.add(methodName);
                        break;

                    case 'get':
                        allGetAccessorNames.add(methodName);
                        break;

                    case 'setget':
                        allBothAccessorNames.add(methodName);
                        break;

                    case 'method':
                        allMethodNames.add(methodName);
                        break;
                }
            }
            currentClass = Object.getPrototypeOf(currentClass);
        }

        if (allSetAccessorNames.size > 0) this.classToSetAccessorNames.set(c, Array.from(allSetAccessorNames).reverse());
        if (allGetAccessorNames.size > 0) this.classToGetAccessorNames.set(c, Array.from(allGetAccessorNames).reverse());
        if (allBothAccessorNames.size > 0) this.classToBothAccessorNames.set(c, Array.from(allBothAccessorNames).reverse());
        if (allMethodNames.size > 0) this.classToMethodNames.set(c, Array.from(allMethodNames).reverse());
    }

    getSetAccessorNames(c: Class): (string | symbol)[] {
        return this.classToSetAccessorNames.get(c);
    }

    getSymbolGetAccessorNames(c: Class): symbol[] {
        return <symbol[]>this.classToGetAccessorNames.get(c)?.filter((name) => typeof name === 'symbol');
    }

    getNonSymbolGetAccessorNames(c: Class): string[] {
        return <string[]>this.classToGetAccessorNames.get(c)?.filter((name) => typeof name === 'string');
    }

    getBothAccessorNames(c: Class): (string | symbol)[] {
        return this.classToBothAccessorNames.get(c);
    }

    getSymbolMethodNames(c: Class): symbol[] {
        return <symbol[]>this.classToMethodNames.get(c)?.filter((name) => typeof name === 'symbol');
    }

    getNonSymbolMethodNames(c: Class): string[] {
        return <string[]>this.classToMethodNames.get(c)?.filter((name) => typeof name === 'string');
    }

    addPiniaStore(storeId: string, store: PiniaStore): void {
        this.idToPiniaStore.set(storeId, store);
    }

    getPiniaStore(storeId: string): PiniaStore {
        return this.idToPiniaStore.get(storeId);
    }

    storeIsCreated(storeId: string): boolean {
        return this.idToPiniaStore.has(storeId);
    }

    private getMethodType(c: Class, methodName: string | symbol): 'constructor' | 'set' | 'get' | 'setget' | 'method' {
        if (methodName === 'constructor') return 'constructor';
        const descriptor = Object.getOwnPropertyDescriptor(c.prototype, methodName);
        if (descriptor.set && !descriptor.get) return 'set';
        if (!descriptor.set && descriptor.get) return 'get';
        if (descriptor.set && descriptor.get) return 'setget';
        /* c8 ignore next */
        if (descriptor.value && !descriptor.set && !descriptor.get) return 'method';
        /* c8 ignore next */
        return undefined;
    }

    static get instance(): StoreManager {
        if (!StoreManager._instance) {
            StoreManager._instance = new StoreManager();
        }
        return StoreManager._instance;
    }
}
