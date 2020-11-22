import { Injectable } from '@angular/core';
import { EventEmitter } from 'events';
import { ToastrService } from 'ngx-toastr';
import { CollectionUtil } from 'src/util/CollectionUtil';

const MESSAGE_LIST_SIZE_LIMIT =  500;

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {

  public debug = false;

  private messageList: FeedbackMessage[] = [];
  private messageArrived: EventEmitter = new EventEmitter();

  constructor(
    private toastrService: ToastrService,
  ) { 
    if (!this.messageList) {
      this.messageList = [];
    }
  }

  info(message: string, subject: string = null, 
    detail: object = null,
  ): FeedbackMessage {
    return this.addMessage(message, subject, FeedbackMessagePriority.INFO,
      detail);
  }

  warn(message: string, subject: string = null, 
    detail: object = null,
  ): FeedbackMessage {
    return this.addMessage(message, subject, FeedbackMessagePriority.WARNING,
      detail);
  }

  good(message: string, subject: string = null, detail: 
    object = null,
  ): FeedbackMessage {
    return this.addMessage(message, subject, FeedbackMessagePriority.SUCCESS,
      detail);
  }

  bad(message: string, subject: string = null, 
    detail: object = null,
  ): FeedbackMessage {
    return this.addMessage(message, subject, FeedbackMessagePriority.ERROR,
      detail);
  }

  addMessage(message: string, subject: string, 
    priority: FeedbackMessagePriority,
    detail: object = null) : FeedbackMessage
  {
    let m: FeedbackMessage = {
      time: new Date(),
      message: message,
      subject: subject,
      priority: priority,
      detail: detail,
    };
    return this.addMessage2(m);
  }

  addMessage2(message: FeedbackMessage): FeedbackMessage {
    if (this.debug) {
      console.log(`${message.time.toISOString()}: ${message.message}`);
    }
    switch (message.priority){
      case FeedbackMessagePriority.INFO:
        this.toastrService.info(message.message, message.subject);
        break;
      case FeedbackMessagePriority.WARNING:
        this.toastrService.warning(message.message, message.subject);
        break;
      case FeedbackMessagePriority.SUCCESS:
        this.toastrService.success(message.message, message.subject);
        break;
      case FeedbackMessagePriority.ERROR:
        this.toastrService.error(message.message, message.subject);
        break;
      default:
        console.error(`unknown message priority: ${message.priority}`);
    }
    this.messageList.push(message);
    this.messageArrived.emit(FeedbackServiceEvent.ADDED);

    // auto remove items to ensure size not too big.
    if (this.messageList.length > MESSAGE_LIST_SIZE_LIMIT) {
      this.messageList = CollectionUtil.takesLast(this.messageList, MESSAGE_LIST_SIZE_LIMIT);
    }

    return message;
  }

  getMessageCount(): number {
    return this.messageList.length;
  }

  getMessageAt(index: number): FeedbackMessage {
    return this.messageList[index];
  }

  getLastMessage(): FeedbackMessage {
    if (this.messageList.length > 0) {
      return this.messageList[this.messageList.length-1];
    } else {
      return null;
    }
  }

  clearMessage(keepCount: number = 0){
    if (keepCount <= 0) {
      this.messageList = [];
    } else {
      this.messageList = CollectionUtil.takesLast(this.messageList, keepCount);
    }
  }

}

export interface FeedbackMessage {
  time: Date,
  message: string,
  subject?: string,
  priority: FeedbackMessagePriority,
  detail?: object,
  errorCode?: string,
  causeLocation?: string,
}

export enum FeedbackMessagePriority {
  ERROR = 'ERROR',
  SUCCESS = 'SUCCESS',
  INFO = 'INFO',
  WARNING = 'WARNING',
  TIPS = 'TIPS',
};

export enum FeedbackServiceEvent {
  ADDED = 'ADDED',
}
