/*globals element, by, console*/
'use strict';
var helper = require('../common/helper.js');

var CityChallengePage = function () {
  var CHALLENGE_ADDRESS = 'Toronto ON, Canada';
  
  var challengeCard = element(by.cssContainingText('h1', 'Verify it\'s you'));
  var cityChallengeButton = element(by.cssContainingText('span', 'Enter the city you usually sign in from'));
  var challengeAddressField = element(by.id('answer'));
  // var submitChallengeButton = element(by.id('submit'));

  this.completeCityChallenge = function() {
    return helper.wait(challengeCard, "Google Verify it's you page").then(function () {
      console.log("Completing city challenge");

      cityChallengeButton.click().then(function (){
        var enter = "\ue007";

        challengeAddressField.sendKeys(CHALLENGE_ADDRESS + enter);
        // submitChallengeButton.click()
      });
    });
  };

};

module.exports = CityChallengePage;
