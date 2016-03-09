/**
 * Created by FanJiaHe on 2016/3/9.
 */

var customPopMenu = {};

customPopMenu._menu = null;
customPopMenu._cellSize = null;
customPopMenu.initMenu = function()
{
    if (!customPopMenu._menu)
    {
        customPopMenu._menu = customPopMenu.getNewInstance();
    }
    return customPopMenu._menu;
};

/**
 * 创建新实例
 * */
customPopMenu.getNewInstance = function()
{
    customPopMenu._cellSize  = cc.size(150, 50);
    var expandMenu = ExpandMenu.getNewInstance(cc.p(0,0), ExpandMenu.actionType.RIGHT_DOWN, 1,
        customPopMenu._cellSize, ExpandMenu._directionType.VERTICAL);
    expandMenu._autoDisappear = true;
    expandMenu.retain();
    return expandMenu;
};


/**
 * 刷新选项
 * 选项请符合以下格式
 * [{"_title":xxx, "_callBack": xxx}]
 * @param {object} options 选项群
 * */
customPopMenu.refreshOption = function(options)
{
    if (!options || !(options instanceof Array) || !options.length )
    {
        console.log("刷新你妹的,我就不刷新");
        return;
    }

    // 删除多余的
    var itemLength = customPopMenu._menu.getListView().getItems().length;
    for(var itemCount = options.length; itemCount < itemLength; itemCount++)
    {
        customPopMenu._menu.getListView().removeItem(itemCount);
    }

    // 拼凑现在的
    for (var count = 0; count < options.length; count++)
    {
        var curOption = options[count];
        var title = curOption["_title"];
        var callBack = curOption["_callBack"];

        var originalItem = customPopMenu._menu.getListView().getItem(count);
        if (originalItem)
        {
            var advSprite = originalItem.getChildByTag(100);
            var label = advSprite.getChildByTag(100);
            label.setString(title);
            (function(callBack, originalItem)
            {
                advSprite.setCallBack(function()
                {
                    if (!originalItem._noDisappear)
                    {
                        customPopMenu._menu.disappear();
                    }
                    callBack();
                });
            })(callBack, originalItem);

        }else
        {
            (function(callBack)
            {
                var item = customPopMenu._menu.createItem(languageControl.getCurLanguage(title), true, function()
                {
                    callBack();
                }, null, false);
                customPopMenu._menu.getListView().pushBackCustomItem(item);
            })(callBack);
        }
    }

    // 重新设置下大小
    customPopMenu._menu.getListView().setContentSize(cc.size(customPopMenu._cellSize.width, customPopMenu._cellSize.height * count));
};

/**
 * 显示
 * */
customPopMenu.show = function(sender, position)
{
    var containerSize = sender.getContentSize();
    var listSize = customPopMenu._menu.getListView().getContentSize();
    var type = ExpandMenu.actionType.RIGHT_DOWN;
    if (containerSize.width > position.x + listSize.width && 0 < position.y - listSize.height)
    {
        type = ExpandMenu.actionType.RIGHT_DOWN;
    }else if (containerSize.width > position.x + listSize.width && 0 > position.y - listSize.height)
    {
        type = ExpandMenu.actionType.RIGHT_UP;
    }else if (containerSize.width < position.x + listSize.width && 0 < position.y - listSize.height)
    {
        type = ExpandMenu.actionType.LEFT_DOWN;
    }else if (containerSize.width < position.x + listSize.width && 0 > position.y - listSize.height)
    {
        type = ExpandMenu.actionType.LEFT_UP;
    }

    customPopMenu._menu.setAction(type);
    customPopMenu._menu.getListView().setLocalZOrder(10);
    customPopMenu._menu.getListView().setPosition(position);
    customPopMenu._menu.show(sender);
};