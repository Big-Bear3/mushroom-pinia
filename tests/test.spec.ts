import { Message } from '../src/mushroom-pinia-core/src/utils/message';
import { describe, it, expect } from 'vitest';
import { AppStore } from '../src/stores/appStore';
import { createPinia, setActivePinia } from 'pinia';

Message.toggleConsolePrintable(false);

setActivePinia(createPinia());

describe('创建store', () => {
    it('id使用字符串', () => {
        const appStore = new AppStore();
        expect(appStore.$id).toBe('app');
    });
});
