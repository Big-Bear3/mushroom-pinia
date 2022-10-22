// import { State, Store } from '@/mushroom-pinia-core/src';
// import { PiniaStore } from '@/mushroom-pinia-core/src/store/PiniaStore';

import { State, Store, PiniaStore } from 'mushroom-pinia';

@Store()
export class CounterStore extends PiniaStore {
    @State()
    count = 5;

    get double() {
        return this.count * 2;
    }

    increment() {
        this.count++;
    }
}

