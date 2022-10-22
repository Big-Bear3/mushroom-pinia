import type { Class, MethodDescriptor } from '../types/globalTypes';

export function ObservableAction(): MethodDecorator {
    return ((target: Class, key: string, methodDescriptor: MethodDescriptor) => {}) as MethodDecorator;
}
