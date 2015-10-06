/*globals browser */
'use strict';
/**
 * Usage: wait(element, label)
 * element : It will wait for this element to come into view
 * label : just used for the error message
 */
var wait = function (element, label) {
  return browser.wait(function () {
    return element.isPresent().then(function (state) {
      if (state === true) {
        return element.isDisplayed().then(function (state2) {
          if (state2 === true) {
            return element.isEnabled().then(function (state3) {
              return state3 === true;
            });
          }
        });
      } else {
        return false;
      }
    });
  }, 10000, label + " did not appear");
};
exports.wait = wait;

/**
 * Usage: waitDisappear(element, label)
 * element : It will wait for this element to disappear from view
 * label : just used for the error message
 */
var waitDisappear = function (element, label) {
  return browser.wait(function () {
    return element.isPresent().then(function (state) {
      if (state === true) {
        return element.isDisplayed().then(function (state) {
          return !state;
        });
      } else {
        return true;
      }
    });
  }, 10000, label + " did not disappear");
};

exports.waitDisappear = waitDisappear;

/**
 * Usage: waitForElementTextToChange(element, textToWaitFor)
 * element : It will wait for this element text to change
 * textToWaitFor : text to wait for
 * label : just used for the error message
 */
var waitForElementTextToChange = function (element, textToWaitFor, label) {
  return browser.wait(function () {
    return element.getText().then(function (text) {
        return text === textToWaitFor;
      });
  }, 10000, label + " text did not change");
}

exports.waitForElementTextToChange = waitForElementTextToChange;


/**
 * Usage: clickWhenClickable(element, label)
 * element : It will click on the element when it is clickable
 * label : just used for the error message
 */
var clickWhenClickable = function (element, label) {
  return browser.wait(function () {
    return element.click().then(function () {
      return true;
    }, function () {
      return false;
    });
  }, 10000, label + " not clickable");
};

exports.clickWhenClickable = clickWhenClickable;
