import { describe } from 'mocha';
import { expect } from 'chai';

import { 
  Counter_Straight, 
} from '../src/Counter';

describe('Counter_Straight', function(){

  it('return base+1 +2 +3 as first 3 values.', function(){
    let counter = new Counter_Straight(38400);
    expect(counter.getAndInc()).equals(38401);
    expect(counter.getAndInc()).equals(38402);
    expect(counter.getAndInc()).equals(38403);
  });

  it('return step+ offset 1.', function(){
    let counter = new Counter_Straight(100100);
    counter.step = 10;
    counter.offset = 1;
    expect(counter.getAndInc()).equals(100111);
    expect(counter.getAndInc()).equals(100121);
    expect(counter.getAndInc()).equals(100131);
  });

  it('return step+ offset 2.', function(){
    let counter = new Counter_Straight(100100);
    counter.step = 10;
    counter.offset = 2;
    expect(counter.getAndInc()).equals(100112);
    expect(counter.getAndInc()).equals(100122);
    expect(counter.getAndInc()).equals(100132);
  });

  it('return step+ offset 3.', function(){
    let counter = new Counter_Straight(100100);
    counter.step = 10;
    counter.offset = 3;
    expect(counter.getAndInc()).equals(100113);
    expect(counter.getAndInc()).equals(100123);
    expect(counter.getAndInc()).equals(100133);
  });

});
