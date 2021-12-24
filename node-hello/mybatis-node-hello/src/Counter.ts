export class Counter_Straight {

  value: number;
  step = 1
  counter = 0;

  constructor(idBaseNumber){
    this.value = idBaseNumber;
  }

  getAndInc(){
    this.counter += 1;
    this.value += this.step;
    return this.value;
  }
};

export class Counter_TangoInLevel {

  value: number;
  step = 1
  counter = 0;

  constructor(idBaseNumber){
    this.value = idBaseNumber;
  }

  getAndInc(){
    this.counter += 1;
    this.value += this.step;
    if (this.counter % 100 == 0) {
      this.value += 2000;
      this.step = 2;
    } else if (this.counter % 100 == 50) {
      this.value -= 1000;
      this.step = 1;
    }
    return this.value;
  }
};

export class Counter_TangoEverySteps {

  value: number;
  step = 1
  counter = 0;
  
  constructor(idBaseNumber){
    this.value = idBaseNumber;
  }

  // 0: 0+1 +4 = 5
  // 1: 5+1 -3 = 3
  // 2: 3+1 +4 = 8
  // 3: 8+1 -3 = 6
  // 4:  6+1 +4 = 11
  // 5: 11+1 -3 = 9
  // 6:  9+1 +4 = 14
  // 7: 14+1 -3 = 12
  getAndInc(){
    this.counter += 1;
    this.value += this.step;
    if (this.counter % 4 == 0) {
      this.value += 4;
    } else if (this.counter % 4 == 1) {
      this.value -= 3;
    } else if (this.counter % 4 == 2) {
      this.value += 4;
    } else if (this.counter % 4 == 3) {
      this.value -= 3;
    }
    return this.value;
  }
};
