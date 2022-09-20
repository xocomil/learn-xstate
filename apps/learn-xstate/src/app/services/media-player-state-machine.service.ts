import { Injectable, OnDestroy } from '@angular/core';
import { fromEventPattern, Observable, Subject, Subscription } from 'rxjs';
import {
  AnyEventObject,
  BaseActionObject,
  interpret,
  Interpreter,
  ResolveTypegenMeta,
  ServiceMap,
  TypegenDisabled,
} from 'xstate';
import {
  MediaPlayerContext,
  mediaPlayerStateMachine,
} from '../state machines/media.player';

type MediaPlayerInterpreter = Interpreter<
  MediaPlayerContext,
  any,
  AnyEventObject,
  { value: any; context: MediaPlayerContext },
  ResolveTypegenMeta<
    TypegenDisabled,
    AnyEventObject,
    BaseActionObject,
    ServiceMap
  >
>;

@Injectable()
export class MediaPlayerStateMachineService implements OnDestroy {
  readonly #subs = new Subscription();
  readonly state$: Observable<any>;
  readonly #service: MediaPlayerInterpreter;
  readonly actions$ = new Subject<any>();

  constructor() {
    const { state$, service } = this.#setupMachine();
    this.state$ = state$;
    this.#service = service;
  }

  #setupMachine(): {
    state$: Observable<MediaPlayerContext>;
    service: MediaPlayerInterpreter;
  } {
    const service = interpret(mediaPlayerStateMachine);

    const state$ = fromEventPattern<MediaPlayerContext>(
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
