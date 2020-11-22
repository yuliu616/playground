import { Injectable } from '@angular/core';
import { EventEmitter } from 'events';

@Injectable({
  providedIn: 'root'
})
export class ClassicAlertService {

  private messageList: string[] = [];
  private messageArrived: EventEmitter = new EventEmitter();

  constructor() { }

  addMessage(message: string){
    let time = new Date().toISOString();
    let timedMessage = `${time}: ${message}`;
    console.log(timedMessage);
    window.alert(timedMessage);
    this.messageList.push(timedMessage);
    this.messageArrived.emit('added');
  }

  getMessageCount(): number {
    return this.messageList.length;
  }

  getMessageAt(index: number): string {
    return this.messageList[index];
  }

}
