(function($) {

"use strict";

var suite = Echo.Tests.Unit.Utils = function() {};

suite.prototype.info = {
	"className": "Echo.Utils",
	"functions": ["htmlize", "foldl", "getNestedValue", "setNestedValue", "stripTags", "object2JSON",
		      "parseUrl", "mapClass2Object", "timestampFromW3CDTF", "addCss", "htmlTextTruncate",
		      "getVisibleColor", "toDOM", "isMobileDevice", "getUniqueString"]
};

suite.prototype.tests = {};

suite.prototype.tests.TestDataMethods = {
	"check": function() {
		
		var hash = Echo.Utils.foldl({}, ["value1", "value2"], function(value, acc) {
			acc[value] = value;
		});
		var values = Echo.Utils.foldl([], ["value1", "value2"], function(value, acc) {
			acc.push(value);
		});
		var truncated_hash = Echo.Utils.foldl({}, {"key1": "value1", "key2": "value2"}, function(value, acc, key) {
			if (key === "key2") return;
			acc[key] = value;
		});
		
		QUnit.deepEqual(hash, { "value1": "value1", "value2": "value2" },
			"Checking foldl() method with hash as accumulator");
		QUnit.deepEqual(values, ["value1", "value2"],
			"Checking foldl() method with with array as accumulator");
		QUnit.deepEqual(truncated_hash, { "key1": "value1" },
			"Checking foldl() method with undefined return in callback");
		
		var data = {
			"key1": "value1",
			"key2": {
				"key2-1": "value2-1"
			}
		};
		
		QUnit.equal(Echo.Utils.getNestedValue("key1", data), "value1",
			"Checking getNestedValue() method with simple key");
		QUnit.deepEqual(Echo.Utils.getNestedValue("", data), data,
			"Checking getNestedValue() method with empty key");
		QUnit.deepEqual(Echo.Utils.getNestedValue("key2", data), {"key2-1": "value2-1"},
			"Checking getNestedValue() method")
		QUnit.equal(Echo.Utils.getNestedValue("key2.key2-1", data), "value2-1",
			"Checking getNestedValue() method with complex key")
		QUnit.equal(Echo.Utils.getNestedValue("key1.fakekey", data, "default value"), "default value",
			"Checking getNestedValue() method with fake key and default value");
		
		Echo.Utils.setNestedValue(data, "key1", { "key1-1": "value1-1"});
		QUnit.deepEqual(data["key1"], {"key1-1": "value1-1"},
			"Checking setNestedValue() method with object param");
		Echo.Utils.setNestedValue(data, "key3", "value3");
		QUnit.equal(data["key3"], "value3",
			"Checking setNestedValue() method with plain param");
		
		QUnit.equal(Echo.Utils.htmlize(), "",
			"Checking htmlize() method with empty param");
		QUnit.equal(Echo.Utils.htmlize("text1 < & > text2"), "text1 &lt; &amp; &gt; text2",
			"Checking htmlize() method with special characters");
		
		QUnit.equal(Echo.Utils.stripTags(""), "",
			"Checking stripTags() method with empty param");
		QUnit.equal(Echo.Utils.stripTags("<div>Content</div>"), "Content",
			"Checking stripTags() method with simple HTML");
		QUnit.equal(Echo.Utils.stripTags("<div>Outer<div><!-- Comment -->Inner</div></div>"), "OuterInner",
			"Checking stripTags() method with complex HTML");
		
		QUnit.equal(Echo.Utils.object2JSON(null), "null",
			"Checking object2JSON() method for null object ");
		QUnit.equal(Echo.Utils.object2JSON(123), "123",
			"Checking object2JSON() method for number object");
		QUnit.equal(Echo.Utils.object2JSON("string\n"), "\"string\\n\"",
			"Checking object2JSON() method for string object");
		QUnit.equal(Echo.Utils.object2JSON(Number.POSITIVE_INFINITY), "null",
			"Checking object2JSON() method for number object (infinity value)");
		QUnit.equal(Echo.Utils.object2JSON(true), "true",
			"Checking object2JSON() method for boolean object (true value)");
		QUnit.equal(Echo.Utils.object2JSON(false), "false",
			"Checking object2JSON() method for boolen object (false value)");
		QUnit.equal(Echo.Utils.object2JSON(["value1", "value2"]), '["value1","value2"]',
			"Checking object2JSON() method for simple array");
		QUnit.equal(Echo.Utils.object2JSON([["value1.1", "value1.2"], "value2"]), '[["value1.1","value1.2"],"value2"]',
			"Checking object2JSON() method for complex array");
		QUnit.equal(Echo.Utils.object2JSON({"k1": "v1", "k2": "v2"}), '{"k1":"v1","k2":"v2"}',
			"Checking object2JSON() method for simple object");
		
		var complex_object = {
			"k1": ["v1.1", null, false],
			"k2": {
				"k2.1": 21,
				"k2.2": 22
			}
		};
		QUnit.equal(Echo.Utils.object2JSON(complex_object), '{"k1":["v1.1",null,false],"k2":{"k2.1":21,"k2.2":22}}',
			"Checking object2JSON() method for complex object");
		
		QUnit.deepEqual(Echo.Utils.parseUrl("http://domain.com/some/path/1?query_string#hash_value"), {
			"scheme": "http",
			"domain": "domain.com",
			"path": "/some/path/1",
			"query": "query_string",
			"fragment": "hash_value"
		}, "Checking parseUrl() method");
		
		QUnit.deepEqual(Echo.Utils.parseUrl("https://www.domain.com"), {
			"scheme": "https",
			"domain": "www.domain.com",
			"path": "",
			"query": undefined,
			"fragment": undefined
		}, "Checking parseUrl() method with some undefined fields");
		
		QUnit.equal(Echo.Utils.timestampFromW3CDTF("1994-11-05T08:15:30Z"), 784023330,
			"Checking timestampFromW3CDTF() method");
		QUnit.equal(Echo.Utils.timestampFromW3CDTF("1994-11-0508-15:30"), undefined,
			"Checking timestampFromW3CDTF() method with incorrect input value");
		
		QUnit.equal(Echo.Utils.htmlTextTruncate("<div>some_content</div>", 10), "<div>some_conte</div>",
			"Checking htmlTextTruncate() method");
		QUnit.equal(Echo.Utils.htmlTextTruncate("<div>content</div>", 10), "<div>content</div>",
			"Checking htmlTextTruncate() method with short HTML content");
		QUnit.equal(Echo.Utils.htmlTextTruncate("<div><span>some</span>_content</div>", 10),"<div><span>some</span>_conte</div>",
			"Checking htmlTextTruncate() method with nested HTML tags");
		QUnit.equal(Echo.Utils.htmlTextTruncate("<div>some_content</div>", 10, "_postfix"), "<div>some_conte_postfix</div>",
			"Checking htmlTextTruncate() method with postfix param");
		QUnit.equal(Echo.Utils.htmlTextTruncate("<div>some&nbsp;content</div>", 10), "<div>some&nbsp;conten</div>",
			"Checking htmlTextTruncate() method with special character");
		QUnit.equal(Echo.Utils.htmlTextTruncate("<div><span>1234&nbsp;", 5, "", 1), "<div><span>1234&nbsp;</span></div>",
			"Checking htmlTextTruncate() method with forceClosingTags param");

		QUnit.ok(typeof Echo.Utils.getUniqueString() == "string", "getUniqueString() really returns string");
		var strings = [];
		for (var i = 0; i < 5; i++) {
			strings.push(Echo.Utils.getUniqueString());
		}
		for (var i = 0; i < 4; i++) {
			var str = strings.shift();
			QUnit.ok(!~$.inArray(str, strings), "getUniqueString(): string \"" + str + "\" differs from others");
		}
	}
};

suite.prototype.tests.TestDomMethods = {
	"check": function() {
		
		QUnit.ok(Echo.Utils.addCss(".echo-utils-tests {}", "utils-tests"),
			"Checking that addCss() method returns true if CSS-class was added");
		QUnit.ok(/echo-utils-tests {}$/.test(Echo.Vars.css.anchor.html()),
			"Checking that addCss() method adds CSS-class to style");
		QUnit.ok(!Echo.Utils.addCss(".echo-utils-tests {}", "utils-tests"),
			"Checking that addCss() method returns false if previously added Id is used");
		// delete previously added css class
		Echo.Vars.css.anchor.html(Echo.Vars.css.anchor.html().replace(/.echo-utils-tests {}$/, ""));
		
		var template =  '<div class="echo-utils-tests-container">' +
					'<div class="echo-utils-tests-header">header</div>' +
					'<div class="echo-utils-tests-content">' +
						'<div class="echo-utils-tests-section1"></div>' +
						'<div class="echo-utils-tests-section2"></div>' +
						'<div class="echo-utils-tests-section3"></div>' +
					'</div>' +
				'</div>';
		
		var footer_template = '<div class="echo-utils-tests-footer">footer content</div>';
		
		var handlers = {
			"section1": function(element) {
				element.text("content1");
			},
			"section2": function(element) {
				element.text("content2");
			},
			"section3": function(element) {
				element.text("content3");
			}
		};
		
		var container = Echo.Utils.toDOM(template, 'echo-utils-tests-', handlers);
		QUnit.equal(container.get("section1").html(), "content1",
			"Checking toDOM.get() method");
		container.set("footer", $(footer_template));
		QUnit.equal(container.get("footer").html(), "footer content",
			"Checking toDOM.set() method");
		container.remove("section2");
		QUnit.equal(container.get("section2"), undefined,
			"Checking toDOM.remove() method");
		
		container.get("section1").css("background-color", "rgb(255, 0, 0)");
		QUnit.equal(Echo.Utils.getVisibleColor(container.get("section1")), "rgb(255, 0, 0)",
			"Checking getVisibleColor() method with element color");
		container.get("content").css("background-color", "rgb(0, 255, 0)");
		QUnit.equal(Echo.Utils.getVisibleColor(container.get("section3")), "rgb(0, 255, 0)",
			"Checking that getVisibleColor() method returns parent element color if element color is undefined");
		container.get("footer").css("background-color", "rgba(0, 0, 0, 0");
		QUnit.equal(Echo.Utils.getVisibleColor(container.get("footer")), "transparent",
			"Checking getVisibleColor() method with transparent element color");
		
		var elements = Echo.Utils.mapClass2Object(container.content);
		QUnit.equal(elements['echo-utils-tests-section3'].innerHTML, "content3",
			"Checking mapClass2Object() method");
		
		var user_agents = {
			"android": "Android-x86-1.6-r2 - Mozilla/5.0 (Linux; U; Android 1.6; en-us; eeepc Build/Donut)" +
					"AppleWebKit/528.5+ (KHTML, like Gecko) Version/3.1.2 Mobile Safari/525.20.1",
			"iphone": "Mozilla/5.0 (iPhone; U; CPU iPhone OS 4_2 like Mac OS X; en_us) AppleWebKit/525.18.1",
			"opera-mini": "Opera/9.60 (J2ME/MIDP; Opera Mini/4.2.14912/812; U; ru) Presto/2.4.15",
			"ie": "Mozilla/5.0 (Windows; U; MSIE 9.0; Windows NT 9.0; en-US)",
			"firefox": "Mozilla/5.0 (X11; U; Linux i686; cs-CZ; rv:1.7.12) Gecko/20050929",
			"chrome": "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_7; en-US) AppleWebKit/534.16" +
					"(KHTML, like Gecko) Chrome/10.0.648.205 Safari/534.16"
		};
		// test regexp for isMobileDevice() method to avoid redefining userAgent
		QUnit.ok(Echo.Vars.regexps.mobileUA.test(user_agents['android']),
			"Checking mobile device regexp for Android user agent");
		QUnit.ok(Echo.Vars.regexps.mobileUA.test(user_agents['iphone']),
			"Checking mobile device regexp for iPhone user agent");
		QUnit.ok(Echo.Vars.regexps.mobileUA.test(user_agents['opera-mini']),
			"Checking mobile device regexp for Opera-Mini user agent");
		QUnit.ok(!Echo.Vars.regexps.mobileUA.test(user_agents['ie']),
			"Checking mobile device regexp for IE user agent");
		QUnit.ok(!Echo.Vars.regexps.mobileUA.test(user_agents['firefox']),
			"Checking mobile device regexp for Firefox user agent");
		QUnit.ok(!Echo.Vars.regexps.mobileUA.test(user_agents['chrome']),
			"Checking mobile device regexp for Chrome user agent");
		// change it if tests is running on mobile devices
		QUnit.equal(Echo.Utils.isMobileDevice(), false,
			"Checking isMobileDevice() method for real userAgent");
	}
};

})(jQuery);