import type { NormalClass } from '../types/globalTypes';
import type { Store } from 'pinia';

import { defineStore } from 'pinia';
import { StoreManager } from '../store/storeManager';
import { Message } from '../utils/message';

export function Store(id: string): ClassDecorator {
    return function (target: NormalClass) {
        const storeManager = StoreManager.instance;

        if (!storeManager.checkAlreadyExtendsPiniaStore(target))
            Message.throwError('29001', `该Store（${target.name}）未继承PiniaStore！`);

        storeManager.addGetAccessorNames(target);

        return function (...args: unknown[]) {
            const storeClassInstance = new target(...args);

            const stateMemberNames = storeManager.getStateMemberNames(target.prototype);
            if (!stateMemberNames) Message.throwError('29002', `该Store（${target.name}）中无State！`);

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

            storeClassInstance.definedPiniaStore = defineStore(id, {
                state: () => stateMembers,
                getters: getAccessors
            })();

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

            return storeClassInstance;
        };
    } as ClassDecorator;
}
