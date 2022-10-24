# mushroom-pinia —— 基于 Pinia 的 Class 风格的状态管理库

## 用法风格概览

```ts
import { State, Store } from 'mushroom-pinia';

@Store({ id: 'counter' })
export class CounterStore {
    @State()
    count = 0; // Pinia State

    // Pinia Getter
    get double() {
        return this.count * 2;
    }

    // Pinia Action
    increment() {
        this.count++;
    }
}
```

## 安装

```bash
npm i -S pinia mushroom-pinia
```

## 使用方法

### 使用前配置

在main.ts中：
```ts
import { createApp } from 'vue';
import App from './App.vue';
import { mushroomPinia } from 'mushroom-pinia';

const app = createApp(App);

app.use(mushroomPinia);

app.mount('#app');
```

在tsconfig.json中：
```js
"compilerOptions": {
    // ...
    "experimentalDecorators": true,
    // ...
}
```

### 定义你的Store

```ts
@Store({ id: 'counter' })
export class CounterStore extends PiniaStore {
    @State()
    count = 0; // Pinia State

    // Pinia Getter
    get double() {
        return this.count * 2;
    }

    // Pinia Action
    increment() {
        this.count++;
    }
}
```

强烈推荐使用[**Mushroom**](https://github.com/Big-Bear3/mushroom-di)依赖管理工具，方便对 store 实例进行管理。
