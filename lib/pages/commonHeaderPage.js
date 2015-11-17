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
  var profilePic = element(by.css(".user-profile-dropdown img.profile-pic"));
  var signOutButton = element(by.css(".dropdown-menu .sign-out-button"));
  var signOutModal = element(by.css(".sign-out-modal"));
  var signOutRvOnlyButton = element(by.css(".sign-out-modal .sign-out-rv-only-button"));
  var signOutGoogleButton = element(by.css(".sign-out-modal .sign-out-google-account"));

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

  this.signOut = function () {
    helper.waitDisappear(loader, 'CH spinner loader');

    profilePic.isDisplayed().then(function (value) {
      if (value) {
        profilePic.click();
        signOutButton.click();
        helper.wait(signOutModal, 'Sign Out Modal');
        signOutRvOnlyButton.click();
        helper.wait(signInButton, 'Sign In Button');
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
  
  this.getProfilePic = function () {
    return profilePic;
  };

  this.getSignOutButton = function () {
    return signOutButton;
  };

  this.getSignOutModal = function () {
    return signOutModal;
  };

  this.getSignOutRvOnlyButton = function () {
    return signOutRvOnlyButton;
  };

  this.getSignOutGoogleButton = function () {
    return signOutGoogleButton;
  };
};

module.exports = CommonHeaderPage;
