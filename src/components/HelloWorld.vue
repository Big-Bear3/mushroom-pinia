<template>
    <main>
        <div>version: {{ appStore.version }}</div>
        <div>count: {{ appStore.count }}</div>
        <div>doubleCount: {{ appStore.double }}</div>
        <div>doubleWithSign: {{ appStore.doubleWithSign }}</div>
        <div>loginUser: {{ appStore.loginUser }}</div>
        <div>sign: {{ appStore.sign }}</div>
        <div>
            <button @click="increment">Increment</button>
            <button @click="addVersionSuffix">AddVersionSuffix</button>
            <button @click="setVersion">SetVersion</button>
            <button @click="setLoginUser">SetLoginUser</button>
            <button @click="patchCount">Patch</button>
            <button @click="resetStore">ResetStore</button>
            <button @click="disposeAppStore">DisposeAppStore</button>
        </div>
        <div>num: {{ numStore.num }}</div>
        <div>
            <button @click="plusNum">Num++</button>
            <button @click="resetNumStore">ResetNumStore</button>
        </div>
        <div>rawPiniaStoreCount: {{ rawPiniaStore.count }}</div>
        <div>
            <button @click="incrementRawPiniaStoreCount">Count++</button>
            <button @click="disposeRawPiniaStoreCount">Dispose</button>
        </div>
    </main>
</template>

<script setup lang="ts">
import { AppStore, NumStore, useRawPiniaStore } from '@/stores/appStore';

const appStore = new AppStore();

function increment() {
    appStore.increment();
}

function addVersionSuffix() {
    appStore.versionSuffix = '！';
}

function setVersion() {
    appStore.version = '1.0.0';
}

function setLoginUser() {
    appStore.loginUser = '张三';
}

function patchCount() {
    appStore.$patch({
        count: 0
    });
}

function resetStore() {
    appStore.$reset();
}

appStore.$onAction(
    ({
        name, // action 名称
        store, // store 实例，类似 `someStore`
        args, // 传递给 action 的参数数组
        after, // 在 action 返回或解决后的钩子
        onError // action 抛出或拒绝的钩子
    }) => {
        console.log(name);
    }
);

function disposeAppStore() {
    appStore.$dispose();
}

const numStore = new NumStore();

function plusNum() {
    numStore.num++;
}

function resetNumStore() {
    numStore.$reset();
}

const rawPiniaStore = useRawPiniaStore();
function incrementRawPiniaStoreCount() {
    rawPiniaStore.count++;
}

function disposeRawPiniaStoreCount() {
    rawPiniaStore.$dispose();
}
</script>
