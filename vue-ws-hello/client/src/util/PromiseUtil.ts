export class PromiseUtil {

  public static async wait(
    timeoutMs: number, 
    resultValue: any = null,
  ){
    return new Promise((resolve, reject)=>{
      setTimeout(()=>{
        // waited 5s
        resolve(resultValue);
      }, timeoutMs);  
    }); 
  }

}
