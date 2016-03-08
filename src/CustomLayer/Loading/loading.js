/**
 * Created by FanJiaHe on 2015/11/9.
 */
var logger = {};
logger.count = 0;
logger.tipsArray = [];

/**
 * 清理所有的tips
 * */
logger.clearAll = function()
{
    var number = logger.tipsArray.length;
    for (var pos = 0; pos < number; pos++)
    {
        var tips = logger.tipsArray[0];
        try
        {
            tips.removeFromParent();
        }
        catch (exception)
        {
            console.log("logger.clearAll 释放出错出错出错");
        }
        tips = null;
        logger.tipsArray.splice(0, 1);
    }
};

/** 删除已经执行完动画的提示 */
logger.getAfterTip = function(backGround)
{
    if (typeof backGround != "object" || !(backGround instanceof cc.LayerColor))
    {
        return;
    }
    for (var pos = 0; pos < logger.tipsArray.length; pos++)
    {
        if (backGround != logger.tipsArray[pos])
        {
            continue;
        }
        logger.tipsArray.splice(pos, 1);
        break;
    }
    backGround.removeFromParent();
    backGround = null;
    console.log(("移除成功! 当前COUNT" + logger.tipsArray.length));
};
/**
 * 创建可显示的日志提示。这些语句将显示在界面上。
 * @param {string|number|bool|object}  cue  日志语句
 */
logger.createTips = function(cue)
{
    return;
    // 准备条件。要求当前界面存在
    if (!cc.director.getRunningScene())
    {
        return;
    }

    // 处理提示语，将其文本化
    var cueText = String(cue);
    if (typeof cue == "object")
    {
        cueText = JSON.stringify(cue);
    }
    if (cueText.length > 400)
    {
        cueText = cueText.substring(0, 400);
    }

    // 创建新的条目
    var size = cc.winSize;
    var backGround = new cc.LayerColor(new cc.Color(31, 154, 58, 255), size.width, size.height * 0.06);
    backGround.setPosition(0, size.height + backGround.height * 0.5);
    logger.tipsArray.push(backGround);
    cc.director.getRunningScene().addChild(backGround);
    backGround.setLocalZOrder(1000);

    size = backGround.getContentSize();
    var line = new cc.LayerColor(new cc.Color(0, 0, 0, 255), size.width, size.height * 0.005);
    backGround.addChild(line);

    var tips = new cc.LabelTTF(cueText + "||" + this.count++ + "||" + logger.tipsArray.length, globalApi.cikers.FONT, 48);
    tips.setPosition(size.width * 0.5, tips.getContentSize().height);
    backGround.addChild(tips);

    var moveAct = new cc.MoveBy(1.5, 0, -backGround.height * (this.tipsArray.length + 1));
    var easeBounceOut = new cc.EaseBounceOut(moveAct);
    var delayTime = new cc.DelayTime(3);
    var seqAc = new cc.Sequence(easeBounceOut, delayTime, moveAct.reverse(),
        new cc.CallFunc(logger.getAfterTip, backGround));
    backGround.runAction(seqAc);
    console.log(JSON.stringify(cue));
};

/**
 * 弹出
 * */
logger.pop = function(cue)
{
    // 准备条件。要求当前界面存在
    if (!cc.director.getRunningScene())
    {
        return;
    }

    // 处理提示语，将其文本化
    var cueText = String(cue);
    if (typeof cue == "object")
    {
        cueText = JSON.stringify(cue);
    }
    if (cueText.length > 400)
    {
        cueText = cueText.substring(0, 400);
    }

    var size = cc.winSize;
    var label = new cc.LabelTTF(cueText, globalApi.cikers.FONT, 48);
    label.setColor(cc.color(255, 255, 255));
    label.setPosition(size.width * 0.5, size.height * 0.6);
    label.setOpacity(0);
    label.setLocalZOrder(1000);
    cc.director.getRunningScene().addChild(label);
    logger.tipsArray.push(label);

    var fade = new cc.FadeIn(1);

    var seqAc = new cc.Sequence(fade, fade.reverse(),
        new cc.CallFunc(logger.getAfterTip, label));
    label.runAction(seqAc);
    console.log(JSON.stringify(cue));
};