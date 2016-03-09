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

/**
 * 使用道具
 * @param {ItemData} item 道具
 * @param {BiologyData} hero 使用对象
 * */
itemControl.useItem = function(item,hero)
{
    console.log("使用道具" + languageControl.getCurLanguage(item._key));
};

/**
 * 出售道具
 * @param {ItemData} item 道具
 * @param {BiologyData} hero 使用对象
 * */
itemControl.sellItem = function(item, hero)
{
    console.log("出售道具" + languageControl.getCurLanguage(item._key));

    hero._gold = Number(hero._gold) + Number(item._gold);
    item._count = Number(item._count) - 1;
};