import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PushModule } from '@ngrx/component';
import { MediaPlayerStateMachineService } from './../../services/media-player-state-machine.service';

@Component({
  selector: 'learn-xstate-media-player',
  standalone: true,
  imports: [CommonModule, PushModule],
  template: ` <pre>{{ state$ | ngrxPush | json }}</pre> `,
  styleUrls: ['./media-player.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [MediaPlayerStateMachineService],
})
export class MediaPlayerComponent {
  protected readonly state$ = this._mediaPlayerStateMachineService.state$;

  constructor(
    private readonly _mediaPlayerStateMachineService: MediaPlayerStateMachineService
  ) {}
}
