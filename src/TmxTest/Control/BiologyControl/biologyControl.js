/**
 * Created by FanJiaHe on 2016/2/25.
 */

var biologyControl = {};

biologyControl._allBiology = null;

/**
 * 获取新的实例
 * */
biologyControl.getNewInstance = function(dataBase, index)
{
    var data = sqlControl.getDataWithTable(dataBase, "biology", function()
    {
        return new BiologyData();
    }, "where idx = " + index);
    return data[0];
};


