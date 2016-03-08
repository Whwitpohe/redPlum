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

    return bagControl._heroBag;
};


bagControl.handleHeroBag = function(hero, heroBag)
{
    var allItems = itemControl._allItem;

    if (!allItems || !heroBag || !heroBag.length)
    {
        console.log("什么都没有你让我计算什么 bagControl.handleHeroBag 0");
        return;
    }

    var tempHeroBagItems = {};
    for (var bagCount = 0; bagCount < heroBag.length; bagCount++)
    {
        var curBag = heroBag[bagCount];

        if (!curBag._bagCount || !curBag._itemIndex || !curBag._itemCount)
        {
            console.log("什么都没有你让我计算什么 bagControl.handleHeroBag 1");
            continue;
        }

        var itemIndex = JSON.parse(curBag._itemIndex);
        var itemCount = JSON.parse(curBag._itemCount);
        if (itemIndex.length != itemCount.length)
        {
            console.log("什么都没有你让我计算什么 bagControl.handleHeroBag 2");
            continue;
        }
        var bagItems = [];
        for (var count = 0; count < curBag._bagCount; count++)
        {
            var curId = itemIndex[count];
            if (!(curId in allItems))
            {
                console.log("如果没有就跳过 bagControl.handleHeroBag" + curId + "||" + JSON.stringify(itemIndex));
                continue;
            }
            var curItem = new ItemData();
            globalApi.deepCopy(allItems[curId], curItem);
            curItem._count = itemCount[count];
            bagItems.push(curItem);
        }

        tempHeroBagItems[curBag._bagType] = bagItems;
    }
    hero._bagItems = tempHeroBagItems;
};
