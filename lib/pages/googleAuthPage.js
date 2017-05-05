/*globals element, by, browser*/
'use strict';
var helper = require('../common/helper.js');
var GoogleAuthPageNew = require('./googleAuthPageNew.js');
var CityChallengePage = require('./cityChallengePage.js');

var GoogleAuthPage = function () {
  var USERNAME = browser.params.login.user;
  var PASSWORD = browser.params.login.pass;
  
  var authPageNew = new GoogleAuthPageNew();
  var cityChallengePage = new CityChallengePage();

  var signinCard = element(by.css('.signin-card'));
  var emailField = element(by.id('Email'));
  var nextButton = element(by.id('next'));
  var passwordField = element(by.id('Passwd'));
  var signInButton = element(by.id('signIn'));
  var thirdPartyInfo = element(by.id('third_party_info'));
  var submitApproveAccessButton = element(by.id('submit_approve_access'));
  var accountchooserTitle = element(by.id('account-' + USERNAME));
  var chooseAccountFirstButton = element(by.id('choose-account-0'));

  this.signin = function (username, password) {
    username = username || USERNAME;
    
    browser.ignoreSynchronization = true;

    authPageNew.signin(username, password).then(function() {
      _waitToGoBackToTheAPPAfterLogin();
    }, function() {
      console.log('Old Google Sign In');

      helper.wait(signinCard, "Google Sign In Card").then(function () {
        helper.wait(emailField, "Google Sign In Email Field").then(function () {
          helper.wait(nextButton, "Google Sign In Next Button").then(function () {
            emailField.sendKeys(username);
            nextButton.click().then(function () {
              _enterPasswordAndSignIn(password);
            });
          }, function () {
            helper.wait(signInButton, "Google Sign In Sign In Button").then(function () {
              emailField.sendKeys(username);
              _enterPasswordAndSignIn(password);
            });
          });

        });
      }, function () {
        helper.wait(accountchooserTitle, "Google Account Chooser", 3000).then(function () {
          console.log('Google Account Chooser found');

          helper.wait(chooseAccountFirstButton, "Google Account Chooser").then(function () {
            chooseAccountFirstButton.click().then(function () {
              _waitToGoBackToTheAPPAfterLogin();
            });
          });
        });
      });

    });

  };

  var _enterPasswordAndSignIn = function (password) {
    password = password || PASSWORD;

    helper.wait(passwordField, "Google Sign In Password Field").then(function () {
      passwordField.sendKeys(password);
      signInButton.click().then(function () {
        console.log('Old Google Sign In Completed');

        helper.wait(thirdPartyInfo, "Google Third Party Info").then(function () {
          _submitApproveAccess();
        }, function () {
          cityChallengePage.completeCityChallenge().then(function () {
            _submitApproveAccess();
          });
        });
      });
    });
  };
  
  var _submitApproveAccess = function () {
    helper.wait(thirdPartyInfo, "Google Third Party Info").then(function () {
      helper.wait(submitApproveAccessButton, "Google Approce Access Button").then(function () {
        submitApproveAccessButton.click().then(function () {
          _waitToGoBackToTheAPPAfterLogin();
        });
      });
    }, function () {
      _waitToGoBackToTheAPPAfterLogin();
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

module.exports = GoogleAuthPage;
