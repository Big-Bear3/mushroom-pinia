import { createPinia } from 'pinia';
import { State as StateDecorator } from './decorators/state';
import { Store as StoreDecorator } from './decorators/store';
import { PiniaStore as PiniaStoreClass } from './store/PiniaStore';
import { createPersistedState } from 'pinia-plugin-persistedstate';

/* c8 ignore start */
export const mushroomPinia = {
    install(app: any) {
        const pinia = createPinia();
        app.use(pinia);
        pinia.use(
            <any>createPersistedState({
                storage: localStorage,
                key: (id) => `__mp_persisted_${id}`
            })
        );
    }
};
/* c8 ignore stop */

export const Store = StoreDecorator;
export const State = StateDecorator;

export const PiniaStore = PiniaStoreClass;
