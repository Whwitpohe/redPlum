/**
 * Created by FanJiaHe on 2015/11/9.
 */
var fileOperation = {};

/**
 * 写log到文件
 * @param {string|object|number|bool} log  想要被打印的日志文字或者对象
 * */
fileOperation.writeLog = function(log)
{
    var myDate = new Date();
    var myTime = myDate.toLocaleString();     //获取当前时间
    if (typeof log == "object")
    {
        myTime += JSON.stringify(log);
    }else
    {
        myTime += String(log);
    }
    jsb.fileUtils.writeStringToFile(myTime, fileOperation.getFullPath("log.txt", true));
};

/**
 * 获取文件完整路径
 * @param {string} fileName 文件名
 * @param {boolean} noCheck 是否检查
 * */
fileOperation.getFullPath = function(fileName, noCheck)
{
    if (!fileName || fileName == "")
    {
        return  null;
    }
    var fullPath = jsb.fileUtils.getWritablePath() + (fileName || "");
    if (jsb.fileUtils.isFileExist(fileName))
    {
        return  jsb.fileUtils.fullPathForFilename(fileName);
    }
    if (jsb.fileUtils.isFileExist(fullPath))
    {
        return  fullPath;
    }else if (noCheck)
    {
        return  fullPath;
    }else
    {
        return  null;
    }
};

/**
 * 获取本地数据库中key对应的value(JsonData类型)
 * @param {string} key 关键字
 * */
fileOperation.getItem = function(key)
{
    var jsonData = null;
    if (cc.sys.localStorage.getItem(key))
    {
        jsonData = JSON.parse(cc.sys.localStorage.getItem(key));
    }
    return jsonData;
};


/**
 * 传入网址,转换成本地路径
 * @param {string} fileName 原路径名文件名
 * */
fileOperation.TransformationLocalPhoto = function(fileName)
{
    var pos = fileName.indexOf("/repos/1/uploads");
    var newFileName = fileName;
    if (pos != -1)
    {
        newFileName = null;
    }

    return newFileName;
};


/**
 * 文件拷贝
 * @param {string} oldFileNamePath 旧文件路径
 * @param {string} newFileName 新文件名
 * */
fileOperation.copyFile = function(oldFileNamePath, newFileName)
{
    console.log("lkasjdasidujoiasljdlsa" + oldFileNamePath);
    var imgStr = jsb.fileUtils.getDataFromFile(oldFileNamePath);
    if (imgStr)
    {
        console.log("图片读取成功");
        if (jsb.fileUtils.writeDataToFile(imgStr, fileOperation.getFullPath(newFileName, true)))
        {
            console.log("图片存储成功");
        }
    }
    return fileOperation.getFullPath(newFileName, true);
};
