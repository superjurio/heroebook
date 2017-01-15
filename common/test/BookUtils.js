var should = require('chai').should(),
bookUtils = require('../src/BookUtils');

var expect = require('chai').expect;

describe('#testToto', function() {
    it('return toto', function() {
         expect(bookUtils.testToto()).to.equal('toto');
    });
});