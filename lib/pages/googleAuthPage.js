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
  var challengeCard = element(by.css('.challenge-card'));
  var mapChallengeCheckbox = element(by.id('MapChallenge'));
  var challengeAddressField = element(by.id('address'));
  var submitChallengeButton = element(by.id('submitChallenge'));

  var CHALLENGE_ADDRESS = 'Toronto ON, Canada';
  var USERNAME = browser.params.login.user;
  var PASSWORD = browser.params.login.pass;

  var oldWindowHandle;
  var newWindowHandle;

  this.signin = function (username, password) {
    username = username || USERNAME;

    browser.sleep(3000);
    browser.getAllWindowHandles().then(function (handles) {

      if (handles.length > 1){
        oldWindowHandle = handles[0];
        newWindowHandle = handles[1];
        browser.ignoreSynchronization = true;
        browser.switchTo().window(newWindowHandle);

        helper.wait(signinCard, "Google Sigin Card").then(function () {
          helper.wait(emailField, "Google Sigin Email Field").then(function () {
            helper.wait(nextButton, "Google Sigin Next Button").then(function () {
              emailField.sendKeys(username);
              nextButton.click().then(function () {
                _enterPasswordAndSignIn();
              });
            }, function () {
              helper.wait(signInButton, "Google Sigin Sign In Button").then(function () {
                emailField.sendKeys(username);
                _enterPasswordAndSignIn(password);
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
          }, function () {
            _waitToGoBackToTheAPPAfterLogin();
          });
        });

      } else {
        _waitToGoBackToTheAPPAfterLogin();
      }
    });
  };

  var _enterPasswordAndSignIn = function (password) {
    password = password || PASSWORD;

    helper.wait(passwordField, "Google Sigin Password Field").then(function () {
      passwordField.sendKeys(password);
      signInButton.click().then(function () {
        helper.waitRemoved(signInButton, "Wait to leave signin form page").then(function () {
          browser.sleep(2000);
          // check if popup has been closed
          browser.getAllWindowHandles().then(function (handles) {
            if (handles.indexOf(newWindowHandle) === -1) {
              _waitToGoBackToTheAPPAfterLogin();
            } else {
              helper.wait(thirdPartyInfo, "Google Third Party Info").then(function () {
                _submitApproveAccess();
              }, function () {
                helper.wait(challengeCard, "Google Verify it's you page").then(function () {
                  mapChallengeCheckbox.click().then(function () {
                    challengeAddressField.sendKeys(CHALLENGE_ADDRESS);
                    submitChallengeButton.click().then(function () {
                      _submitApproveAccess();
                    });
                  });
                }, function () {
                  _waitToGoBackToTheAPPAfterLogin();
                });
              });
            }
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
    if (oldWindowHandle) {
      browser.switchTo().window(oldWindowHandle);
    }
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
