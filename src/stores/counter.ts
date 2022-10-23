import { PiniaStore, State, Store } from '@/mushroom-pinia-core/src';

export class ParentStore extends PiniaStore {
    #aa = 123;

    @State()
    storeName = 'ParentStore';

    @State()
    count = 10;

    get aa(): number {
        return this.#aa;
    }

    set aa(value: number) {
        this.#aa = value;
    }
}

@Store(() => 'counter')
export class CounterStore extends ParentStore {
    @State()
    count = 5;

    sign = '----';

    #bb = 456;
    #cc = 789;

    get bb(): number {
        return this.#bb;
    }

    set bb(value: number) {
        this.#bb = value;
    }

    set cc(value: number) {
        this.#cc = value;
    }

    get double() {
        return this.count * 2 + this.bb;
    }

    increment() {
        this.count++;
        this.storeName = '123';
    }
}
