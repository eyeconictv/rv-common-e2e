/*globals element, by */
'use strict';

var CustomAuthPage = require('./customAuthPage.js');

var LoginPage = function() {

  var signInWithCustomLink = element(by.id('sign-in-button'));

  this.signIn = function() {
    var customAuthPage = new CustomAuthPage();

    signInWithCustomLink.isPresent().then(function (state) {
      if (state) {
        customAuthPage.signin();
      }
    });
  };

};

module.exports = LoginPage;
