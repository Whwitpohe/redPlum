/**
 * Created by FanJiaHe on 2016/3/4.
 */

var ItemData = function()
{

};

ItemData.prototype._idx = null;         // id
ItemData.prototype._itemId = null;      // itemId
ItemData.prototype._key = null;         // 名称
ItemData.prototype._type = null;        // 类型 : 装备.消耗,材料
ItemData.prototype._subType = null;     // 子类型 一般消耗品. 抽奖品
ItemData.prototype._quality = null;     // 品质 普通,紫色,黄色
ItemData.prototype._weight = null;      // 重量 kg
ItemData.prototype._max = null;         // 最大个数
ItemData.prototype._image = null;       // 图片
ItemData.prototype._info = null;        // 一些信息         白字
ItemData.prototype._canSonsume = null;  // 是否可消耗
ItemData.prototype._effect = null;      // 作用于   hp,attack等 可以是数组
ItemData.prototype._effectType = null;  // 作用类型  百分比 固定值, 可以是数组
ItemData.prototype._effectValue = null; // 数值 500,50可以是数组
ItemData.prototype._effectInfo = null;  // 效果的介绍            蓝字
ItemData.prototype._actionLength = null;// 生效时长  10秒生效 代表 10秒作用完全效果 0代表立即生效
ItemData.prototype._durationLength = null;// 持续时长   10代表 10秒后相反结果 0代表,无相反结果
ItemData.prototype._coolingTime = null; // 冷却时长
ItemData.prototype._levelRestrictions = null; // 等级限制 数组[0,80]


ItemData.prototype.getInfo = function()
{
    var text = this._info;
    if (text)
    {
        text = JSON.parse("\"" + text + "\"");
    }
    return text;
};

ItemData.prototype.getLevelRestrictions = function()
{
    var levelRestrictionsList = JSON.parse(this._levelRestrictions);
    var firstText = levelRestrictionsList[0] > 0 ? ("LV" + levelRestrictionsList[0] + "以上") : "";
    var lastText = levelRestrictionsList[1] > 0 ? ((firstText ? "," : "LV") + levelRestrictionsList[1] + "以下") : "";
    return firstText + lastText + "可以使用";
};


ItemData.prototype.getEffectList = function()
{
    var effect = this._effect;
    if (effect)
    {
        effect = JSON.parse(effect);
    }
    return effect;
};

/**
 * 获取效果说明
 * */
ItemData.prototype.getEffectText = function()
{
    var effectTextList = ["", "", "", ""];
    var text = "";
    var effectList = this.getEffectList();
    for (var count = 0; count < effectList.length; count++)
    {
        var curEffect = effectList[count];
        var curEffectLanguage = languageControl.getCurLanguage(curEffect);
        var curEffectValue = Number(this._effectValue);
        var curEffectType = this._effectType == "percentage" ? "%" : "";
        var curEffectStatus = curEffectValue > 0 ? " 增加 " : " 减少 ";
        switch (curEffect)
        {
            case "HP":
            case "MP":
            {
                curEffectStatus = curEffectValue > 0 ? " 恢复 " : " 减少 ";
                effectTextList[0] += (curEffectLanguage + curEffectStatus + Math.abs(curEffectValue) +
                                      curEffectType + "\n");
                break;
            }
            case "HPMAX":
            case "MPMAX":
            {
                effectTextList[1] += (curEffectLanguage + curEffectStatus + Math.abs(curEffectValue) +
                                      curEffectType + "\n");
                break;
            }
        }
    }


    var firstText = this._actionLength > 0 ? ("在" + this._actionLength + "秒内\n") : "";
    var lastText = Number(this._durationLength) ? ("效果持续" + this._durationLength + "秒\n") : "\n";
    var effectInfo = this._effectInfo;
    lastText += effectInfo;

    effectTextList[0] = firstText + effectTextList[0];
    effectTextList[3] += lastText;
    for (count = 0; count < effectTextList.length; count++)
    {
        if (effectTextList[count])
        {
            text += effectTextList[count];
        }
    }

    return text;
};
