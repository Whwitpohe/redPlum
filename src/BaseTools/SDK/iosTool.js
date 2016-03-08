/**
 * Created by FanJiaHe on 2015/11/18.
 */

var iosTool = {};

/**
 * 调用IOS函数,屏幕设置
 * @param {number} direction 方向 0 竖屏,1横屏
 * */
iosTool.setScreenDirection = function(direction)
{
    if (direction === 1) {
        jsb.reflection.callStaticMethod("IosUtil", "callRotateScreen:", "hengping");
    } else {
        jsb.reflection.callStaticMethod("IosUtil", "callRotateScreen:", "shuping");
    }
};

/**
 * 调用iOS函数,召唤相机
 * */
iosTool.takePicture = function(eventName)
{
    console.log("打开相机");
    jsb.reflection.callStaticMethod("IosUtil", "getCamera");
};

/**
 * 调用ios函数,召唤图册
 * */
iosTool.selectPicture = function(eventName)
{
    console.log("打开相册");
    jsb.reflection.callStaticMethod("IosUtil", "getPhoto");
};

/**
 * 拨打电话
 * @param {string} phoneNumber 电话号码
 * */
iosTool.phoneCall = function(phoneNumber)
{

    jsb.reflection.callStaticMethod("IosUtil", "sendPhone:", phoneNumber);
};

/**
 * 统计登录者id
 * @param {string|number} userId 登录者id
 * */
iosTool.statisticsLoginUserId = function(userId)
{
    jsb.reflection.callStaticMethod("IosUtil", "sendAnalyticsByUserId", String(userId));
};


/**
 * 调用iOS函数,关闭键盘
 * */
iosTool.closeKeyboard = function()
{
    console.log("关闭键盘");
    jsb.reflection.callStaticMethod("IosUtil", "closeKeyboard");
};
