import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { GraphComponent } from './graph/graph.component';
// import { MqttModule, IMqttServiceOptions } from 'ngx-mqtt';
import { environment as env } from '../environments/environment';
import { HttpClientModule } from '@angular/common/http';
import { MqttClientService } from './mqtt-client.service';
import { MqttService } from './services/mqtt.service';

// const MQTT_SERVICE_OPTIONS: IMqttServiceOptions = {
//   hostname: env.mqtt.server,
//   port: env.mqtt.port,
//   protocol: env.mqtt.protocol === 'wss' ? 'wss' : 'ws',
//   path: '',
// };

@NgModule({
  declarations: [AppComponent, GraphComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatCardModule,
    MatButtonModule,
    HttpClientModule
    // MqttModule.forRoot(MQTT_SERVICE_OPTIONS),
  ],
  providers: [
    MqttClientService,
    MqttService
  ],
  bootstrap: [AppComponent],
})
export class AppModule {

}
