/**
 * Created by FanJiaHe on 2015/11/6.
 */
var http = {};
http.status = {
    ERROR: 100,
    TIMEOUT: 101,
    ABORT: 102
};
var Http = function()
{
    this._succCallback = null;
};

Http.prototype._header = [];
Http.prototype._customData = null;

http.serverAddr = "http://newstack.cikers.com:8080/cikersapi/";

/**
 * 通用获取数据方法getMessage Post
 * @param {string} url 网址
 * @param {string|object} data  postData数据
 * @param {function} successCallBack 成功回调函数
 * @param {object} header
 * @param {object} customData 自定义内容
 */
http.sendForPost = function(url, data, successCallBack, header, customData)
{
    var http = new Http();
    http._header = header;
    http._customData = customData;
    var sendData = data;
    var website = this.serverAddr + url;
    http.getData(website, sendData, successCallBack);
};

/**
 * 通用获取数据方法getMessage Get
 * @param {string} url 网址
 * @param {function} successCallBack 成功回调函数
 */
http.send = function(url, successCallBack)
{
    var http = new Http();
    var website = this.serverAddr + url;
    http.getData(website, null, successCallBack);
};


/**
 *  @param {string} url  网址
 *  @param {string|object} data  postData数据
 *  @param {function} callBack  成功回调函数
 * */
Http.prototype.getData = function(url, data, callBack)
{
    this._succCallback = callBack;
    var xmlHttp = cc.loader.getXMLHttpRequest();
    var params = textOperation.MosaicString(data);

    // 设置header
    if (this._header)
    {
        for (var count = 0; count < this._header.length; count ++)
        {
            var header = this._header[count];
            if (header)
            {
                xmlHttp.setRequestHeader(header["key"], header["value"]);
                console.log("找到header" + JSON.stringify(header));
            }
        }
    }

    if (params)
    {
        xmlHttp.timeout = 5000;
        xmlHttp.open("POST", url);
        xmlHttp.send(params);
        logger.createTips("isPost");
    } else
    {
        xmlHttp.timeout = 5000;
        xmlHttp.open("GET", url);
        xmlHttp.send();
        logger.createTips("isGet");
    }

    var self = this;

    ['loadstart', 'abort', 'error', 'load', 'loadend', 'timeout'].forEach(function (eventName) {
        xmlHttp["on" + eventName] = function () {
            if (eventName == "error")
            {
                self._succCallback.handle(http.status.ERROR);
            }else if (eventName == "abort")
            {
                self._succCallback.handle(http.status.ABORT);
            }else if (eventName == "timeout")
            {
                self._succCallback.handle(http.status.TIMEOUT);
            }
            logger.createTips(eventName);
        }
    });

    //===================  ajax回调
    xmlHttp.onreadystatechange = function()
    {
        logger.createTips("回调成功");
        fileOperation.writeLog(url + " " + JSON.stringify(params) + xmlHttp.responseText);
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
        {
            logger.createTips(xmlHttp.status + url);
            if (xmlHttp.responseText.length > 0)
            {
                logger.createTips("接收数据成功");
                var strData = xmlHttp.responseText;
                self._succCallback.parse(strData, self._customData);
            } else
            {
                logger.createTips("没有接收到数据");
            }
        } else
        {
            logger.createTips("网络错误处理");
            self._succCallback.parse("网络错误");
        }
    }
};


