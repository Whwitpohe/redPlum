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

individualCenterControl._disappearCallBack = null;
individualCenterControl._forceRefresh = false;
individualCenterControl._isColse = null;


/**
 * 获取Layer
 * */
individualCenterControl.getLayer = function(hero, shouldDisplayType)
{
    individualCenterControl._hero = hero;
    individualCenterControl._shouldDisplay = shouldDisplayType || individualCenterControl._shouldDisplay;
    individualCenterControl._isColse = false;    // 每次打开状态都置为true
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
 * 设置消失回调
 * @param {function } callBack 回调
 * */
individualCenterControl.setDisappearCallBack = function(callBack)
{
    individualCenterControl._disappearCallBack = callBack;
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

    // 对title执行动画

    effectAnimationControl.runAction(individualCenterControl._layer._title, effectAnimationControl._animationType.ZOOM, true);
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

    individualCenterControl._disappearCallBack();
    individualCenterControl.clearData();
};

/**
 * 数据清空,防止下次污染
 * */
individualCenterControl.clearData = function()
{
    individualCenterControl._disappearCallBack = null;
    individualCenterControl._isColse = true;   // 每次关闭状态都置为false
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
    effectAnimationControl.runAction(node, effectAnimationControl._animationType.ZOOM, true);
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
    effectAnimationControl.runAction(node, effectAnimationControl._animationType.ZOOM, true);

    if (node._index == index && individualCenterControl._lastBagType == individualCenterControl._curBagType &&
        !individualCenterControl._forceRefresh)
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

/**
 * 点击回调
 * */
individualCenterControl.touchItemCellCallBack = function(index, pSender, cell)
{
    if (index >= individualCenterControl._curBag.length)
    {
        console.log("没有道具");
        return;
    }

    var size = individualCenterControl._heroItemSize;
    var options = individualCenterControl.createMenuWithItem(index);
    customPopMenu.refreshOption(options);
    var tmpOrigin = cell.getParent().convertToWorldSpace(cell.getPosition());
    customPopMenu.show(individualCenterControl._layer, cc.p(tmpOrigin.x + size.width * 0.5, tmpOrigin.y +
                                                                                            size.height * 0.5));
};

/**
 * 刷新item状态
 * */
individualCenterControl.refreshItem = function(value)
{
    if (individualCenterControl._isColse || !individualCenterControl._layer ||
        !individualCenterControl._layer._itemView)
    {
        return;
    }

    var count = value[0];
    var item = value[1];
    var index = individualCenterControl._curBag.indexOf(item);
    if (count == 0) // 如果是0  就删除自身,而且刷新一下子
    {
        individualCenterControl._curBag.splice(index, 1);
        individualCenterControl._forceRefresh = true;
        individualCenterControl._layer.reshowView();
        individualCenterControl._forceRefresh = false;
    } else
    {
        var node = individualCenterControl._layer._itemView.getCurrentCell(index);
        if (node)
        {
            var itemCount = node.getChildByTag(102);
            itemCount.setString(count);
        }
    }
};


/**
 * 为不同的item创建不同的显示菜单
 * */
individualCenterControl.createMenuWithItem = function(index)
{
    var item = individualCenterControl._curBag[index];
    var options = [];

    var useItem = {
        "_title": "使用",
        "_callBack": function()
        {
            itemControl.useItem(item, individualCenterControl._hero);
        }
    };

    var sellItem = {
        "_title": "出售道具",
        "_callBack": function()
        {
            itemControl.sellItem(item, individualCenterControl._hero);
        }
    };

    var seeItem = {
        "_title": "查看介绍",
        "_callBack": function()
        {
            var item = individualCenterControl._curBag[index];
            var itemDetailsLayer = popItemDetailsControl.getLayer(item);
            cc.director.getRunningScene().addChild(itemDetailsLayer);
        }
    };

    var unknown = {
        "_title": "未知的",
        "_callBack": function()
        {
            console.log("我什么都不会说的,哼");
        }
    };

    switch (item._type)
    {
        case "CONSUMABLES":
        {
            options.push(useItem);
            options.push(sellItem);
            options.push(seeItem);
            break;
        }

        case "MATERIAL":
        {
            options.push(sellItem);
            options.push(seeItem);
            break;
        }
        default:
        {
            options.push(unknown);
            break;
        }
    }

    return options;
};


/**
 * 切换背包视图
 * */
individualCenterControl.switchBagView = function(curBagType)
{
    if (individualCenterControl._curBagType == curBagType)
    {
        // 如果上一次选择和这一次选择的相同,则不进行视图切换
        return;
    }

    individualCenterControl._lastBagType = individualCenterControl._curBagType;
    individualCenterControl._curBagType = curBagType || individualCenterControl._curBagType;
    individualCenterControl._curBag = individualCenterControl._hero._bagItems[individualCenterControl._curBagType];
    individualCenterControl._layer._title.setString(languageControl.getCurLanguage(individualCenterControl._curBagType));

    // 对title执行动画
    effectAnimationControl.runAction(individualCenterControl._layer._title, effectAnimationControl._animationType.ZOOM, true);

    individualCenterControl._layer.reshowView();
};