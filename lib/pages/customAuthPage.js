/*globals element, by, browser*/
'use strict';

var CustomAuthPage = function () {
  var USERNAME = "risejenkins@outlook.com"; // browser.params.login.user;
  var PASSWORD = "jenkinsrise0"; // browser.params.login.pass;
  
  var emailField = element(by.id('username'));
  var passwordField = element(by.id('password'));

  //var signInButton = element(by.id('sign-in-button'));

  this.signin = function (username, password) {
    var enter = "\ue007";

    username = username || USERNAME;
    password = password || PASSWORD;

    console.log('Custom Sign In Page found', username, password);

    browser.ignoreSynchronization = true;

    emailField.sendKeys(username);
    passwordField.sendKeys(password + enter);
    //signInButton.click();

    console.log('Custom Sign In completed');
  };
};

module.exports = CustomAuthPage;
