/**
 * Created by FanJiaHe on 2015/11/11.
 */

var imageOperation = {};

imageOperation.type = {
    CIRCLE: 0,
    HEART: 1,
    SQUARE: 2,
    SQUARE120PX: 3,
    HEAD: 4
};
imageOperation.mask = {
    CIRCLE: "res/Mask/Mask_Circle.png",
    HEART: "res/Mask/Mask_Heart.png",
    SQUARE: "res/Mask/Mask_Square.png",
    SQUARE120PX: "res/Mask/Mask_Square120px.png",
    HEAD: "res/Mask/Mask_Head.png"
};

/**
 * 通过类型来获取遮罩图片
 * @param {number|imageOperation.type.} type
 * */
imageOperation.getMask = function(type)
{
    var maskFileName = "";
    switch (type)
    {
        case this.type.CIRCLE:
            maskFileName = this.mask.CIRCLE;
            break;
        case this.type.HEART:
            maskFileName = this.mask.HEART;
            break;
        case this.type.SQUARE:
            maskFileName = this.mask.SQUARE;
            break;
        case this.type.SQUARE120PX:
            maskFileName = this.mask.SQUARE120PX;
            break;
        case this.type.HEAD:
            maskFileName = this.mask.HEAD;
            break;
        default:
            maskFileName = this.mask.CIRCLE;
            break;
    }
    return maskFileName;
};

/**
 * @param {string}  fileName  图片路径
 * @param {imageOperation.type.} type   类型
 * @param {number} idx 当使用TableView时, idx为Cell的idx值
 * @param {title} name 按钮名字
 * @param {function} callBack 回调函数
 * @param {object} pSender 添加button的父控件
 * */
imageOperation.makeCutButton = function(fileName, type, idx, name, callBack, pSender)
{
    var button = ccui.Button(fileName);
    button.addTouchEventListener(callBack, pSender);
    button.setName(name);
    button.setTag(idx);
    var maskFileName = this.getMask(type);
    var maskSprite = new cc.Sprite(maskFileName);
    var stencil = new cc.Node();
    stencil.addChild(maskSprite);
    var clippingNode = new cc.ClippingNode(stencil);
    clippingNode.setInverted(false);
    clippingNode.setAlphaThreshold(0);
    clippingNode.addChild(button);

    button._toSize = maskSprite.getContentSize();
    var oldSize = button.getContentSize();
    var newSize = maskSprite.getContentSize();
    var scaleX = newSize.width / oldSize.width;
    var scaleY = newSize.height / oldSize.height;
    button.setScale((scaleX > scaleY ? scaleX : scaleY));

    return clippingNode;
};


/**
 * @param {string}  fileName  图片路径
 * @param {imageOperation.type.} type   类型
 * @param {function} callBack 点击回调
 * */
imageOperation.makeCutSprite = function(fileName, type, callBack)
{
    var textureSprite = new AdvSprite(fileName);
    textureSprite.setCallBack(callBack);
    textureSprite.setTag(1);
    var maskFileName = this.getMask(type);
    var maskSprite = new cc.Sprite(maskFileName);
    var stencil = new cc.Node();
    stencil.addChild(maskSprite);
    var clippingNode = new cc.ClippingNode(stencil);
    clippingNode.setInverted(false);
    clippingNode.setAlphaThreshold(0);
    clippingNode.addChild(textureSprite);

    textureSprite._toSize = maskSprite.getContentSize();
    var oldSize = textureSprite.getContentSize();
    var newSize = maskSprite.getContentSize();
    var scaleX = newSize.width / oldSize.width;
    var scaleY = newSize.height / oldSize.height;
    textureSprite.setScale((scaleX > scaleY ? scaleX : scaleY));

    return clippingNode;
};
