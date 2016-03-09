/**
 * Created by FanJiaHe on 2016/3/3.
 */

var prospectMenuControl = {};

prospectMenuControl._layer = null;
prospectMenuControl._hero = null;


// 这个需要单例
prospectMenuControl.getLayer = function(hero)
{
    prospectMenuControl._hero = hero;
    if (!prospectMenuControl._layer)
    {
        prospectMenuControl._layer = new ProspectMenu();
    }
    return prospectMenuControl._layer;
};

/**
 * 按钮点击
 * */
prospectMenuControl.onClicked = function(object, type)
{
    switch (type)
    {
        case ccui.Widget.TOUCH_BEGAN:
            break;
        case ccui.Widget.TOUCH_MOVED:
            break;
        case ccui.Widget.TOUCH_ENDED:
        {
            prospectMenuControl.actionEvent(object);
            break;
        }
        case ccui.Widget.TOUCH_CANCELED:
            break;
    }
};


/**
 * 按钮回调触发
 * @param {object} button 按钮实例
 * */
prospectMenuControl.actionEvent = function(button)
{
    switch (button.getName())
    {
        case "personalPhoto":
        {
            prospectMenuControl.personalPhotoCallBack();
            break;
        }
    }
};

prospectMenuControl.refreshView = function()
{
    prospectMenuControl._layer._labelGold.setString(prospectMenuControl._hero._gold + "金币");
};


/***/
prospectMenuControl.personalPhotoCallBack = function()
{
    var IndividualCenter = individualCenterControl.getLayer(prospectMenuControl._hero);
    individualCenterControl.setDisappearCallBack(prospectMenuControl.refreshView);
    cc.director.getRunningScene().addChild(IndividualCenter);

    // if (cc.director.isPaused())
    // {
    //     cc.director.resume();
    // } else
    // {
    //     cc.director.pause();
    // }
};