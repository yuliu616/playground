/////////////////////////////
// these import statements wont work for index-raw.html

// import node.js friendly dependency
import * as moment from 'moment';

// import plain css
import 'semantic-ui-css/semantic.min.css';
// import js that require global symbols `$` and `jQuery`
import 'semantic-ui-css/semantic.js';

import './style.css';

// import data object from json file
import package_data from '../package.json';

import './script1';

/////////////////////////////

var current_progress = 0.0;

let nationDay = moment({ 
  year: 2000, month: 9, day: 1
}); //2000-10-01 00:00:00+08
console.log('nationDay =', nationDay.format());

console.log('package.json =', package_data);

// access jquery using the global symbol `$`
console.log('jquery version(1) =', $.fn.jquery);

// access jquery using the global symbol `jQuery`
console.log('jquery version(2) =', jQuery.fn.jquery);

function increaseProgress(){
  let value = current_progress + 12;
  if (value > 100.0) {
    value = 0.0;
  }
  $('#progress1').progress({
    percent: value
  });
  current_progress = value;
}

window.increaseProgress = increaseProgress;
