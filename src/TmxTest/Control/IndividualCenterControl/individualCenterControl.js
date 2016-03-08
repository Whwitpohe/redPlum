/**
 * Created by FanJiaHe on 2016/3/3.
 */

var individualCenterControl = {};

individualCenterControl._displayType = {
    ATTRIBUTE: "ATTRIBUTE",
    BAG: "BAG",
    PET: "PET"
};

individualCenterControl._layer = null;
individualCenterControl._hero = null;
individualCenterControl._shouldDisplay = individualCenterControl._displayType.ATTRIBUTE;


individualCenterControl._heroAttribute = [];
individualCenterControl._heroAttributeCellSize = null;

individualCenterControl._heroItemSize = null;
individualCenterControl._curBag = null;
individualCenterControl._curBagType = null;
individualCenterControl._lastBagType = null;

/**
 * 获取Layer
 * */
individualCenterControl.getLayer = function(hero, shouldDisplayType)
{
    individualCenterControl._hero = hero;
    individualCenterControl._shouldDisplay = shouldDisplayType || individualCenterControl._shouldDisplay;
    if (!individualCenterControl._layer)
    {
        individualCenterControl._curBagType = "CONSUMABLES";
        individualCenterControl._lastBagType = individualCenterControl._curBagType;

        individualCenterControl._layer = new IndividualCenter();
        individualCenterControl._layer.retain();    // 防止被释放掉,我要让这货一直存在着
    }
    return individualCenterControl._layer;
};


/**
 * 根据不同的规则刷新不同的界面显示刷新界面
 * */
individualCenterControl.refreshView = function()
{
    switch (individualCenterControl._shouldDisplay)
    {
        case individualCenterControl._displayType.ATTRIBUTE:
        {
            individualCenterControl._layer._buttonAttribute.setBrightStyle(ccui.Widget.BRIGHT_STYLE_HIGH_LIGHT);
            individualCenterControl._layer._buttonBag.setBrightStyle(ccui.Widget.BRIGHT_STYLE_NORMAL);
            individualCenterControl._layer._buttonPet.setBrightStyle(ccui.Widget.BRIGHT_STYLE_NORMAL);

            individualCenterControl._layer._title.setString("我的属性");

            individualCenterControl._layer._attributeView.setVisible(true);
            individualCenterControl._layer._itemView.setVisible(false);

            individualCenterControl._layer._tab.setVisible(false);
            break;
        }
        case  individualCenterControl._displayType.BAG:
        {
            individualCenterControl._layer._buttonAttribute.setBrightStyle(ccui.Widget.BRIGHT_STYLE_NORMAL);
            individualCenterControl._layer._buttonBag.setBrightStyle(ccui.Widget.BRIGHT_STYLE_HIGH_LIGHT);
            individualCenterControl._layer._buttonPet.setBrightStyle(ccui.Widget.BRIGHT_STYLE_NORMAL);

            individualCenterControl._layer._title.setString(languageControl.getCurLanguage(individualCenterControl._curBagType));

            individualCenterControl._layer._attributeView.setVisible(false);
            individualCenterControl._layer._itemView.setVisible(true);

            individualCenterControl._layer._tab.setVisible(true);
            break;
        }
        case  individualCenterControl._displayType.PET:
        {
            individualCenterControl._layer._buttonAttribute.setBrightStyle(ccui.Widget.BRIGHT_STYLE_NORMAL);
            individualCenterControl._layer._buttonBag.setBrightStyle(ccui.Widget.BRIGHT_STYLE_NORMAL);
            individualCenterControl._layer._buttonPet.setBrightStyle(ccui.Widget.BRIGHT_STYLE_HIGH_LIGHT);

            individualCenterControl._layer._title.setString("我的宠物");

            break;
        }
        default:
            break;
    }

    individualCenterControl._layer._title.setScale(0.5);
    var scaleTo = cc.scaleTo(2,1,1);
    var ease = new cc.EaseElasticOut(scaleTo, 0.5);
    individualCenterControl._layer._title.runAction(ease);

};


/**
 * 按钮点击
 * */
individualCenterControl.onClicked = function(object, type)
{
    switch (type)
    {
        case ccui.Widget.TOUCH_BEGAN:
            break;
        case ccui.Widget.TOUCH_MOVED:
            break;
        case ccui.Widget.TOUCH_ENDED:
        {
            individualCenterControl.actionEvent(object);
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
individualCenterControl.actionEvent = function(button)
{
    switch (button.getName())
    {
        case "back":
        {
            individualCenterControl.disappear();
            break;
        }
        case "attribute":
        {
            individualCenterControl._shouldDisplay = individualCenterControl._displayType.ATTRIBUTE;
            individualCenterControl.refreshView();
            break;
        }
        case "bag":
        {
            individualCenterControl._shouldDisplay = individualCenterControl._displayType.BAG;
            individualCenterControl.refreshView();
            break;
        }
        case "pet":
        {
            individualCenterControl._shouldDisplay = individualCenterControl._displayType.PET;
            individualCenterControl.refreshView();
            break;
        }
    }
};


/**
 * 消失
 * */
individualCenterControl.disappear = function(isClear)
{
    individualCenterControl._layer.removeFromParent();
    if (isClear)
    {
        individualCenterControl._layer.release();
    }
};


//------------------------------------------------------------------

/**
 * 创建人物属性列表
 * @param {object} node 节点
 * @param {number} index 当前节点的index
 */
individualCenterControl.createAttributeCell = function(node, index)
{
    //
    var size = individualCenterControl._heroAttributeCellSize;
    var data = individualCenterControl._heroAttribute[index];

    node._index = index;
    var backGround = new cc.LayerColor(cc.color(0, 0, 0), size.width - 1, size.height - 1);
    node.addChild(backGround);

    var icon = new cc.Sprite(attributeImageControl.getImage(data["key"].substring(1)));
    icon.setPosition(size.width * 0.1, size.height * 0.5);
    icon.setTag(100);
    node.addChild(icon);

    var keyName = new cc.LabelTTF(languageControl.getCurLanguage(data["key"].substring(1)) + ": ", "", 24);
    keyName.setPosition(size.width * 0.5, size.height * 0.5);
    keyName.setTag(101);
    node.addChild(keyName);

    var valueName = new cc.LabelTTF(data["value"], "", 24);
    valueName.setPosition(size.width * 0.8, size.height * 0.5);
    valueName.setTag(102);
    node.addChild(valueName);
};

/**
 * 更新人物属性列表
 * @param {object} node 节点
 * @param {number} index 当前节点的index
 */
individualCenterControl.updateAttributeCell = function(node, index)
{
    if (node._index == index)
    {
        return;
    }
    var icon = node.getChildByTag(100);
    var keyName = node.getChildByTag(101);
    var valueName = node.getChildByTag(102);

    var data = individualCenterControl._heroAttribute[index];
    node._index = index;

    icon.setTexture(attributeImageControl.getImage(data["key"].substring(1)));
    keyName.setString(languageControl.getCurLanguage(data["key"].substring(1)) + ": ");
    valueName.setString(data["value"]);
};

/**
 * 点击时的回调方法
 * @param {number} idx 当前点击节点的Index
 * @param {object} pSender 承载列表的Layer
 */
individualCenterControl.touchAttributeCellCallBack = function(idx, pSender)
{

};

//---------------------------------------------------------------------------------------------------------------------

individualCenterControl.createItemCell = function(node, index)
{
    var size = individualCenterControl._heroItemSize;
    var data = individualCenterControl._curBag[index];

    node._index = index;
    var backGround = new cc.LayerColor(cc.color(0, 0, 0), size.width - 1, size.height - 1);
    node.addChild(backGround);

    var icon = new cc.Sprite(data["_image"]);
    icon.setPosition(size.width * 0.5, size.height * 0.6);
    icon.setTag(100);
    node.addChild(icon);
    //
    var itemNameText = languageControl.getCurLanguage(data["_key"]);
    var itemName = new cc.LabelTTF(itemNameText, "", 24);
    itemName.setPosition(size.width * 0.5, size.height * 0.2);
    itemName.setFontSize(itemNameText.length > 3 ? 24 * 3.5 / itemNameText.length : 24);
    itemName.setTag(101);
    node.addChild(itemName);


    var itemCount = new cc.LabelTTF(data["_count"], "", 24);
    itemCount.setPosition(size.width * 0.8, size.height * 0.5);
    itemCount.setTag(102);
    node.addChild(itemCount);
};

individualCenterControl.updateItemCell = function(node, index)
{
    if (node._index == index && individualCenterControl._lastBagType == individualCenterControl._curBagType)
    {
        return;
    }
    var icon = node.getChildByTag(100);
    var itemName = node.getChildByTag(101);
    var itemCount = node.getChildByTag(102);

    var data = individualCenterControl._curBag[index];
    node._index = index;

    icon.setTexture(data["_image"]);
    var itemNameText = languageControl.getCurLanguage(data["_key"]);
    itemName.setString(itemNameText);
    itemName.setFontSize(itemNameText.length > 3 ? 24 * 3.5 / itemNameText.length : 24);
    itemCount.setString(data["_count"]);
};

individualCenterControl.touchItemCellCallBack = function(index, pSender)
{
    if (index >= individualCenterControl._curBag.length)
    {
        console.log("没有道具");
        return;
    }

    var item = individualCenterControl._curBag[index];
    var itemDetailsLayer = popItemDetailsControl.getLayer(item);
    cc.director.getRunningScene().addChild(itemDetailsLayer);

};

/**
 * 切换背包视图
 * */
individualCenterControl.switchBagView = function(curBagType)
{
    if (individualCenterControl._curBagType == curBagType)
    {
        return;
    }

    individualCenterControl._lastBagType = individualCenterControl._curBagType;
    individualCenterControl._curBagType = curBagType || individualCenterControl._curBagType;
    individualCenterControl._curBag = individualCenterControl._hero._bagItems[individualCenterControl._curBagType];
    individualCenterControl._layer._title.setString(languageControl.getCurLanguage(individualCenterControl._curBagType));

    individualCenterControl._layer._title.setScale(0.5);
    var scaleTo = cc.scaleTo(2,1,1);
    var ease = new cc.EaseElasticOut(scaleTo, 0.5);
    individualCenterControl._layer._title.runAction(ease);

    individualCenterControl._layer.reshowView();
};