import type { NormalClass } from '../types/globalTypes';
import type { Store } from 'pinia';

import { defineStore } from 'pinia';
import { StoreManager } from '../store/storeManager';
import { Message } from '../utils/message';

export function Store(id: string): ClassDecorator {
    return function (target: NormalClass) {
        const storeManager = StoreManager.instance;

        storeManager.addGetAccessorNames(target);
        storeManager.addMethodNames(target);

        return function (...args: unknown[]) {
            const storeClassInstance = new target(...args);

            const stateMemberNames = storeManager.getStateMemberNames(target.prototype);
            if (!stateMemberNames) Message.throwError('29001', `该Store（${target.name}）中无State！`);

            const stateMembers: Record<string, unknown> = {};
            for (const stateMemberName of stateMemberNames) {
                stateMembers[stateMemberName] = storeClassInstance[stateMemberName];
            }

            const getAccessors: Record<string, () => unknown> = {};
            const getAccessorNames = storeManager.getGetAccessorNames(target);

            if (getAccessorNames) {
                for (const getAccessorName of getAccessorNames) {
                    getAccessors[getAccessorName] = () => storeClassInstance[getAccessorName];
                }
            }

            const methods: Record<string, () => unknown> = {};
            const methodNames = storeManager.getMethodNames(target);

            if (methodNames) {
                for (const methodName of methodNames) {
                    methods[methodName] = storeClassInstance[methodName].bind(storeClassInstance);
                }
            }

            storeClassInstance.definedPiniaStore = defineStore(id, {
                state: () => stateMembers,
                getters: getAccessors,
                actions: methods
            })();

            for (const memberName in storeClassInstance) {
                if (stateMemberNames.indexOf(memberName) === -1) {
                    Reflect.defineProperty(storeClassInstance.definedPiniaStore, memberName, {
                        enumerable: true,
                        configurable: true,
                        get() {
                            return storeClassInstance[memberName];
                        },
                        set(value: unknown) {
                            storeClassInstance[memberName] = value;
                        }
                    });
                }
            }

            for (const stateMemberName of stateMemberNames) {
                Reflect.defineProperty(storeClassInstance, stateMemberName, {
                    enumerable: true,
                    configurable: true,
                    get() {
                        return (<any>storeClassInstance.definedPiniaStore)[stateMemberName];
                    },
                    set(value: unknown) {
                        (<Store>storeClassInstance.definedPiniaStore).$patch({ [stateMemberName]: value });
                    }
                });
            }

            return storeClassInstance.definedPiniaStore;
        };
    } as ClassDecorator;
}
