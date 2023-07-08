import { message, notification } from 'ant-design-vue';
import { StringHelper } from "@/util/StringHelper";

export class MessageServiceImpl {

  debug = false;

  public async info(options: {
    message: string, 
    description?: string
  }): Promise<void> {
    notification.info({
      message: options.message,
      description: options.description,
    });
  }

  public async good(options: {
    message: string, 
    description?: string
  }): Promise<void> {
    notification.success({
      message: options.message,
      description: options.description,
    });
  }

}

class Singleton {
  static value: MessageServiceImpl;
}

export function MessageService(debug = false) {
  if (!Singleton.value) {
    Singleton.value = new MessageServiceImpl();
  }
  Singleton.value.debug = debug;
  return Singleton.value;
}
