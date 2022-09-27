import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PushModule } from '@ngrx/component';
import { MediaPlayerStateMachineService } from './../../services/media-player-state-machine.service';

@Component({
  selector: 'learn-xstate-media-player',
  standalone: true,
  imports: [CommonModule, PushModule],
  template: `
    <div class="media-player" *ngIf="state$ | ngrxPush; let state">
      {{ state[0].value }}
      <div class="play-status">
        atBeginning: {{ state[0].context.atBeginning }}<br />
        atEnd: {{ state[0].context.atEnd }}
      </div>
    </div>
    <div class="button-bar">
      <button type="button" class="play" (click)="handler('Play')">Play</button>
      <button type="button" class="pause" (click)="handler('Pause')">
        Pause
      </button>
      <button type="button" class="stop" (click)="handler('Stop')">Stop</button>
      <button type="button" class="rewind" (click)="handler('Rewind')">
        Rewind
      </button>
      <button type="button" class="ff" (click)="handler('FastForward')">
        Fast Forward
      </button>
      <button
        type="button"
        class="at-beginning"
        (click)="handler('AtBeginning')"
      >
        Reached Beginning
      </button>
      <button type="button" class="at-end" (click)="handler('AtEnd')">
        Reached End
      </button>
    </div>
    <pre>{{ state$ | ngrxPush | json }}</pre>
  `,
  styleUrls: ['./media-player.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [MediaPlayerStateMachineService],
})
export class MediaPlayerComponent {
  protected readonly state$ = this._mediaPlayerStateMachineService.state$;

  constructor(
    private readonly _mediaPlayerStateMachineService: MediaPlayerStateMachineService
  ) {}

  handler(nextState: string) {
    this._mediaPlayerStateMachineService.actions$.next(nextState);
  }
}
