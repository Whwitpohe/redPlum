/**
 * Created by FanJiaHe on 2016/3/4.
 */

var languageControl = {};

languageControl._languageData = null;
languageControl._curLanguageCode = "_cn";

/**
 * 初始化数据内容
 * */
languageControl.initLanguage = function(dataBase)
{
    languageControl._languageData = sqlControl.getDataWithTable(dataBase, "language", function()
    {
        return new LanguageData();
    });

    languageControl._languageData = globalApi.a2o(languageControl._languageData, "_key");
    return languageControl._languageData;
};

/**
 * 获取当前语种的翻译
 * @param {string} key
 * */
languageControl.getCurLanguage = function(key)
{
    var text = key;
    try
    {
        if (key in languageControl._languageData)
        {
            text = languageControl._languageData[key][languageControl._curLanguageCode];
        }
    } catch (e)
    {
        console.log("languageControl.getCurLanguage  读取错误");
        text = key;
    }
    return text;
};

