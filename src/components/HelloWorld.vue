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
import { watch } from 'vue';

const store = new CounterStore();

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
