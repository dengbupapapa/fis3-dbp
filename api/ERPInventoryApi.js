/*jshint -W069 */
/**
 * ERP inventory api
 * @class ERPInventoryApi
 * @param {(string|object)} [domainOrOptions] - The project domain or options object. If object, see the object's optional properties.
 * @param {string} [domainOrOptions.domain] - The project domain
 * @param {object} [domainOrOptions.token] - auth token - object with value property and optional headerOrQueryName and isQuery properties
 */
var ERPInventoryApi = (function() {
    'use strict';

    var request = require('request');
    var Q = require('q');

    function ERPInventoryApi(options) {
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
     * @name ERPInventoryApi#request
     * @param {string} method - http method
     * @param {string} url - url to do request
     * @param {object} parameters
     * @param {object} body - body parameters / object
     * @param {object} headers - header parameters
     * @param {object} queryParameters - querystring parameters
     * @param {object} form - form data object
     * @param {object} deferred - promise object
     */
    ERPInventoryApi.prototype.request = function(method, url, parameters, body, headers, queryParameters, form, deferred) {
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
     * 新增配件商品
     * @method
     * @name ERPInventoryApi#addDeviceProductUsingPOST
     * @param {object} parameters - method options and parameters
     * @param {} parameters.deviceCategoryReqVo - deviceCategoryReqVo
     */
    ERPInventoryApi.prototype.addDeviceProductUsingPOST = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/categoryServ/addDeviceProduct';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['*/*'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['deviceCategoryReqVo'] !== undefined) {
            body = parameters['deviceCategoryReqVo'];
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * 新增手机商品
     * @method
     * @name ERPInventoryApi#addMobileProductUsingPOST
     * @param {object} parameters - method options and parameters
     * @param {} parameters.mobileCategoryReqVo - mobileCategoryReqVo
     */
    ERPInventoryApi.prototype.addMobileProductUsingPOST = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/categoryServ/addMobileProduct';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['*/*'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['mobileCategoryReqVo'] !== undefined) {
            body = parameters['mobileCategoryReqVo'];
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * 商品管理：删除类目服务
     * @method
     * @name ERPInventoryApi#deleteMobileCategoryUsingPOST
     * @param {object} parameters - method options and parameters
     * @param {} parameters.deleteMobileCategoryReqVo - deleteMobileCategoryReqVO
     */
    ERPInventoryApi.prototype.deleteMobileCategoryUsingPOST = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/categoryServ/deleteMobileCategory';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['*/*'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['deleteMobileCategoryReqVo'] !== undefined) {
            body = parameters['deleteMobileCategoryReqVo'];
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * 商品修改
     * @method
     * @name ERPInventoryApi#modifyProductInProductManageUsingPOST
     * @param {object} parameters - method options and parameters
     * @param {} parameters.operateProductReqVo - operateProductReqVO
     */
    ERPInventoryApi.prototype.modifyProductInProductManageUsingPOST = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/categoryServ/modifyProductInProductManage';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['*/*'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['operateProductReqVo'] !== undefined) {
            body = parameters['operateProductReqVo'];
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * 查询商品是否已存在
     * @method
     * @name ERPInventoryApi#queryCategoryIsExistUsingPOST
     * @param {object} parameters - method options and parameters
     * @param {} parameters.deviceCategoryReqVo - deviceCategoryReqVo
     */
    ERPInventoryApi.prototype.queryCategoryIsExistUsingPOST = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/categoryServ/queryCategoryIsExist';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['*/*'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['deviceCategoryReqVo'] !== undefined) {
            body = parameters['deviceCategoryReqVo'];
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * 根据手机品牌、型号查询出手机对应所有内存和颜色列表接口
     * @method
     * @name ERPInventoryApi#queryMobileCategoryByBrandAndModelUsingPOST
     * @param {object} parameters - method options and parameters
     * @param {} parameters.queryMobileCategoryByBrandAndModelReqVo - queryMobileCategoryByBrandAndModelReqVO
     */
    ERPInventoryApi.prototype.queryMobileCategoryByBrandAndModelUsingPOST = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/categoryServ/queryMobileCategoryByBrandAndModel';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['*/*'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['queryMobileCategoryByBrandAndModelReqVo'] !== undefined) {
            body = parameters['queryMobileCategoryByBrandAndModelReqVo'];
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * 查询手机/配件类目服务
     * @method
     * @name ERPInventoryApi#queryProductCategoryUsingPOST
     * @param {object} parameters - method options and parameters
     * @param {} parameters.queryCategoryReqVo - queryCategoryReqVO
     */
    ERPInventoryApi.prototype.queryProductCategoryUsingPOST = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/categoryServ/queryProductCategory';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['*/*'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['queryCategoryReqVo'] !== undefined) {
            body = parameters['queryCategoryReqVo'];
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * 根据categoryId查询类目服务
     * @method
     * @name ERPInventoryApi#queryProductCategoryBycategoryIdUsingPOST
     * @param {object} parameters - method options and parameters
     * @param {} parameters.queryCategoryBycategoryIdReqVo - queryCategoryBycategoryIdReqVO
     */
    ERPInventoryApi.prototype.queryProductCategoryBycategoryIdUsingPOST = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/categoryServ/queryProductCategoryBycategoryId';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['*/*'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['queryCategoryBycategoryIdReqVo'] !== undefined) {
            body = parameters['queryCategoryBycategoryIdReqVo'];
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * 商品管理：查询手机/配件类目服务
     * @method
     * @name ERPInventoryApi#queryProductCategoryInProductManageUsingPOST
     * @param {object} parameters - method options and parameters
     * @param {} parameters.queryProductCategoryReqVo - queryProductCategoryReqVO
     */
    ERPInventoryApi.prototype.queryProductCategoryInProductManageUsingPOST = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/categoryServ/queryProductCategoryInProductManage';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['*/*'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['queryProductCategoryReqVo'] !== undefined) {
            body = parameters['queryProductCategoryReqVo'];
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * 供应商/分销商财务收款/付款
     * @method
     * @name ERPInventoryApi#payOrTakeInSupplierBillUsingPOST
     * @param {object} parameters - method options and parameters
     * @param {} parameters.supplierArapBillReqVo - supplierArapBillReqVO
     */
    ERPInventoryApi.prototype.payOrTakeInSupplierBillUsingPOST = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/financeManagerServ/payOrTakeInBill';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['*/*'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['supplierArapBillReqVo'] !== undefined) {
            body = parameters['supplierArapBillReqVo'];
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * 供应商/分销商财务流水明细查询
     * @method
     * @name ERPInventoryApi#queryBillDetailUsingPOST
     * @param {object} parameters - method options and parameters
     * @param {} parameters.productSupplierBillReqVo - productSupplierBillReqVO
     */
    ERPInventoryApi.prototype.queryBillDetailUsingPOST = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/financeManagerServ/queryBillDetail';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['*/*'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['productSupplierBillReqVo'] !== undefined) {
            body = parameters['productSupplierBillReqVo'];
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * 采购/分销数据查询明细
     * @method
     * @name ERPInventoryApi#queryFinanceStatsUsingPOST
     * @param {object} parameters - method options and parameters
     * @param {} parameters.queryFinanceStatsDetailReqVo - queryFinanceStatsDetailReqVO
     */
    ERPInventoryApi.prototype.queryFinanceStatsUsingPOST = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/financeManagerServ/queryFinanceStats';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['*/*'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['queryFinanceStatsDetailReqVo'] !== undefined) {
            body = parameters['queryFinanceStatsDetailReqVo'];
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * 采购/分销数据统计
     * @method
     * @name ERPInventoryApi#queryTotalFinanceStatsUsingPOST
     * @param {object} parameters - method options and parameters
     * @param {} parameters.queryTotalFinanceStatsReqVo - queryTotalFinanceStatsReqVO
     */
    ERPInventoryApi.prototype.queryTotalFinanceStatsUsingPOST = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/financeManagerServ/queryTotalFinanceStats';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['*/*'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['queryTotalFinanceStatsReqVo'] !== undefined) {
            body = parameters['queryTotalFinanceStatsReqVo'];
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * 供应商/分销商调账
     * @method
     * @name ERPInventoryApi#transferSupplierBillUsingPOST
     * @param {object} parameters - method options and parameters
     * @param {} parameters.transferBillReqVo - transferBillReqVO
     */
    ERPInventoryApi.prototype.transferSupplierBillUsingPOST = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/financeManagerServ/transferSupplierBill';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['*/*'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['transferBillReqVo'] !== undefined) {
            body = parameters['transferBillReqVo'];
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * 根据外部业务订单号查询商品库存订单
     * @method
     * @name ERPInventoryApi#queryProductOrderByOutBizNoUsingPOST
     * @param {object} parameters - method options and parameters
     * @param {} parameters.queryProductOrderByOutBizNoReqVo - queryProductOrderByOutBizNoReqVO
     */
    ERPInventoryApi.prototype.queryProductOrderByOutBizNoUsingPOST = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/inventoryOrderServ/queryProductOrderByOutBizNo';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['*/*'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['queryProductOrderByOutBizNoReqVo'] !== undefined) {
            body = parameters['queryProductOrderByOutBizNoReqVo'];
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * 查询调拨(调入)单详情
     * @method
     * @name ERPInventoryApi#queryAllocateInRecordDetailUsingPOST
     * @param {object} parameters - method options and parameters
     * @param {} parameters.queryAllocateStockInOrderDetailReqVo - queryAllocateStockInOrderDetailReqVO
     */
    ERPInventoryApi.prototype.queryAllocateInRecordDetailUsingPOST = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/inventoryQueryServ/queryAllocateInRecordDetail';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['*/*'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['queryAllocateStockInOrderDetailReqVo'] !== undefined) {
            body = parameters['queryAllocateStockInOrderDetailReqVo'];
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * 查询调拨(调出)单详情
     * @method
     * @name ERPInventoryApi#queryAllocateOutRecordDetailUsingPOST
     * @param {object} parameters - method options and parameters
     * @param {} parameters.queryAllocateStockOutOrderDetailReqVo - queryAllocateStockOutOrderDetailReqVO
     */
    ERPInventoryApi.prototype.queryAllocateOutRecordDetailUsingPOST = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/inventoryQueryServ/queryAllocateOutRecordDetail';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['*/*'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['queryAllocateStockOutOrderDetailReqVo'] !== undefined) {
            body = parameters['queryAllocateStockOutOrderDetailReqVo'];
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * 根据单位编号、店铺编号、商品类别查询产品库存
     * @method
     * @name ERPInventoryApi#queryCategoryByCategoryIdUsingPOST
     * @param {object} parameters - method options and parameters
     * @param {} parameters.queryCategoryCountReqVo - queryCategoryCountReqVO
     */
    ERPInventoryApi.prototype.queryCategoryByCategoryIdUsingPOST = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/inventoryQueryServ/queryCategoryCountByCategoryId';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['*/*'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['queryCategoryCountReqVo'] !== undefined) {
            body = parameters['queryCategoryCountReqVo'];
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * 根据类别编号(category_id)、商品类别查询产品库存、建议零售价格
     * @method
     * @name ERPInventoryApi#queryCategoryInfoByCategoryIdUsingPOST
     * @param {object} parameters - method options and parameters
     * @param {} parameters.queryCategoryInfoReqVo - queryCategoryInfoReqVO
     */
    ERPInventoryApi.prototype.queryCategoryInfoByCategoryIdUsingPOST = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/inventoryQueryServ/queryCategoryInfoByCategoryId';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['*/*'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['queryCategoryInfoReqVo'] !== undefined) {
            body = parameters['queryCategoryInfoReqVo'];
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * 查询店铺个人销售记录
     * @method
     * @name ERPInventoryApi#queryClerkStockoutRecordsUsingPOST
     * @param {object} parameters - method options and parameters
     * @param {} parameters.queryClerkStockoutRecordReqVo - queryClerkStockoutRecordReqVO
     */
    ERPInventoryApi.prototype.queryClerkStockoutRecordsUsingPOST = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/inventoryQueryServ/queryClerkStockoutRecords';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['*/*'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['queryClerkStockoutRecordReqVo'] !== undefined) {
            body = parameters['queryClerkStockoutRecordReqVo'];
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * 根据名称模糊查询配件库存数量
     * @method
     * @name ERPInventoryApi#queryDeviceStockInfoByFullNameUsingPOST
     * @param {object} parameters - method options and parameters
     * @param {} parameters.queryDeviceStockInfoByFullName - queryDeviceByFullNameReqVO
     */
    ERPInventoryApi.prototype.queryDeviceStockInfoByFullNameUsingPOST = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/inventoryQueryServ/queryDeviceByFullName';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['*/*'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['queryDeviceStockInfoByFullName'] !== undefined) {
            body = parameters['queryDeviceStockInfoByFullName'];
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * 根据ClassID查询店铺库存数量大于0的配件信息
     * @method
     * @name ERPInventoryApi#queryDeviceCategoryInfoByClassIdUsingPOST
     * @param {object} parameters - method options and parameters
     * @param {} parameters.queryDeviceCategoryByClassIdReqVo - queryDeviceCategoryByClassIdReqVO
     */
    ERPInventoryApi.prototype.queryDeviceCategoryInfoByClassIdUsingPOST = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/inventoryQueryServ/queryDeviceCategoryInfoByClassId';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['*/*'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['queryDeviceCategoryByClassIdReqVo'] !== undefined) {
            body = parameters['queryDeviceCategoryByClassIdReqVo'];
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * 和商汇调用ERP根据categoryId、productType、shopId查询库存信息
     * @method
     * @name ERPInventoryApi#queryInventoryByCategoryIdAndShopIdUsingPOST
     * @param {object} parameters - method options and parameters
     * @param {} parameters.queryInventoryByCategoryIdAndShopIdReqVo - queryInventoryByCategoryIdAndShopIdReqVO
     */
    ERPInventoryApi.prototype.queryInventoryByCategoryIdAndShopIdUsingPOST = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/inventoryQueryServ/queryInventoryByCategoryIdAndShopId';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['*/*'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['queryInventoryByCategoryIdAndShopIdReqVo'] !== undefined) {
            body = parameters['queryInventoryByCategoryIdAndShopIdReqVo'];
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * 产品库存详情导出
     * @method
     * @name ERPInventoryApi#queryInventoryDetailForExportUsingPOST
     * @param {object} parameters - method options and parameters
     * @param {} parameters.queryInventoryDetailReqVo - queryInventoryDetailReqVO
     */
    ERPInventoryApi.prototype.queryInventoryDetailForExportUsingPOST = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/inventoryQueryServ/queryInventoryDetailForExport';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['*/*'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['queryInventoryDetailReqVo'] !== undefined) {
            body = parameters['queryInventoryDetailReqVo'];
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * 根据imei号查询手机信息
     * @method
     * @name ERPInventoryApi#queryMobileByImeiNoUsingPOST
     * @param {object} parameters - method options and parameters
     * @param {} parameters.queryMobileByImeiNoReqVo - queryMobileByImeiNoReqVO
     */
    ERPInventoryApi.prototype.queryMobileByImeiNoUsingPOST = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/inventoryQueryServ/queryMobileByImeiNo';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['*/*'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['queryMobileByImeiNoReqVo'] !== undefined) {
            body = parameters['queryMobileByImeiNoReqVo'];
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * 根据imei列表查询手机信息列表
     * @method
     * @name ERPInventoryApi#queryMobilesByImeiNosUsingPOST
     * @param {object} parameters - method options and parameters
     * @param {} parameters.queryMobilesByImeiNosReqVo - queryMobilesByImeiNosReqVO
     */
    ERPInventoryApi.prototype.queryMobilesByImeiNosUsingPOST = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/inventoryQueryServ/queryMobilesByImeiNos';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['*/*'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['queryMobilesByImeiNosReqVo'] !== undefined) {
            body = parameters['queryMobilesByImeiNosReqVo'];
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * 查询产品库存
     * @method
     * @name ERPInventoryApi#queryProductInventoryUsingPOST
     * @param {object} parameters - method options and parameters
     * @param {} parameters.queryInventoryReqVo - queryInventoryReqVO
     */
    ERPInventoryApi.prototype.queryProductInventoryUsingPOST = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/inventoryQueryServ/queryProductInventory';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['*/*'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['queryInventoryReqVo'] !== undefined) {
            body = parameters['queryInventoryReqVo'];
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * 查询产品库存详情
     * @method
     * @name ERPInventoryApi#queryProductInventoryDetailUsingPOST
     * @param {object} parameters - method options and parameters
     * @param {} parameters.queryInventoryDetailReqVo - queryInventoryDetailReqVO
     */
    ERPInventoryApi.prototype.queryProductInventoryDetailUsingPOST = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/inventoryQueryServ/queryProductInventoryDetail';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['*/*'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['queryInventoryDetailReqVo'] !== undefined) {
            body = parameters['queryInventoryDetailReqVo'];
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * 库存导出查询
     * @method
     * @name ERPInventoryApi#queryProductInventoryForExportUsingPOST
     * @param {object} parameters - method options and parameters
     * @param {} parameters.queryInventoryReqVo - queryInventoryReqVO
     */
    ERPInventoryApi.prototype.queryProductInventoryForExportUsingPOST = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/inventoryQueryServ/queryProductInventoryForExport';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['*/*'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['queryInventoryReqVo'] !== undefined) {
            body = parameters['queryInventoryReqVo'];
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * 根据店铺id和categoryID查询库存量
     * @method
     * @name ERPInventoryApi#queryProductStockByShopIdsAndcategoryIdUsingPOST
     * @param {object} parameters - method options and parameters
     * @param {} parameters.productStockByCategoryIdReqVo - productStockByCategoryIdReqVO
     */
    ERPInventoryApi.prototype.queryProductStockByShopIdsAndcategoryIdUsingPOST = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/inventoryQueryServ/queryProductStockByShopIdsAndcategoryId';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['*/*'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['productStockByCategoryIdReqVo'] !== undefined) {
            body = parameters['productStockByCategoryIdReqVo'];
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * 查询店铺推荐配件信息
     * @method
     * @name ERPInventoryApi#queryRecommendDeviceCategoryInfoUsingPOST
     * @param {object} parameters - method options and parameters
     * @param {} parameters.queryRecommendDeviceCategoryVo - queryRecommendDeviceCategoryVO
     */
    ERPInventoryApi.prototype.queryRecommendDeviceCategoryInfoUsingPOST = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/inventoryQueryServ/queryRecommendDeviceCategoryInfo';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['*/*'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['queryRecommendDeviceCategoryVo'] !== undefined) {
            body = parameters['queryRecommendDeviceCategoryVo'];
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * 根据关键字查询店铺配件信息
     * @method
     * @name ERPInventoryApi#queryRecommendDeviceCategoryInfoByKeyWordUsingPOST
     * @param {object} parameters - method options and parameters
     * @param {} parameters.queryRecommendDeviceCategoryVo - queryRecommendDeviceCategoryVO
     */
    ERPInventoryApi.prototype.queryRecommendDeviceCategoryInfoByKeyWordUsingPOST = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/inventoryQueryServ/queryRecommendDeviceCategoryInfoByKeyWord';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['*/*'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['queryRecommendDeviceCategoryVo'] !== undefined) {
            body = parameters['queryRecommendDeviceCategoryVo'];
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * 查询店铺是否有库存
     * @method
     * @name ERPInventoryApi#queryRemainStockUsingPOST
     * @param {object} parameters - method options and parameters
     * @param {} parameters.queryProductStockReqVo - queryProductStockReqVO
     */
    ERPInventoryApi.prototype.queryRemainStockUsingPOST = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/inventoryQueryServ/queryRemainStock';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['*/*'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['queryProductStockReqVo'] !== undefined) {
            body = parameters['queryProductStockReqVo'];
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * 查询销售出库订单详情
     * @method
     * @name ERPInventoryApi#querySaleStockOutOrderDetailUsingPOST
     * @param {object} parameters - method options and parameters
     * @param {} parameters.querySaleStockOutOrderDetailReqVo - querySaleStockOutOrderDetailReqVO
     */
    ERPInventoryApi.prototype.querySaleStockOutOrderDetailUsingPOST = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/inventoryQueryServ/querySaleStockOutOrderDetail';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['*/*'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['querySaleStockOutOrderDetailReqVo'] !== undefined) {
            body = parameters['querySaleStockOutOrderDetailReqVo'];
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * 库存筛选查询商品信息-app
     * @method
     * @name ERPInventoryApi#queryScreenProductCategoryInfoUsingPOST
     * @param {object} parameters - method options and parameters
     * @param {} parameters.queryScreenProductCategoryReqVo - queryScreenProductCategoryReqVO
     */
    ERPInventoryApi.prototype.queryScreenProductCategoryInfoUsingPOST = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/inventoryQueryServ/queryScreenProductCategoryInfo';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['*/*'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['queryScreenProductCategoryReqVo'] !== undefined) {
            body = parameters['queryScreenProductCategoryReqVo'];
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * 出库导出查询
     * @method
     * @name ERPInventoryApi#queryStockOutRecordForExportUsingPOST
     * @param {object} parameters - method options and parameters
     * @param {} parameters.queryReqVo - queryReqVO
     */
    ERPInventoryApi.prototype.queryStockOutRecordForExportUsingPOST = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/inventoryQueryServ/queryStockOutRecordForExport';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['*/*'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['queryReqVo'] !== undefined) {
            body = parameters['queryReqVo'];
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * 查询入库单详情
     * @method
     * @name ERPInventoryApi#queryStockinRecordDetailUsingPOST
     * @param {object} parameters - method options and parameters
     * @param {} parameters.queryStockInRecordDetailReqVo - queryStockInRecordDetailReqVO
     */
    ERPInventoryApi.prototype.queryStockinRecordDetailUsingPOST = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/inventoryQueryServ/queryStockinRecordDetail';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['*/*'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['queryStockInRecordDetailReqVo'] !== undefined) {
            body = parameters['queryStockInRecordDetailReqVo'];
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * 入库导出查询
     * @method
     * @name ERPInventoryApi#queryStockinRecordForExportUsingPOST
     * @param {object} parameters - method options and parameters
     * @param {} parameters.queryInventoryDetailReqVo - queryInventoryExportReqVO
     */
    ERPInventoryApi.prototype.queryStockinRecordForExportUsingPOST = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/inventoryQueryServ/queryStockinRecordForExport';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['*/*'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['queryInventoryDetailReqVo'] !== undefined) {
            body = parameters['queryInventoryDetailReqVo'];
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * 查询入库记录
     * @method
     * @name ERPInventoryApi#queryStockinRecordsUsingPOST
     * @param {object} parameters - method options and parameters
     * @param {} parameters.queryStockInRecordsReqVo - queryStockInRecordsReqVO
     */
    ERPInventoryApi.prototype.queryStockinRecordsUsingPOST = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/inventoryQueryServ/queryStockinRecords';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['*/*'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['queryStockInRecordsReqVo'] !== undefined) {
            body = parameters['queryStockInRecordsReqVo'];
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * 查询出库记录
     * @method
     * @name ERPInventoryApi#queryStockoutRecordsUsingPOST
     * @param {object} parameters - method options and parameters
     * @param {} parameters.queryStockOutRecordsReqVo - queryStockOutRecordsReqVO
     */
    ERPInventoryApi.prototype.queryStockoutRecordsUsingPOST = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/inventoryQueryServ/queryStockoutRecords';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['*/*'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['queryStockOutRecordsReqVo'] !== undefined) {
            body = parameters['queryStockOutRecordsReqVo'];
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * 修改库存商品的建议零售价格
     * @method
     * @name ERPInventoryApi#modifyInventoryProductSuggestPriceUsingPOST
     * @param {object} parameters - method options and parameters
     * @param {} parameters.modifySuggestPriceReqVo - modifySuggestPriceReqVO
     */
    ERPInventoryApi.prototype.modifyInventoryProductSuggestPriceUsingPOST = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/inventoryServ/modifyInventoryProductSuggestPrice';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['*/*'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['modifySuggestPriceReqVo'] !== undefined) {
            body = parameters['modifySuggestPriceReqVo'];
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * 修改入库价格
     * @method
     * @name ERPInventoryApi#modifyStockInUnitPriceUsingPOST
     * @param {object} parameters - method options and parameters
     * @param {} parameters.modifyStockInPriceReqVo - modifyStockInPriceReqVO
     */
    ERPInventoryApi.prototype.modifyStockInUnitPriceUsingPOST = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/inventoryServ/modifyStockInUnitPrice';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['*/*'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['modifyStockInPriceReqVo'] !== undefined) {
            body = parameters['modifyStockInPriceReqVo'];
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * 商品调拨
     * @method
     * @name ERPInventoryApi#stockAllocateUsingPOST
     * @param {object} parameters - method options and parameters
     * @param {} parameters.stockAllocateReqVo - stockOutReqVO
     */
    ERPInventoryApi.prototype.stockAllocateUsingPOST = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/inventoryServ/stockAllocate';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['*/*'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['stockAllocateReqVo'] !== undefined) {
            body = parameters['stockAllocateReqVo'];
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * 商品换货
     * @method
     * @name ERPInventoryApi#stockExchangeUsingPOST
     * @param {object} parameters - method options and parameters
     * @param {} parameters.stockChangeReqVo - stockChangeReqVO
     */
    ERPInventoryApi.prototype.stockExchangeUsingPOST = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/inventoryServ/stockExchange';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['*/*'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['stockChangeReqVo'] !== undefined) {
            body = parameters['stockChangeReqVo'];
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * 商品入库
     * @method
     * @name ERPInventoryApi#stockInUsingPOST
     * @param {object} parameters - method options and parameters
     * @param {} parameters.stockInReqVo - stockInReqVO
     */
    ERPInventoryApi.prototype.stockInUsingPOST = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/inventoryServ/stockIn';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['*/*'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['stockInReqVo'] !== undefined) {
            body = parameters['stockInReqVo'];
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * 商品出库
     * @method
     * @name ERPInventoryApi#stockOutUsingPOST
     * @param {object} parameters - method options and parameters
     * @param {} parameters.stockOutReqVo - stockOutReqVO
     */
    ERPInventoryApi.prototype.stockOutUsingPOST = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/inventoryServ/stockOut';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['*/*'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['stockOutReqVo'] !== undefined) {
            body = parameters['stockOutReqVo'];
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * 商品批量出库
     * @method
     * @name ERPInventoryApi#stockOutBatchUsingPOST
     * @param {object} parameters - method options and parameters
     * @param {} parameters.stockOutBatchReqVo - stockOutBatchReqVO
     */
    ERPInventoryApi.prototype.stockOutBatchUsingPOST = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/inventoryServ/stockOutBatch';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['*/*'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['stockOutBatchReqVo'] !== undefined) {
            body = parameters['stockOutBatchReqVo'];
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * 商品分销出库
     * @method
     * @name ERPInventoryApi#stockOutBySupplierUsingPOST
     * @param {object} parameters - method options and parameters
     * @param {} parameters.stockOutReqVo - stockOutReqVO
     */
    ERPInventoryApi.prototype.stockOutBySupplierUsingPOST = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/inventoryServ/stockOutBySupplier';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['*/*'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['stockOutReqVo'] !== undefined) {
            body = parameters['stockOutReqVo'];
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * 商品退货
     * @method
     * @name ERPInventoryApi#stockReturnUsingPOST
     * @param {object} parameters - method options and parameters
     * @param {} parameters.stockReturnReqVo - stockReturnReqVO
     */
    ERPInventoryApi.prototype.stockReturnUsingPOST = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/inventoryServ/stockReturn';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['*/*'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['stockReturnReqVo'] !== undefined) {
            body = parameters['stockReturnReqVo'];
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * 根据categoryId和ChnId查询手机评价数据信息
     * @method
     * @name ERPInventoryApi#queryMobileEvaluateInfoByCategoryIdUsingPOST
     * @param {object} parameters - method options and parameters
     * @param {} parameters.queryMobileEvaluateByCategoryIdReqVo - queryMobileEvaluateByCategoryIdReqVo
     */
    ERPInventoryApi.prototype.queryMobileEvaluateInfoByCategoryIdUsingPOST = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/mobileEvaluateQueryServ/queryMobileEvaluateInfoByCategoryId';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['*/*'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['queryMobileEvaluateByCategoryIdReqVo'] !== undefined) {
            body = parameters['queryMobileEvaluateByCategoryIdReqVo'];
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * 根据categoryId修改手机详情数据信息
     * @method
     * @name ERPInventoryApi#modifyMobileInformationUsingPOST
     * @param {object} parameters - method options and parameters
     * @param {} parameters.mobileInformationReqVo - mobileInformationReqVo
     */
    ERPInventoryApi.prototype.modifyMobileInformationUsingPOST = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/mobileInformationQueryServ/modifyMobileInformation';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['*/*'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['mobileInformationReqVo'] !== undefined) {
            body = parameters['mobileInformationReqVo'];
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * 根据categoryId查询手机详情数据信息
     * @method
     * @name ERPInventoryApi#queryMobileInformationByCategoryIdUsingPOST
     * @param {object} parameters - method options and parameters
     * @param {} parameters.queryMobileInformationByCategoryIdReqVo - queryMobileInformationByCategoryIdReqVo
     */
    ERPInventoryApi.prototype.queryMobileInformationByCategoryIdUsingPOST = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/mobileInformationQueryServ/queryMobileInformationByCategoryId';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['*/*'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['queryMobileInformationByCategoryIdReqVo'] !== undefined) {
            body = parameters['queryMobileInformationByCategoryIdReqVo'];
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * 根据categoryId查询手机渠道价格数据信息
     * @method
     * @name ERPInventoryApi#queryMobilePriceByCategoryIdUsingPOST
     * @param {object} parameters - method options and parameters
     * @param {} parameters.queryMobilePriceByCategoryIdReqVo - queryMobilePriceByCategoryIdReqVo
     */
    ERPInventoryApi.prototype.queryMobilePriceByCategoryIdUsingPOST = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/mobilePriceQueryServ/queryMobilePriceByCategoryId';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['*/*'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['queryMobilePriceByCategoryIdReqVo'] !== undefined) {
            body = parameters['queryMobilePriceByCategoryIdReqVo'];
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * 新增品牌
     * @method
     * @name ERPInventoryApi#addProductBrandUsingPOST
     * @param {object} parameters - method options and parameters
     * @param {} parameters.productBrandReqVo - productBrandReqVO
     */
    ERPInventoryApi.prototype.addProductBrandUsingPOST = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/productBrandsManageSrv/addProductBrand';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['*/*'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['productBrandReqVo'] !== undefined) {
            body = parameters['productBrandReqVo'];
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * 删除品牌
     * @method
     * @name ERPInventoryApi#deleteProductBrandUsingPOST
     * @param {object} parameters - method options and parameters
     * @param {} parameters.operateBrandReqVo - operateBrandReqVO
     */
    ERPInventoryApi.prototype.deleteProductBrandUsingPOST = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/productBrandsManageSrv/deleteProductBrand';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['*/*'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['operateBrandReqVo'] !== undefined) {
            body = parameters['operateBrandReqVo'];
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * 修改商品品牌
     * @method
     * @name ERPInventoryApi#modifyProductBrandUsingPOST
     * @param {object} parameters - method options and parameters
     * @param {} parameters.operateBrandReqVo - operateBrandReqVO
     */
    ERPInventoryApi.prototype.modifyProductBrandUsingPOST = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/productBrandsManageSrv/modifyProductBrand';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['*/*'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['operateBrandReqVo'] !== undefined) {
            body = parameters['operateBrandReqVo'];
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * 查询所有品牌
     * @method
     * @name ERPInventoryApi#queryProductBrandsUsingPOST
     * @param {object} parameters - method options and parameters
     * @param {} parameters.queryproductBrandReqVo - queryproductBrandReqVO
     */
    ERPInventoryApi.prototype.queryProductBrandsUsingPOST = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/productBrandsManageSrv/queryProductBrand';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['*/*'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['queryproductBrandReqVo'] !== undefined) {
            body = parameters['queryproductBrandReqVo'];
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * 根据ClassId查询店铺拥有的品牌类型-APP专用
     * @method
     * @name ERPInventoryApi#queryShopProductBrandsByClassIdUsingPOST
     * @param {object} parameters - method options and parameters
     * @param {} parameters.queryShopProductBrandByClassIdReqVo - queryShopProductBrandByClassIdReqVO
     */
    ERPInventoryApi.prototype.queryShopProductBrandsByClassIdUsingPOST = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/productBrandsManageSrv/queryShopProductBrandsByClassId';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['*/*'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['queryShopProductBrandByClassIdReqVo'] !== undefined) {
            body = parameters['queryShopProductBrandByClassIdReqVo'];
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * 增加配件类型
     * @method
     * @name ERPInventoryApi#addDeviceClassUsingPOST
     * @param {object} parameters - method options and parameters
     * @param {} parameters.productClassReqVo - productClassReqVO
     */
    ERPInventoryApi.prototype.addDeviceClassUsingPOST = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/productClassSrv/addDeviceClass';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['*/*'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['productClassReqVo'] !== undefined) {
            body = parameters['productClassReqVo'];
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * 查询配件类型
     * @method
     * @name ERPInventoryApi#queryDeviceClassUsingPOST
     * @param {object} parameters - method options and parameters
     * @param {} parameters.queryDeviceClassReqVo - queryDeviceClassReqVO
     */
    ERPInventoryApi.prototype.queryDeviceClassUsingPOST = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/productClassSrv/queryDeviceClass';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['*/*'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['queryDeviceClassReqVo'] !== undefined) {
            body = parameters['queryDeviceClassReqVo'];
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * 查询店铺拥有的所有商品类型-APP专用
     * @method
     * @name ERPInventoryApi#queryShopAllProductClassUsingPOST
     * @param {object} parameters - method options and parameters
     * @param {} parameters.queryAllProductClassReqVo - queryAllProductClassReqVO
     */
    ERPInventoryApi.prototype.queryShopAllProductClassUsingPOST = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/productClassSrv/queryShopAllProductClass';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['*/*'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['queryAllProductClassReqVo'] !== undefined) {
            body = parameters['queryAllProductClassReqVo'];
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * 新增产品型号
     * @method
     * @name ERPInventoryApi#addProductModelUsingPOST
     * @param {object} parameters - method options and parameters
     * @param {} parameters.addProductModelReqVo - addProductModelReqVO
     */
    ERPInventoryApi.prototype.addProductModelUsingPOST = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/productModelServ/addProductModel';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['*/*'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['addProductModelReqVo'] !== undefined) {
            body = parameters['addProductModelReqVo'];
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * 删除产品型号
     * @method
     * @name ERPInventoryApi#deleteProductModelUsingPOST
     * @param {object} parameters - method options and parameters
     * @param {} parameters.deleteProductModelReqVo - deleteProductModelReqVO
     */
    ERPInventoryApi.prototype.deleteProductModelUsingPOST = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/productModelServ/deleteProductModel';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['*/*'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['deleteProductModelReqVo'] !== undefined) {
            body = parameters['deleteProductModelReqVo'];
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * 修改产品型号
     * @method
     * @name ERPInventoryApi#modifyProductModelUsingPOST
     * @param {object} parameters - method options and parameters
     * @param {} parameters.productModelReqVo - productModelReqVO
     */
    ERPInventoryApi.prototype.modifyProductModelUsingPOST = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/productModelServ/modifyProductModel';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['*/*'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['productModelReqVo'] !== undefined) {
            body = parameters['productModelReqVo'];
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * 查询产品型号
     * @method
     * @name ERPInventoryApi#queryProductModelUsingPOST
     * @param {object} parameters - method options and parameters
     * @param {} parameters.queryProductModelReqVo - queryProductModelReqVO
     */
    ERPInventoryApi.prototype.queryProductModelUsingPOST = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/productModelServ/queryProductModel';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['*/*'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['queryProductModelReqVo'] !== undefined) {
            body = parameters['queryProductModelReqVo'];
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * 根据ClassId和brandId查询店铺拥有的手机型号-APP专用
     * @method
     * @name ERPInventoryApi#queryProductModelByClassIdUsingPOST
     * @param {object} parameters - method options and parameters
     * @param {} parameters.queryProductModelByClassIdReqVo - queryProductModelByClassIdReqVO
     */
    ERPInventoryApi.prototype.queryProductModelByClassIdUsingPOST = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/productModelServ/queryProductModelByClassId';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['*/*'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['queryProductModelByClassIdReqVo'] !== undefined) {
            body = parameters['queryProductModelByClassIdReqVo'];
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * 供应商/分销商新增
     * @method
     * @name ERPInventoryApi#addProductSupplierUsingPOST
     * @param {object} parameters - method options and parameters
     * @param {} parameters.productSupplierModelReqVo - productSupplierModelReqVO
     */
    ERPInventoryApi.prototype.addProductSupplierUsingPOST = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/productSupplierServ/addProductSupplier';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['*/*'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['productSupplierModelReqVo'] !== undefined) {
            body = parameters['productSupplierModelReqVo'];
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * 供应商/分销商删除
     * @method
     * @name ERPInventoryApi#delProductSupplierUsingPOST
     * @param {object} parameters - method options and parameters
     * @param {} parameters.delProductSupplierReqVo - queryKeySupplierReqVO
     */
    ERPInventoryApi.prototype.delProductSupplierUsingPOST = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/productSupplierServ/delProductSupplier';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['*/*'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['delProductSupplierReqVo'] !== undefined) {
            body = parameters['delProductSupplierReqVo'];
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * 供应商/分销商修改
     * @method
     * @name ERPInventoryApi#modifyProductSupplierUsingPOST
     * @param {object} parameters - method options and parameters
     * @param {} parameters.productSupplierModelReqVo - modifyProductSupplierReqVO
     */
    ERPInventoryApi.prototype.modifyProductSupplierUsingPOST = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/productSupplierServ/modifyProductSupplier';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['*/*'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['productSupplierModelReqVo'] !== undefined) {
            body = parameters['productSupplierModelReqVo'];
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * 供应商/分销商分页查询
     * @method
     * @name ERPInventoryApi#queryProductSupplierListUsingPOST
     * @param {object} parameters - method options and parameters
     * @param {} parameters.queryProductSupplierReqVo - queryProductSupplierReqVO
     */
    ERPInventoryApi.prototype.queryProductSupplierListUsingPOST = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/productSupplierServ/queryProductSupplierList';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['*/*'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['queryProductSupplierReqVo'] !== undefined) {
            body = parameters['queryProductSupplierReqVo'];
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * 查询单位下的供应商/分销商(不分页)
     * @method
     * @name ERPInventoryApi#queryProductSuppliersUsingPOST
     * @param {object} parameters - method options and parameters
     * @param {} parameters.queryProductSupplierReqVo - queryProductSupplierReqVO
     */
    ERPInventoryApi.prototype.queryProductSuppliersUsingPOST = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/productSupplierServ/queryProductSuppliers';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['*/*'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['queryProductSupplierReqVo'] !== undefined) {
            body = parameters['queryProductSupplierReqVo'];
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * 供应商/分销商根据主键查询
     * @method
     * @name ERPInventoryApi#querySupplierByKeyUsingPOST
     * @param {object} parameters - method options and parameters
     * @param {} parameters.queryKeySupplierReqVo - queryKeySupplierReqVO
     */
    ERPInventoryApi.prototype.querySupplierByKeyUsingPOST = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/productSupplierServ/querySupplierByKey';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['*/*'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['queryKeySupplierReqVo'] !== undefined) {
            body = parameters['queryKeySupplierReqVo'];
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * 单位的供应商/分销商数量查询
     * @method
     * @name ERPInventoryApi#querySupplierCountUsingPOST
     * @param {object} parameters - method options and parameters
     * @param {} parameters.querySupplierByCompanyIdReqVo - querySupplierByCompanyIdReqVO
     */
    ERPInventoryApi.prototype.querySupplierCountUsingPOST = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/productSupplierServ/querySupplierCount';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['*/*'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['querySupplierByCompanyIdReqVo'] !== undefined) {
            body = parameters['querySupplierByCompanyIdReqVo'];
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * 查询我服务的店铺
     * @method
     * @name ERPInventoryApi#queryMyServiceShopUsingPOST
     * @param {object} parameters - method options and parameters
     * @param {} parameters.statSaleForMyshopReqVo - statSaleForMyshopReqVO
     */
    ERPInventoryApi.prototype.queryMyServiceShopUsingPOST = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/salePerformanceStatServ/queryMyServiceShop';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['*/*'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['statSaleForMyshopReqVo'] !== undefined) {
            body = parameters['statSaleForMyshopReqVo'];
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * 查询店员的销售详情
     * @method
     * @name ERPInventoryApi#querySalerSaleDetailsUsingPOST
     * @param {object} parameters - method options and parameters
     * @param {} parameters.statSaleForMyshopReqVo - statSaleForMyshopReqVO
     */
    ERPInventoryApi.prototype.querySalerSaleDetailsUsingPOST = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/salePerformanceStatServ/querySalerSaleDetails';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['*/*'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['statSaleForMyshopReqVo'] !== undefined) {
            body = parameters['statSaleForMyshopReqVo'];
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * 统计店铺 30天内销售最好手机品牌信息
     * @method
     * @name ERPInventoryApi#statBestMobileBrandSalePerformanceUsingPOST
     * @param {object} parameters - method options and parameters
     * @param {} parameters.queryMobileSaleReqVo - queryMobileSaleReqVO
     */
    ERPInventoryApi.prototype.statBestMobileBrandSalePerformanceUsingPOST = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/salePerformanceStatServ/statBestMobileBrandSalePerformance';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['*/*'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['queryMobileSaleReqVo'] !== undefined) {
            body = parameters['queryMobileSaleReqVo'];
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * 统计手机品牌查询30天内销售最好手机型号信息
     * @method
     * @name ERPInventoryApi#statBestMobileModelSalePerformanceUsingPOST
     * @param {object} parameters - method options and parameters
     * @param {} parameters.queryMobileSaleReqVo - queryMobileSaleReqVO
     */
    ERPInventoryApi.prototype.statBestMobileModelSalePerformanceUsingPOST = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/salePerformanceStatServ/statBestMobileModelSalePerformance';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['*/*'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['queryMobileSaleReqVo'] !== undefined) {
            body = parameters['queryMobileSaleReqVo'];
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * 配件销售额统计
     * @method
     * @name ERPInventoryApi#statDeviceSaleUsingPOST
     * @param {object} parameters - method options and parameters
     * @param {} parameters.statSaleReqVo - statSaleReqVO
     */
    ERPInventoryApi.prototype.statDeviceSaleUsingPOST = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/salePerformanceStatServ/statDeviceSale';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['*/*'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['statSaleReqVo'] !== undefined) {
            body = parameters['statSaleReqVo'];
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * 手机销售状况TOP5统计
     * @method
     * @name ERPInventoryApi#statMobileBrandSalePerformanceTop5UsingPOST
     * @param {object} parameters - method options and parameters
     * @param {} parameters.queryMobileSaleReqVo - queryMobileSaleReqVO
     */
    ERPInventoryApi.prototype.statMobileBrandSalePerformanceTop5UsingPOST = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/salePerformanceStatServ/statMobileBrandSalePerformanceTop5';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['*/*'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['queryMobileSaleReqVo'] !== undefined) {
            body = parameters['queryMobileSaleReqVo'];
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * 手机销售额统计
     * @method
     * @name ERPInventoryApi#statMobileSaleUsingPOST
     * @param {object} parameters - method options and parameters
     * @param {} parameters.statSaleReqVo - statSaleReqVO
     */
    ERPInventoryApi.prototype.statMobileSaleUsingPOST = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/salePerformanceStatServ/statMobileSale';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['*/*'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['statSaleReqVo'] !== undefined) {
            body = parameters['statSaleReqVo'];
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * 销售额统计
     * @method
     * @name ERPInventoryApi#statSaleAmtUsingPOST
     * @param {object} parameters - method options and parameters
     * @param {} parameters.statSaleAmtReqVo - commonStatSaleReqVO
     */
    ERPInventoryApi.prototype.statSaleAmtUsingPOST = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/salePerformanceStatServ/statSaleAmt';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['*/*'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['statSaleAmtReqVo'] !== undefined) {
            body = parameters['statSaleAmtReqVo'];
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * 综合统计销售业绩
     * @method
     * @name ERPInventoryApi#statSaleCompositeUsingPOST
     * @param {object} parameters - method options and parameters
     * @param {} parameters.statSaleCompositeReqVo - commonStatSaleReqVO
     */
    ERPInventoryApi.prototype.statSaleCompositeUsingPOST = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/salePerformanceStatServ/statSaleComposite';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['*/*'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['statSaleCompositeReqVo'] !== undefined) {
            body = parameters['statSaleCompositeReqVo'];
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * 统计我的店铺中店员的销售业绩
     * @method
     * @name ERPInventoryApi#statSaleForMyshopUsingPOST
     * @param {object} parameters - method options and parameters
     * @param {} parameters.statSaleForMyshopReqVo - statSaleForMyshopReqVO
     */
    ERPInventoryApi.prototype.statSaleForMyshopUsingPOST = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/salePerformanceStatServ/statSaleForMyshop';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['*/*'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['statSaleForMyshopReqVo'] !== undefined) {
            body = parameters['statSaleForMyshopReqVo'];
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * 销售利润统计服务
     * @method
     * @name ERPInventoryApi#statSaleProfitUsingPOST
     * @param {object} parameters - method options and parameters
     * @param {} parameters.statSaleProfitReqVo - commonStatSaleReqVO
     */
    ERPInventoryApi.prototype.statSaleProfitUsingPOST = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/salePerformanceStatServ/statSaleProfit';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['*/*'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['statSaleProfitReqVo'] !== undefined) {
            body = parameters['statSaleProfitReqVo'];
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * 销量统计服务
     * @method
     * @name ERPInventoryApi#statSaleQuantityUsingPOST
     * @param {object} parameters - method options and parameters
     * @param {} parameters.statSaleQuantityReqVo - commonStatSaleReqVO
     */
    ERPInventoryApi.prototype.statSaleQuantityUsingPOST = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/salePerformanceStatServ/statSaleQuantity';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['*/*'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['statSaleQuantityReqVo'] !== undefined) {
            body = parameters['statSaleQuantityReqVo'];
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * 店员销售额统计
     * @method
     * @name ERPInventoryApi#statSalerSaleUsingPOST
     * @param {object} parameters - method options and parameters
     * @param {} parameters.statSaleReqVo - statSaleReqVO
     */
    ERPInventoryApi.prototype.statSalerSaleUsingPOST = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/salePerformanceStatServ/statSalerSale';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['*/*'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['statSaleReqVo'] !== undefined) {
            body = parameters['statSaleReqVo'];
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * 统计店铺 当月和当日销售情况
     * @method
     * @name ERPInventoryApi#statShopMonthSalePerformanceUsingPOST
     * @param {object} parameters - method options and parameters
     * @param {} parameters.queryStatSaleReqVo - queryStatSaleReqVO
     */
    ERPInventoryApi.prototype.statShopMonthSalePerformanceUsingPOST = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/salePerformanceStatServ/statShopMonthSalePerformance';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['*/*'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['queryStatSaleReqVo'] !== undefined) {
            body = parameters['queryStatSaleReqVo'];
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * 统计店铺销售状况
     * @method
     * @name ERPInventoryApi#statShopSalePerformanceUsingPOST
     * @param {object} parameters - method options and parameters
     * @param {} parameters.statShopSalePerformanceReqVo - commonStatSaleReqVO
     */
    ERPInventoryApi.prototype.statShopSalePerformanceUsingPOST = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/salePerformanceStatServ/statShopSalePerformance';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['*/*'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['statShopSalePerformanceReqVo'] !== undefined) {
            body = parameters['statShopSalePerformanceReqVo'];
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * 统计店员个人当月和当日销售情况-APP专用
     * @method
     * @name ERPInventoryApi#statShopSalePerformanceForAppUsingPOST
     * @param {object} parameters - method options and parameters
     * @param {} parameters.queryStatSaleForAppReqVo - queryStatSaleForAppReqVO
     */
    ERPInventoryApi.prototype.statShopSalePerformanceForAppUsingPOST = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/salePerformanceStatServ/statShopSalePerformanceForApp';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['*/*'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['queryStatSaleForAppReqVo'] !== undefined) {
            body = parameters['queryStatSaleForAppReqVo'];
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * 统计店员个人最近7天销售状况
     * @method
     * @name ERPInventoryApi#statShopSevenDaysSalePerformanceUsingPOST
     * @param {object} parameters - method options and parameters
     * @param {} parameters.querySevenDaysStatSaleReqVo - querySevenDaysStatSaleReqVO
     */
    ERPInventoryApi.prototype.statShopSevenDaysSalePerformanceUsingPOST = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/salePerformanceStatServ/statShopSevenDaysSalePerformance';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['*/*'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['querySevenDaysStatSaleReqVo'] !== undefined) {
            body = parameters['querySevenDaysStatSaleReqVo'];
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };

    return ERPInventoryApi;
})();

exports.ERPInventoryApi = ERPInventoryApi;