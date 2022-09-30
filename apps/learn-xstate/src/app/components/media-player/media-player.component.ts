import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PushModule } from '@ngrx/component';
import { MediaPlayerActions, MediaPlayerComponentStore } from '../../services/media-player-component.store';

@Component({
  selector: 'learn-xstate-media-player',
  standalone: true,
  imports: [CommonModule, PushModule],
  providers: [MediaPlayerComponentStore],
  template: `
    <div class="media-player" *ngIf="state$ | ngrxPush; let state">
      {{ state.value }}
      <div class="play-status">
        atBeginning: {{ state.context.atBeginning }}<br />
        atEnd: {{ state.context.atEnd }}
      </div>
    </div>
    <div class="button-bar">
      <button type="button" class="play" (click)="handler('Play')">Play</button>
      <button type="button" class="pause" (click)="handler('Pause')">Pause</button>
      <button type="button" class="stop" (click)="handler('Stop')">Stop</button>
      <button type="button" class="rewind" (click)="handler('Rewind')">Rewind</button>
      <button type="button" class="ff" (click)="handler('FastForward')">Fast Forward</button>
      <button type="button" class="at-beginning" (click)="handler('AtBeginning')">Reached Beginning</button>
      <button type="button" class="at-end" (click)="handler('AtEnd')">Reached End</button>
    </div>
    <pre>{{ state$ | ngrxPush | json }}</pre>
  `,
  styleUrls: ['./media-player.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MediaPlayerComponent {
  protected readonly state$ = this._componentStore.currentState$;

  constructor(private readonly _componentStore: MediaPlayerComponentStore) {}

  handler(nextState: MediaPlayerActions) {
    this._componentStore.sendAction(nextState);
  }
}
