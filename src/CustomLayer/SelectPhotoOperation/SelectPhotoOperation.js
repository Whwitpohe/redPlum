/**
 * Created by FanJiaHe on 2015/12/17.
 */

var SelectPhotoOperation = function()
{

};

SelectPhotoOperation.prototype._callBack = null;
SelectPhotoOperation.prototype._layer = null;
SelectPhotoOperation.prototype._listener = null;
SelectPhotoOperation.prototype._customData = null;

/**
 * 创建新的 相册预览器
 * */
SelectPhotoOperation.getNewInstance = function()
{
    var layer = new SelectPhotoOperation();
    layer.initLayer();
    return layer;
};

/**
 * 设置自定义数据, 会回传回来的
 * */
SelectPhotoOperation.prototype.setCustomData = function(customData)
{
   this._customData = customData;
};


/**
 * 设置回调 执行完成后的回调
 * @param {function} callBack 回调
 * */
SelectPhotoOperation.prototype.setCallBack = function(callBack)
{
    this._callBack = callBack;
};

/**
 * 初始化界面
 * */
SelectPhotoOperation.prototype.initLayer = function()
{
    this._layer = LoadLayer.load(res.SelectPhotoOperation_json);

    var size = this._layer.getNode();
    if (!this._listener)
    {
        this._listener = globalApi.addCustomEvent("getPicture", this.receiveData, this._layer.getNode(), this);
    }

    var closeButton = this._layer.getElement("close");
    closeButton.addTouchEventListener(this.onClose, this);

    var selectLocalPhotoButton = this._layer.getElement("selectLocalPhoto");
    selectLocalPhotoButton.addTouchEventListener(this.onSelectLocalPhoto, this);

    var takePictureButton = this._layer.getElement("takePicture");
    takePictureButton.addTouchEventListener(this.onTakePicture, this);

    var mask = new cc.LayerColor(cc.color(0, 0, 0, 153));
    globalApi.swallowTouches(this._layer.getNode());

    mask.setPosition(0, size.height);
    this._layer.getNode().addChild(mask);
};

/**
 * 关闭更换图片操作框
 * */
SelectPhotoOperation.prototype.onClose = function(object, type)
{
    switch (type)
    {
        case ccui.Widget.TOUCH_BEGAN:
            break;
        case ccui.Widget.TOUCH_MOVED:
            break;
        case ccui.Widget.TOUCH_ENDED:
            this.disappear(null);
            break;
        case ccui.Widget.TOUCH_CANCELED:
            break;
        default:
    }
};

/**
 * 选择本地图片
 * */
SelectPhotoOperation.prototype.onSelectLocalPhoto = function(object, type)
{
    switch (type)
    {
        case ccui.Widget.TOUCH_BEGAN:
            break;
        case ccui.Widget.TOUCH_MOVED:
            break;
        case ccui.Widget.TOUCH_ENDED:
            // 选择本地图片
            nativeTool.selectPicture("getPicture");
            break;
        case ccui.Widget.TOUCH_CANCELED:
            break;
        default:
    }
};

/**
 * 选择拍照
 * */
SelectPhotoOperation.prototype.onTakePicture = function(object, type)
{
    switch (type)
    {
        case ccui.Widget.TOUCH_BEGAN:
            break;
        case ccui.Widget.TOUCH_MOVED:
            break;
        case ccui.Widget.TOUCH_ENDED:
            nativeTool.takePicture("getPicture");
            break;
        case ccui.Widget.TOUCH_CANCELED:
            break;
        default:
    }
};

/**
 * 接收数据
 * */
SelectPhotoOperation.prototype.receiveData = function(event, sender)
{
    if (event.getUserData())
    {
        sender.disappear(event.getUserData());
    }
};

/**
 * 显示在pSender之上
 * @param {object} pSender
 * */
SelectPhotoOperation.prototype.show = function(pSender)
{
    this._layer.getNode().setPosition(0, 0 - this._layer.getNode().getContentSize().height);
    this._layer.show(pSender);
    var moveTo = cc.moveTo(0.5, 0, 0);
    var animation = new cc.EaseElasticInOut(moveTo, 1);
    this._layer.getNode().runAction(animation);
};

/**
 * 消失,释放资源什么的以及传输接收到的数据
 * @param {string || object} fileName 文件名
 * */
SelectPhotoOperation.prototype.disappear = function(fileName)
{
    var moveTo = cc.moveTo(0.5, 0, 0 - this._layer.getNode().getContentSize().height);
    var animation = new cc.EaseElasticInOut(moveTo, 1);

    var self = this;
    var seqAc = new cc.Sequence(animation, new cc.CallFunc(function()
    {
        if (self._callBack)
        {
            self._callBack(fileName, self._customData);
        }
        self._layer.getNode().removeFromParent();
        cc.eventManager.removeListener(self._listener);
        self._listener = null;
        self._layer = null;
        self = null;
    }));
    this._layer.getNode().runAction(seqAc);
};