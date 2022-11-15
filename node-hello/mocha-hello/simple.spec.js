let expect = require('chai').expect;

/**
 * usage: format('i like {0}.', 'eating')
 */
function formatString() {
  var theString;
  var argCount;
  var paramList;
  if (Array.isArray(arguments[0])) {
    paramList = arguments[0];
    argCount = arguments[0].length;
    theString = arguments[0][0];
  } else {
    paramList = arguments;
    argCount = arguments.length;
    theString = arguments[0];
  }
  
  // start with the second argument (i = 1)
  for (var i = 1; i < argCount; i++) {
      // "gm" = RegEx options for Global search (more than one instance)
      // and for Multiline search
      var regEx = new RegExp("\\{" + (i - 1) + "\\}", "gm");
      theString = theString.replace(regEx, paramList[i]);
  }
  
  return theString;
}

describe('simple test', function(){

  it('works for 1+1', function(){

    expect(formatString('{0}+{0} = {1}', 1, 2))
      .eq('1+1 = 2');

  });

  it('works for 2+4', function(){

    expect(formatString('{0}+{1} = {2}', 2, 4, 6))
      .eq('2+4 = 6');

  });

});
