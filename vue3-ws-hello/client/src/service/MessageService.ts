import { notification } from 'ant-design-vue';
import { ERROR_UNKNOWN, RestfulUtil } from "@/util/RestfulUtil";
import { StringHelper } from "@/util/StringHelper";

export class MessageServiceImpl {

  debug = false;

  /**
   * shorthand version of sendMessage(MessageType.GOOD)
   */
  public async good(message: string, 
    options: MessageOptions|null = null,
  ): Promise<void> {
    this.sendMessage({
      type: MessageType.GOOD,
      text: message
    }, options);
  }

  /**
   * shorthand version of sendMessage(MessageType.INFO)
   */
  public async info(message: string, 
    options: MessageOptions|null = null,
  ): Promise<void> {
    this.sendMessage({
      type: MessageType.INFO,
      text: message
    }, options);
  }

  /**
   * shorthand version of sendMessage(MessageType.WARN)
   */
  public async warn(message: string, 
    options: MessageOptions|null = null,
  ): Promise<void> {
    this.sendMessage({
      type: MessageType.WARN,
      text: message
    }, options);
  }

  /**
   * sendMessage for error (if errorObject is provided, auto guess error message by it)
   */
  public async errorMsg(
    errorObject: any|null = null,
    message: string,
    options: MessageOptions|null = null,
  ): Promise<void> {
    if (errorObject) {
      let converted = RestfulUtil.asError(errorObject, {includeTrace:true});
      if (converted && converted.code && converted.code != ERROR_UNKNOWN) {
        // if error code exists, display error message by it instead.
        errorObject = converted;
        message = converted.code;
      } else if (converted?.message){
        message = converted?.message;
      }
    }

    if (errorObject) {
      if (options) {
        options.extra = errorObject;
      } else {
        options = {
          extra: errorObject,
        };
      }
    }
    this.sendMessage({
      type: MessageType.ERROR,
      text: message
    }, options);
  }

  /**
   * send local message (to messageStore)
   */
  public async sendMessage(message: Message,
    options: MessageOptions|null = null,
  ): Promise<void> {
    if (this.debug) console.log(`msg[${message.type}] :`, message.text);
    let duration = options?.doNoAutoClose ? 0 :
      (options?.durationSec || MESSAGE_DEFAULT_DURATION_SEC);
    switch (message.type) {
      case MessageType.INFO:
        notification.info({
          message: 'hi',
          description: message.text,
          duration: duration,
        });    
        break;
      case MessageType.WARN:
        notification.warn({
          message: 'hey',
          description: message.text,
          duration: duration,
        });    
        break;
      case MessageType.ERROR:
        notification.error({
          message: 'oops',
          description: message.text,
          duration: duration,
        });    
        break;
      case MessageType.GOOD:
        notification.success({
          message: 'nice',
          description: message.text,
          duration: duration,
        });    
        break;
      default:
        console.warn(`MessageType not handled:[${message.type}]`);
    }
  }

}

const MESSAGE_DEFAULT_DURATION_SEC = 4.5;

export enum MessageType {
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  GOOD ='GOOD',
}

export interface Message {
  id?: number;
  time?: Date;
  type: MessageType;
  text: string;
  extra?: any;
}

export interface MessageOptions {

  durationSec?: number,
  
  doNoAutoClose?: boolean,

  /**
   * extra data to be kept with the message.
   * (normally, not displayed)
   */
  extra?: any;
}


class Singleton {
  static value: MessageServiceImpl;
}

export function MessageService() {
  if (!Singleton.value) {
    Singleton.value = new MessageServiceImpl();
  }
  Singleton.value.debug = 
    !!(+import.meta.env.VITE_MessageService_debug);
  return Singleton.value;
}
