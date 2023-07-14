import { describe, it } from 'mocha';
import { expect } from 'chai';
import { StringHelper } from '../../src/StringHelper';

describe('simple test', function(){

  it('works for 1+1', function(){

    expect(StringHelper.formatString('{0}+{0} = {1}', 1, 2))
      .eq('1+1 = 2');

  });

  it('works for 2+4', function(){

    expect(StringHelper.formatString('{0}+{1} = {2}', 2, 4, 6))
      .eq('2+4 = 6');

  });

});
