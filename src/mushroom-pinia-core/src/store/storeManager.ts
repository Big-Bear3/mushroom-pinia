import type { Class } from 'src/types/globalTypes';

export class StoreManager {
    private static _instance: StoreManager;

    /** 类和类与其父类中@State()装饰器装饰的成员变量名的映射 */
    private classToStateMemberNames = new Map<Class, string[]>();

    /** 类和类与其父类中的set访问器名的映射 */
    private classToSetAccessorNames = new Map<Class, string[]>();

    /** 类和类与其父类中的get访问器名的映射 */
    private classToGetAccessorNames = new Map<Class, string[]>();

    /** 类和类与其父类中同时拥有set、get的访问器名的映射 */
    private classToBothAccessorNames = new Map<Class, string[]>();

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

    addAccessorAndMethodNames(c: Class): void {
        const allSetAccessorNames = new Set<string>();
        const allGetAccessorNames = new Set<string>();
        const allBothAccessorNames = new Set<string>();
        const allMethodNames = new Set<string>();

        let currentClass = c;
        while (currentClass && currentClass.prototype) {
            const currentClassMethodNames = Object.getOwnPropertyNames(currentClass.prototype);
            for (const methodName of currentClassMethodNames.reverse()) {
                const methodType = this.getMethodType(currentClass, methodName);
                switch (methodType) {
                    case 'set':
                        allSetAccessorNames.add(methodName);
                        break;

                    case 'get':
                        allGetAccessorNames.add(methodName);
                        break;

                    case 'setget':
                        allBothAccessorNames.add(methodName);
                        break;

                    case 'method':
                        allMethodNames.add(methodName);
                        break;
                }
            }
            currentClass = Object.getPrototypeOf(currentClass);
        }

        if (allSetAccessorNames.size > 0) this.classToSetAccessorNames.set(c, Array.from(allSetAccessorNames).reverse());
        if (allGetAccessorNames.size > 0) this.classToGetAccessorNames.set(c, Array.from(allGetAccessorNames).reverse());
        if (allBothAccessorNames.size > 0) this.classToBothAccessorNames.set(c, Array.from(allBothAccessorNames).reverse());
        if (allMethodNames.size > 0) this.classToMethodNames.set(c, Array.from(allMethodNames).reverse());
    }

    getSetAccessorNames(c: Class): string[] {
        return this.classToSetAccessorNames.get(c);
    }

    getGetAccessorNames(c: Class): string[] {
        return this.classToGetAccessorNames.get(c);
    }

    getBothAccessorNames(c: Class): string[] {
        return this.classToBothAccessorNames.get(c);
    }

    getMethodNames(c: Class): string[] {
        return this.classToMethodNames.get(c);
    }

    private getMethodType(c: Class, methodName: string): 'constructor' | 'set' | 'get' | 'setget' | 'method' {
        if (methodName === 'constructor') return 'constructor';
        const descriptor = Object.getOwnPropertyDescriptor(c.prototype, methodName);
        if (descriptor.set && !descriptor.get) return 'set';
        if (!descriptor.set && descriptor.get) return 'get';
        if (descriptor.set && descriptor.get) return 'setget';
        if (descriptor.value && !descriptor.set && !descriptor.get) return 'method';
        return undefined;
    }

    static get instance(): StoreManager {
        if (!StoreManager._instance) {
            StoreManager._instance = new StoreManager();
        }
        return StoreManager._instance;
    }
}
