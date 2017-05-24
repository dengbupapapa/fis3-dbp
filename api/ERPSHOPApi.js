/*jshint -W069 */
/**
 * ERP SHOP api
 * @class ERPSHOPApi
 * @param {(string|object)} [domainOrOptions] - The project domain or options object. If object, see the object's optional properties.
 * @param {string} [domainOrOptions.domain] - The project domain
 * @param {object} [domainOrOptions.token] - auth token - object with value property and optional headerOrQueryName and isQuery properties
 */
var ERPSHOPApi = (function() {
    'use strict';

    var request = require('request');
    var Q = require('q');

    function ERPSHOPApi(options) {
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
     * @name ERPSHOPApi#request
     * @param {string} method - http method
     * @param {string} url - url to do request
     * @param {object} parameters
     * @param {object} body - body parameters / object
     * @param {object} headers - header parameters
     * @param {object} queryParameters - querystring parameters
     * @param {object} form - form data object
     * @param {object} deferred - promise object
     */
    ERPSHOPApi.prototype.request = function(method, url, parameters, body, headers, queryParameters, form, deferred) {
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
     * 添加店铺
     * @method
     * @name ERPSHOPApi#addShopUsingPOST
     * @param {object} parameters - method options and parameters
     * @param {} parameters.addShopReqVo - addShopReqVO
     */
    ERPSHOPApi.prototype.addShopUsingPOST = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/addShopForAndBusinessGatherService/addShop';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['*/*'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['addShopReqVo'] !== undefined) {
            body = parameters['addShopReqVo'];
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * 添加店员
     * @method
     * @name ERPSHOPApi#addClerkUsingPOST
     * @param {object} parameters - method options and parameters
     * @param {} parameters.addClerkReqVo - addClerkReqVO
     */
    ERPSHOPApi.prototype.addClerkUsingPOST = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/clerkServ/addClerk';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['*/*'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['addClerkReqVo'] !== undefined) {
            body = parameters['addClerkReqVo'];
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * 删除店员,类似于离职
     * @method
     * @name ERPSHOPApi#delClerkUsingPOST
     * @param {object} parameters - method options and parameters
     * @param {} parameters.employeeEditVo - employeeEditVO
     */
    ERPSHOPApi.prototype.delClerkUsingPOST = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/clerkServ/delClerk';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['*/*'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['employeeEditVo'] !== undefined) {
            body = parameters['employeeEditVo'];
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * 锁定店员,不允许店员操作店铺
     * @method
     * @name ERPSHOPApi#lockClerkUsingPOST
     * @param {object} parameters - method options and parameters
     * @param {} parameters.employeeEditVo - employeeEditVO
     */
    ERPSHOPApi.prototype.lockClerkUsingPOST = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/clerkServ/lockClerk';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['*/*'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['employeeEditVo'] !== undefined) {
            body = parameters['employeeEditVo'];
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * 查询该单位所有店员
     * @method
     * @name ERPSHOPApi#queryAllClerksUsingPOST
     * @param {object} parameters - method options and parameters
     * @param {} parameters.queryClerkReqVo - queryClerkReqVO
     */
    ERPSHOPApi.prototype.queryAllClerksUsingPOST = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/clerkServ/queryAllClerks';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['*/*'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['queryClerkReqVo'] !== undefined) {
            body = parameters['queryClerkReqVo'];
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * 查询店员所属单位Id
     * @method
     * @name ERPSHOPApi#queryClerkCompanyIdUsingPOST
     * @param {object} parameters - method options and parameters
     * @param {} parameters.shopCompanyClerk - shopCompanyClerk
     */
    ERPSHOPApi.prototype.queryClerkCompanyIdUsingPOST = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/clerkServ/queryClerkCompanyId';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['*/*'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['shopCompanyClerk'] !== undefined) {
            body = parameters['shopCompanyClerk'];
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * 查询店员的状态
     * @method
     * @name ERPSHOPApi#queryClerkStatusUsingPOST
     * @param {object} parameters - method options and parameters
     * @param {} parameters.shopCompanyClerk - shopCompanyClerk
     */
    ERPSHOPApi.prototype.queryClerkStatusUsingPOST = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/clerkServ/queryClerkStatus';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['*/*'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['shopCompanyClerk'] !== undefined) {
            body = parameters['shopCompanyClerk'];
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * 查询用户身份信息
     * @method
     * @name ERPSHOPApi#queryUserIdentityUsingPOST
     * @param {object} parameters - method options and parameters
     * @param {} parameters.queryUserIdentityReqVo - queryUserIdentityReqVO
     */
    ERPSHOPApi.prototype.queryUserIdentityUsingPOST = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/clerkServ/queryUserIdentity';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['*/*'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['queryUserIdentityReqVo'] !== undefined) {
            body = parameters['queryUserIdentityReqVo'];
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * 添加单位
     * @method
     * @name ERPSHOPApi#addCompanyUsingPOST
     * @param {object} parameters - method options and parameters
     * @param {} parameters.companyReqVo - companyReqVO
     */
    ERPSHOPApi.prototype.addCompanyUsingPOST = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/companyServ/addCompany';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['*/*'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['companyReqVo'] !== undefined) {
            body = parameters['companyReqVo'];
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * 编辑单位信息
     * @method
     * @name ERPSHOPApi#editCompanyUsingPOST
     * @param {object} parameters - method options and parameters
     * @param {} parameters.editCompanyReqVo - editCompanyReqVO
     */
    ERPSHOPApi.prototype.editCompanyUsingPOST = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/companyServ/editCompany';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['*/*'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['editCompanyReqVo'] !== undefined) {
            body = parameters['editCompanyReqVo'];
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * 创建订单
     * @method
     * @name ERPSHOPApi#createOrderUsingPOST
     * @param {object} parameters - method options and parameters
     * @param {} parameters.createOrderReqVo - createOrderReqVO
     */
    ERPSHOPApi.prototype.createOrderUsingPOST = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/orderServ/createOrder';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['*/*'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['createOrderReqVo'] !== undefined) {
            body = parameters['createOrderReqVo'];
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * 去支付或者继续支付
     * @method
     * @name ERPSHOPApi#goPayUsingPOST
     * @param {object} parameters - method options and parameters
     * @param {} parameters.goPayReqVo - goPayReqVO
     */
    ERPSHOPApi.prototype.goPayUsingPOST = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/orderServ/goPay';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['*/*'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['goPayReqVo'] !== undefined) {
            body = parameters['goPayReqVo'];
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * 支付结果回调
     * @method
     * @name ERPSHOPApi#payResultCallbackUsingPOST
     * @param {object} parameters - method options and parameters
     * @param {} parameters.payResultCallbackReqVo - payCallback
     */
    ERPSHOPApi.prototype.payResultCallbackUsingPOST = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/orderServ/payResultCallback';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['*/*'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['payResultCallbackReqVo'] !== undefined) {
            body = parameters['payResultCallbackReqVo'];
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * 支付结果查询
     * @method
     * @name ERPSHOPApi#queryPayOrderResultUsingPOST
     * @param {object} parameters - method options and parameters
     * @param {} parameters.createOrderReqVo - createOrderReqVO
     */
    ERPSHOPApi.prototype.queryPayOrderResultUsingPOST = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/orderServ/queryPayOrderResult';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['*/*'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['createOrderReqVo'] !== undefined) {
            body = parameters['createOrderReqVo'];
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * 添加店铺
     * @method
     * @name ERPSHOPApi#addShopUsingPOST_1
     * @param {object} parameters - method options and parameters
     * @param {} parameters.shopReqVo - shopReqVO
     */
    ERPSHOPApi.prototype.addShopUsingPOST_1 = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/shopServ/addShop';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['*/*'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['shopReqVo'] !== undefined) {
            body = parameters['shopReqVo'];
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * 删除店铺信息
     * @method
     * @name ERPSHOPApi#delShopUsingPOST
     * @param {object} parameters - method options and parameters
     * @param {} parameters.delShopReqVo - delShopReqVO
     */
    ERPSHOPApi.prototype.delShopUsingPOST = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/shopServ/delShop';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['*/*'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['delShopReqVo'] !== undefined) {
            body = parameters['delShopReqVo'];
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * 编辑店铺信息
     * @method
     * @name ERPSHOPApi#editShopUsingPOST
     * @param {object} parameters - method options and parameters
     * @param {} parameters.editShopReqVo - editShopReqVO
     */
    ERPSHOPApi.prototype.editShopUsingPOST = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/shopServ/editShop';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['*/*'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['editShopReqVo'] !== undefined) {
            body = parameters['editShopReqVo'];
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * 查询我的店铺信息
     * @method
     * @name ERPSHOPApi#queryAllMyShopsUsingPOST
     * @param {object} parameters - method options and parameters
     * @param {} parameters.queryShopReqVo - queryShopReqVO
     */
    ERPSHOPApi.prototype.queryAllMyShopsUsingPOST = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/shopServ/queryAllMyShops';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['*/*'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['queryShopReqVo'] !== undefined) {
            body = parameters['queryShopReqVo'];
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * 查询店铺的员工信息
     * @method
     * @name ERPSHOPApi#queryClerkByShopIdsUsingPOST
     * @param {object} parameters - method options and parameters
     * @param {} parameters.queryClerkByShopIdReqVo - queryClerkByShopIdReqVO
     */
    ERPSHOPApi.prototype.queryClerkByShopIdsUsingPOST = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/shopServ/queryClerkByShopIds';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['*/*'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['queryClerkByShopIdReqVo'] !== undefined) {
            body = parameters['queryClerkByShopIdReqVo'];
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * 查询我的店铺
     * @method
     * @name ERPSHOPApi#queryMyShopUsingPOST
     * @param {object} parameters - method options and parameters
     * @param {} parameters.queryMyShopReqVo - queryMyShopReqVO
     */
    ERPSHOPApi.prototype.queryMyShopUsingPOST = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/shopServ/queryMyShop';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['*/*'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['queryMyShopReqVo'] !== undefined) {
            body = parameters['queryMyShopReqVo'];
        }

        if (parameters['queryMyShopReqVo'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: queryMyShopReqVo'));
            return deferred.promise;
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * 根据Id查询店铺信息
     * @method
     * @name ERPSHOPApi#queryShopByIdUsingPOST
     * @param {object} parameters - method options and parameters
     * @param {} parameters.queryShopByIdReqVo - queryShopByIdReqVO
     */
    ERPSHOPApi.prototype.queryShopByIdUsingPOST = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/shopServ/queryShopById';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['*/*'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['queryShopByIdReqVo'] !== undefined) {
            body = parameters['queryShopByIdReqVo'];
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * 根据Id查询店铺信息
     * @method
     * @name ERPSHOPApi#queryShopByListUsingPOST
     * @param {object} parameters - method options and parameters
     * @param {} parameters.queryShopByListReqVo - queryShopByListReqVO
     */
    ERPSHOPApi.prototype.queryShopByListUsingPOST = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/shopServ/queryShopByList';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['*/*'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['queryShopByListReqVo'] !== undefined) {
            body = parameters['queryShopByListReqVo'];
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * 查询用户服务的店铺信息
     * @method
     * @name ERPSHOPApi#queryUserServiceShopsUsingPOST
     * @param {object} parameters - method options and parameters
     * @param {} parameters.queryShopReqVo - queryShopReqVO
     */
    ERPSHOPApi.prototype.queryUserServiceShopsUsingPOST = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/shopServ/queryUserServiceShops';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['*/*'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['queryShopReqVo'] !== undefined) {
            body = parameters['queryShopReqVo'];
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * 查询用户服务的所有店铺ID和名称
     * @method
     * @name ERPSHOPApi#queryUserServiceShopsByCompassUsingPOST
     * @param {object} parameters - method options and parameters
     * @param {} parameters.queryShopReqVo - queryShopReqVO
     */
    ERPSHOPApi.prototype.queryUserServiceShopsByCompassUsingPOST = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/shopServ/queryUserServiceShopsByCompass';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['*/*'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['queryShopReqVo'] !== undefined) {
            body = parameters['queryShopReqVo'];
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * 查询用户服务的所有店铺销售数据
     * @method
     * @name ERPSHOPApi#queryUserServiceShopsSaleUsingPOST
     * @param {object} parameters - method options and parameters
     * @param {} parameters.queryShopReqVo - queryShopReqVO
     */
    ERPSHOPApi.prototype.queryUserServiceShopsSaleUsingPOST = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/shopServ/queryUserServiceShopsSale';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['*/*'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['queryShopReqVo'] !== undefined) {
            body = parameters['queryShopReqVo'];
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };

    return ERPSHOPApi;
})();

exports.ERPSHOPApi = ERPSHOPApi;