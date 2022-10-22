<template>
    <div class="greetings">count: {{ store.count }}</div>
    <div class="greetings">doubleCount: {{ store.double }}</div>
    <div>
        <button @click="increment">increment</button>
    </div>
</template>

<script setup lang="ts">
import { CounterStore } from '@/stores/counter';

const store = new CounterStore();

function increment() {
    store.increment();
}
</script>

