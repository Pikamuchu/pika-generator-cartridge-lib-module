'use strict';

var path = require('path');
var assert = require('yeoman-assert');
var helpers = require('yeoman-test');
var os = require('os');

describe('cartridge-lib-module:app', function () {
  before(function (done) {
    console.log('Generating test template on ' + os.tmpdir() + '/lib-temp-test');
    helpers.run(path.join(__dirname, '../app'))
      .inDir(path.join(os.tmpdir(), './lib-temp-test'))
      .withOptions({ 'skip-install': true })
      .on('end', done);
  });

  it('creates files', function () {
    assert.file([
      'package.json',
      '.eslintrc.json'
    ]);
  });
});
