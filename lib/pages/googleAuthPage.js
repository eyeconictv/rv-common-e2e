/*globals element, by, browser*/
'use strict';
var helper = require('../common/helper.js');
var GoogleAuthPageNew = require('./googleAuthPageNew.js');

var GoogleAuthPage = function () {
  var CHALLENGE_ADDRESS = 'Toronto ON, Canada';
  var USERNAME = browser.params.login.user;
  var PASSWORD = browser.params.login.pass;
  
  var authPageNew = new GoogleAuthPageNew();

  var url = "https://accounts.google.com";
  var signinCard = element(by.css('.signin-card'));
  var emailField = element(by.id('Email'));
  var nextButton = element(by.id('next'));
  var passwordField = element(by.id('Passwd'));
  var signInButton = element(by.id('signIn'));
  var thirdPartyInfo = element(by.id('third_party_info'));
  var submitApproveAccessButton = element(by.id('submit_approve_access'));
  var accountchooserTitle = element(by.id('account-' + USERNAME));
  var chooseAccountFirstButton = element(by.id('choose-account-0'));
  var challengeCard = element(by.cssContainingText('h1', 'Verify it\'s you'));
  var cityChallengeButton = element(by.cssContainingText('span', 'Enter the city you usually sign in from'));
  var challengeAddressField = element(by.id('answer'));
  var submitChallengeButton = element(by.id('submit'));

  this.signin = function (username, password) {
    username = username || USERNAME;
    
    browser.ignoreSynchronization = true;

    authPageNew.signin(username, password).then(null, function() {
      
      helper.wait(signinCard, "Google Sign In Card").then(function () {
        helper.wait(emailField, "Google Sign In Email Field").then(function () {
          helper.wait(nextButton, "Google Sign In Next Button").then(function () {
            emailField.sendKeys(username);
            nextButton.click().then(function () {
              _enterPasswordAndSignIn();
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
        helper.wait(thirdPartyInfo, "Google Third Party Info").then(function () {
          _submitApproveAccess();
        }, function () {
          helper.wait(challengeCard, "Google Verify it's you page").then(function () {
            cityChallengeButton.click().then(function (){
              challengeAddressField.sendKeys(CHALLENGE_ADDRESS);
              submitChallengeButton.click().then(function () {
                _submitApproveAccess();
              });
            });
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
