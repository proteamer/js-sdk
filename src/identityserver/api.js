(function(jQuery) {
"use strict";

var $ = jQuery;

if (Echo.IdentityServer && Echo.IdentityServer.API) return;

if (!Echo.IdentityServer) Echo.IdentityServer = {};

Echo.IdentityServer.API = {};

/**
 * @class Echo.IdentityServer.API.Request
 * Class implements the interaction with the <a href="http://wiki.aboutecho.com/w/page/35104702/API-section-users" target="_blank">Echo Users API</a> 
 * @extends Echo.API.Request
 *
 * @constructor
 * Constructor initializing class using configuration data.
 * @param {Object} config Configuration data.
 */
Echo.IdentityServer.API.Request = Echo.Utils.inherit(Echo.API.Request, function(config) {
	if (!config.data.appkey) {
		Echo.Utils.log({
			"type": "error",
			"component": "Echo.IdentityServer.API",
			"message": "Unable to initialize API request, appkey is invalid",
			"args": {"config": config}
		});
		return {};
	}
	config = $.extend({
		/**
		 * @cfg {Function} [onData] Callback called after API request succeded.
		 */
		"onData": function() {},
		/**
		 * @cfg {Function} [onError] Callback called after API request failed. 
		 */
		"onError": function() {},
		/**
		 * @cfg {String} [submissionProxyURL] Specifes the URL to the submission proxy service.
		 */
		"submissionProxyURL": "http://apps.echoenabled.com/v2/esp/activity"
	}, config);
	config = this._wrapTransportEventHandlers(config);
	Echo.IdentityServer.API.Request.parent.constructor.call(this, config);
});

Echo.IdentityServer.API.Request.prototype._prepareURI = function() {
	return this.config.get("endpoint") === "whoami"
		? Echo.IdentityServer.API.Request.parent._prepareURI.call(this)
		// FIXME: move replace to API.Request lib
		: this.config.get("submissionProxyURL").replace(/^(http|ws)s?:\/\//, "");
};

Echo.IdentityServer.API.Request.prototype._wrapTransportEventHandlers = function(config) {
	var self = this;
	var _config = $.extend({}, config);
	return $.extend({}, config, {
		"onData": function(response, requestParams) {
			self._onData(response, _config);
		}
	});
};

Echo.IdentityServer.API.Request.prototype._onData = function(response, config) {
	if (response && response.result === "error") {
		config.onError(response);
		return;
	}
	config.onData(response);
};

Echo.IdentityServer.API.Request.prototype._update = function(args) {
	var content = $.extend({}, this.config.get("data.content"), {
		"endpoint": "users/update"
	});
	this.request(
		$.extend({}, this.config.get("data"), {
			"content": Echo.Utils.objectToJSON(content)
		})
	);
};

Echo.IdentityServer.API.Request.prototype._whoami = function(args) {
	this.request(args);
};

/**
 * @static
 * Alias for the class constructor.
 * @param {Object} Configuration data.
 * @return {Object} New class instance.
 */
Echo.IdentityServer.API.request = function(config) {
	return (new Echo.IdentityServer.API.Request(config));
};

})(Echo.jQuery);
