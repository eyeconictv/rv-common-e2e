(function (module) {
  "use strict";
  var expect = require('./common/expect.js');
  var helper = require('./common/helper.js');
  var commonHeaderPage = require('./pages/commonHeaderPage.js');
  var googleAuthPage = require('./pages/googleAuthPage.js');

  var factory = {
    expect: expect,
    helper: helper,
    commonHeaderPage: commonHeaderPage,
    googleAuthPage: googleAuthPage
  };

  module.exports = factory;

})(module);

