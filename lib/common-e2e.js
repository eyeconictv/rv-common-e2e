(function (module) {
  "use strict";
  var chai = require('./common/chai.js');
  var helper = require('./common/helper.js');
  var commonHeaderPage = require('./pages/commonHeaderPage.js');
  var googleAuthPage = require('./pages/googleAuthPage.js');
  var customAuthPage = require('./pages/customAuthPage.js');

  var factory = {
    expect: chai.expect,
    assert: chai.assert,
    helper: helper,
    commonHeaderPage: commonHeaderPage,
    googleAuthPage: googleAuthPage,
    customAuthPage: customAuthPage
  };

  module.exports = factory;

})(module);

