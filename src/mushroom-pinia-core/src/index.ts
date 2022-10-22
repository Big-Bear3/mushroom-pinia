import { createPinia } from 'pinia';
import { State as StateDecorator } from './decorators/state';
import { Store as StoreDecorator } from './decorators/store';
import { PiniaStore as PiniaStoreClass } from './store/PiniaStore';

export const mushroomPinia = {
    install(app: any) {
        const pinia = createPinia();
        app.use(pinia);
    }
};

export const Store = StoreDecorator;
export const State = StateDecorator;

export const PiniaStore = PiniaStoreClass;
