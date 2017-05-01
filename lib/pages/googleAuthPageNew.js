/*globals element, by, browser*/
'use strict';
var helper = require('../common/helper.js');

var GoogleAuthPageNew = function () {
  var CHALLENGE_ADDRESS = 'Toronto ON, Canada';
  var USERNAME = browser.params.login.user;
  var PASSWORD = browser.params.login.pass;
  
  var intialViewPage = element(by.id('initialView'));
  var emailField = element(by.id('identifierId'));
  var identifierNextButton = element(by.id('identifierNext'));

  var passwordField = element(by.css('#password input'));
  var passwordNextButton = element(by.id('passwordNext'));  

  var challengeCard = element(by.cssContainingText('h1', 'Verify it\'s you'));
  var cityChallengeButton = element(by.cssContainingText('span', 'Enter the city you usually sign in from'));
  var challengeAddressField = element(by.id('answer'));
  var submitChallengeButton = element(by.id('submit'));

  this.signin = function (username, password) {
    username = username || USERNAME;
    password = password || PASSWORD;
    
    browser.ignoreSynchronization = true;

    return helper.wait(intialViewPage, "Google Sign In Page").then(function () {
      helper.wait(emailField, "Google Sign In Email Field").then(function () {
        helper.wait(identifierNextButton, "Google Sign In Next Button").then(function () {
          emailField.sendKeys(username);
          return identifierNextButton.click();
        }).then(function () {
          helper.wait(passwordField, "Google Sign In Password Field").then(function () {
            passwordField.sendKeys(password);
            return passwordNextButton.click();
          });
        }).then(function() {
          helper.wait(challengeCard, "Google Verify it's you page").then(function () {
            cityChallengeButton.click().then(function (){
              challengeAddressField.sendKeys(CHALLENGE_ADDRESS);
              submitChallengeButton.click().then(function () {
                _waitToGoBackToTheAPPAfterLogin();
              });
            });
          }, function() {
            _waitToGoBackToTheAPPAfterLogin();
          });
        });
      }, function () {
        var accountChooser = element(by.cssContainingText('p', username));
        helper.wait(accountChooser, "Google Account Chooser", 3000).then(function () {
          accountChooser.click().then(function () {
            _waitToGoBackToTheAPPAfterLogin();
          });
        });
      });
    });

  };
  
  var _waitToGoBackToTheAPPAfterLogin = function () {
    browser.manage().timeouts().pageLoadTimeout(40000);
    browser.wait(function () {
      return browser.executeScript('return !!window.angular');
    }, 10000); // 10000 is the timeout in millis
    browser.ignoreSynchronization = false;
  };

};

module.exports = GoogleAuthPageNew;
