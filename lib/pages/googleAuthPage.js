/*globals element, by */
'use strict';
var GoogleAuthPage = function () {
  var url = "https://accounts.google.com";
  var signinCard = element(by.css('.signin-card'));
  var emailField = element(by.id('Email'));
  var nextButton = element(by.id('next'));
  var passwordField = element(by.id('Passwd'));
  var signInButton = element(by.id('signIn'));
  var thirdPartyInfo = element(by.id('third_party_info'));
  var submitApproveAccessButton = element(by.id('submit_approve_access'));
  var accountchooserTitle = element(by.id('accountchooser-title'));
  var chooseAccountFirstButton = element(by.id('choose-account-0'));

  this.getUrl = function () {
    return url;
  };
  this.getSigninCard = function () {
    return signinCard;
  };

  this.getEmailField = function () {
    return emailField;
  };

  this.getNextButton = function () {
    return nextButton;
  };

  this.getPasswordField = function () {
    return passwordField;
  };

  this.getSignInButton = function () {
    return signInButton;
  };

  this.getThirdPartyInfo = function () {
    return thirdPartyInfo;
  };

  this.getSubmitApproveAccessButton = function () {
    return submitApproveAccessButton;
  };

  this.getAccountchooserTitle = function () {
    return accountchooserTitle;
  };

  this.getChooseAccountFirstButton = function () {
    return chooseAccountFirstButton;
  };

};

module.exports = GoogleAuthPage;
