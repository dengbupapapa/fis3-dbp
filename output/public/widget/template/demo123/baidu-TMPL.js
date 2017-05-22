define('public/widget/template/demo123/baidu.tmpl', function(require, exports, module) {

  exports.template = [function(_template_object
  /**/) {
  var _template_fun_array=[];
  var fn=(function(__data__){
  var _template_varName='';
  for(var name in __data__){
  _template_varName+=('var '+name+'=__data__["'+name+'"];');
  };
  eval(_template_varName);
  _template_fun_array.push('<div class="baidu">    ',typeof(skuStatus) === 'undefined'?'':baidu.template._encodeHTML(skuStatus),'    <span>',typeof(skuStatus) === 'undefined'?'':baidu.template._encodeHTML(skuStatus),'</span></div>');
  _template_varName=null;
  })(_template_object);
  fn = null;
  return _template_fun_array.join('');
  
  }][0]

});
