/*globals element, by, browser */
'use strict';
var GoogleAuthPage = require('./googleAuthPage.js');
var helper = require('../common/helper.js');

var CommonHeaderPage = function () {

  var USERNAME = browser.params.login.user;
  var PASSWORD = browser.params.login.pass;

  var googleAuthPage = new GoogleAuthPage();
  var commonHeader = element(by.tagName('common-header'));
  var commonHeaderMenuItems = element.all(by.repeater('opt in navOptions'));
  var signInButton = element(by.buttonText('Sign In'));
  var modalDialog = element(by.css('.modal-dialog'));

  this.signin = function () {

    signInButton.isDisplayed().then(function (state) {
      if (state) {
        browser.ignoreSynchronization = true;
        signInButton.click().then(function () {
          googleAuthPage.getSigninCard().isDisplayed().then(function () {
            helper.wait(googleAuthPage.getSigninCard(), "Google Sigin Card").then(function () {
              helper.wait(googleAuthPage.getEmailField(), "Google Sigin Email Field").then(function () {
                helper.wait(googleAuthPage.getNextButton(), "Google Sigin Next Button").then(function () {
                  googleAuthPage.getEmailField().sendKeys(USERNAME);
                  googleAuthPage.getNextButton().click().then(function () {
                    _enterPasswordAndSignIn();
                  });
                }, function () {
                  helper.wait(googleAuthPage.getSignInButton(), "Google Sigin Sign In Button").then(function () {
                    googleAuthPage.getEmailField().sendKeys(USERNAME);
                    _enterPasswordAndSignIn();
                  });
                });

              });
            });
          }, function () {
            helper.wait(googleAuthPage.getAccountchooserTitle(), "Google Account Chooser").then(function () {
              helper.wait(googleAuthPage.getChooseAccountFirstButton(), "Google Account Chooser").then(function () {
                googleAuthPage.getChooseAccountFirstButton().click().then(function () {
                  _waitToGoBackToTheAPPAfterLogin();
                });
              });
            });
          });
        });
      }
    });
  };

  var _enterPasswordAndSignIn = function () {

    helper.wait(googleAuthPage.getPasswordField(), "Google Sigin Password Field").then(function () {
      googleAuthPage.getPasswordField().sendKeys(PASSWORD);
      googleAuthPage.getSignInButton().click().then(function () {
        googleAuthPage.getThirdPartyInfo().isDisplayed().then(function () {
          helper.wait(googleAuthPage.getThirdPartyInfo(), "Google Third Party Info").then(function () {
            helper.wait(googleAuthPage.getSubmitApproveAccessButton(), "Google Approce Access Button").then(function () {
              googleAuthPage.getSubmitApproveAccessButton().click().then(function () {
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
    helper.wait(commonHeader, "Common Header");
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
};

module.exports = CommonHeaderPage;
