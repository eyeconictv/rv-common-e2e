/*globals element, by, browser*/
'use strict';
var helper = require('../common/helper.js');

var GoogleAuthPage = function () {
  var USERNAME = browser.params.login.user;
  var PASSWORD = browser.params.login.pass;
  var enter = '\ue007';

  var intialViewPage = element(by.id('initialView'));
  var emailField = element(by.id('identifierId'));
  var identifierNextButton = element(by.id('identifierNext'));

  var passwordField = element(by.css('#password input'));

  var challengeCard = element(by.cssContainingText('h1', 'Verify it\'s you'));
  
  var emailChallengeInput = element(by.id('knowledge-preregistered-email-response'));
  var CHALLENGE_EMAIL = 'support@risevision.com';

  var pickEmailChallengeLink = element(by.cssContainingText('li div div', 'Confirm your recovery email'));
    
  var cityChallengeButton = element(by.cssContainingText('li div div', 'Enter the city you usually sign in from'));
  var knowledgeLoginLocationInput = element(by.id('knowledgeLoginLocationInput'));
  var CHALLENGE_ADDRESS = 'Toronto ON, Canada';

  var _emailSignin = function(username, password) {
    return helper.wait(identifierNextButton, 'Google Sign In Next Button')
      .then(function () {
        browser.sleep(500);

        emailField.sendKeys(username);
        identifierNextButton.click();
        
        helper.wait(passwordField, 'Google Sign In Password Field');
        browser.sleep(500);

        passwordField.sendKeys(password + enter);

        console.log('Google Sign In Completed');

        return helper.wait(challengeCard, 'Verify its you');
      })
      .then(function () {
        console.log('Google Verify its you page found');

        return emailChallengeInput.isPresent()
          .then(function(isPresent) {
            if (isPresent) {
              console.log('Email Challenge page found');

              browser.sleep(500);
              
              emailChallengeInput.sendKeys(CHALLENGE_EMAIL + enter);
            } else {
              return cityChallengeButton.isPresent()
                .then(function(isPresent) {
                  if (isPresent) {
                    console.log('City Challenge page found');

                    browser.sleep(500);

                    helper.clickWhenClickable(cityChallengeButton, 'City Challenge Button 1');
                    browser.sleep(500);

                    helper.wait(knowledgeLoginLocationInput,'Waiting knowledge');
                    browser.sleep(500);

                    browser.actions().sendKeys(CHALLENGE_ADDRESS + enter).perform();
                  } else {
                    return pickEmailChallengeLink.isPresent()
                      .then(function(isPresent){
                        if (isPresent) {
                          console.log('Pick Challenge page found!');
                          browser.sleep(500);
                          pickEmailChallengeLink.click();
                          browser.sleep(500);

                          console.log('Waiting for Challenge input');
                          helper.wait(emailChallengeInput,'Email Challenge');
                          console.log('Entering for Email Challenge');
                          emailChallengeInput.sendKeys(CHALLENGE_EMAIL + enter);
                        } else {
                          console.log('Invalid Challenge page found');
                        }                        
                      });                    
                  }
                });
            }
          });
      })
      .then(null, function() {
        console.log('Proceed to App');
      });
  };

  var _accountChooserSignin = function(username, password) {
    var accountChooser = element(by.cssContainingText('#headingText', 'Choose an account'));
    var activeAccount = element(by.cssContainingText('#profileIdentifier', username));
    var useOtherAccount = element(by.cssContainingText('li > div', 'Use another account'));

    console.log('Looking for Google Account Chooser');

    return helper.wait(accountChooser, 'Google Account Chooser', 3000)
      .then(function() {
        console.log('Google Account Chooser found');

        return activeAccount.isPresent()
          .then(function(isPresent) {
            if (isPresent) {
              console.log('Choose Active Account');

              return activeAccount.click();          
            } else {
              console.log('Looking for Another Account');

              helper.wait(useOtherAccount, 'User Another Account', 3000);

              console.log('Use Another Account');

              useOtherAccount.click();

              console.log('Sign In Again');

              helper.wait(intialViewPage, 'Google Sign In Page');
                
              console.log('Google Sign In Page found');

              return _emailSignin(username, password);            
            }
          });
        
      })
      .then(null, function() {
        var oldAccountChooser = element(by.cssContainingText('p', username));
        
        return helper.wait(oldAccountChooser, 'Old Google Account Chooser', 3000)
          .then(function() {
            console.log('Old Google Account Chooser found');

            oldAccountChooser.click();  
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

  this.signin = function (username, password) {
    username = username || USERNAME;
    password = password || PASSWORD;
    
    browser.ignoreSynchronization = true;

    helper.wait(intialViewPage, 'Google Sign In Page');
      
    console.log('Google Sign In Page found');

    emailField.isPresent()
      .then(function(isPresent) {
        if (isPresent) {
          return _emailSignin(username, password);
        } else {
          return _accountChooserSignin(username, password);
        }
      })
      .then(function() {
        _waitToGoBackToTheAPPAfterLogin();
      });
  };

};

module.exports = GoogleAuthPage;
