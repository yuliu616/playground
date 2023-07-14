import { describe } from 'mocha';
import { expect } from 'chai';
import { RegExpTextRule } from '../../../src/model/validation/RegExpTextRule';

export const ERROR_INVALID_FORMAT = 'ERROR_INVALID_FORMAT';

describe('RegExpTextRule', function(){

  it('allow letter-only as decided', function(){
    let out = new RegExpTextRule(/^[A-Za-z]+$/).validate('Peter');
    expect(out).to.be.null;
  });

  it('could reject by letter-only as decided', function(){
    let out = new RegExpTextRule(/^[A-Za-z]+$/).validate('Peter 123');
    expect(out).is.an('object');
    if (out) {
      expect(out.reason).is.an('string');
      expect(out.reason).eq(ERROR_INVALID_FORMAT);
    }
  });

  it('allow search for word as decided', function(){
    let out = new RegExpTextRule(/son/).validate('Johnson');
    expect(out).to.be.null;
  });

  it('could reject by search for word as decided', function(){
    let out = new RegExpTextRule(/son/).validate('Brotherhood');
    expect(out).is.an('object');
    if (out) {
      expect(out.reason).is.an('string');
      expect(out.reason).eq(ERROR_INVALID_FORMAT);
    }
  });

  it('allow Chinese Char only as decided', function(){
    let out = new RegExpTextRule(/^\p{Script=Han}+$/u).validate('公主');
    expect(out).to.be.null;
  });

  it('could reject by Chinese Char only as decided', function(){
    let out = new RegExpTextRule(/^\p{Script=Han}+$/u).validate('Princess');
    expect(out).is.an('object');
    if (out) {
      expect(out.reason).is.an('string');
      expect(out.reason).eq(ERROR_INVALID_FORMAT);
    }
  });

  it('accept not-filled', function(){
    let out = new RegExpTextRule(/^[A-Za-z]+$/).validate(null);
    expect(out).to.be.null;
    out = new RegExpTextRule(/^[A-Za-z]+$/).validate('');
    expect(out).to.be.null;
    out = new RegExpTextRule(/^[A-Za-z]+$/).validate(undefined);
    expect(out).to.be.null;
  });

  it('support customize errorCode', function(){
    let out = new RegExpTextRule(/^[A-Za-z]+$/, 
      'name must not contains numbers',
    ).validate('Peter 123');
    expect(out).is.an('object');
    if (out) {
      expect(out.reason).is.an('string');
      expect(out.reason).eq('name must not contains numbers');
    }
  });

});
