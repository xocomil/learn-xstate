import { Injectable, OnDestroy } from '@angular/core';
import { fromEventPattern, Observable, Subject, Subscription } from 'rxjs';
import {
  AnyEventObject,
  BaseActionObject,
  interpret,
  Interpreter,
  ResolveTypegenMeta,
  ServiceMap,
  StateValue,
  TypegenDisabled,
} from 'xstate';
import { MediaPlayerContext, mediaPlayerStateMachine } from '../state machines/media.player';

export type MediaPlayerInterpreter = Interpreter<
  MediaPlayerContext,
  any,
  AnyEventObject,
  { value: any; context: MediaPlayerContext },
  ResolveTypegenMeta<TypegenDisabled, AnyEventObject, BaseActionObject, ServiceMap>
>;

export interface MediaPlayerState {
  value: StateValue;
  context: MediaPlayerContext;
}

@Injectable()
export class MediaPlayerStateMachineService implements OnDestroy {
  readonly #subs = new Subscription();
  readonly state$: Observable<MediaPlayerState[]>;
  readonly #service: MediaPlayerInterpreter;
  readonly actions$ = new Subject<any>();

  constructor() {
    const { state$, service } = this.#setupMachine();
    this.state$ = state$;
    this.#service = service;
  }

  #setupMachine(): {
    state$: Observable<MediaPlayerState[]>;
    service: MediaPlayerInterpreter;
  } {
    const service = interpret(mediaPlayerStateMachine);

    const state$ = fromEventPattern<MediaPlayerState[]>(
      (handler) => {
        service.onTransition(handler).start();

        return service;
      },
      (handler, service) => service.stop()
    );

    this.#subs.add(this.actions$.subscribe(service.send));

    return { state$, service };
  }

  ngOnDestroy() {
    this.#subs.unsubscribe();
  }
}
