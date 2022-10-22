import type { Class } from '../types/globalTypes';

import { StoreManager } from '../store/storeManager';
import { Message } from '../utils/message';

export function State(): PropertyDecorator {
    return function (target: Class, key: string | symbol) {
        const storeManager = StoreManager.instance;
        if (typeof key === 'symbol') {
            Message.error('21001', `请勿使用symbol作为State！Store: ${target.constructor.name}, State: ${String(key)}`);
            return;
        }
        storeManager.addStateMemberName(target, <string>key);
    } as PropertyDecorator;
}
