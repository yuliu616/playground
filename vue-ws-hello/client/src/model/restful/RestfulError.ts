/**
 * error object of an RESTful api call
 * 一个RESTful API调用时的错误
 */
export interface RestfulError {

  /**
   * HTTP status
   */
  statusCode: number;

  /**
   * request abort due to timeout
   * 是否因时限而客户端放弃请求
   */
  isTimeout: boolean;

  /**
   * app depended result/error code
   * app 自定义的 结果/错误码
   */
  code?: string;

  /**
   * human readable text message (not generic)
   * 比较适合人类看的错误讯息（但没有准确定义）
   */
  message?: string;

  /**
   * for message/code that takes arguments, this is the argument array.
   * 有时候，错误讯息中需要包含参数，这就是那些参数。
   */
  messageArguments?: string[];

  /**
   * debug info (normally not included)
   * debug 资讯（一般会被省略）
   */
  trace: any;

}
