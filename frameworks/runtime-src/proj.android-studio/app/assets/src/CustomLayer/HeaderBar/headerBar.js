/**
 * Created by FanJiaHe on 2015/11/27.
 */

var HeaderBar = function()
{

};

HeaderBar._type = {
    V_L: "res/HeaderBar.json",
    V_M: "V_M",
    V_S: "V_S",
    H_L: "res/crossHeaderBar.json",
    H_M: "res/crossHeaderBar_m.json",
    H_S: "res/crossHeaderBar_s.json",
    H_SS: "res/crossHeaderBar_ss.json"
};

HeaderBar.prototype._forwardCallBack = null;
HeaderBar.prototype._backwardCallBack = null;
HeaderBar.prototype._title = "";
HeaderBar.prototype._forwardText = "";
HeaderBar.prototype._backwardText = "";
HeaderBar.prototype._forwardPicture = "";
HeaderBar.prototype._backwardPicture = "";
HeaderBar.prototype._controlNode = null;
HeaderBar.prototype._layer = null;
HeaderBar.prototype._style = null;

/**
 * 创建顶边栏
 * @param {string} forwardText 前进按钮文字 位于顶边栏右方
 * @param {string} forwardPicture 前进按钮图片 位于顶边栏右方
 * @param {function} forwardCallBack 前进按钮回调
 * @param {string} title 标题文字 位于顶边栏中间
 * @param {string} backwardText 后退按钮文字 位于顶边栏左方
 * @param {string} backwardPicture 后退按钮图片 位于顶边栏左方
 * @param {function} backwardCallBack 后退按钮回调
 * @param {function} type 样式
 * */

HeaderBar.getNewInstance = function(forwardText, forwardPicture, forwardCallBack, title, backwardText, backwardPicture, backwardCallBack, type)
{
    if (arguments.length < 7)
    {
        logger.createTips("参数不够 HeaderBar.getNewInstance ");
        return;
    }
    var headerBar = new HeaderBar();
    headerBar._forwardText = forwardText;
    headerBar._forwardPicture = forwardPicture;
    headerBar._forwardCallBack = forwardCallBack;
    headerBar._title = title;
    headerBar._backwardText = backwardText;
    headerBar._backwardPicture = backwardPicture;
    headerBar._backwardCallBack = backwardCallBack;
    headerBar._style = type;
    headerBar.init();
    headerBar.binding();
    return headerBar;
};

/**
 * 显示在某一层面之上
 * */
HeaderBar.prototype.show = function(pSender)
{
    pSender.addChild(this._layer);
};


/**
 * 初始化
 * */
HeaderBar.prototype.init = function()
{
    var size = cc.winSize;
    this._controlNode =  LoadLayer.load(this._style || (size.width > size.height ? res.CrossHeaderBar_json : res.HeaderBar_json));
    this._layer = new cc.Layer(size.width, size.height * 0.12);
    this._layer.ignoreAnchorPointForPosition(false);
    this._layer.setPosition(size.width * 0.5, size.height * 0.5);
    size = this._layer.getContentSize();
    this._controlNode.getNode().setPosition(0, size.height -  this._controlNode.getNode().getContentSize().height);
    this._layer.addChild(this._controlNode.getNode());
};

/**
 * 设置背景
 * */
HeaderBar.prototype.setBackGround = function(fileName)
{
    if (!fileName)
    {
        return;
    }
    var backGround = this._controlNode.getElement("background");    // 背景
    backGround.setBackGroundImage(fileName);
};

/**
 * 设置标题
 * */
HeaderBar.prototype.setTitle = function(titleText)
{
    var title = this._controlNode.getElement("title");
    title.setString(titleText);
};


/**
 * 设置字体颜色
 * @param {cc.Color} color 颜色值
 * */
HeaderBar.prototype.setFontColor = function(color)
{
    var title = this._controlNode.getElement("title");  // 标题
    title.setColor(color);
};


/**
 * 设置回调
 * @param {function} forwardCallBack 前进回调
 * @param {function} backwardCallBack 后退回调
 * */
HeaderBar.prototype.setCallBack = function(forwardCallBack, backwardCallBack)
{
    this._forwardCallBack = forwardCallBack;
    this._backwardCallBack = backwardCallBack;
};

/**
 * 设置按钮禁用状态
 * @param {boolean} forwardEnable 是否启用
 * @param {boolean} backEnable 是否启用
 * */
HeaderBar.prototype.setButtonEnable = function(forwardEnable, backEnable)
{
    var forWard = this._controlNode.getElement("forward");    // 前进按钮
    var backWard = this._controlNode.getElement("backward");   // 后退按钮

    forWard.setTouchEnabled(forwardEnable);
    backWard.setTouchEnabled(backEnable);
};


/**
 * 设置按钮文字
 * @param {boolean} forwardText 前进回调
 * @param {boolean} backText 后退回调
 * */
HeaderBar.prototype.setButtonTitle = function(forwardText, backText)
{
    var forWard = this._controlNode.getElement("forward");    // 前进按钮
    var backWard = this._controlNode.getElement("backward");   // 后退按钮

    forWard.setTitleText(forwardText);
    backWard.setTitleText(backText);
};

/**
 * 设置按钮是否可见
 * @param {boolean} forwardFlag 前进回调
 * @param {boolean} backFlag 后退回调
 * */
HeaderBar.prototype.setButtonVisible = function(forwardFlag, backFlag)
{
    var forWard = this._controlNode.getElement("forward");    // 前进按钮
    var backWard = this._controlNode.getElement("backward");   // 后退按钮

    forWard.setVisible(forwardFlag);
    backWard.setVisible(backFlag);
};

/**
 * 设置贴图
 * @param {string} forwardPicture 前进回调
 * @param {string} backwardPicture 后退回调
 * */
HeaderBar.prototype.setNormalPicture = function(forwardPicture, backwardPicture)
{
    var backWard = this._controlNode.getElement("backward");   // 后退按钮
    var forWard = this._controlNode.getElement("forward");    // 前进按钮
    if(forwardPicture)
    {
        forWard.loadTextureNormal(forwardPicture);
    }
    if (backwardPicture)
    {
        backWard.loadTextureNormal(backwardPicture);
    }
};

/**
 * 设置按下之后的贴图
 * @param {string} forwardPicture 前进贴图
 * @param {string} backwardPicture 后退贴图
 * */
HeaderBar.prototype.setPressPicture = function(forwardPicture, backwardPicture)
{
    var backWard = this._controlNode.getElement("backward");   // 后退按钮
    var forWard = this._controlNode.getElement("forward");    // 前进按钮
    if(forwardPicture)
    {
        forWard.loadTexturePressed(forwardPicture);
    }
    if (backwardPicture)
    {
        backWard.loadTexturePressed(backwardPicture);
    }
};


/**
 * 绑定
 * */
HeaderBar.prototype.binding = function()
{
    var title = this._controlNode.getElement("title");  // 标题
    var backWard = this._controlNode.getElement("backward");   // 后退按钮
    var forWard = this._controlNode.getElement("forward");    // 前进按钮

    if (title)
    {
        title.setString(this._title);
    }

    if (backWard)
    {
        if (this._backwardPicture !== "")
        {
            backWard.loadTextureNormal(this._backwardPicture);
        }
        backWard.ignoreContentAdaptWithSize(true);
        backWard.setTitleText(this._backwardText);
        backWard.addTouchEventListener(this.backWardCallBack,this);
    }

    if (forWard)
    {
        if (this._forwardPicture !== "")
        {
            forWard.loadTextureNormal(this._forwardPicture);
        }
        forWard.setTitleText(this._forwardText);
        forWard.addTouchEventListener(this.forWardCallBack,this);
    }
};

/**
 * 后退回调
 * */
HeaderBar.prototype.backWardCallBack = function(sender, type)
{
    switch (type) {
        case ccui.Widget.TOUCH_BEGAN:
            break;

        case ccui.Widget.TOUCH_MOVED:
            break;

        case ccui.Widget.TOUCH_ENDED:
            this._backwardCallBack();
            break;

        case ccui.Widget.TOUCH_CANCELED:
            break;

        default:
            break;
    }
};

/**
 * 前进回调
 * */
HeaderBar.prototype.forWardCallBack = function(sender, type)
{
    switch (type) {
        case ccui.Widget.TOUCH_BEGAN:
            break;

        case ccui.Widget.TOUCH_MOVED:
            break;

        case ccui.Widget.TOUCH_ENDED:
            this._forwardCallBack();
            break;

        case ccui.Widget.TOUCH_CANCELED:
            break;

        default:
            break;
    }
};

/**
 * 获取layer
 * */
HeaderBar.prototype.getLayer = function()
{
    return this._layer;
};