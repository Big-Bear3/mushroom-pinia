import type { StoreOnActionListener, SubscriptionCallback, _DeepPartial } from 'pinia';
import type { UnwrapRef, WatchOptions } from 'vue';
import type { Actions, Getters, States } from '../types/globalTypes';

export abstract class PiniaStore {
    declare $id: string;

    declare $state: UnwrapRef<States<this>>;

    declare $patch: ((partialState: _DeepPartial<UnwrapRef<States<this>>>) => void) &
        (<F extends (state: UnwrapRef<States<this>>) => any>(
            stateMutator: ReturnType<F> extends Promise<any> ? never : F
        ) => void);

    declare $reset: () => void;

    declare $subscribe: (
        callback: SubscriptionCallback<States<this>>,
        options?: {
            detached?: boolean;
        } & WatchOptions
    ) => () => void;

    declare $onAction: (
        callback: StoreOnActionListener<string, States<this>, Getters<this>, Actions<this>>,
        detached?: boolean
    ) => () => void;

    declare $dispose: () => void;
}
