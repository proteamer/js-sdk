var wd = require('wd')
	, Q = require('q')
	, request = require('request')
	, assert = require('assert')
	, host = "ondemand.saucelabs.com"
	, port = 80
	, username = "echo-apps"
	, accessKey = "cede2c15-c632-41bd-8bd9-1aac61fca87f"
// general rest call helper function using promises
var api = function (url, method, data) {
	var deferred = Q.defer();
	request(
		{ method: method
			, uri: ["https://", username, ":", accessKey, "@saucelabs.com/rest", url].join("")
			, headers: {'Content-Type': 'application/json'}
			, body: JSON.stringify(data)
		}
		, function (error, response, body) {
			deferred.resolve(response.body);
		}
	);
	return deferred.promise;
};

var platforms = [{
	browserName: 'iphone',
	version: '5.0',
	platform: 'Mac 10.6',
	tags: ["examples"],
	name: "Echo testrs (iphone)",
	build: "Testing enviroment"
}, {
	browserName: 'firefox',
	version: '21',
	platform: 'Windows 7',
	tags: ["examples"],
	name: "Echo testrs (firefox)",
	build: "Testing enviroment"
}, {
	browserName: 'chrome',
	version: '26',
	platform: 'Windows 7',
	tags: ["examples"],
	name: "Echo testrs (chrome)",
	build: "Testing enviroment"
}, {
	browserName: 'internet explorer',
	version: '9',
	platform: 'Windows 7',
	tags: ["examples"],
	name: "Echo testrs (ie9)",
	build: "Testing enviroment"
}, {
	browserName: 'internet explorer',
	version: '8',
	platform: 'Windows 7',
	tags: ["examples"],
	name: "Echo testrs (ie8)",
	build: "Testing enviroment"
}/*, {
	browserName: 'android',
	version: '4',
	platform: 'Linux',
	tags: ["examples"],
	name: "Echo testrs (android)",
	build: "Testing enviroment"
}*/];

platforms.forEach(function(platform, i) {
	var browser = wd.promiseRemote(host, port, username, accessKey);
	browser.on('status', function(info){
		console.log('\x1b[36m%s\x1b[0m', info);
	});
	// test case
	browser.init(platform).then(function () {
			//return browser.get("http://saucelabs.com/test_helpers/front_tests/qunit.html")
			return browser.get("http://proteamer.github.io/js-sdk/tests/?module=View");
		}).then(function () {
			return browser.waitForCondition("!!window.testResults", 1000 * 60 * 5, 5000);
		//}).then(function () {
		//	return browser.title();
		//}).then(function (title) {
			// are we on the right page?
		//	assert.ok(~title.indexOf("Refactored date examples"), 'Wrong title!');
		}).then(function () {
			// get jasmine output as JSON
			return browser.eval("window.testResults");
		}).then(function (jsreport) {
			// make an API call to Sauce - set custom-data with 'jasmine' data
			var data = {
				'custom-data': {qunit: jsreport},
				'passed': jsreport.failed == 0
			};
			return api(["/v1/", username, "/jobs/", browser.sessionID].join(""), "PUT", data);
		}).then(function (body) {
			//console.log("CONGRATS - WE'RE DONE", body);
		}).fin(function () {
			browser.quit();
		}).fail(function (error) {
			var data = {
				'passed': false
			};
			return api(["/v1/", username, "/jobs/", browser.sessionID].join(""), "PUT", data);
			console.error("Error:", error);
		}).done();
});

