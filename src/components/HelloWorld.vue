<template>
    <main>
        <div>count: {{ store.count }}</div>
        <div>doubleCount: {{ store.double }}</div>
        <div>store: {{ store.aa }}</div>
        <div>
            <button @click="increment">Increment</button>
        </div>
    </main>
</template>

<script setup lang="ts">
import { CounterStore } from '@/stores/counter';
import { of, by } from 'mushroom-di';
import { watch } from 'vue';

const store = by(CounterStore, 'counter');
const store2 = by(CounterStore, 'counter2');

const b = store === store2;

store.$patch({
    storeName: '',
    count: 1
});

store.$state.count;
store.$state.sign;
store.$state.storeName;
store.$state.storeName;

setTimeout(() => {
    store.aa = 66;
}, 2222);

watch(
    () => store.count,
    () => {
        console.log(store.count);
    }
);

function increment() {
    store.increment();
}
</script>
