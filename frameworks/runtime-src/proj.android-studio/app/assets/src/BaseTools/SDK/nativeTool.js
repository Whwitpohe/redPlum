/**
 * Created by FanJiaHe on 2015/11/18.
 */

var nativeTool = {};

/**
 * 调用函数,屏幕设置
 * @param {number} direction 方向 0 竖屏,1横屏
 * */
nativeTool.setScreenDirection = function(direction)
{
    try
    {
        if (cc.sys.os === cc.sys.OS_ANDROID)
        {
            androidTool.setScreenDirection(direction);
        }
        else if (cc.sys.os === cc.sys.OS_IOS)
        {
            iosTool.setScreenDirection(direction);
        }
    } catch (e)
    {
        console.log("屏幕设置失败,--------------");
    }
};

/**
 * 拍照
 * @param {string} eventName 事件名称,用于回调
 * */
nativeTool.takePicture = function(eventName)
{
    try
    {
        if (cc.sys.os === cc.sys.OS_ANDROID)
        {
            androidTool.takePicture(eventName);
        }
        else if (cc.sys.os === cc.sys.OS_IOS)
        {
            iosTool.takePicture(eventName);
        }
    } catch (e)
    {
        console.log("召唤拍照失败,--------------");
    }
};

/**
 * 调用安卓函数,召唤图册
 * @param {string} eventName 事件名称,用于回调
 * */
nativeTool.selectPicture = function(eventName)
{
    try
    {
        if (cc.sys.os === cc.sys.OS_ANDROID)
        {
            androidTool.selectPicture(eventName);
        }
        else if (cc.sys.os === cc.sys.OS_IOS)
        {
            iosTool.selectPicture(eventName);
        }
    } catch (e)
    {
        console.log("召唤图册失败,--------------");
    }
};

nativeTool.phoneCall = function(phoneNumber)
{
    try
    {
        if (cc.sys.os === cc.sys.OS_ANDROID)
        {
            androidTool.phoneCall(phoneNumber);
        }
        else if (cc.sys.os === cc.sys.OS_IOS)
        {
            iosTool.phoneCall(phoneNumber);
        }
    } catch (e)
    {
        console.log("拨打电话失败,--------------");
    }
};

/**
 * 统计登录者的id
 * */
nativeTool.statisticsLoginUserId = function(userId)
{
    try
    {
        if (cc.sys.os === cc.sys.OS_ANDROID)
        {
            androidTool.statisticsLoginUserId(userId);
        }
        else if (cc.sys.os === cc.sys.OS_IOS)
        {
            iosTool.statisticsLoginUserId(userId);
        }
    } catch (e)
    {
        console.log("统计失败,--------------");
    }
};


/**
 * 关闭键盘
 * */
nativeTool.closeKeyboard = function()
{
    try
    {
        if (cc.sys.os === cc.sys.OS_ANDROID)
        {
        }
        else if (cc.sys.os === cc.sys.OS_IOS)
        {
            iosTool.closeKeyboard();
        }
    } catch (e)
    {
        console.log("关闭失败,--------------");
    }
};
