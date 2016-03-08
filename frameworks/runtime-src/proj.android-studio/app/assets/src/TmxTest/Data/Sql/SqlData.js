/**
 * Created by FanJiaHe on 2016/2/25.
 */

var SqlData = function()
{

};


SqlData.prototype._name = null;
SqlData.prototype._db = null;
SqlData.prototype._path = null;




/**
 * 获取数据
 * @param {string} sqlCommand sql语句
 * @param {string} tableName 表名
 * */
SqlData.prototype.getData = function(sqlCommand, tableName)
{
    var tableInfo = this.desc(tableName);
    var tempSt = this._db.statement(sqlCommand);

    var array = [];
    while (tempSt && tempSt.nextRow())
    {
        var newObject = {};
        for (var count = 0; count < tableInfo.length; count++)
        {
            var keyName = tableInfo[count];
            newObject[keyName] = tempSt.valueString(count);
        }
        array.push(newObject);
    }

    return array;
};



/**
 * 查询数据库所有字段名
 * @param {string} tableName 表名
 * */
SqlData.prototype.desc = function(tableName)
{
    var tempSt = this._db.statement("pragma table_info ( "+ tableName + ")");
    var array = [];
    while (tempSt.nextRow())
    {
        // var tableInfo = {};
        // tableInfo.cid = (tempSt.valueString(0));
        // tableInfo.name = tempSt.valueString(1);
        // tableInfo.type = tempSt.valueString(2);
        // array.push(tableInfo);
        array.push(tempSt.valueString(1));
    }
    return array;
} ;