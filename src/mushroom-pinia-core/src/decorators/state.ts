import type { Class } from '../types/globalTypes';

import { StoreManager } from '../store/storeManager';
import { Message } from '../utils/message';

export function State(): PropertyDecorator {
    return function (target: Class, key: string | symbol | number) {
        const storeManager = StoreManager.instance;
        if (typeof key === 'symbol') {
            Message.throwError('29002', `不能使用symbol作为State！Store: ${target.constructor.name}, State: ${String(key)}`);
            return;
        }
        storeManager.addStateMemberName(target, <string>key.toString());
    } as PropertyDecorator;
}
