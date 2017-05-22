/*jshint -W069 */
/**
 * ERP Privilege api
 * @class ERPPrivilegeApi
 * @param {(string|object)} [domainOrOptions] - The project domain or options object. If object, see the object's optional properties.
 * @param {string} [domainOrOptions.domain] - The project domain
 * @param {object} [domainOrOptions.token] - auth token - object with value property and optional headerOrQueryName and isQuery properties
 */
var ERPPrivilegeApi = (function() {
    'use strict';

    var request = require('request');
    var Q = require('q');

    function ERPPrivilegeApi(options) {
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
     * @name ERPPrivilegeApi#request
     * @param {string} method - http method
     * @param {string} url - url to do request
     * @param {object} parameters
     * @param {object} body - body parameters / object
     * @param {object} headers - header parameters
     * @param {object} queryParameters - querystring parameters
     * @param {object} form - form data object
     * @param {object} deferred - promise object
     */
    ERPPrivilegeApi.prototype.request = function(method, url, parameters, body, headers, queryParameters, form, deferred) {
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
     * 查询所有的权限节点
     * @method
     * @name ERPPrivilegeApi#findAllPrivilegesUsingPOST
     * @param {object} parameters - method options and parameters
     * @param {} parameters.findAllPrivilegesReqVo - param0
     */
    ERPPrivilegeApi.prototype.findAllPrivilegesUsingPOST = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/privilegeServ/findAllPrivileges';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['*/*'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['findAllPrivilegesReqVo'] !== undefined) {
            body = parameters['findAllPrivilegesReqVo'];
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * 查询员工被授予的所有权限节点
     * @method
     * @name ERPPrivilegeApi#findGrantedPrivilegeByUserIdUsingPOST
     * @param {object} parameters - method options and parameters
     * @param {} parameters.queryUserPrivilegeReqVo - param0
     */
    ERPPrivilegeApi.prototype.findGrantedPrivilegeByUserIdUsingPOST = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/privilegeServ/findGrantedPrivilegeByUserId';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['*/*'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['queryUserPrivilegeReqVo'] !== undefined) {
            body = parameters['queryUserPrivilegeReqVo'];
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * 查询员工被授权管理的所有店铺
     * @method
     * @name ERPPrivilegeApi#findGrantedShopByUserIdUsingPOST
     * @param {object} parameters - method options and parameters
     * @param {} parameters.queryUserPrivilegeReqVo - param0
     */
    ERPPrivilegeApi.prototype.findGrantedShopByUserIdUsingPOST = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/privilegeServ/findGrantedShopByUserId';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['*/*'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['queryUserPrivilegeReqVo'] !== undefined) {
            body = parameters['queryUserPrivilegeReqVo'];
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * 授权给用户
     * @method
     * @name ERPPrivilegeApi#grantUserPrivilegeUsingPOST
     * @param {object} parameters - method options and parameters
     * @param {} parameters.grantPrivilegeReqVo - param0
     */
    ERPPrivilegeApi.prototype.grantUserPrivilegeUsingPOST = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/privilegeServ/grantUserPrivilege';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['*/*'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['grantPrivilegeReqVo'] !== undefined) {
            body = parameters['grantPrivilegeReqVo'];
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * 查询员工是否拥有单位操作的某个权限节点（比如添加员工、设置权限）
     * @method
     * @name ERPPrivilegeApi#hasPrivilegeNodeUsingPOST
     * @param {object} parameters - method options and parameters
     * @param {} parameters.privilegeNodeReqVo - param0
     */
    ERPPrivilegeApi.prototype.hasPrivilegeNodeUsingPOST = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/privilegeServ/hasPrivilegeNode';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['*/*'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['privilegeNodeReqVo'] !== undefined) {
            body = parameters['privilegeNodeReqVo'];
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * 查询员工是否拥有某个店铺的某个权限操作点（比如入库、出库是针对店铺的）
     * @method
     * @name ERPPrivilegeApi#hasPrivilegeShopUsingPOST
     * @param {object} parameters - method options and parameters
     * @param {} parameters.privilegeShopReqVo - param0
     */
    ERPPrivilegeApi.prototype.hasPrivilegeShopUsingPOST = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/privilegeServ/hasPrivilegeShop';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['*/*'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['privilegeShopReqVo'] !== undefined) {
            body = parameters['privilegeShopReqVo'];
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };

    return ERPPrivilegeApi;
})();

exports.ERPPrivilegeApi = ERPPrivilegeApi;