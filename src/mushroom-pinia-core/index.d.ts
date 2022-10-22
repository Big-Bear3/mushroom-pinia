export function Store(): ClassDecorator;
export function State(): PropertyDecorator;

export abstract class PiniaStore {
    $reset: () => void;
}

export const mushroomPinia: any;
