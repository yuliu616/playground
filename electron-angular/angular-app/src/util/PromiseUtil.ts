import * as bluebird from 'bluebird';

export class PromiseUtil {

  /**
   * run a task after a delay(timeout), defined as Promise.
   * @param timeout 
   * @param task to be invoked after timeout, result of it will 
   * become Resolve of the Promise.
   */
  static async timedTask<T>(timeout: number, task: ()=>T): Promise<T>{
    return new Promise((resolve, reject)=>{
      setTimeout(()=>{
        try {
          let result = task();
          resolve(result);
        } catch (err){
          reject(err);
        }
      }, timeout);
    });
  }

}
