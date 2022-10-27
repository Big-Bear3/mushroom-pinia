import type { NormalClass, StoreOptions } from '../types/globalTypes';

//import { createPinia, setActivePinia } from 'pinia';

import { Store } from 'pinia';
import { defineStore } from 'pinia';
import { StoreManager } from '../store/storeManager';
import { Message } from '../utils/message';

export function Store<T extends Record<string | symbol | number, any>>(storeOptions?: StoreOptions<T>): ClassDecorator {
    return function (target: NormalClass) {
        const storeManager = StoreManager.instance;

        storeManager.addAccessorAndMethodNames(target);

        return function (...args: unknown[]) {
            // 先创建Class Store对象
            const classStoreInstance = new target(...args);

            // 如果未设置Store Id，则使用类名，如果Store Id是函数，则使用函数返回值
            const storeId =
                storeOptions?.id === undefined || storeOptions?.id === null
                    ? target.name
                    : typeof storeOptions.id === 'function'
                    ? storeOptions.id.call(classStoreInstance, classStoreInstance)
                    : storeOptions.id;

            // 保证同一Store Id只能有一个Store实例
            if (storeManager.storeIsCreated(storeId)) {
                Message.warn('20001', `该Store (id: ${storeId}) 已经创建过，将返回该Store的实例！`);
                return storeManager.getPiniaStore(storeId);
            }

            // 将用@State()装饰器装饰的成员变量设置为State
            const stateMemberNames = storeManager.getStateMemberNames(target.prototype);
            if (stateMemberNames.length === 0) Message.throwError('29001', `该Store (${target.name}) 中无State！`);

            const stateMembers: Record<string, unknown> = {};
            for (const stateMemberName of stateMemberNames) {
                stateMembers[stateMemberName] = classStoreInstance[stateMemberName];
            }

            // 只有get的字符串key的访问器设置为Getter
            const getAccessors: Record<string, () => unknown> = {};
            const getAccessorNames = storeManager.getNonSymbolGetAccessorNames(target);

            if (getAccessorNames) {
                for (const getAccessorName of getAccessorNames) {
                    getAccessors[getAccessorName] = () => classStoreInstance[getAccessorName];
                }
            }

            // 字符串key的方法设置为Action
            const methods: Record<string, () => unknown> = {};
            const methodNames = storeManager.getNonSymbolMethodNames(target);

            if (methodNames) {
                for (const methodName of methodNames) {
                    methods[methodName] = classStoreInstance[methodName].bind(classStoreInstance);
                }
            }

            // 创建Pinia Store
            const piniaStoreInstance = defineStore(storeId, {
                state: () => stateMembers,
                getters: getAccessors,
                actions: methods
            })();

            handleStateMembers(stateMemberNames, classStoreInstance, piniaStoreInstance);
            handleNonStateMembers(stateMemberNames, classStoreInstance, piniaStoreInstance);
            handleSetAccessors(storeManager.getSetAccessorNames(target), classStoreInstance, piniaStoreInstance);
            handleBothAccessors(storeManager.getBothAccessorNames(target), classStoreInstance, piniaStoreInstance);
            handleSymbolGetAccessors(storeManager.getSymbolGetAccessorNames(target), classStoreInstance, piniaStoreInstance);
            handleSymbolMethods(storeManager.getSymbolMethodNames(target), classStoreInstance, piniaStoreInstance);

            setPiniaBuiltinPropsToClassStoreInstance(classStoreInstance, piniaStoreInstance);

            // 将此Pinia Store储存起来
            storeManager.addPiniaStore(storeId, piniaStoreInstance);

            return piniaStoreInstance;
        };
    } as ClassDecorator;
}

/** Class Store中的State映射至Pinia Store中的State */
function handleStateMembers(
    stateMemberNames: string[],
    classStoreInstance: Record<string | symbol | number, any>,
    piniaStoreInstance: Store
): void {
    for (const stateMemberName of stateMemberNames) {
        Reflect.defineProperty(classStoreInstance, stateMemberName, {
            enumerable: true,
            configurable: true,
            get() {
                return piniaStoreInstance[stateMemberName];
            },
            set(value: unknown) {
                piniaStoreInstance.$patch({ [stateMemberName]: value });
            }
        });
    }
}

/** 未被@State()装饰器装饰的成员变量定义成Pinia Store实例的属性 */
function handleNonStateMembers(
    stateMemberNames: string[],
    classStoreInstance: Record<string | symbol | number, any>,
    piniaStoreInstance: Store
): void {
    const classStoreMemberNames = Reflect.ownKeys(classStoreInstance);

    for (const memberName of classStoreMemberNames) {
        if (typeof memberName === 'symbol' || stateMemberNames.indexOf(memberName) === -1) {
            Reflect.defineProperty(piniaStoreInstance, memberName, {
                enumerable: true,
                configurable: true,
                get() {
                    return classStoreInstance[memberName];
                },
                set(value: unknown) {
                    classStoreInstance[memberName] = value;
                }
            });
        }
    }
}

/** Class Store中的set访问器定义成Pinia Store实例的set访问器 */
function handleSetAccessors(
    setAccessorNames: (string | symbol)[],
    classStoreInstance: Record<string | symbol | number, any>,
    piniaStoreInstance: Store
): void {
    if (!setAccessorNames) return;
    for (const setAccessorName of setAccessorNames) {
        Reflect.defineProperty(piniaStoreInstance, setAccessorName, {
            enumerable: false,
            configurable: true,
            set(value: unknown) {
                classStoreInstance[setAccessorName] = value;
            }
        });
    }
}

/** Class Store中的既有set又有get的访问器定义成Pinia Store实例的访问器 */
function handleBothAccessors(
    bothAccessorNames: (string | symbol)[],
    classStoreInstance: Record<string | symbol | number, any>,
    piniaStoreInstance: Store
): void {
    if (!bothAccessorNames) return;
    for (const bothAccessorName of bothAccessorNames) {
        Reflect.defineProperty(piniaStoreInstance, bothAccessorName, {
            enumerable: false,
            configurable: true,
            get() {
                return classStoreInstance[bothAccessorName];
            },
            set(value: unknown) {
                classStoreInstance[bothAccessorName] = value;
            }
        });
    }
}

/** Class Store中的symbol类型的key的get访问器定义成Pinia Store实例的get访问器 */
function handleSymbolGetAccessors(
    symbolGetAccessorNames: (string | symbol)[],
    classStoreInstance: Record<string | symbol | number, any>,
    piniaStoreInstance: Store
): void {
    if (!symbolGetAccessorNames) return;
    for (const symbolGetAccessorName of symbolGetAccessorNames) {
        Reflect.defineProperty(piniaStoreInstance, symbolGetAccessorName, {
            enumerable: false,
            configurable: true,
            get() {
                return classStoreInstance[symbolGetAccessorName];
            }
        });
    }
}

/** Class Store中的symbol类型的key的方法定义成Pinia Store实例的方法 */
function handleSymbolMethods(
    symbolMethodNames: (string | symbol)[],
    classStoreInstance: Record<string | symbol | number, any>,
    piniaStoreInstance: Store
): void {
    if (!symbolMethodNames) return;
    for (const symbolMethodName of symbolMethodNames) {
        Reflect.defineProperty(piniaStoreInstance, symbolMethodName, {
            enumerable: false,
            configurable: true,
            value: classStoreInstance[symbolMethodName]
        });
    }
}

/** 将Pinia Store实例的内置方法映射到Class Store实例中，让Class Store内部也可以使用 */
function setPiniaBuiltinPropsToClassStoreInstance(
    classStoreInstance: Record<string | symbol | number, any>,
    piniaStoreInstance: Store
): void {
    const piniaBuiltinPropNames = ['$id', '$state', '$patch', '$reset', '$subscribe', '$onAction', '$dispose'];
    for (const propName of piniaBuiltinPropNames) {
        Reflect.defineProperty(classStoreInstance, propName, {
            enumerable: false,
            configurable: true,
            value: piniaStoreInstance[propName]
        });
    }
}
