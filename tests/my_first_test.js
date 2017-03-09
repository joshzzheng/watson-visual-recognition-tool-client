require('dotenv').config();
var http = require("http");
var blc = require("broken-link-checker");

module.exports = {
    "load tool" : function (browser) {
        browser
        .url('http://localhost:8080')
        .waitForElementVisible('#landing-page', 1000)
    },

    "check bluemix link" : function (browser) {
        var urlChecker = new blc.UrlChecker(null, {
            link: function(result, customData){
                console.log('checking: ' + result.url.original);
                browser
                .assert.equal(result.brokenReason, null);
            },
            end: function(){}
        });
        browser
        .getAttribute("a#link--landing-page--api-key", "href", function(result) {
            urlChecker.enqueue(result.value);
        });
    },

    'check invalid key' : function (browser) {
        browser
        .setValue('input#input--landing-page--api-key', '0000')
        .waitForElementVisible('button#button--landing-page--api-key', 1000)
        .click('button#button--landing-page--api-key')
        .waitForElementVisible('#error--landing-page--api-key', 10000)
    },

    'check real key' : function (browser) {
        browser
        .clearValue('input#input--landing-page--api-key')
        .setValue('input#input--landing-page--api-key', process.env.API_KEY)
        .waitForElementVisible('button#button--landing-page--api-key', 1000)
        .click('button#button--landing-page--api-key')
        .waitForElementNotPresent('#landing-page', 10000)
    },

    'check dropdown' : function (browser) {
        browser
        .waitForElementVisible('.dropdown--classifier-detail:first-child', 10000)
        .click('.dropdown--classifier-detail:first-child')
    },

    'check 5mb dropzone' : function (browser) {
        browser
        .setValue('.dropzone--classifier-detail:first-child input', require('path').resolve('test_files/large.png'))
        .waitForElementVisible('#error--classifier-detail', 1000)
    },

    // Do this test in the middle to clear out the error
    'check dropzone' : function (browser) {
        browser
        .setValue('.dropzone--classifier-detail:first-child input', require('path').resolve('test_files/small.jpg'))
        .waitForElementVisible('button#button--results--clear', 10000)
        .click('button#button--results--clear')
    },

    'check wrong format dropzone' : function (browser) {
        browser
        .setValue('.dropzone--classifier-detail:first-child input', require('path').resolve('test_files/vader.zip'))
    },

    "check api link" : function (browser) {
        var urlChecker = new blc.UrlChecker(null, {
            link: function(result, customData){
                console.log('checking: ' + result.url.original);
                browser
                .assert.equal(result.brokenReason, null);
            },
            end: function(){}
        });
        browser
        .getAttribute("a#link--classifiers--api-reference", "href", function(result) {
            urlChecker.enqueue(result.value);
        });
    },

    // --Test update
    // Test over 100mb
    // Test over 250mb
    // Test less than 10 pics
    // Test over 10k pics
    // Test no class name
    // Test illegal characters
    // Test no files
    // Test less than 1 class
    // Test wrong file type
    // Test a successful update

    // --Test delete

    'check create' : function (browser) {
        browser
        .click('button#button--classifiers--create')
    },

    // --Test create
    // Test over 100mb
    // Test over 250mb
    // Test less than 10 pics
    // Test over 10k pics
    // Test no classifer name
    // Test no class name
    // Test illegal characters
    // Test no files
    // Test less than 2 classes
    // Test wrong file type
    // Test a successful classifier

    'check update fake key' : function (browser) {
        browser
        .click('button#button--base--update-api-key')
        .waitForElementVisible('#exampleModal', 1000)
        .setValue('input#input--api-key-modal--api-key', '0000')
        .click('button#button--api-key-modal--submit')
        .waitForElementVisible('#error--api-key-modal--api-key', 10000)
    },

    'check update real key' : function (browser) {
        browser
        .clearValue('input#input--api-key-modal--api-key')
        .setValue('input#input--api-key-modal--api-key', process.env.API_KEY)
        .click('button#button--api-key-modal--submit')
        .waitForElementNotPresent('#exampleModal', 10000)
    },

    'check logout' : function (browser) {
        browser
        .click('button#button--base--update-api-key')
        .waitForElementVisible('#exampleModal', 1000)
        .click('button#button--api-key-modal--logout')
        .waitForElementVisible('#landing-page', 10000)
        .end();
    }
};
