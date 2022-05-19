const assert = require('assert');
const gameplay = require('../gameplay');

describe('App',function(){
  it('validguess should return false because 3 digits place', function(){
    var str = "!pir 123.123";
    var editedStr = str.slice(5,str.length);
    assert.equal(gameplay._validGuess(editedStr),false);

  });

  it('validguess should return true', function(){
    var str = "!pir 123.12";
    var editedStr = str.slice(5,str.length);
    assert.equal(gameplay._validGuess(editedStr),true);

  });
});
