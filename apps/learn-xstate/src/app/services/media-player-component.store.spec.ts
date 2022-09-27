import { TestBed } from '@angular/core/testing';
import { MediaPlayerComponentStore } from './media-player-component.store';

describe('MediaPlayerComponentStore', () => {
  let service: MediaPlayerComponentStore;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MediaPlayerComponentStore);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
