// import { State, Store } from '@/mushroom-pinia-core/src';
// import { PiniaStore } from '@/mushroom-pinia-core/src/store/PiniaStore';

import { State, Store, PiniaStore } from 'mushroom-pinia';

export class ParentStore extends PiniaStore {
    @State()
    storeName = 'ParentStore';

    @State()
    count = 10;

    get aa(): any {
        return null;
    }
}

@Store('counter')
export class CounterStore extends ParentStore {
    @State()
    count = 5;

    private sign = '----';

    get double() {
        return this.count * 2 + this.sign;
    }

    increment() {
        this.count++;
        this.storeName = '123';
    }
}

