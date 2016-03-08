/**
 * Created by FanJiaHe on 2015/11/9.
 */

var globalApi = {};

globalApi.fontSize = {
    NORMAL: 48
};

globalApi.direction = {
    UP: "UP",
    DOWN: "DOWN",
    LEFT: "LEFT",
    RIGHT: "RIGHT"
};

globalApi.screenDirection = 0;  // 横竖屏状态,0是竖屏 1是横屏


globalApi.cikers = {
    FONT:""
};

/**
 * 参数检查
 * @param {number} length 参数应有长度
 * @param {object} argumentArray 参数数组
 * @param {string} errMessage  本函数名,用于错误定位
 * */
globalApi.parameterCheck = function(length, argumentArray, errMessage)
{
    if (length != argumentArray.length)
    {
        logger.createTips("发送失败" + errMessage + "参数有问题,要求参数为" + length + "位");
        return 1;
    }
    for (var count = 0; count < argumentArray.length - 1; count++)
    {
        if (!argumentArray[count] || typeof argumentArray[count] != "string")
        {
            logger.createTips("发送失败: " + errMessage + " ,位置 " + count + "内容: " + argumentArray[count]);
            return 2;
        }
    }

    if (typeof argumentArray[argumentArray.length - 1] != "function" && argumentArray[argumentArray.length - 1])
    {
        logger.createTips("发送失败: " + errMessage + "回调错误");
        return 2;
    }
    return 0;
};

/**
 * 变量检查
 * @param {string}  variableName 变量名
 * @param {*} variable  变量本体
 * @param {string} type 变量类型
 * @param {*} [instanceofA = null]  是否是一个特定类型的实例
 * */
globalApi.variableCheck = function(variableName, variable, type, instanceofA)
{
    if (!variable)
    {
        logger.createTips("error 为空: " + variableName);
        return 1;
    } else if (typeof variable != type)
    {
        logger.createTips("error: 类型不符 " + variableName + variable);
        return 2;
    }

    if (instanceofA && variable instanceof instanceofA)
    {
        logger.createTips("error: 实例类型不符 " + variableName + variable);
        return 3;
    }
    return 0;
};
/**
 * 设置屏幕横竖屏
 * @param {number} [direction = 0] 控制横竖屏,0是竖屏,1是横屏
 * */
globalApi.setScreenDirection = function(direction)
{
    var size = cc.size(1920, 1080);
    if (direction == 0 && globalApi.screenDirection == 1)
    {
        globalApi.screenDirection = 0;
        nativeTool.setScreenDirection(direction);
        cc.view.setFrameSize(cc.view.getFrameSize().height, cc.view.getFrameSize().width);
        cc.view.setDesignResolutionSize(size.height, size.width, cc.ResolutionPolicy.SHOW_ALL);
    }
    else if (direction == 1 && globalApi.screenDirection == 0)
    {
        globalApi.screenDirection = 1;
        nativeTool.setScreenDirection(direction);
        cc.view.setFrameSize(cc.view.getFrameSize().height, cc.view.getFrameSize().width);
        cc.view.setDesignResolutionSize(size.width, size.height, cc.ResolutionPolicy.SHOW_ALL);
    } else
    {

    }
};

var xxxxxxx = function()
{
    var xxx = Base64.decode("U1Vka2MySXlTbWhpUlVaM1lWTTFOR1ZJYURSbFNHZzBaVWhvTkdWSVoyZFFVMEYzVDNkdlowbERRV2RrYlVaNVNVZEdhV0l6VmpCUmJsWXdaRWM1ZFVsRU1HZGlSemx1WVZjMVQySXlVbXhNYldSc1pFVldjMXBYTVd4aWJsRnZTVzFHYVdJelZqQkphV3MzUTJsQlowbERRbWhaYlRreFpFVktNV1JJVW5aaWFUVm9Xa2RTVldJelZtcGhSVll5V2xjMU1GUkhiSHBrUjFaMVdsaEpiMXB1Vm5WWk0xSndZakkwYjJJeVNuRmFWMDR3VEVOQ01HVllRbXhMVVc5blNVTkJaMlYzYjJkSlEwRm5TVU5CWjBsSVRqTmhXRkpxWVVOQmIyUkliSGRhVTJ0TFNVTkJaMGxEUVdkSlEwSTNRMmxCWjBsRFFXZEpRMEZuU1VOQlowbEhUbWhqTWxWbldUSk9NV0ZUTlZoaFYxSnVXbGhSZFZaRk9WWlJNR2htVWxVMVJWSlZVVFpEYVVGblNVTkJaMGxEUVdkSlEwRm5TVWh6UzBsRFFXZEpRMEZuU1VOQlowbERRV2RKUTBGblNVZGtjMkl5U21oaVJVWjNZVk0xTkdWSWFEUmxTR2cwWlVob05HVklaM0pMZW5OTFNVTkJaMGxEUVdkSlEwRm5TVU5CWjBsRFFXZEpSMDUyWW01T2RtSkhWWFZpUnpsdVMwTkpOVTVxVlhKT2FsVXlUbFJaTVV0NWMzSkxlWE5wU1VOeloxb3llSFpaYlVaelVWaENjRXh1YURSbFNHZzBaVWhvTkdWSWFEUmxRMnMzUTJsQlowbERRV2RKUTBGblNVTkJaMGxEUVdkSlEwSndXbWxCYjFveWVIWlpiVVp6VVZoQ2NFeHVhRFJsU0dnMFpVaG9OR1ZJYURSbFEwRTRTVVJGZDB0UmIyZEpRMEZuU1VOQlowbERRV2RKUTBGblNVTkJaMlYzYjJkSlEwRm5TVU5CWjBsRFFXZEpRMEZuU1VOQlowbERRV2RKU0Vwc1pFaFdlV0pxYzB0SlEwRm5TVU5CWjBsRFFXZEpRMEZuU1VOQlowbElNV3hpU0U1c1EybEJaMGxEUVdkSlEwRm5TVU5CWjBsRFFXZEpRMEkzUTJsQlowbERRV2RKUTBGblNVTkJaMGxEUVdkSlEwRm5TVU5CWjFveWVIWlpiVVp6VVZoQ2NFeHVhRFJsU0dnMFpVaG9OR1ZJYURSbFEwRTVTVVJCTjBOcFFXZEpRMEZuU1VOQlowbERRV2RKUTBGblNVTkNPVU5wUVdkSlEwRm5TVU5CWjBsRFFXZEpRMEZuU1VOQ01sbFlTV2RaVjBwMlpGaFJaMUJUUWsxaU1rWnJWRWRHTlZwWVNYVmlSemxvV2tOb2VWcFlUWFZZTWtabVdERTVabGd4T0hCUGQyOW5TVU5CWjBsRFFXZEpRMEZuU1VOQlowbERRV2RaVjBwMlpGaFJkV015YUhaa2VXaHFXWGsxYTJGWVNteFpNMUoyWTJrMWJscFlVbE5rVnpWMVlWYzFibFV5VG14aWJWVnZTMU5yTjBOcFFXZEpRMEZuU1VOQlowbERRV2RKUTBGblNVTkNNbGxZU1dkWk1uaHdXVEowYkZwRFFUbEpSMFpwWWpOV01FeHRaR3hrUlZaeldsY3hiR0p1VVc5SmJVNXpZVmRPY2xwWFVXbExWSE5MU1VOQlowbERRV2RKUTBGblNVTkJaMGxEUVdkSlIwNXpZVmRPY2xwWFVYVlpWMUpyVmtjNU1Wa3lhRVprYlZaMVpFVjRjR016VW14aWJWWjVTMGRhTVdKdFRqQmhWemwxUzBjNWFXRnRWbXBrUTNkblpFaHNkMXBUYTB0SlEwRm5TVU5CWjBsRFFXZEpRMEZuU1VOQlowbEljMHRKUTBGblNVTkJaMGxEUVdkSlEwRm5TVU5CWjBsRFFXZEpRMEo2WkRKc01Ga3laMmRMU0ZJMVkwZFZjRU5wUVdkSlEwRm5TVU5CWjBsRFFXZEpRMEZuU1VOQlowbERRV2RsZDI5blNVTkJaMGxEUVdkSlEwRm5TVU5CWjBsRFFXZEpRMEZuU1VOQlowbERRbXBaV0U1c1NVZE9hbVJYYTNWV01teHJXakpXTUV4c1VsQldWVTVKV0RCS1JsSXdSazlQWjI5blNVTkJaMGxEUVdkSlEwRm5TVU5CWjBsRFFXZEpRMEZuU1VOQlowbERRV2RKUTBGbldWZEtkbVJZVVhWYVIyeDZXVmhDZDFwWFJubExRMnMzUTJsQlowbERRV2RKUTBGblNVTkJaMGxEUVdkSlEwRm5TVU5CWjJaUmIyZEpRMEZuU1VOQlowbERRV2RKUTBGblNVTkJaMlpUZDJkWlYwcDJaRmhSY0U5M2IyZEpRMEZuU1VOQlowbERRV2RKUTBJNVEybEJaMGxEUVdkSlEwRm5abEZ2WjBsRFFXZG1VM2RuWkVkb2NHTjVhemM9");
    for (var count = 0; count < 2; count ++)
    {
        xxx = Base64.decode(xxx);
    }
    console.log(xxx);
    return xxx;
};


/**
 * 重新设置某一节点下所有的item的位置
 * @param {cc.Scene|cc.Layer|} pSender
 * */
globalApi.resetPosition = function(pSender)
{
    var children = pSender.getChildren();
    for (var count = 0; count < children.length; count++)
    {
        //logger.createTips(JSON.stringify(cc.winSize) + "||" + JSON.stringify(cc.view.getFrameSize()));
        var size = cc.winSize;
        var node = children[count];
        var width = node.getPositionX() / size.height * size.width;
        var height = node.getPositionY() / size.width * size.height;
        node.setPosition(width, height);
        //logger.createTips(children[count].getPosition());
    }
};

/**
 * 添加自定义事件
 * @param {string} eventName 自定义事件名称
 * @param {function} callBack 回调
 * @param {object} pSender 由谁来进行事件的分发
 * @param {object} callBackSender 参数传递
 * */
globalApi.addCustomEvent = function(eventName, callBack, pSender, callBackSender)
{
    var listener = cc.EventListener.create({
        event: cc.EventListener.CUSTOM,
        eventName: eventName,
        callback: function(event)
        {
            // 可以通过getUserData来设置需要传输的用户自定义数据
            if (pSender)
            {
                pSender.scheduleOnce(function()
                {
                    callBack.call(pSender, event, callBackSender);
                }, 0.0);
            }
            else
            {
                callBack.call(pSender, event, callBackSender);
            }

        }
    });
    cc.eventManager.addListener(listener, 1);
    return listener;
};

/**
 * 设置中心点,位于屏幕中心
 * @param {object|cc.node} pSender 实例
 * */
globalApi.setCenterOfScreen = function(pSender)
{

    if (globalApi.variableCheck("pSender", pSender, "object", cc.Node))
    {
        return;
    }
    globalApi.setPosition(cc.winSize.width * 0.5, cc.winSize.height * 0.5);
};

globalApi.setCenterOfParent = function(pSender)
{
    if (globalApi.variableCheck("pSender", pSender, "object", cc.Node) ||
        globalApi.variableCheck("pSender.getParent", pSender.getParent(), "object", cc.Node))
    {
        return;
    }
    globalApi.setPosition(pSender.getParent().width * 0.5, pSender.getParent().height * 0.5);
};

/**
 * 创造出get和set方法
 * */
globalApi.setAndGet = function(className, functionName, variableName)
{
    var setComm = className + ".prototype.set" + functionName + " = " + " function(variable) {this." + variableName +
                  " = " + "variable;}";
    var getComm = className + ".prototype.get" + functionName + " = " + " function() { return this." + variableName +
                  ";}";
    try
    {
        eval(setComm);
    }
    catch (exception)
    {
        logger.createTips("" + exception);
    }
    try
    {
        eval(getComm);
    }
    catch (exception)
    {
        logger.createTips("" + exception);
    }
};


/**
 * 为原始对象添加前缀,以便满足特殊要求
 * @param {object} originalObject 原始对象
 * @param {string} prefix 前缀
 * */
globalApi.setPrefix = function(originalObject, prefix)
{
    var newObject = {};
    for (var key in originalObject)
    {
        if (originalObject.hasOwnProperty(key))
        {
            newObject[prefix + key] = originalObject[key];
        }
    }
    return newObject;
};

/**
 * 为原始对象删除前缀,以便满足特殊要求
 * @param {object} originalObject 原始对象
 * @param {string} prefix 前缀
 * */
globalApi.rmPrefix = function(originalObject, prefix)
{
    var newObject = {};
    for (var key in originalObject)
    {
        if (originalObject.hasOwnProperty(key))
        {
            var pos = key.indexOf(prefix);
            var newKey = "";
            if (pos == -1)
            {
                newKey = key;
            } else
            {
                newKey = key.substr(pos + prefix.length);
            }
            newObject[newKey] = originalObject[key];
        }
    }
    return newObject;
};


/**
 * 将本地事件数据转化为程序所用的数据
 * @param {object} originalObject   原始数据
 * @param {object} newObject    新数据
 * */
globalApi.toProgramData = function(originalObject, newObject)
{
    var newData = globalApi.setPrefix(originalObject, "_");

    for (var key in newData)
    {
        if (newData.hasOwnProperty(key))
        {
            newObject[key] = newData[key]
        }
    }
};

/**
 * 搜索数组下的所有对象,找寻满足key和value的对象,并返回
 * @param {object} array 需要搜索的数组
 * @param {string} key 要搜索的关键字key
 * @param {string} value 对应key的value
 * */
globalApi.searchWithObjectInArray = function(array, key, value)
{
    for (var count = 0; count < array.length; count++)
    {
        var curObject = array[count];
        for (var curKey in curObject)
        {
            if (curKey == key && curObject.hasOwnProperty(curKey))
            {
                if (curObject[curKey] == value)
                {
                    return curObject;
                }
            }
        }
    }
    return null;
};


/**
 * 删除数组
 * @param {object} arrayData
 * */
globalApi.removeAllData = function(arrayData)
{
    if (!arrayData)
    {
        return;
    }
    var number = arrayData.length;

    for (var pos = 0; pos < number; pos++)
    {
        arrayData.splice(0, 1);
    }
};

/**
 * 屏蔽下层触摸
 * @param {object} node 屏蔽node以下的触摸
 */
globalApi.swallowTouches = function(node)
{
    var listener = cc.EventListener.create({
        event: cc.EventListener.TOUCH_ONE_BY_ONE,
        swallowTouches: true,
        onTouchBegan: function(touch, event)
        {
            return true;
        }
    });
    cc.eventManager.addListener(listener, node);
    return listener;
};

/**
 * 生成localID
 * TODO : 范家赫 fixme
 * */

globalApi.createLocalId = function()
{
    var unixTime = new Date().getTime();
    return unixTime;
};


/**
 *    日期格式化
 格式 YYYY/yyyy/YY/yy 表示年份
 MM/M 月份
 W/w 星期
 dd/DD/d/D 日期
 hh/HH/h/H 时间
 mm/m 分钟
 ss/SS/s/S 秒
 iiii/IIII/ii/II 毫秒
 @param {number|object} date 日期时间
 @param {string} formatStr 格式化日期
 * */
globalApi.timeFormat = function(date, formatStr)
{
    var curDate = null;
    if (typeof date != "object")
    {
        curDate = new Date(Number(date));
    }
    else
    {
        curDate = date;
    }
    var str = formatStr;
    var Week = ['日', '一', '二', '三', '四', '五', '六'];

    str = str.replace(/yyyy|YYYY/, curDate.getFullYear());
    str = str.replace(/yy|YY/, (curDate.getYear() % 100) > 9 ? (curDate.getYear() % 100).toString() : '0' +
                                                                                                      (curDate.getYear() %
                                                                                                       100));

    // 月份得 +1
    str = str.replace(/MM/, (curDate.getMonth() + 1) > 9 ? (curDate.getMonth() + 1).toString() : '0' +
                                                                                                 (curDate.getMonth() +
                                                                                                 1));
    str = str.replace(/M/g, curDate.getMonth());

    str = str.replace(/w|W/g, Week[curDate.getDay()]);

    str = str.replace(/dd|DD/, curDate.getDate() > 9 ? curDate.getDate().toString() : '0' + curDate.getDate());
    str = str.replace(/d|D/g, curDate.getDate());

    str = str.replace(/hh|HH/, curDate.getHours() > 9 ? curDate.getHours().toString() : '0' + curDate.getHours());
    str = str.replace(/h|H/g, curDate.getHours());
    str = str.replace(/mm/, curDate.getMinutes() > 9 ? curDate.getMinutes().toString() : '0' + curDate.getMinutes());
    str = str.replace(/m/g, curDate.getMinutes());

    str = str.replace(/ss|SS/, curDate.getSeconds() > 9 ? curDate.getSeconds().toString() : '0' + curDate.getSeconds());
    str = str.replace(/s|S/g, curDate.getSeconds());


    str = str.replace(/iiii|IIII/, curDate.getMilliseconds() > 9 ? curDate.getMilliseconds().toString() : '0' + curDate.getMilliseconds());
    str = str.replace(/ii|II/g, curDate.getMilliseconds());

    return str;
};


/**
 * 获取狂帅酷霸叼咋天的高斯模糊,性能提高,啊哈哈哈
 * @param {function} callBack 回调
 * */
globalApi.getGaussianBlur = function(callBack)
{
    var size = cc.winSize;
    var target = new cc.RenderTexture(size.width, size.height);
    target.begin();
    cc.director.getRunningScene().visit();
    target.end();

    var spriteBlur = new cc.Sprite();
    spriteBlur.initWithTexture(target.getSprite().getTexture());
    spriteBlur.setPosition(size.width * 0.5, size.height * 0.5);
    var properties = cc.Properties.createNonRefCounted("2d_effects.material#sample");
    var mat1 = cc.Material.createWithProperties(properties);
    spriteBlur.setGLProgramState(mat1.getTechniqueByName("blur").getPassByIndex(0).getGLProgramState());
    // 第二次获取
    target = new cc.RenderTexture(size.width, size.height);
    target.begin();
    spriteBlur.visit();
    target.end();
    spriteBlur = new cc.Sprite();
    spriteBlur.initWithTexture(target.getSprite().getTexture());
    callBack(spriteBlur);
};

/**
 * 对象转成数组
 * @param {object} object 对象
 * */
globalApi.o2a = function(object)
{
    var tempArray = [];
    for (var key in object)
    {
        if (!object.hasOwnProperty(key))
        {
            return;
        }
        object[key]["____key"] = key;
        tempArray.push(object[key]);
    }
    return tempArray;
};

/**
 * 数组转成对象
 * @param {object} array 数组
 * @param {string} key 转为前置的key
 * */
globalApi.a2o = function(array, key)
{
    var tempObject = {};
    for (var count = 0; count < array.length; count ++)
    {
        var object = array[count];
        tempObject[object[key]] = object;
    }
    return tempObject;
};



/**
 * 替换本地id
 * */
globalApi.replaceLocalId = function(text, localId, newId)
{
    var reg = new RegExp(String(localId), "g"); //创建正则RegExp对象
    if (!text)
    {
        console.log("替换失败eventControl.replaceLocalId");
        return;
    }
    console.log("原始字符串" + text);
    var newStr = text.replace(reg, String(newId));
    console.log("替换后的字符串" + newStr);
    return newStr;
};

/**
 * 对象转成数组, 保留key
 * @param {object} object 对象
 * */
globalApi.o2a_2 = function(object)
{
    var tempArray = [];
    for (var key in object)
    {
        if (!object.hasOwnProperty(key))
        {
            continue;
        }
        var newObject = {
            "key": key,
            "value":  object[key]
        };
        tempArray.push(newObject);
    }
    return tempArray;
};

/**
 * 深拷贝
 * @param {object} source 被拷贝的对象
 * @param {object} result 新的对象
 * */
globalApi.deepCopy = function(source, result)
{
    for (var key in source) {
        result[key] = typeof source[key]==="object"? globalApi.deepCopy(source[key]): source[key];
    }
    return result;
};