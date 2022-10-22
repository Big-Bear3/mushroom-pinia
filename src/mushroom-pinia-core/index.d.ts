import type { App } from 'vue';

export function Store(id: string): ClassDecorator;
export function State(): PropertyDecorator;

export const mushroomPinia: { install: (app: App) => void };
