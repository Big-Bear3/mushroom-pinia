import { it, expect } from 'vitest';
import { PiniaStore, State, Store } from '../src/mushroom-pinia-core/src';
import { StoreManager } from '../src/mushroom-pinia-core/src/store/storeManager';
import { Message } from '../src/mushroom-pinia-core/src/utils/message';
import {
    AppStore,
    ClassNameAsIdStore,
    DynamicIdStore,
    numberBothAccessorName,
    numberGetAccessorName,
    numberMethodName,
    numberPropName,
    numberSetAccessorName,
    numberStatePropName,
    NumStore,
    symbolBothAccessorName,
    symbolGetAccessorName,
    symbolMethodName,
    symbolPropName,
    symbolSetAccessorName,
    symbolStatePropName
} from '../src/stores/appStore';

Message.toggleConsolePrintable(false);

it('不能使用key为symbol类型的State', () => {
    const messageHistory = Message.getHistory();
    Message.clearHistory();

    try {
        @Store({ id: 'symbolKeyStateStore' })
        class SymbolKeyStateStore extends PiniaStore {
            @State()
            [symbolStatePropName] = -20;
        }
    } catch (error) {}

    expect(messageHistory[0].code).toBe('29002');
});

it('Store中不能没有State', () => {
    const messageHistory = Message.getHistory();
    Message.clearHistory();

    try {
        @Store({ id: 'noStateStore' })
        class NoStateStore extends PiniaStore {}
        new NoStateStore();
    } catch (error) {}

    expect(messageHistory[0].code).toBe('29001');
});

it('创建StoreId相同的Store', () => {
    const messageHistory = Message.getHistory();
    Message.clearHistory();
    new AppStore();
    new AppStore();

    expect(messageHistory[0].code).toBe('20001');
});

it('id使用字符串', () => {
    const appStore = new AppStore();
    expect(appStore.$id).toBe('app');
});

it('id使用回调函数', () => {
    const messageHistory = Message.getHistory();

    const dynamicIdStore1 = new DynamicIdStore('dynamicId1');
    expect(dynamicIdStore1.$id).toBe('dynamicId1');

    Message.clearHistory();
    const dynamicIdStore2 = new DynamicIdStore('dynamicId1');
    expect(messageHistory[0].code).toBe('20001');
    expect(dynamicIdStore1 === dynamicIdStore2).toBe(true);

    const dynamicIdStore3 = new DynamicIdStore('dynamicId2');
    expect(dynamicIdStore3.$id).toBe('dynamicId2');
});

it('使用类名作为Store id', () => {
    const classNameAsIdStore = new ClassNameAsIdStore();
    expect(classNameAsIdStore.$id).toBe('ClassNameAsIdStore');
});

it('普通成员变量和State成员变量以及字符串key的方法', () => {
    const appStore = new AppStore();
    expect(appStore.count).toBe(5);

    appStore.increment();
    expect(appStore.count).toBe(6);

    expect(appStore.sign).toBe('----');
    expect(appStore.$state.sign).toBe(undefined);

    appStore.changeSign();
    expect(appStore.sign).toBe('====');

    expect(appStore[numberStatePropName]).toBe(-10);
    expect(appStore[numberPropName]).toBe(-100);
    expect(appStore[symbolPropName]).toBe(-200);

    appStore[symbolPropName] = 200;
    expect(appStore[symbolPropName]).toBe(200);

    appStore.changeNumberStatePropName();
    expect(appStore[numberStatePropName]).toBe(-11);

    appStore.changeNumberPropName();
    expect(appStore[numberPropName]).toBe(100);

    appStore.changeSymbolPropName();
    expect(appStore[symbolPropName]).toBe(-200);
});

it('Getters和访问器', () => {
    const appStore = new AppStore();

    appStore.count = 1;
    expect(appStore.double).toBe(2);
    expect(appStore.doubleWithSign).toBe(appStore.sign + ' ' + 2 + ' ' + appStore.sign);
    expect(appStore.loginUser).toBe('Zhangsan');

    appStore.loginUser = '张三';
    expect(appStore.loginUser).toBe('张三');

    appStore[numberSetAccessorName] = null as any;
    expect(appStore.sign).toBe('set-numberSetAccessorName');

    appStore[symbolSetAccessorName] = null as any;
    expect(appStore.sign).toBe('set-symbolSetAccessorName');

    expect(appStore[numberGetAccessorName]).toBe('get-numberGetAccessorName');
    expect(appStore[symbolGetAccessorName]).toBe('get-symbolGetAccessorName');

    appStore[numberBothAccessorName] = null as any;
    expect(appStore.sign).toBe('set-numberBothAccessorName');
    expect(appStore[numberBothAccessorName]).toBe('get-numberBothAccessorName');

    appStore[symbolBothAccessorName] = null as any;
    expect(appStore.$state.count).toBe(666);
    expect(appStore[symbolBothAccessorName]).toBe('666!');
});

it('symbol和number类型的key的方法', () => {
    const appStore = new AppStore();
    appStore[numberMethodName]();
    expect(appStore.sign).toBe('method-numberMethodName');
    appStore[symbolMethodName]();
    expect(appStore.sign).toBe('method-symbolMethodName');
});

it('支持继承', () => {
    const appStore = new AppStore();
    expect(appStore.version).toBe('1.0.0');

    appStore.versionSuffix = '~~';
    expect(appStore.version).toBe('1.0.0~~');

    appStore.version = '1.0.1';
    expect(appStore.version).toBe('1.0.1');
    expect(appStore.$state.version).toBe('1.0.1');

    appStore.$patch({ version: '1.0.2' });
    expect(appStore.version).toBe('1.0.2');
    expect(appStore.$state.version).toBe('1.0.2');
});

it('Class Store内部使用Pinia内置属性', () => {
    const classNameAsIdStore = new ClassNameAsIdStore();
    classNameAsIdStore.innerPatch(111);

    expect(classNameAsIdStore.count).toBe(111);
    expect(classNameAsIdStore.$state.count).toBe(111);
});

it('静态属性和静态方法', () => {
    expect(AppStore.serialsNo).toBe('123');
    AppStore.serialsNo = '456';
    expect(AppStore.serialsNo).toBe('456');
});

it('重置Store', () => {
    const appStore = new AppStore();
    appStore.version = '1.0.1';
    appStore.count = 100;

    appStore.countNoBak = 2;
    appStore.countObj.value.val = 2;
    appStore.countObjNoBak.value.val = 2;

    expect(appStore.version + appStore.count).toBe('1.0.1100');

    appStore.$reset();
    expect(appStore.version + appStore.count).toBe('1.0.05');
    expect(appStore.countNoBak).toBe(2);
    expect(appStore.countObj.value.val).toBe(1);
    expect(appStore.countObjNoBak.value.val).toBe(2);
});

it('Class Store的方法绑定至Pinia Store', () => {
    let flag = false;
    const appStore = new AppStore();
    appStore.$onAction(({ name }) => {
        if (name === 'increment') {
            flag = true;
        }
    });
    appStore.innerIncrement();
    expect(flag).toBe(true);
    appStore.count = 5;
});

it('钩子方法', () => {
    const numStore = new NumStore();
    expect(numStore.num2).toBe(1);
});

it('Pinia Store 和 Class Store的映射', () => {
    const appStore = new AppStore();
    expect((AppStore as any)[StoreManager.originalClassPropName].name).toBe('AppStore');
    expect((appStore as any)[StoreManager.originalInstancePropName].count).toBe(5);
});
