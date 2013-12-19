(function(test) {
  if (
    typeof require === 'function'
    && typeof exports === 'object'
    && typeof module === 'object'
  ) {
    // NodeJS
    (function() {
      var chai = require('chai');
      chai.Assertion.includeStack = true;
      test(chai, true);
    } ());
  } else {
    // Other environment (usually <script> tag): plug in to global chai instance directly.
    test(chai, false);
  }
}(function (chai, testingServer) {

  var should = chai.should();
  var assert = chai.assert;

  describe('chai-properties', function () {

    if (testingServer) {
      var properties = require('../chai-properties');

      it('exports a function that takes two arguments', function () {
        should.exist(properties);
        properties.should.be.a('function');
        properties.length.should.equal(2);
      });

      chai.use(properties);
    }

    chai.use(function (chai, utils) {
      inspect = utils.objDisplay;

      chai.Assertion.addMethod('fail', function (message) {
        var obj = this._obj;

        new chai.Assertion(obj).is.a('function');

        try {
          obj();
        } catch (err) {
          this.assert(
              err instanceof chai.AssertionError
            , 'expected #{this} to fail, but it threw ' + inspect(err));
          this.assert(
              err.message === message
            , 'expected #{this} to fail with ' + inspect(message) + ', but got ' + inspect(err.message));
          return;
        }

        this.assert(false, 'expected #{this} to fail');
      });
    });

    describe('matchers', function () {
      describe('.properties', function () {
        var subject;

        describe('with one-dimension object', function () {
          before(function() {
            subject = { a: 'a', b: 'b', c: 'c' };
          });

          it('passes when one right property is given', function() {
            subject.should.have.properties({ a: 'a' });
          });

          it('passes when multiple (part or all) right properties are given', function() {
            subject.should.have.properties({ a: 'a', b: 'b' });
          });

          it('fails when one false property is given', function() {
            var difference = { a: '1' };

            (function(){
              subject.should.have.properties(difference);
            }).should.fail('expected ' + inspect(subject) + ' to have properties ' + inspect(difference));
          });

          it('fails when multiple (part or all) false properties are given', function() {
            var difference = { a: '1', b: '2' };

            (function(){
              subject.should.have.properties(difference);
            }).should.fail('expected ' + inspect(subject) + ' to have properties ' + inspect(difference));
          });

          it('fails when at least one not existing property is given', function() {
            var difference = { z: 'z' };

            (function(){
              subject.should.have.properties(difference);
            }).should.fail('expected ' + inspect(subject) + ' to have properties ' + inspect(difference));
          });

          it('passes negated when no given properties exist', function() {
            subject.should.not.have.properties({ z: 'z', 'y': 'y' });
          });

          it('passes negated when at least a false given property exist', function() {
            subject.should.not.have.properties({ a: '1' });
          });

          it('fails negated when all given properties exist and are right', function() {
            var difference = { a: 'a', b: 'b' };

            (function(){
              subject.should.not.have.properties(difference);
            }).should.fail('expected ' + inspect(subject) + ' to have properties ' + inspect(difference));
          });
        });
      });
    });

    describe('tdd aliases', function() {
      var subject, objProp, objNotProp;

      before(function() {
        subject = { a: 'a', b: 'b', c: 'c' };
        objProp = { a: 'a', b: 'b' };
        objNotProp = { z: 'z' };
      });

      //basic integrity checks

      it('.haveProperties', function() {
        assert.haveProperties(subject, objProp ,'tdd');
        subject.should.have.properties(objProp, 'bdd');
      });

      it('.notHaveProperties', function() {
        assert.notHaveProperties(subject, objNotProp ,'tdd');
        subject.should.not.have.properties(objNotProp, 'bdd');
      });
    });
  });
}));
