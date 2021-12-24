export class PromiseUtil {

  public static async wait(
    timeoutMs: number, 
    resultValue: any = null,
  ){
    return new Promise((resolve, reject)=>{
      setTimeout(()=>{
        resolve(resultValue);
      }, timeoutMs);  
    }); 
  }

  public static async waitForRightMoment(periodLengthSec, currentTime){
    let nowValue = currentTime.getSeconds() * 1000 + currentTime.getMilliseconds();
    let period = periodLengthSec * 1000;
    let passed = nowValue % period;
    let nextMoment = nowValue - passed + period;
    // console.log('now =', currentTime.toISOString(), ', nowValue =', nowValue,
    //   ', passed =', passed, ', waitFor:', nextMoment-nowValue);
    return PromiseUtil.wait(nextMoment - nowValue);
  }

}
