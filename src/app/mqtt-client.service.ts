import { Injectable } from '@angular/core';
import { Paho } from 'ng4-mqtt';

@Injectable({
  providedIn: 'root'
})
export class MqttClientService {

  private client: Paho.MQTT.Client;

  constructor() {
    this.client = new Paho.MQTT.Client('localhost', 15675, 'my-mqtt-client');
    this.client.connect({
      onSuccess: () => {
        console.log('Connected to RabbitMQ over MQTT');
      }
    });
  }

  public subscribe(destinationName: string, onMessageArrived: (message: Paho.MQTT.Message) => void): any {
    this.client.subscribe(destinationName, {});
    this.client.onMessageArrived = onMessageArrived;
  }
}
