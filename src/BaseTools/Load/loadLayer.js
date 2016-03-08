/**
 * Created by FanJiaHe on 2015/11/26.
 */
var LoadLayer = function()
{

};

LoadLayer.prototype._ndoe = null;

/**
 * 加载cocos2d jsonUI文件
 * @param {string} fileName 文件名
 * */
LoadLayer.load = function(fileName)
{
    var container = new LoadLayer();
    container.setNode(fileName);
    return container;
};

LoadLayer.seekWidgetByName = function(root, name)
{
    if (!root)
    {
        return null;
    }
    if (root.getName() == name)
    {
        return root;
    }
    var arrayRootChildren = root.getChildren();
    var length = arrayRootChildren.length;
    for (var i = 0; i < length; i++)
    {
        var child = arrayRootChildren[i];
        var res = LoadLayer.seekWidgetByName(child, name);
        if (res != null)
        {
            return res;
        }
    }
};

/**
 * 加载cocos2d jsonUI文件
 * @param {string} fileName 文件名
 * */
LoadLayer.prototype.setNode = function(fileName)
{
    this._node = ccs.load(fileName).node;
};

/**
 * 获取 Node
 * */
LoadLayer.prototype.getNode = function()
{
    return this._node;
};

/**
 * 根据名称查找某个节点
 * @param {string} elementName
 * */
LoadLayer.prototype.getElement = function(elementName)
{
    return LoadLayer.seekWidgetByName(this.getNode(), elementName);
};

/**
 * 显示在pSender之上
 * @param {object|*} pSender
 * */
LoadLayer.prototype.show = function(pSender)
{
    pSender.addChild(this.getNode());
};


/**
 * 消失
 * */
LoadLayer.prototype.disappear = function()
{
    this.getNode().removeFromParent();
};