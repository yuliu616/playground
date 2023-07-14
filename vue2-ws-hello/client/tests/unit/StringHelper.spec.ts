import { describe } from 'mocha';
import { expect } from 'chai';
import { StringHelper } from '../../src/util/StringHelper';

describe('StringHelper', function(){

  it('simply works', function(){
    let out = StringHelper.formatString(
      'while this is year {0}, i am {1} years old now.', 2021, 40);
    expect(out).eq('while this is year 2021, i am 40 years old now.');
  });

  it('work for no argument', function(){
    let out = StringHelper.formatString('hey');
    expect(out).eq('hey');
  });

  it('work for dont use argument', function(){
    let out = StringHelper.formatString('hey', 123, 456);
    expect(out).eq('hey');
  });

});