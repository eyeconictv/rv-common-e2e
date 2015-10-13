/*globals element, by */
'use strict';
var GoogleAuthPage = require('./googleAuthPage.js');
var helper = require('../common/helper.js');

var CommonHeaderPage = function () {

  var googleAuthPage = new GoogleAuthPage();
  var commonHeader = element(by.tagName('common-header'));
  var commonHeaderMenuItems = element.all(by.repeater('opt in navOptions'));
  var signInButton = element(by.buttonText('Sign In'));
  var modalDialog = element(by.css('.modal-dialog'));
  var loader = element(by.xpath('//div[@spinner-key="_rv-global-spinner"]'));

  this.signin = function (username, password) {

    signInButton.isDisplayed().then(function (state) {
      if (state) {

        signInButton.click().then(function () {
          googleAuthPage.signin(username, password);
          helper.waitDisappear(loader, 'CH spinner loader');
        });
      }
    });
  };

  this.getCommonHeader = function () {
    return commonHeader;
  };

  this.getCommonHeaderMenuItems = function () {
    return commonHeaderMenuItems;
  };

  this.getSignInButton = function () {
    return signInButton;
  };

  this.getModalDialog = function () {
    return modalDialog;
  };

  this.getLoader = function () {
    return loader;
  };
};

module.exports = CommonHeaderPage;
