const apiDomain = 'http://erp-gateway'; //请求地址

module.exports = {
    dir: './', //生成到哪
    apis: [
        apiDomain + '/erp-account/v2/api-docs',
        apiDomain + '/erp-mns/v2/api-docs',
        apiDomain + '/erp-shop/v2/api-docs',
        apiDomain + '/erp-privilege/v2/api-docs',
        apiDomain + '/erp-inventory/v2/api-docs'
    ]
}