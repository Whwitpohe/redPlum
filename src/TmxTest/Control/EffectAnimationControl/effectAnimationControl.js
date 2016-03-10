/**
 * Created by FanJiaHe on 2016/3/10.
 */

var effectAnimationControl = {};

effectAnimationControl._forceOne = false;
effectAnimationControl._animationType = {
    ZOOM: "ZOOM"
};

/**
 * 执行动画
 * @param {object}  sender 需要执行动画的实例
 * @param {effectAnimationControl._animationType.} type 动画类型
 * @param {boolean} forceOne 强制让一个执行而非全部孩子
 * */
effectAnimationControl.runAction = function(sender, type, forceOne)
{
    switch (type)
    {
        case  effectAnimationControl._animationType.ZOOM:
        {
            effectAnimationControl.checkRun(effectAnimationControl.zoomAnimation, sender, forceOne);
            break;
        }
    }

};

/**
 * 检查并运行
 * */
effectAnimationControl.checkRun = function(func, sender, forceOne)
{
    var childrenCount = sender.getChildrenCount();

    if (!forceOne && childrenCount)
    {
        var children = sender.getChildren();
        for (var count = 0; count < childrenCount; count++)
        {
            effectAnimationControl.checkRun(func, children[count], forceOne);
        }
    } else
    {
        func(sender);
    }
};

/**
 * 一种缩放动画
 * */
effectAnimationControl.zoomAnimation = function(sender)
{
    sender.setScale(0.5);
    var scaleTo = cc.scaleTo(2, 1, 1);
    var ease = new cc.EaseElasticOut(scaleTo, 0.5);
    sender.runAction(ease);
};


/**
 * 一种淡出动画
 * */
effectAnimationControl.fadeOutAnimation = function(sender)
{
    sender.setOpacity(0);
    var fadeOutTo = cc.fadeIn(0.5);
    sender.runAction(fadeOutTo);
};


