import { Injectable } from '@angular/core';
import { Paho } from 'ng4-mqtt/mqttws31';
import { BehaviorSubject, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';

export enum State {
  CLOSED,
  TRYING,
  CONNECTED,
  SUBSCRIBED,
  UNSUBSCRIBING,
  DISCONNECTED
}

/**
 *  Generic service to be used to connect with backend via RabbitMQ.
 *  @author Ashish
 *  @version 3
 */
@Injectable({
  providedIn: 'root'
})
export class MqttService {

  /**
   * Connection status of RabbitMQ server.
   * @type {State}
   * states:
   * - CLOSED : not connected to server.
   * - TRYING : trying to establish connection with server.
   * - CONNECTED : connected to server.
   * - SUBSCRIBED : subscribed to the given queue.
   * - UNSUBSCRIBING : unsubscribing from the given queue.
   * - DISCONNECTED : not connected to server.
   */
  public state: BehaviorSubject<State> = new BehaviorSubject<State>(State.CLOSED);
  private clientId = (localStorage.getItem("userID") ?? "UI") + '_U' + Math.floor(Math.random() * 1024 * 1024);
  private client: Paho.MQTT.Client = new Paho.MQTT.Client(environment.mqtt.server, environment.mqtt.port, '/ws', this.clientId);
  private connectedTopicName: string | string[] | null = null;
  private messages = new Subject<any>();
  private useSSL: boolean = false;

  constructor() {
    // if (environment.mqtt.useSSL !== undefined) {
    //   this.useSSL = environment.mqtt.useSSL === 'false' ? false : true;
    // }
    /** Checks if mqtt service is required or not; then initializes based on the flag. */
    // if (environment.mqtt.required === 'true') {
    this.initialize();
    // }
  }

  /**
   * Initializes the connection.
   */
  private initialize() {
    this.state.next(State.TRYING);
    this.initiateConnection();
  }

  private initiateConnection() {
    this.connectedTopicName = localStorage.getItem('connectedQueueName')?.split(',') ?? null; //Important: fetches the queue name connected earlier to for reconnection.
    this.onConnectionLost();
    this.client.connect({
      userName: 'guest', password: 'guest', onSuccess: this.checkAndConnect.bind(this),
      onFailure: this.sleepAndRetry.bind(this), useSSL: this.useSSL, keepAliveInterval: 8
    });
  }

  private checkAndConnect(sm: any) {
    this.state.next(State.CONNECTED);
    if (this.connectedTopicName !== null && this.state.value == 2) { //Check to only subscribe to topic if it is connected
      this.subscribeToQueue(this.connectedTopicName);
    }
  }

  /**
   * This method retries to connect to the server incase it is unable to connect it.
   * Timeout set is : 5 seconds.
   * @param sm :not required( used for binding in angular)
   */
  private sleepAndRetry(sm: any) {
    console.log("Retrying after 5 seconds");
    setTimeout(() => {
      this.initiateConnection();
    }, 5000);
  }

  /**
   * This method is called when a queue needs to connected to.
   * @param queueName the queue name to which user wants to subscribe.
   */
  private subscribeToQueue(queueName: string | string[]) {
    if (Array.isArray(queueName)) {
      localStorage.setItem('connectedQueueName', queueName.join(','));
      queueName.forEach(queue => this.subscribe(queue));
    }
    else {
      this.connectedTopicName = queueName;
      localStorage.setItem('connectedQueueName', queueName); //Stores the topic name
      this.subscribe(queueName);
    }
  }

  private subscribe(topic: string) {
    if (this.connectedTopicName !== null && this.connectedTopicName !== '') {
      if ((this.client.isConnected()) && (topic !== '')) {
        this.client.subscribe(topic, {});
        this.state.next(State.SUBSCRIBED);
        console.log("Connected to Queue:" + topic + " with Client ID:" + this.clientId + " on " + new Date().toTimeString());
        this.client.onMessageArrived = (message: Paho.MQTT.Message) => {
          console.log('Message arrived : ' + message.payloadString);
          this.messages.next(JSON.parse(message.payloadString));
        };
      }
    }
  }

  /**
   * Method to be used to get messages from the given queue.
   * @param topicName  Topic name to get messages from.
   * @type {string} incase of subscription is required with **`one` queue only**.
   * @type {string[]} incase of subscription is required with **`multiple` queues**.
   * @returns observable sequence of messages.
   */
  getMessages(topicName: string | string[]) {
    this.subscribeToQueue(topicName);
    return this.messages;
  }

  sendMessage(message: string) {
    let packet = new Paho.MQTT.Message(message);
    packet.destinationName = "123456";
    this.client.send(packet);
  }

  //To get error message on connection lost.
  private onConnectionLost() {
    this.client.onConnectionLost = (responseObject: Object) => {
      this.state.next(State.DISCONNECTED);
      console.log('Connection lost : ' + JSON.stringify(responseObject) + new Date());
      this.initialize();
    };
  }

  /**
   * Unsubscribes from the given queue.
   * @param queueName queue to unsubscribe from.
   */
  disconnect(queueName: string | string[]) {
    localStorage.removeItem('connectedQueueName');
    if (Array.isArray(queueName)) {
      queueName.forEach(queue => this.unsubscribe(queue));
      this.connectedTopicName = null;
    }
    else {
      this.unsubscribe(queueName);
    }
    this.state = new BehaviorSubject<State>(State.CONNECTED);
  }

  private unsubscribe(topic: string) {
    if (this.state.value == 3 || this.state.value == 2) {
      this.client.unsubscribe(topic, {});
      this.state.next(State.UNSUBSCRIBING);
      console.log("Disconnected from the queue: " + topic);
    }
  }
}
