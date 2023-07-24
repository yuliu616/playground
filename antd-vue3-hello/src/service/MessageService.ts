import { message, notification } from 'ant-design-vue';
import { StringUtil } from "@/util/StringUtil";
import type { ILogger } from '@/model/core/ILogger';

let darkTheme = !!(+import.meta.env.VITE_DarkTheme);

export class MessageServiceImpl {

  debug = false;

  public async info(options: {
    message: string, 
    description?: string
  }): Promise<void> {
    notification.info({
      message: options.message,
      description: options.description,
      class: (darkTheme ? 'my my-antd-notification-dark':undefined),
    });
  }

  public async error(options: {
    message: string, 
    description?: string
  }): Promise<void> {
    notification.error({
      message: options.message,
      description: options.description,
      class: (darkTheme ? 'my my-antd-notification-dark':undefined),
    });
  }

  public async good(options: {
    message: string, 
    description?: string
  }): Promise<void> {
    notification.success({
      message: options.message,
      description: options.description,
      class: (darkTheme ? 'my my-antd-notification-dark':undefined),
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
