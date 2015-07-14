/*globals element, by, browser*/
'use strict';
var helper = require('../common/helper.js');

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

  var USERNAME = browser.params.login.user;
  var PASSWORD = browser.params.login.pass;

  this.signin = function () {
    browser.ignoreSynchronization = true;

    helper.wait(signinCard, "Google Sigin Card").then(function () {
      helper.wait(emailField, "Google Sigin Email Field").then(function () {
        helper.wait(nextButton, "Google Sigin Next Button").then(function () {
          emailField.sendKeys(USERNAME);
          nextButton.click().then(function () {
            _enterPasswordAndSignIn();
          });
        }, function () {
          helper.wait(signInButton, "Google Sigin Sign In Button").then(function () {
            emailField.sendKeys(USERNAME);
            _enterPasswordAndSignIn();
          });
        });

      });
    }, function () {
      helper.wait(accountchooserTitle, "Google Account Chooser").then(function () {
        helper.wait(chooseAccountFirstButton, "Google Account Chooser").then(function () {
          chooseAccountFirstButton.click().then(function () {
            _waitToGoBackToTheAPPAfterLogin();
          });
        });
      });
    });

  };

  var _enterPasswordAndSignIn = function () {

    helper.wait(passwordField, "Google Sigin Password Field").then(function () {
      passwordField.sendKeys(PASSWORD);
      signInButton.click().then(function () {
        thirdPartyInfo.isDisplayed().then(function () {
          helper.wait(thirdPartyInfo, "Google Third Party Info").then(function () {
            helper.wait(submitApproveAccessButton, "Google Approce Access Button").then(function () {
              submitApproveAccessButton.click().then(function () {
                _waitToGoBackToTheAPPAfterLogin();
              });
            });
          });
        }, function () {
          _waitToGoBackToTheAPPAfterLogin();
        });
      });
    });
  };

  var _waitToGoBackToTheAPPAfterLogin = function () {
    browser.ignoreSynchronization = false;
    browser.wait(function () {
      return element(by.css('.spinner-backdrop')).isDisplayed().then(function (result) {
        return !result;
      });
    }, 20000);
    //helper.wait(commonHeader, "Common Header");
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
