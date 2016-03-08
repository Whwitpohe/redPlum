/**
 * Created by FanJiaHe on 2015/11/17.
 */

var androidTool = {};

/**
 * 调用安卓函数,屏幕设置
 * @param {number} direction 方向 0 竖屏,1横屏
 * */
androidTool.setScreenDirection = function(direction)
{
    jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "setDirection", "(I)V", direction);
};

/**
 * 调用安卓函数,召唤相机
 * */
androidTool.takePicture = function(eventName)
{
    jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "takePicture", "(Ljava/lang/String;)V", eventName);
};

/**
 * 调用安卓函数,召唤图册
 * */
androidTool.selectPicture = function(eventName)
{
    jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "selectPicture", "(Ljava/lang/String;)V", eventName);
};

/**
 * 拨打电话
 * @param {string} phoneNumber 电话号码
 * */
androidTool.phoneCall = function(phoneNumber)
{
    jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "callPhone", "(Ljava/lang/String;)V", phoneNumber);
};

/**
 * 统计登录者id
 * @param {string|number} userId 登录者id
 * */
androidTool.statisticsLoginUserId = function(userId)
{
    jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "statisticsLoginUserId", "(Ljava/lang/String;)V", String(userId));
};