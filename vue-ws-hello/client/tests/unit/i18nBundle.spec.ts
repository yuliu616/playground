import { describe } from 'mocha';
import { expect } from 'chai';
import { i18nBundles, i18nModel, i18nDefaultBundle } from '../../src/translation/i18n';
import { ObjectHelper } from '../../src/util/ObjectHelper';

describe('i18n', function(){

  it('simply works', function(){
    let bundle: i18nModel = i18nDefaultBundle;
    let out = bundle.word['word.hello'];
    expect(out).eq('Hello');
    out = bundle.model.Message['model.name'];
    expect(out).eq('Message');
  });

  it('(en) works', function(){
    let bundle: i18nModel = i18nBundles.en;
    let out = bundle.word['word.hello'];
    expect(out).eq('Hello');
    out = bundle.model.Message['model.name'];
    expect(out).eq('Message');
  });

  it('(zh) works', function(){
    let bundle: i18nModel = i18nBundles.zh;
    let out = bundle.word['word.hello'];
    expect(out).eq('你好');
    out = bundle.model.Message['model.name'];
    expect(out).eq('讯息');
  });

  it('t(translate method) works', function(){
    let bundle: i18nModel = i18nDefaultBundle;
    let out = bundle.t('word', 'word.hello');
    expect(out).eq('Hello');
    out = bundle.t('model.Message', 'model.name');
    expect(out).eq('Message');
  });

  it('(en) t(translate method) works', function(){
    let bundle: i18nModel = i18nBundles.en;
    let out = bundle.t('word', 'word.hello');
    expect(out).eq('Hello');
    out = bundle.t('model.Message', 'model.name');
    expect(out).eq('Message');
  });

  it('(zh) t(translate method) works', function(){
    let bundle: i18nModel = i18nBundles.zh;
    let out = bundle.t('word', 'word.hello');
    expect(out).eq('你好');
    out = bundle.t('model.Message', 'model.name');
    expect(out).eq('讯息');
  });

});
