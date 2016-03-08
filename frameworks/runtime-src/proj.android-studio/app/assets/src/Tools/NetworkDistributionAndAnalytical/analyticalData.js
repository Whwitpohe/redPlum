/**
 * Created by FanJiaHe on 2015/11/10.
 */

/**
 * 创建解析回调
 * */
var AnalyticalData = function()
{
};

/**
 * 设置网络返回成功并且数据成功的回调函数
 * @param {function} callBack 回调函数
 * */
AnalyticalData.prototype.setSuccessCallBack = function(callBack)
{
    this.successCallBack = callBack;
};
/**
 * 设置网络返回成功但是数据失败的回调函数
 * @param {function} callBack 回调函数
 * */
AnalyticalData.prototype.setErrorBack = function(callBack)
{
    this.errorCallBack = callBack;
};
/**
 * 获取成功的回调函数
 * */
AnalyticalData.prototype.getSuccessCallBack = function()
{
    return this.successCallBack;
};

/**
 * 获取失败的回调函数
 * */
AnalyticalData.prototype.getErrorCallBack = function()
{
    return this.errorCallBack;
};

/**
 * 处理网络异常出数据
 * @param {http.status.} abnormalCode 异常代码
 * */
AnalyticalData.prototype.handle = function(abnormalCode)
{
    var jsonData = {};
    switch (abnormalCode)
    {
        case http.status.ERROR:
        {
            jsonData.e = http.status.ERROR;
            this.getSuccessCallBack()(false, jsonData);
            // 网络错误
            break;
        }
        case http.status.TIMEOUT:
        {
            break;
        }
        case http.status.ABORT:
        {
            break;
        }
        default:
            break;
    }
};

/**
 *
 * @param {string} data 网络返回的数据
 * @param {string} customData 自定义数据格式
 * */
AnalyticalData.prototype.parse = function(data, customData)
{
    if (data == "网络错误")
    {
        console.log("网络接收数据错误");
        return;
    }

    logger.createTips("网络返回数据: " + data);
    var jsonData = JSON.parse(data);
    if (globalApi.variableCheck("jsonData", jsonData, "object"))
    {
        logger.createTips("无法解析数据,数据错乱");
        return;
    }

    if (jsonData.success)
    {
        delete jsonData.e;
        delete jsonData.total;
        delete jsonData.msg;
        delete jsonData.success;
        this.getSuccessCallBack()(true, jsonData.data, customData);
    } else
    {
        delete jsonData.total;
        delete jsonData.data;
        delete jsonData.success;
        this.getSuccessCallBack()(false, jsonData, customData);
    }
};


