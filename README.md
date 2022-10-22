## mushroom-pinia

Use it like:

```ts
import { createApp } from 'vue';
import App from './App.vue';
import { mushroomPinia } from 'mushroom-pinia';

const app = createApp(App);

app.use(mushroomPinia);

app.mount('#app');
```

```ts
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
```
