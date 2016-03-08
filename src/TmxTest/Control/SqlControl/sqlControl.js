/**
 * Created by FanJiaHe on 2016/2/25.
 */


var sqlControl = {};
sqlControl._db = [];

// 打开数据库
sqlControl.openSql = function(name)
{
    var newDataBase = globalApi.searchWithObjectInArray(sqlControl._db, "_name", name);
    if (!newDataBase)
    {
        newDataBase = new SqlData();
        newDataBase._name = name;
        newDataBase._db = new sql.SQLiteWrapper();
        newDataBase._path = newDataBase._db.initializing(name, "", "");
        var isOpen = newDataBase._db.open(newDataBase._path);
        if (isOpen)
        {
            sqlControl._db.push(newDataBase);
            console.log("加载完成,当前共有 " + sqlControl._db.length + " 个数据库");
        }
    }
    return newDataBase;
};



/**
 * 获取数据库中 某个表的所有数据
 * @param {object} dataBase 数据库对象
 * @param {string} tableName 表名
 * @param {function} newDataFunction 需要被转换成的数据格式
 * @param {string} screenSql 筛选语句
 * */
sqlControl.getDataWithTable = function(dataBase, tableName, newDataFunction, screenSql)
{
    try
    {
        var array = [];
        var dataArray = dataBase.getData("select * from " + tableName + " " + screenSql, tableName);
        if (dataArray)
        {
            for (var count = 0; count < dataArray.length; count ++)
            {
                var newData = newDataFunction();
                globalApi.toProgramData(dataArray[count], newData);
                array.push(newData);
                // console.log("sqlControl.dataArray -------------" + JSON.stringify(newData));
            }
        }
        return array;
    }catch (e)
    {
        console.log("------------------------------sqlControl.getGivenDataWithTable   出现错误");
        return [];
    }
};
//
// /**
//  * 获取数据库中 某个表的某条数据
//  * @param {object} dataBase 数据库对象
//  * @param {string} tableName 表名
//  * @param {function} newDataFunction 需要被转换成的数据格式
//  * @param {string} screenSql 筛选语句
//  * */
// sqlControl.getGivenDataWithTable = function(dataBase, tableName, newDataFunction, screenSql)
// {
//    try {
//        var array = [];
//        var dataArray = dataBase.getData("select * from " + tableName + " " + screenSql, tableName);
//        if (dataArray)
//        {
//            for (var count = 0; count < dataArray.length; count ++)
//            {
//                var newData = newDataFunction();
//                globalApi.toProgramData(dataArray[count], newData);
//                array.push(newData);
//                // console.log("sqlControl.dataArray -------------" + JSON.stringify(newData));
//            }
//        }
//        return array;
//    }catch (e)
//    {
//        console.log("------------------------------sqlControl.getGivenDataWithTable   出现错误");
//        return [];
//    }
// };