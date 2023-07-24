export class PromiseUtil {

  public static async wait(
    timeoutMs: number
  ): Promise<void> {
    return new Promise((resolve, reject)=>{
      setTimeout(()=>{
        resolve();
      }, timeoutMs);
    });
  }

  public static async waitFor<T>(
    timeoutMs: number,
    resultValue: T,
  ): Promise<T> {
    return new Promise((resolve, reject)=>{
      setTimeout(()=>{
        resolve(resultValue);
      }, timeoutMs);  
    }); 
  }

}
