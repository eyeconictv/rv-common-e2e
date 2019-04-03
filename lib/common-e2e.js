(function (module) {
  "use strict";
  var chai = require('./common/chai.js');
  var helper = require('./common/helper.js');
  var googleAuthPage = require('./pages/googleAuthPage.js');

  var factory = {
    expect: chai.expect,
    assert: chai.assert,
    helper: helper,
    googleAuthPage: googleAuthPage
  };

  module.exports = factory;

})(module);
