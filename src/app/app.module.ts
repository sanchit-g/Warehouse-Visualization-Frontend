import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { GraphComponent } from './Components/Graph/graph.component';
import { environment as env } from '../environments/environment';
import { HttpClientModule } from '@angular/common/http';
import { MqttService } from './Services/mqtt.service';

@NgModule({
  declarations: [AppComponent, GraphComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatCardModule,
    MatButtonModule,
    HttpClientModule
  ],
  providers: [
    MqttService
  ],
  bootstrap: [AppComponent],
})
export class AppModule {

}
