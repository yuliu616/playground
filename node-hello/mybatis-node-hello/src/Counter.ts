import { v1 as uuidV1, v4 as uuidV4 } from 'uuid';

export class Counter_Straight {

  value: number;
  step = 1;
  offset = 0;
  counter = 0;

  constructor(idBaseNumber){
    this.value = idBaseNumber;
  }

  getAndInc(){
    this.counter += 1;
    this.value += this.step;
    return this.value + this.offset;
  }
};

export class Counter_Uuid {

  value: number;
  step = 1
  counter = 0;

  constructor(idBaseNumber){
    this.value = idBaseNumber;
  }

  getAndInc(){
    this.counter += 1;
    this.value += this.step;
    // return uuidV4();
    return uuidV1();
  }
};

export class Counter_TimeBasedRand {

  counter = 0;

  constructor(idBaseNumber){
    // ignore idBaseNumber
  }

  /**
   * a time-based number with random integer suffix.
   * format:  YYYYMMDDHHmmssiiiRRRRRRRRR (i for ms, R for random number)
   * example: 20220514034317034619389933
   */
  getAndInc(){
    this.counter += 1;
    let now = new Date();
    let timeDigits = ''
      +now.getFullYear()
      // +'.'
      +(now.getMonth()+1 < 10 ? '0' : '')
      +(now.getMonth()+1)
      // +'.'
      +(now.getDate() < 10 ? '0' : '')
      +now.getDate()
      // +'.'
      +(now.getHours() < 10 ? '0' : '')
      +now.getHours()
      // +'.'
      +(now.getMinutes() < 10 ? '0' : '')
      +now.getMinutes()
      // +'.'
      +(now.getSeconds() < 10 ? '0' : '')
      +now.getSeconds()
      // +'.'
      +(now.getMilliseconds()+1000).toString().substring(1);
    let numDigits = 
      (Math.floor(1_000_000_000 * Math.random())+1_000_000_000)
      .toString().substring(1);

    return timeDigits+numDigits;
  }

}