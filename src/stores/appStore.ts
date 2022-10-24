import { PiniaStore, State, Store } from '../mushroom-pinia-core/src/';

export class CommonStore extends PiniaStore {
    @State()
    version = '1.0.0';

    set versionSuffix(value: string) {
        this.version += value;
    }
}

@Store({ id: 'app' })
export class AppStore extends CommonStore {
    @State()
    count = 5;

    sign = '----';

    #loginUser = 'Zhangsan';

    get double() {
        return this.count * 2;
    }

    get doubleWithSigh() {
        return this.sign + ' ' + this.count * 2 + ' ' + this.sign;
    }

    get loginUser() {
        return this.#loginUser;
    }

    set loginUser(value) {
        this.#loginUser = value;
    }

    increment() {
        this.count++;
    }
}
