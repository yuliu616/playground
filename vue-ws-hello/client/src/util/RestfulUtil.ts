import { RestfulError } from "@/model/restful/RestfulError";
import axios, { AxiosError, AxiosResponse } from "axios";

export const ERROR_UNKNOWN = 'ERROR_UNKNOWN';

/**
 * util class for RESTful api
 * RESTful api 的工具类
 */
export class RestfulUtil {

  static debug = false;

  /**
   * convert the provided JS error object (produced by Axios)
   * to a generic error object.
   * 以 error(JS error object)参数生成定义化的错误对象
   */
  public static asError(err: any, 
    options: { includeTrace: boolean }|null = null,
  ): RestfulError {
    let errorMessage: string|null = null;
    let trace: any = {};

    // for AxiosResponse
    let axiosErr: AxiosError = err;
    let axiosErrRes: AxiosResponse = err.response;
    
    if (err && err.message) {
      errorMessage = err.message;
    }
    if (options?.includeTrace && axiosErr.config) {
      trace.endpoint = `${axiosErr.config.method?.toUpperCase()} ${axiosErr.config.url}`;
    }

    if (RestfulUtil.debug) {
      if (axiosErr.isAxiosError) {
        if (axiosErr.response) {
          console.log('asError: axiosErr.response =', axiosErr.response);
        } else {
          console.log('asError: axiosErr =', axiosErr);
        }
      } else {
        console.log('asError: non-axiosErr =', err);
      }
    }

    // for error without response
    if (axiosErr.isAxiosError && !axiosErr.response) {
      if (!axiosErr.code && axiosErr.message == 'Network Error') {
        // for offline mode, code will be empty
        return <RestfulError>{
          isTimeout: false,
          code: 'AXIOS_ERROR_NO_NETWORK',
          trace: Object.keys(trace) ? trace : null,
        };
      } else if (axiosErr.code == 'ECONNABORTED') {
        return <RestfulError>{
          isTimeout: true,
          code: 'AXIOS_ERROR_ECONNABORTED',
          trace: Object.keys(trace) ? trace : null,
        };
      } else {
        console.error(`unhandled axios error code: [${axiosErr.code}]`);
        return <RestfulError>{
          code: ERROR_UNKNOWN,
          trace: Object.keys(trace) ? trace : null,
        };
      }

    } else { // for response exists
      // for non-app error (network error, etc.)
      if (axiosErrRes.status == 404) {
        // 404 error
        return <RestfulError>{
          code: `HTTP_ERROR_${axiosErrRes.status}`,
          message: axiosErrRes.statusText,
          trace: Object.keys(trace) ? trace : null,
        };
      } else if (axiosErrRes.status >= 500 && axiosErrRes.status < 600) {
        // 5xx error
        return <RestfulError>{
          code: `HTTP_ERROR_${axiosErrRes.status}`,
          message: axiosErrRes.statusText,
          trace: Object.keys(trace) ? trace : null,
        };

      } else if (axiosErrRes && axiosErrRes.config && axiosErrRes.status) {
        // 4xx error: app defined error
        if (options?.includeTrace && axiosErrRes.data) {
          trace.payload = axiosErrRes.data;
        }
        let result: RestfulError = {
          statusCode: axiosErrRes.status,
          isTimeout: false,
          trace: Object.keys(trace) ? trace : null,
        };
        if (axiosErrRes.status >= 400 && axiosErrRes.status < 500 
        && axiosErrRes.data) {
          if (axiosErrRes.data.errorCode || axiosErrRes.data.code) {
            // for response payload is coded
            result.code = (axiosErrRes.data.errorCode || axiosErrRes.data.code);
            result.messageArguments = axiosErrRes.data?.arg;
          }
        } else if (errorMessage){
          result.message = errorMessage;
        }
        return result;
      }
    }

    // fallback
    return <RestfulError>{
      code: ERROR_UNKNOWN,
      message: errorMessage,
    };
  }


}
