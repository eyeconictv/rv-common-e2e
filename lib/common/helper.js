/*globals browser */
'use strict';
/**
 * Usage: wait(element, label)
 * element : It will wait for this element to come into view
 * label : just used for the error message
 */
var wait = function (element, label, timeout) {
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
  }, (timeout)? timeout : 10000, label + " did not appear");
};
exports.wait = wait;

/**
 * Usage: waitDisappear(element, label)
 * element : It will wait for this element to disappear from view
 * label : just used for the error message
 */
var waitDisappear = function (element, label, timeout) {
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
  }, (timeout)? timeout : 10000, label + " did not disappear");
};

exports.waitDisappear = waitDisappear;

/**
 * Usage: waitRemoved(element, label)
 * element : It will wait for this element to be removed from view
 * label : just used for the error message
 */
var waitRemoved = function (element, label, timeout) {
  return browser.wait(function () {
    return element.isPresent().then(function (state) {
      return !state;
    });
  }, (timeout)? timeout : 10000, label + " did not disappear");
};

exports.waitRemoved = waitRemoved;

/**
 * Usage: waitForElementTextToChange(element, textToWaitFor)
 * element : It will wait for this element text to change
 * textToWaitFor : text to wait for
 * label : just used for the error message
 */
var waitForElementTextToChange = function (element, textToWaitFor, label, timeout) {
  return browser.wait(function () {
    return element.getText().then(function (text) {
      return text === textToWaitFor;
    });
  }, (timeout)? timeout : 10000, label + " text did not change");
};

exports.waitForElementTextToChange = waitForElementTextToChange;

/**
 * Usage: waitForAlert(label)
 * label : just used for the error message
 */
var waitForAlert = function (label, timeout) {
  browser.wait(function () {
    return browser.switchTo().alert().then(
      function() { return true; }, 
      function() { return false; }
    );
  }, (timeout)? timeout : 10000, label + " alert did not appear");
};

exports.waitForAlert = waitForAlert;

/**
 * Usage: waitForUrlToContain(textToSearchFor)
 * textToSearchFor : the string to search for in the URL
 */
var waitForUrlToContain = function (textToSearchFor, timeout) {
  browser.wait(function () {
    return browser.getCurrentUrl().then(function (url) {
      if (url && url.indexOf(textToSearchFor) > -1) {
        return true;
      } else {
        return false;
      }
    });
  }, (timeout)? timeout : 10000,  "URL did not contain " + textToSearchFor);
};

exports.waitForUrlToContain = waitForUrlToContain;

/**
 * Usage: clickWhenClickable(element, label)
 * element : It will click on the element when it is clickable
 * label : just used for the error message
 */
var clickWhenClickable = function (element, label, timeout) {
  return browser.wait(function () {
    return element.click().then(function () {
      return true;
    }, function () {
      return false;
    });
  }, (timeout)? timeout : 10000, label + " not clickable");
};

exports.clickWhenClickable = clickWhenClickable;

/**
 * Usage: takeScreenshot(fileName)
 * fileName : The file name to save
 */
var takeScreenshot = function (fileName, timeout) {
  return browser.wait(function () {
    return new Promise((res)=>{
      browser.takeScreenshot(fileName)
      .then((png)=>{
        require("fs").createWriteStream(fileName || "shot.png")
        .end(png, "base64", ()=>res(true));
      });
    });
  }, (timeout)? timeout : 2000, "screenshot error");
};

exports.takeScreenshot = takeScreenshot;
