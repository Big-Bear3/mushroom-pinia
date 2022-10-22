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

@Store('counter')
export class CounterStore extends PiniaStore {
    @State()
    count = 5; // Pinia States

    get double() { // Pinia Getters
        return this.count * 2;
    }

    increment() { // Pinia Actions
        this.count++;
    }
}
```

In tsconfig.json:
```js
"compilerOptions": {
    // ...
    "experimentalDecorators": true,
    // ...
}
```
In Vue Component：
```
<template>
    <main>
        <div>count: {{ store.count }}</div>
        <div>doubleCount: {{ store.double }}</div>
        <div>
            <button @click="increment">Increment</button>
        </div>
    </main>
</template>

<script setup lang="ts">
import { CounterStore } from '@/stores/counter';

const store = new CounterStore();

function increment() {
    store.increment();
}
</script>
```

强烈推荐使用[**Mushroom**](https://github.com/Big-Bear3/mushroom-di)依赖管理工具，方便对store实例进行管理。


