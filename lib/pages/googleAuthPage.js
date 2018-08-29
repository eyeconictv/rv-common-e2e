/*globals element, by, browser*/
'use strict';
var helper = require('../common/helper.js');

var GoogleAuthPage = function () {
  var USERNAME = browser.params.login.user;
  var PASSWORD = browser.params.login.pass;
  
  var intialViewPage = element(by.id('initialView'));
  var emailField = element(by.id('identifierId'));
  var identifierNextButton = element(by.id('identifierNext'));

  var passwordField = element(by.css('#password input'));

  var challengeCard = element(by.cssContainingText('h1', 'Verify it\'s you'));
  var cityChallengeButton = element(by.cssContainingText('li div div', 'Enter the city you usually sign in from'));
  var knowledgeLoginLocationInput = element(by.id('knowledgeLoginLocationInput'));
  var CHALLENGE_ADDRESS = 'Toronto ON, Canada';


  this.signin = function (username, password) {
    username = username || USERNAME;
    password = password || PASSWORD;
    
    browser.ignoreSynchronization = true;

    helper.wait(intialViewPage, "Google Sign In Page").then(function () {
      console.log('Google Sign In Page found');
      helper.wait(emailField, "Google Sign In Email Field").then(function () {
        helper.wait(identifierNextButton, "Google Sign In Next Button").then(function () {
          emailField.sendKeys(username);
          identifierNextButton.click();
        }).then(function () {
          helper.wait(passwordField, "Google Sign In Password Field").then(function () {
            var enter = "\ue007";
            passwordField.sendKeys(password + enter);
          });
        }).then(function() {
          console.log('Google Sign In Completed');
          helper.wait(challengeCard, "Verify it's you").then(function () {
            console.log('Google Verify it\'s you page found');

            helper.wait(cityChallengeButton, "Enter the city you usually sign in from").then(function () {
              browser.sleep(500);
              helper.clickWhenClickable(cityChallengeButton, "City Challenge Button 1").then(function() {
                browser.sleep(500);
                helper.wait(knowledgeLoginLocationInput,"Waiting knowledge").then(function(){
                  browser.sleep(500);
                  var enter = "\ue007";
                  browser.actions().sendKeys(CHALLENGE_ADDRESS+enter).perform();
                });
              });
            });
          });
        }).then(null, function() {
        });
      }, function () {
        var accountChooser = element(by.cssContainingText('#profileIdentifier', username));

        helper.wait(accountChooser, "Google Account Chooser", 3000).then(function () {
          console.log('Google Account Chooser found');

          accountChooser.click();
        }, function() {
          var oldAccountChooser = element(by.cssContainingText('p', username));
          
          helper.wait(oldAccountChooser, "Old Google Account Chooser", 3000)
            .then(function() {
              console.log('Old Google Account Chooser found');

              oldAccountChooser.click();  
            });
        });
      });
    })
    .then(function() {
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
