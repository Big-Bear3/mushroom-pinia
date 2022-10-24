import type { NormalClass, StoreOptions } from '../types/globalTypes';
import type { Store } from 'pinia';

import { defineStore } from 'pinia';
import { StoreManager } from '../store/storeManager';
import { Message } from '../utils/message';

export function Store<T extends Record<string | symbol | number, any>>(storeOptions: StoreOptions<T>): ClassDecorator {
    return function (target: NormalClass) {
        const storeManager = StoreManager.instance;

        storeManager.addAccessorAndMethodNames(target);

        return function (...args: unknown[]) {
            const classStoreInstance = new target(...args);

            const storeId =
                typeof storeOptions.id === 'function'
                    ? storeOptions.id.call(classStoreInstance, classStoreInstance)
                    : storeOptions.id;

            if (storeManager.storeIsCreated(storeId)) {
                Message.warn('20001', `该Store（id: ${storeId}）已经创建过，将返回该Store的实例！`);
                return storeManager.getPiniaStore(storeId);
            }

            const stateMemberNames = storeManager.getStateMemberNames(target.prototype);
            if (!stateMemberNames) Message.throwError('29001', `该Store（${target.name}）中无State！`);

            const stateMembers: Record<string, unknown> = {};
            for (const stateMemberName of stateMemberNames) {
                stateMembers[stateMemberName] = classStoreInstance[stateMemberName];
            }

            const getAccessors: Record<string, () => unknown> = {};
            const getAccessorNames = storeManager.getGetAccessorNames(target);

            if (getAccessorNames) {
                for (const getAccessorName of getAccessorNames) {
                    getAccessors[getAccessorName] = () => classStoreInstance[getAccessorName];
                }
            }

            const methods: Record<string, () => unknown> = {};
            const methodNames = storeManager.getMethodNames(target);

            if (methodNames) {
                for (const methodName of methodNames) {
                    methods[methodName] = classStoreInstance[methodName].bind(classStoreInstance);
                }
            }

            const piniaStoreInstance = defineStore(storeId, {
                state: () => stateMembers,
                getters: getAccessors,
                actions: methods
            })();

            handleStateMembers(stateMemberNames, classStoreInstance, piniaStoreInstance);
            handleNonStateMembers(stateMemberNames, classStoreInstance, piniaStoreInstance);
            handleSetAccessors(storeManager.getSetAccessorNames(target), classStoreInstance, piniaStoreInstance);
            handleBothAccessors(storeManager.getBothAccessorNames(target), classStoreInstance, piniaStoreInstance);

            setPiniaBuiltinPropsToClassStoreInstance(classStoreInstance, piniaStoreInstance);

            storeManager.addPiniaStore(storeId, piniaStoreInstance);

            return piniaStoreInstance;
        };
    } as ClassDecorator;
}

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

function handleNonStateMembers(
    stateMemberNames: string[],
    classStoreInstance: Record<string | symbol | number, any>,
    piniaStoreInstance: Store
): void {
    for (const memberName in classStoreInstance) {
        if (stateMemberNames.indexOf(memberName) === -1) {
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

function handleSetAccessors(
    setAccessorNames: string[],
    classStoreInstance: Record<string | symbol | number, any>,
    piniaStoreInstance: Store
): void {
    if (!setAccessorNames) return;
    for (const setAccessorName of setAccessorNames) {
        Reflect.defineProperty(piniaStoreInstance, setAccessorName, {
            enumerable: true,
            configurable: true,
            set(value: unknown) {
                classStoreInstance[setAccessorName] = value;
            }
        });
    }
}

function handleBothAccessors(
    bothAccessorNames: string[],
    classStoreInstance: Record<string | symbol | number, any>,
    piniaStoreInstance: Store
): void {
    if (!bothAccessorNames) return;
    for (const bothAccessorName of bothAccessorNames) {
        Reflect.defineProperty(piniaStoreInstance, bothAccessorName, {
            enumerable: true,
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

function setPiniaBuiltinPropsToClassStoreInstance(
    classStoreInstance: Record<string | symbol | number, any>,
    piniaStoreInstance: Store
): void {
    const piniaBuiltinPropNames = ['$id', '$state', '$patch', '$reset', '$subscribe', '$onAction', '$dispose'];
    for (const propName of piniaBuiltinPropNames) {
        classStoreInstance[propName] = piniaStoreInstance[propName];
    }
}
