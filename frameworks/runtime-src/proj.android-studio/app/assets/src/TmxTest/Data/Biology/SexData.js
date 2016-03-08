/**
 * Created by FanJiaHe on 2016/2/25.
 */

var sexControl = {};
sexControl._data = [];

/**
 * 获取数据库中sex类别
 * @param {object} dataBase 数据库对象
 * @param {boolean} isClearData 是否清空以前数据
 * */
sexControl.initData = function(dataBase, isClearData)
{
    if (!sexControl._data || !sexControl._data.length || isClearData)
    {
        sexControl._data = sqlControl.getDataWithTable(dataBase, "sex", function()
        {
            return new SexData();
        });
    }
    return sexControl._data;
};


var SexData = function()
{

};

SexData.prototype._idx =  null;
SexData.prototype._type =  null;
SexData.prototype._cn =  null;

SexData.prototype.getIndex = function()
{
    return this._idx;
};
