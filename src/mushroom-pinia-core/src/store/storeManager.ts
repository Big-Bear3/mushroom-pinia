import type { Class } from 'src/types/globalTypes';

export class StoreManager {
    private static _instance: StoreManager;

    /** 类和类与其父类中@State()装饰器装饰的成员变量名的映射 */
    private classToStateMemberNames = new Map<Class, string[]>();

    /** 类和类与其父类中的get访问器名的映射 */
    private classToGetAccessorNames = new Map<Class, string[]>();

    /** 类和类与其父类中的方法名名的映射 */
    private classToMethodNames = new Map<Class, string[]>();

    addStateMemberName(c: Class, stateMemberName: string): void {
        let stateMemberNames = this.classToStateMemberNames.get(c);
        if (!stateMemberNames) {
            stateMemberNames = [];
            this.classToStateMemberNames.set(c, stateMemberNames);
        }
        stateMemberNames.push(stateMemberName);
    }

    getStateMemberNames(c: Class): string[] {
        const allStateMemberNames = new Set<string>();

        let currentClass = c;
        while (currentClass) {
            const currentClassStateMemberNames = this.classToStateMemberNames.get(currentClass);
            if (currentClassStateMemberNames) {
                for (const stateMemberName of currentClassStateMemberNames.reverse()) {
                    allStateMemberNames.add(stateMemberName);
                }
            }

            currentClass = Object.getPrototypeOf(currentClass);
        }
        return Array.from(allStateMemberNames).reverse();
    }

    addGetAccessorNames(c: Class): void {
        const allGetAccessorNames = new Set<string>();

        let currentClass = c;
        while (currentClass && currentClass.prototype) {
            const currentClassMethodNames = Object.getOwnPropertyNames(currentClass.prototype);
            for (const methodName of currentClassMethodNames.reverse()) {
                if (methodName === 'constructor' || !this.isGetAccessor(currentClass, methodName)) continue;
                allGetAccessorNames.add(methodName);
            }
            currentClass = Object.getPrototypeOf(currentClass);
        }

        this.classToGetAccessorNames.set(c, Array.from(allGetAccessorNames).reverse());
    }

    getGetAccessorNames(c: Class): string[] {
        return this.classToGetAccessorNames.get(c);
    }

    addMethodNames(c: Class): void {
        const allMethodNames = new Set<string>();

        let currentClass = c;
        while (currentClass && currentClass.prototype) {
            const currentClassMethodNames = Object.getOwnPropertyNames(currentClass.prototype);
            for (const methodName of currentClassMethodNames.reverse()) {
                if (methodName === 'constructor' || !this.isMethod(currentClass, methodName)) continue;
                allMethodNames.add(methodName);
            }
            currentClass = Object.getPrototypeOf(currentClass);
        }

        this.classToMethodNames.set(c, Array.from(allMethodNames).reverse());
    }

    getMethodNames(c: Class): string[] {
        return this.classToMethodNames.get(c);
    }

    private isGetAccessor(c: Class, methodName: string): boolean {
        const descriptor = Object.getOwnPropertyDescriptor(c.prototype, methodName);
        if (descriptor.get && !descriptor.set) return true;
        return false;
    }

    private isMethod(c: Class, methodName: string): boolean {
        const descriptor = Object.getOwnPropertyDescriptor(c.prototype, methodName);
        if (descriptor.value && !descriptor.set && !descriptor.get) return true;
        return false;
    }

    static get instance(): StoreManager {
        if (!StoreManager._instance) {
            StoreManager._instance = new StoreManager();
        }
        return StoreManager._instance;
    }
}
