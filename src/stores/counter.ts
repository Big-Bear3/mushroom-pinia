import { State, Store } from '@/mushroom-pinia-core/src';

export class ParentStore {
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

    sign = '----';

    get double() {
        return this.count * 2 + this.sign;
    }

    increment() {
        this.count++;
        this.storeName = '123';
    }
}
