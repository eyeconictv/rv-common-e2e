/*globals element, by, console, browser*/
'use strict';
var helper = require('../common/helper.js');

var CityChallengePage = function () {
  var CHALLENGE_ADDRESS = 'Toronto ON, Canada';
  
  var challengeCard = element(by.cssContainingText('h1', 'Verify it\'s you'));
  var cityChallengeButton = element(by.cssContainingText('span', 'Enter the city you usually sign in from'));
  var challengeAddressField = element(by.id('answer'));
  // var submitChallengeButton = element(by.id('submit'));

  this.completeCityChallenge = function() {
    return helper.wait(challengeCard, "Verify it's you").then(function () {
      console.log("Completing city challenge");

      helper.wait(cityChallengeButton, "Enter the city you usually sign in from 2").then(function () {
        browser.sleep(500);

        helper.clickWhenClickable(cityChallengeButton, "City Challenge Button 2")
        .then(function () {
          var enter = "\ue007";

          challengeAddressField.sendKeys(CHALLENGE_ADDRESS + enter);
          // submitChallengeButton.click()
        });
      });
    });
  };

};

module.exports = CityChallengePage;
