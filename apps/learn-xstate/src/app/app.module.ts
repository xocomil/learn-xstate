import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { MediaPlayerComponent } from './components/media-player/media-player.component';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, MediaPlayerComponent],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
