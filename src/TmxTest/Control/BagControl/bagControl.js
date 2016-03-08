/**
 * Created by FanJiaHe on 2016/3/7.
 */

var bagControl = {};

bagControl._heroBag = null;

/**
 * 初始化数据内容
 * */
bagControl.initHeroBag = function(dataBase, heroIndex)
{
    bagControl._heroBag = sqlControl.getDataWithTable(dataBase, "bag", function()
    {
        return new BagData();
    }, "where gameId = " + heroIndex);

    bagControl._heroBag = bagControl._heroBag[0];
    return bagControl._heroBag;
};


bagControl.handleHeroBag = function(hero, heroBag)
{
    var allItems = itemControl._allItem;

    if (!allItems || !heroBag._bagCount || !heroBag._itemIndex || !heroBag._itemCount || heroBag._itemIndex.length != heroBag._itemCount.length)
    {
        console.log("什么都没有你让我计算什么 bagControl.handleHeroBag");
        return;
    }

    var itemIndex = JSON.parse(heroBag._itemIndex);
    var itemCount = JSON.parse(heroBag._itemCount);

    var bagItems = [];
    for (var count = 0; count < heroBag._bagCount; count++)
    {
        var curId = itemIndex[count];
        if (!(curId in allItems))
        {
            console.log("如果没有就跳过 bagControl.handleHeroBag");
            continue;
        }
        var curItem = new ItemData();
        globalApi.deepCopy(allItems[curId], curItem);
        curItem._count = itemCount[count];
        bagItems.push(curItem);
    }

    hero._bagItems = bagItems;
};
