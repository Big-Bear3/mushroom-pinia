import type { Store } from 'pinia';

export abstract class PiniaStore {
    // $state: UnwrapRef<S> & PiniaCustomStateProperties<S>;
    // $patch(partialState: _DeepPartial<UnwrapRef<S>>): void;
    // $patch<F extends (state: UnwrapRef<S>) => any>(stateMutator: ReturnType<F> extends Promise<any> ? never : F): void;
    // $reset(): void;
    // $subscribe(
    //     callback: SubscriptionCallback<S>,
    //     options?: {
    //         detached?: boolean;
    //     } & WatchOptions
    // ): () => void;
    // $onAction(callback: StoreOnActionListener<Id, S, G, A>, detached?: boolean): () => void;
    // $dispose(): void;

    $reset: () => void;

    private definedPiniaStore: Store;
}
