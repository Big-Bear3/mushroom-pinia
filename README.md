# 一款基于 Pinia 的 Class 风格的状态管理库

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

支持动态的Store id，您可以使用Store类中的成员变量去构建你的Store id：
```ts
@Store<CounterStore>({
    id: function () {
        return this.idPrefix + this.storeId;
    }
})
export class CounterStore extends PiniaStore {
    private readonly idPrefix = 'app-';

    constructor(private storeId: string) {
        super();
    }
}
```



### 使用Store

```ts
const counterStore = new CounterStore();
```

#### 强烈推荐使用[**Mushroom**](https://github.com/Big-Bear3/mushroom-di)依赖管理工具，方便对 store 实例进行管理。

### 原理及注意事项
* 您可以像定义一个正常的Class一样去定义你的Store，**Mushroom** 会将所有 **@State()** 装饰器装饰的成员变量转成Pinia的States，所有get访问器转换为Pinia的Getters，所有方法转换为Pinia的Actions，未被 **@State()** 装饰器装饰的成员变量仍作为成员变量。但要注意的是，set访问器并不会转换成Pinia的Actions，只是会作为一个普通的访问器。如果您同时定义了同名的set和get访问器，此get访问器也不会转换为Pinia的Getters，都将作为普通的访问器。
* 您可以使用继承，在父类中也可以通过 **@State()** 装饰器定义States，属性、访问器和方法的规则同上。记得在继承链最上层的类继承 **PiniaStore**，否则将无Pinia内置属性和方法（$开头的）的类型推断。
* 如果您想在Store内部使用Pinia内置属性和方法，如：this.$patch({ count: 1 })，记得对this进行强制类型转换：(<CounterStore>this).$patch({ count: 1 }); 否则会导致类型推断不正确。（不确定是否是Typescript的bug）

