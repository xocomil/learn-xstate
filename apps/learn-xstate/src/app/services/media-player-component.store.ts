import { Injectable, OnDestroy } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import produce from 'immer';
import { Observable, tap } from 'rxjs';
import { AnyEventObject, BaseActionObject, interpret, ResolveTypegenMeta, ServiceMap, State, TypegenDisabled } from 'xstate';
import { MediaPlayerContext, mediaPlayerStateMachine } from '../state machines/media.player';
import { MediaPlayerInterpreter, MediaPlayerState } from './media-player-state-machine.service';

type StateMachineState = State<
  MediaPlayerContext,
  AnyEventObject,
  any,
  {
    value: any;
    context: MediaPlayerContext;
  },
  ResolveTypegenMeta<TypegenDisabled, AnyEventObject, BaseActionObject, ServiceMap>
>;

interface ComponentState {
  currentState?: StateMachineState;
}

const initialState: ComponentState = Object.freeze({
  currentState: undefined,
});

@Injectable({
  providedIn: 'root',
})
export class MediaPlayerComponentStore extends ComponentStore<ComponentState> implements OnDestroy {
  readonly #service: MediaPlayerInterpreter;
  readonly currentState$: Observable<MediaPlayerState | undefined> = this.select((state) => state.currentState);

  constructor() {
    super({
      ...initialState,
    });

    this.#service = this.#setupMachine();
  }

  #updateState = this.updater((state, machineState: StateMachineState) => {
    return produce(state, (draft) => {
      draft.currentState = machineState;
    });
  });

  sendAction = this.effect((action$: Observable<'Playing' | 'Stopped' | 'Paused' | 'Rewind' | 'Fast Forward'>) =>
    action$.pipe(
      tap((action) => {
        this.#service.send(action);
      })
    )
  );

  override ngOnDestroy(): void {
    this.#service.stop();

    super.ngOnDestroy();
  }

  #setupMachine(): MediaPlayerInterpreter {
    const service = interpret(mediaPlayerStateMachine);

    service.onTransition((state) => this.#updateState(state)).start();

    return service;
  }
}
