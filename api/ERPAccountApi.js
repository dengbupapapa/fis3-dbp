/*jshint -W069 */
/**
 * ERP Account api
 * @class ERPAccountApi
 * @param {(string|object)} [domainOrOptions] - The project domain or options object. If object, see the object's optional properties.
 * @param {string} [domainOrOptions.domain] - The project domain
 * @param {object} [domainOrOptions.token] - auth token - object with value property and optional headerOrQueryName and isQuery properties
 */
var ERPAccountApi = (function() {
    'use strict';

    var request = require('request');
    var Q = require('q');

    function ERPAccountApi(options) {
        var domain = (typeof options === 'object') ? options.domain : options;
        this.domain = domain ? domain : '';
        if (this.domain.length === 0) {
            throw new Error('Domain parameter must be specified as a string.');
        }
    }

    function mergeQueryParams(parameters, queryParameters) {
        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }
        return queryParameters;
    }

    /**
     * HTTP Request
     * @method
     * @name ERPAccountApi#request
     * @param {string} method - http method
     * @param {string} url - url to do request
     * @param {object} parameters
     * @param {object} body - body parameters / object
     * @param {object} headers - header parameters
     * @param {object} queryParameters - querystring parameters
     * @param {object} form - form data object
     * @param {object} deferred - promise object
     */
    ERPAccountApi.prototype.request = function(method, url, parameters, body, headers, queryParameters, form, deferred) {
        var req = {
            method: method,
            uri: url,
            qs: queryParameters,
            headers: headers,
            body: body
        };
        if (Object.keys(form).length > 0) {
            req.form = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {}
                }
                if (response.statusCode === 204) {
                    deferred.resolve({
                        response: response
                    });
                } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });
    };

    /**
     * 平台账户登录
     * @method
     * @name ERPAccountApi#loginForAndBusinessGatherUsingPOST
     * @param {object} parameters - method options and parameters
     * @param {} parameters.addUserReqVo - param0
     */
    ERPAccountApi.prototype.loginForAndBusinessGatherUsingPOST = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/addUserAccountServ/loginForAndBusinessGather';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['*/*'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['addUserReqVo'] !== undefined) {
            body = parameters['addUserReqVo'];
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * 第三方boss登录
     * @method
     * @name ERPAccountApi#bossLoginUsingPOST
     * @param {object} parameters - method options and parameters
     * @param {} parameters.bossLoginReqVo - param0
     */
    ERPAccountApi.prototype.bossLoginUsingPOST = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/loginServ/bossLogin';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['*/*'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['bossLoginReqVo'] !== undefined) {
            body = parameters['bossLoginReqVo'];
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * 平台账户登录
     * @method
     * @name ERPAccountApi#userLoginUsingPOST
     * @param {object} parameters - method options and parameters
     * @param {} parameters.loginReqVo - param0
     */
    ERPAccountApi.prototype.userLoginUsingPOST = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/loginServ/login';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['*/*'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['loginReqVo'] !== undefined) {
            body = parameters['loginReqVo'];
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * 账户登出
     * @method
     * @name ERPAccountApi#logoutUsingPOST
     * @param {object} parameters - method options and parameters
     * @param {} parameters.loginReqVo - param0
     */
    ERPAccountApi.prototype.logoutUsingPOST = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/loginServ/logout';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['*/*'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['loginReqVo'] !== undefined) {
            body = parameters['loginReqVo'];
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * 第三方账户登录
     * @method
     * @name ERPAccountApi#otherLoginUsingPOST
     * @param {object} parameters - method options and parameters
     * @param {} parameters.otherLoginReqVo - param0
     */
    ERPAccountApi.prototype.otherLoginUsingPOST = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/loginServ/otherLogin';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['*/*'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['otherLoginReqVo'] !== undefined) {
            body = parameters['otherLoginReqVo'];
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * 第三方账户登录回调
     * @method
     * @name ERPAccountApi#otherLoginCallBackUsingPOST
     * @param {object} parameters - method options and parameters
     * @param {} parameters.obj - param0
     */
    ERPAccountApi.prototype.otherLoginCallBackUsingPOST = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/loginServ/otherLoginCallBack';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['*/*'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['obj'] !== undefined) {
            body = parameters['obj'];
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * 快速登录
     * @method
     * @name ERPAccountApi#quickLoginUsingPOST
     * @param {object} parameters - method options and parameters
     * @param {} parameters.quickLoginReqVo - param0
     */
    ERPAccountApi.prototype.quickLoginUsingPOST = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/loginServ/quickLogin';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['*/*'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['quickLoginReqVo'] !== undefined) {
            body = parameters['quickLoginReqVo'];
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * 密码修改完成后,发送短信告诉用户
     * @method
     * @name ERPAccountApi#modifyPasswordUsingPOST
     * @param {object} parameters - method options and parameters
     * @param {} parameters.modifyPasswordReqVo - param0
     */
    ERPAccountApi.prototype.modifyPasswordUsingPOST = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/passwordServ/modifyPassword';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['*/*'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['modifyPasswordReqVo'] !== undefined) {
            body = parameters['modifyPasswordReqVo'];
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * 找回密码的重置功能,需要再次验证手机验证码是否已经验证通过
     * @method
     * @name ERPAccountApi#resetPasswordUsingPOST
     * @param {object} parameters - method options and parameters
     * @param {} parameters.resetPasswordReqVo - param0
     */
    ERPAccountApi.prototype.resetPasswordUsingPOST = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/passwordServ/resetPassword';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['*/*'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['resetPasswordReqVo'] !== undefined) {
            body = parameters['resetPasswordReqVo'];
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * 注册
     * @method
     * @name ERPAccountApi#userRegUsingPOST
     * @param {object} parameters - method options and parameters
     * @param {} parameters.regReqVo - param0
     */
    ERPAccountApi.prototype.userRegUsingPOST = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/regServ/userReg';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['*/*'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['regReqVo'] !== undefined) {
            body = parameters['regReqVo'];
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * 用户使用第三方账户登录进入主页后,需要调用本接口绑定手机号,同时需要设置登录密码
     * @method
     * @name ERPAccountApi#bindMobileUsingPOST
     * @param {object} parameters - method options and parameters
     * @param {} parameters.bindMobileReqVo - param0
     */
    ERPAccountApi.prototype.bindMobileUsingPOST = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/userInfoServ/bindMobile';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['*/*'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['bindMobileReqVo'] !== undefined) {
            body = parameters['bindMobileReqVo'];
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * 判断用户的手机号是否已经绑定
     * @method
     * @name ERPAccountApi#checkBindStateUsingPOST
     * @param {object} parameters - method options and parameters
     * @param {} parameters.checkBindMobileReqVo - param0
     */
    ERPAccountApi.prototype.checkBindStateUsingPOST = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/userInfoServ/checkBindState';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['*/*'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['checkBindMobileReqVo'] !== undefined) {
            body = parameters['checkBindMobileReqVo'];
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * 完善用户信息
     * @method
     * @name ERPAccountApi#completeInfoUsingPOST
     * @param {object} parameters - method options and parameters
     * @param {} parameters.userInfoReqVo - param0
     */
    ERPAccountApi.prototype.completeInfoUsingPOST = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/userInfoServ/completeInfo';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['*/*'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['userInfoReqVo'] !== undefined) {
            body = parameters['userInfoReqVo'];
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * 根据userId查询社交绑定信息
     * @method
     * @name ERPAccountApi#querySNSBindUsingPOST
     * @param {object} parameters - method options and parameters
     * @param {} parameters.querySnsBindReqVo - param0
     */
    ERPAccountApi.prototype.querySNSBindUsingPOST = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/userInfoServ/querySNSBind';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['*/*'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['querySnsBindReqVo'] !== undefined) {
            body = parameters['querySnsBindReqVo'];
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * 根据用户ID或者手机号查询用户信息
     * @method
     * @name ERPAccountApi#queryUserInfoUsingPOST
     * @param {object} parameters - method options and parameters
     * @param {} parameters.queryUserInfoReqVo - param0
     */
    ERPAccountApi.prototype.queryUserInfoUsingPOST = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/userInfoServ/queryUserInfo';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['*/*'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['queryUserInfoReqVo'] !== undefined) {
            body = parameters['queryUserInfoReqVo'];
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * 根据用户ID列表查询用户信息
     * @method
     * @name ERPAccountApi#queryUserInfoByUserIdsUsingPOST
     * @param {object} parameters - method options and parameters
     * @param {} parameters.queryUserInfoReqVo - param0
     */
    ERPAccountApi.prototype.queryUserInfoByUserIdsUsingPOST = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/userInfoServ/queryUserInfoByUserIds';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['*/*'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['queryUserInfoReqVo'] !== undefined) {
            body = parameters['queryUserInfoReqVo'];
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * 根据userKey查询用户信息
     * @method
     * @name ERPAccountApi#queryUserInfoByUserKeyUsingPOST
     * @param {object} parameters - method options and parameters
     * @param {} parameters.queryUserInfoByUserKeyReqVo - param0
     */
    ERPAccountApi.prototype.queryUserInfoByUserKeyUsingPOST = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/userInfoServ/queryUserInfoByUserKey';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['*/*'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['queryUserInfoByUserKeyReqVo'] !== undefined) {
            body = parameters['queryUserInfoByUserKeyReqVo'];
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };

    return ERPAccountApi;
})();

exports.ERPAccountApi = ERPAccountApi;