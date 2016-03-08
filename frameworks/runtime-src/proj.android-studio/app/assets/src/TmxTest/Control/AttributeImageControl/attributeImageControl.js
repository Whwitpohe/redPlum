/**
 * Created by FanJiaHe on 2016/3/4.
 */

var attributeImageControl = {};

attributeImageControl._attributeImageData = null;

/**
 * 初始化数据内容
 * */
attributeImageControl.initAttributeImage = function(dataBase)
{
    attributeImageControl._attributeImageData = sqlControl.getDataWithTable(dataBase, "image", function()
    {
        return new AttributeImageData();
    });

    attributeImageControl._attributeImageData = globalApi.a2o(attributeImageControl._attributeImageData, "_key");
    return attributeImageControl._attributeImageData;
};

/**
 * 获取当前key对应的图片
 * @param {string} key
 * */
attributeImageControl.getImage = function(key)
{
    var text = res.Default;
    try
    {
        if (key in attributeImageControl._attributeImageData)
        {
            text = attributeImageControl._attributeImageData[key]["_imagePath"];
        }
    } catch (e)
    {
        console.log("attributeImageControl.getImage  读取错误");
        text = res.Default;
    }
    return text;
};