const assert = require('assert');
const gameplay = require('../gameplay');

describe('App',function(){
  it('app should return hello', function(){
    assert.equal(gameplay.alreadyFilledIn(),"Hello World");
  });

});
