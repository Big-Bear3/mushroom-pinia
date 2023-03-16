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
        </div>
        <div>num: {{ numStore.num }}</div>
        <div>
            <button @click="plusNum">Num++</button>
        </div>
    </main>
</template>

<script setup lang="ts">
import { AppStore, NumStore } from '@/stores/appStore';

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

const numStore = new NumStore();

function plusNum() {
    numStore.num++;
}
</script>
