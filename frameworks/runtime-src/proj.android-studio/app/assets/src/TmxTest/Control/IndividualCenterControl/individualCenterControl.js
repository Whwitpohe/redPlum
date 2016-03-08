/**
 * Created by FanJiaHe on 2016/3/3.
 */

var individualCenterControl = {};

individualCenterControl._layer = null;
individualCenterControl._hero = null;

individualCenterControl._heroAttribute = [];
individualCenterControl._heroAttributeCellSize = null;

individualCenterControl._heroItems = [];
individualCenterControl._heroItemSize = null;


/**
 * 获取Layer
 * */
individualCenterControl.getLayer = function(hero)
{
    individualCenterControl._hero = hero;
    if (!individualCenterControl._layer)
    {
        individualCenterControl._layer = new IndividualCenter();
        individualCenterControl._layer.retain();    // 防止被释放掉,我要让这货一直存在着
    }
    return individualCenterControl._layer;
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
    var backGround = new cc.LayerColor(cc.color(0,0,0), size.width -1, size.height-1);
    node.addChild(backGround);

    var icon = new cc.Sprite(attributeImageControl.getImage(data["key"].substring(1)));
    icon.setPosition(size.width * 0.1, size.height * 0.5);
    icon.setTag(100);
    node.addChild(icon);

    var keyName = new cc.LabelTTF(languageControl.getCurLanguage(data["key"].substring(1)) + ": ","",24);
    keyName.setPosition(size.width * 0.5, size.height * 0.5);
    keyName.setTag(101);
    node.addChild(keyName);

    var valueName = new cc.LabelTTF(data["value"],"",24);
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
    var data = individualCenterControl._heroItems[index];

    node._index = index;
    var backGround = new cc.LayerColor(cc.color(0,0,0), size.width -1, size.height-1);
    node.addChild(backGround);

    var icon = new cc.Sprite(data["_image"]);
    icon.setPosition(size.width * 0.5, size.height * 0.6);
    icon.setTag(100);
    node.addChild(icon);
    //

    var keyName = new cc.LabelTTF(languageControl.getCurLanguage(data["_key"]),"",24);
    keyName.setPosition(size.width * 0.5, size.height * 0.2);
    keyName.setTag(101);
    node.addChild(keyName);

    //
    // var valueName = new cc.LabelTTF(data["value"],"",24);
    // valueName.setPosition(size.width * 0.8, size.height * 0.5);
    // valueName.setTag(102);
    // node.addChild(valueName);
};

individualCenterControl.updateItemCell = function(node, index)
{
    if (node._index == index)
    {
        return;
    }
    // var icon = node.getChildByTag(100);
    // var keyName = node.getChildByTag(101);
    // var valueName = node.getChildByTag(102);
    //
    // var data = individualCenterControl._heroAttribute[index];
    // node._index = index;
    //
    // icon.setTexture(attributeImageControl.getImage(data["key"].substring(1)));
    // keyName.setString(languageControl.getCurLanguage(data["key"].substring(1)) + ": ");
    // valueName.setString(data["value"]);
};

individualCenterControl.touchItemCellCallBack = function(index, pSender)
{
    if(index >= individualCenterControl._heroItems.length)
    {
        console.log("没有道具");
        return;
    }

    var item = individualCenterControl._heroItems[index];
    var itemDetailsLayer = popItemDetailsControl.getLayer(item);
    cc.director.getRunningScene().addChild(itemDetailsLayer);

};