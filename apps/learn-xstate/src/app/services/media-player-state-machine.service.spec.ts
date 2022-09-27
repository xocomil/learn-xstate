import { TestBed } from '@angular/core/testing';

import { MediaPlayerStateMachineService } from './media-player-state-machine.service';

describe('MediaPlayerStateMachineService', () => {
  let service: MediaPlayerStateMachineService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MediaPlayerStateMachineService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
