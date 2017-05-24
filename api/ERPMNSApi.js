/*jshint -W069 */
/**
 * ERP MNS api
 * @class ERPMNSApi
 * @param {(string|object)} [domainOrOptions] - The project domain or options object. If object, see the object's optional properties.
 * @param {string} [domainOrOptions.domain] - The project domain
 * @param {object} [domainOrOptions.token] - auth token - object with value property and optional headerOrQueryName and isQuery properties
 */
var ERPMNSApi = (function() {
    'use strict';

    var request = require('request');
    var Q = require('q');

    function ERPMNSApi(options) {
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
     * @name ERPMNSApi#request
     * @param {string} method - http method
     * @param {string} url - url to do request
     * @param {object} parameters
     * @param {object} body - body parameters / object
     * @param {object} headers - header parameters
     * @param {object} queryParameters - querystring parameters
     * @param {object} form - form data object
     * @param {object} deferred - promise object
     */
    ERPMNSApi.prototype.request = function(method, url, parameters, body, headers, queryParameters, form, deferred) {
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
     * 批量删除站内信
     * @method
     * @name ERPMNSApi#batchDelInternalMsgUsingPOST
     * @param {object} parameters - method options and parameters
     * @param {} parameters.batchOpertInternalMsgReqVo - batchOpertInternalMsgReqVO
     */
    ERPMNSApi.prototype.batchDelInternalMsgUsingPOST = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/internalMsgServ/batchDelInternalMsg';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['*/*'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['batchOpertInternalMsgReqVo'] !== undefined) {
            body = parameters['batchOpertInternalMsgReqVo'];
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * 批量阅读站内信
     * @method
     * @name ERPMNSApi#batchReadInternalMsgUsingPOST
     * @param {object} parameters - method options and parameters
     * @param {} parameters.batchOpertInternalMsgReqVo - batchOpertInternalMsgReqVO
     */
    ERPMNSApi.prototype.batchReadInternalMsgUsingPOST = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/internalMsgServ/batchReadInternalMsg';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['*/*'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['batchOpertInternalMsgReqVo'] !== undefined) {
            body = parameters['batchOpertInternalMsgReqVo'];
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * 删除站内信
     * @method
     * @name ERPMNSApi#delInternalMsgUsingPOST
     * @param {object} parameters - method options and parameters
     * @param {} parameters.operateInternalMsgReqVo - operateInternalMsgReqVO
     */
    ERPMNSApi.prototype.delInternalMsgUsingPOST = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/internalMsgServ/delInternalMsg';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['*/*'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['operateInternalMsgReqVo'] !== undefined) {
            body = parameters['operateInternalMsgReqVo'];
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * 查询站内信
     * @method
     * @name ERPMNSApi#queryInternalMsgUsingPOST
     * @param {object} parameters - method options and parameters
     * @param {} parameters.queryInternalMsgReqVo - queryInternalMsgReqVO
     */
    ERPMNSApi.prototype.queryInternalMsgUsingPOST = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/internalMsgServ/queryInternalMsg';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['*/*'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['queryInternalMsgReqVo'] !== undefined) {
            body = parameters['queryInternalMsgReqVo'];
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * 通过id查询站内信
     * @method
     * @name ERPMNSApi#queryInternalMsgByIdUsingPOST
     * @param {object} parameters - method options and parameters
     * @param {} parameters.queryInternalMsgReqVo - queryInternalMsgReqVO
     */
    ERPMNSApi.prototype.queryInternalMsgByIdUsingPOST = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/internalMsgServ/queryInternalMsgById';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['*/*'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['queryInternalMsgReqVo'] !== undefined) {
            body = parameters['queryInternalMsgReqVo'];
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * 通过userId查询站内信未读条数
     * @method
     * @name ERPMNSApi#queryUnReadInternalMsgCountUsingPOST
     * @param {object} parameters - method options and parameters
     * @param {} parameters.queryUnReadInternalMsgReqVo - queryUnReadInternalMsgReqVO
     */
    ERPMNSApi.prototype.queryUnReadInternalMsgCountUsingPOST = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/internalMsgServ/queryUnReadInternalMsgCount';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['*/*'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['queryUnReadInternalMsgReqVo'] !== undefined) {
            body = parameters['queryUnReadInternalMsgReqVo'];
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * 阅读站内信
     * @method
     * @name ERPMNSApi#readInternalMsgUsingPOST
     * @param {object} parameters - method options and parameters
     * @param {} parameters.operateInternalMsgReqVo - operateInternalMsgReq
     */
    ERPMNSApi.prototype.readInternalMsgUsingPOST = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/internalMsgServ/readInternalMsg';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['*/*'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['operateInternalMsgReqVo'] !== undefined) {
            body = parameters['operateInternalMsgReqVo'];
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * 发送站内信
     * @method
     * @name ERPMNSApi#sendInternalMsgUsingPOST
     * @param {object} parameters - method options and parameters
     * @param {} parameters.internalMsgReqVo - internalMsgReqVO
     */
    ERPMNSApi.prototype.sendInternalMsgUsingPOST = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/internalMsgServ/sendInternalMsg';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['*/*'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['internalMsgReqVo'] !== undefined) {
            body = parameters['internalMsgReqVo'];
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * 新增无模板消息请求
     * @method
     * @name ERPMNSApi#addNoTemplateMsgInterReqProcUsingPOST
     * @param {object} parameters - method options and parameters
     * @param {} parameters.msgInterReqProcReqVo - msgInterReqProcReqVO
     */
    ERPMNSApi.prototype.addNoTemplateMsgInterReqProcUsingPOST = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/msgInterReqProcServ/addNoTemplateMsgInterReqProc';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['*/*'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['msgInterReqProcReqVo'] !== undefined) {
            body = parameters['msgInterReqProcReqVo'];
        }

        if (parameters['msgInterReqProcReqVo'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: msgInterReqProcReqVo'));
            return deferred.promise;
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * 新增有模板消息请求
     * @method
     * @name ERPMNSApi#addTemplateMsgInterReqProcUsingPOST
     * @param {object} parameters - method options and parameters
     * @param {} parameters.msgInterReqProcReqVo - msgInterReqProcReqVO
     */
    ERPMNSApi.prototype.addTemplateMsgInterReqProcUsingPOST = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/msgInterReqProcServ/addTemplateMsgInterReqProc';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['*/*'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['msgInterReqProcReqVo'] !== undefined) {
            body = parameters['msgInterReqProcReqVo'];
        }

        if (parameters['msgInterReqProcReqVo'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: msgInterReqProcReqVo'));
            return deferred.promise;
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * 异步批量处理站内信请求
     * @method
     * @name ERPMNSApi#batchDealInternalMsgUsingPOST
     * @param {object} parameters - method options and parameters
     * @param {} parameters.batchDealInternalMsgReqVo - batchDealInternalMsgReqVO
     */
    ERPMNSApi.prototype.batchDealInternalMsgUsingPOST = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/msgInterReqProcServ/batchDealInternalMsg';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['*/*'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['batchDealInternalMsgReqVo'] !== undefined) {
            body = parameters['batchDealInternalMsgReqVo'];
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * 发送短信验证码，返回ticket
     * @method
     * @name ERPMNSApi#sendSMSCodeUsingPOST
     * @param {object} parameters - method options and parameters
     * @param {} parameters.sMsCodeSendReqVo - sMSCodeSendReqVO
     */
    ERPMNSApi.prototype.sendSMSCodeUsingPOST = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/smsServ/sendSMSCode';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['*/*'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['sMsCodeSendReqVo'] !== undefined) {
            body = parameters['sMsCodeSendReqVo'];
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * 短信验证码验证
     * @method
     * @name ERPMNSApi#verifySMSCodeUsingPOST
     * @param {object} parameters - method options and parameters
     * @param {} parameters.smsCodeReqVo - smsCodeReqVO
     */
    ERPMNSApi.prototype.verifySMSCodeUsingPOST = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/smsServ/verifySMSCode';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['*/*'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['smsCodeReqVo'] !== undefined) {
            body = parameters['smsCodeReqVo'];
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * 删除系统消息
     * @method
     * @name ERPMNSApi#delSystemMsgUsingPOST
     * @param {object} parameters - method options and parameters
     * @param {} parameters.operateInternalMsgReqVo - operateInternalMsgReqVO
     */
    ERPMNSApi.prototype.delSystemMsgUsingPOST = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/systemMsgServ/delSystemMsg';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['*/*'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['operateInternalMsgReqVo'] !== undefined) {
            body = parameters['operateInternalMsgReqVo'];
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * 查询系统消息
     * @method
     * @name ERPMNSApi#querySystemMsgUsingPOST
     * @param {object} parameters - method options and parameters
     * @param {} parameters.queryInternalMsgReqVo - queryInternalMsgReqVO
     */
    ERPMNSApi.prototype.querySystemMsgUsingPOST = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/systemMsgServ/querySystemMsg';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['*/*'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['queryInternalMsgReqVo'] !== undefined) {
            body = parameters['queryInternalMsgReqVo'];
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * 阅读系统消息
     * @method
     * @name ERPMNSApi#readSystemMsgUsingPOST
     * @param {object} parameters - method options and parameters
     * @param {} parameters.operateInternalMsgReqVo - operateInternalMsgReqVO
     */
    ERPMNSApi.prototype.readSystemMsgUsingPOST = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/systemMsgServ/readSystemMsg';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['*/*'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['operateInternalMsgReqVo'] !== undefined) {
            body = parameters['operateInternalMsgReqVo'];
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * 发送系统消息
     * @method
     * @name ERPMNSApi#sendSystemMsgUsingPOST
     * @param {object} parameters - method options and parameters
     * @param {} parameters.internalMsgReqVo - internalMsgReqVO
     */
    ERPMNSApi.prototype.sendSystemMsgUsingPOST = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/systemMsgServ/sendSystemMsg';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['*/*'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['internalMsgReqVo'] !== undefined) {
            body = parameters['internalMsgReqVo'];
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };

    return ERPMNSApi;
})();

exports.ERPMNSApi = ERPMNSApi;