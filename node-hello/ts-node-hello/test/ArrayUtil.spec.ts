import { describe } from 'mocha';
import { expect } from 'chai';
import { ArrayUtil } from '../src/ArrayUtil';

describe('ArrayUtil', function(){

  it('could create 3 items array.', function(){
    let out = ArrayUtil.createArray('x', 3);
    expect(out).to.be.an('array');
    expect(out).to.have.length(3);
    expect(out[0]).equals('x');
    expect(out[1]).equals('x');
    expect(out[2]).equals('x');
  });

  it('could create 20 items array.', function(){
    let out = ArrayUtil.createArray('x', 20);
    expect(out).to.be.an('array');
    expect(out).to.have.length(20);
    expect(out[0]).equals('x');
    expect(out[1]).equals('x');
    expect(out[2]).equals('x');
    expect(out[19]).equals('x');
  });

});