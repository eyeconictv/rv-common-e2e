/*globals browser */
'use strict';

const writeStream = require("fs").createWriteStream;
const execSync = cmd => require("child_process").execSync(cmd, {encoding: "utf8"});

var globalTimeout = 30000;

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
  }, (timeout)? timeout : globalTimeout, label + " did not appear");
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
  }, (timeout)? timeout : globalTimeout, label + " did not disappear");
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
  }, (timeout)? timeout : globalTimeout, label + " did not disappear");
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
  }, (timeout)? timeout : globalTimeout, label + " text did not change");
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
  }, (timeout)? timeout : globalTimeout, label + " alert did not appear");
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
  }, (timeout)? timeout : globalTimeout,  "URL did not contain " + textToSearchFor);
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
  }, (timeout)? timeout : globalTimeout, label + " not clickable");
};

exports.clickWhenClickable = clickWhenClickable;

/**
 * Usage: takeScreenshot(fileName)
 * fileName : The file name to save
 */
var takeScreenshot = function (fileName, timeout) {
  return browser.wait(function () {
    return new Promise((res)=>{
      browser.takeScreenshot()
      .then((png)=>{
        writeStream(fileName || "shot.png")
        .end(png, "base64", ()=>res(true));
      });
    });
  }, (timeout)? timeout : 2000, "screenshot error");
};

exports.takeScreenshot = takeScreenshot;

var waitForScreenImage = function (compareFile, timeout) {
  timeout = timeout || 9000;
  return browser.wait(new Promise(compareScreens), timeout, "screenshot timeout");

  function compareScreens(res) {
    browser.takeScreenshot()
    .then((png)=>{
      let shotPath = execSync("mktemp").replace("\n","");
      let diffPath = execSync("mktemp").replace("\n","");
      writeStream(shotPath).end(png, "base64", ()=>{
        let compareCmd = `compare -metric MSE ${shotPath} ${compareFile} ${diffPath} 2>&1` +
                        `|| true`;
        let compareResult = execSync(compareCmd);
        console.log(compareResult);
        if (parseInt(compareResult, 10) < 200) {return res(true);}
        setTimeout(()=>{compareScreens(res);}, 1000);
      });
    });
  }
};

exports.waitForScreenImage = waitForScreenImage;

/**
 * Usage: Handle google sign in.  Expects signin process to be initiated (eg: signin button has been clicked)
 * email: user email to use for sign in
 * pass: user pass to use for sign in
 * additionalChallengeCityAnswer: answer for the "What city do you normally sign in from" challenge
 */
var googleSignIn = function (email, pass, additionalChallengeCityAnswer) {
  let mainWindow = browser.windowHandles().value[0];
  let additionalChallengeScreenButtonCount = 3;
  let additionalChallengeCityButtonPosition = 1;
  let enter = "\ue007";

  browser.waitUntil(()=>browser.windowHandles().value.length === 2, 5000, "login window not present");
  browser.window(browser.windowHandles().value[1]);

  browser.waitForExist("#Email");
  browser.element("#Email").setValue(email);
  browser.element("#next").click();

  browser.waitForVisible("#Passwd");
  browser.element("#Passwd").setValue(pass);
  browser.element("#signIn").click();

  browser.waitUntil(()=>{
    if (browser.windowHandles().value.length === 1) {return true;}
    if (browser.elements("button").value.length === additionalChallengeScreenButtonCount) {
      browser.elements("button").value[additionalChallengeCityButtonPosition].click();
      browser.element("#answer").setValue(additionalChallengeCityAnswer + enter);
    }
  }, 15000, "could not complete signin process");

  browser.window(mainWindow);
};

exports.googleSignIn = googleSignIn;
