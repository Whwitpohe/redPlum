/**
 * Created by FanJiaHe on 2016/3/4.
 */

var itemControl = {};


itemControl._allItem = null;

/**
 * 初始化数据内容
 * */
itemControl.initItemData = function(dataBase)
{
    itemControl._allItem = sqlControl.getDataWithTable(dataBase, "item", function()
    {
        return new ItemData();
    });

    itemControl._allItem = globalApi.a2o(itemControl._allItem, "_itemId");
    return itemControl._allItem;
};

