/**
 * Created by FanJiaHe on 2015/12/20.
 */

/**
 * 弹出框
 * */
var PopUpBox = function()
{

};

PopUpBox.prototype._title = "";
PopUpBox.prototype._title2 = "";
PopUpBox.prototype._confirmText = "";
PopUpBox.prototype._callBack = null;
PopUpBox.prototype._rightCallBack = null;
PopUpBox.prototype._rightText = "";
PopUpBox.prototype._type = null;
PopUpBox.prototype._content = "";
PopUpBox.prototype._color = "";
PopUpBox.prototype._layer = null;
PopUpBox.prototype._backGround = null;
PopUpBox.prototype._percentageA = null;
PopUpBox.prototype._percentageB = null;
PopUpBox.prototype._percentA = 0;
PopUpBox.prototype._slider = null;

/**
 * 获取一个新的实例
 * */
PopUpBox.getNewInstance = function(title, content, confirmText, callBack, color, rightText, rightCallBack, title2, type)
{
    var popUpBox = new PopUpBox();
    popUpBox._title = title || "提示";
    popUpBox._content = content || "";
    popUpBox._callBack = callBack || null;
    popUpBox._confirmText = confirmText || "确认";
    popUpBox._color = color || cc.color(240, 240, 240);

    popUpBox._rightCallBack = rightCallBack || null;
    popUpBox._type = type || 1;
    popUpBox._title2 = title2 || "";
    popUpBox._rightText = rightText || "";
    popUpBox.initLayer();
    return popUpBox;
};

/**
 * 初始化
 * */
PopUpBox.prototype.initLayer = function()
{
    if (this._type == 1)
    {
        this._layer = LoadLayer.load(res.PopUpBox);
        if (cc.winSize.width > cc.winSize.height)
        {
            this._layer = LoadLayer.load(res.PopUpBox_cross);
        }
    } else if (this._type == 2)
    {
        this._layer = LoadLayer.load(res.PopUpBox_option);
    } else if (this._type == 3)
    {
        this._layer = LoadLayer.load(res.PopUpBox_slider);
    }

    var self = this;
    var mask = self._layer.getElement("mask");
    // 高斯模糊
    //globalApi.getGaussianBlur(function(spriteBlur)
    //{
    //    self._backGround = spriteBlur;
    //    var size = self._layer.getNode().getContentSize();
    //    self._backGround.setLocalZOrder(-1);
    //    self._backGround.setPosition(size.width * 0.5, size.height * 0.5);
    //    mask.addChild(self._backGround);
    //    self._backGround.setTexture(spriteBlur.getTexture());
    //});

    // 关闭按钮
    var closeButton = this._layer.getElement("close");
    closeButton.addTouchEventListener(this.onClose, this);


    // 不同类型下不同的布局
    switch (this._type)
    {
        case 1:
        {
            // 内容颜色
            var content = this._layer.getElement("content");
            content.setString(this._content);
            content.setColor(this._color);

            // 确认按钮
            var confirmButton = this._layer.getElement("confirm");
            confirmButton.addTouchEventListener(this.onClicked, this);
            confirmButton.setTitleText(this._confirmText);
            break;
        }
        case 2:
        {
            // 确认按钮
            var leftButton = this._layer.getElement("leftButton");
            leftButton.addTouchEventListener(this.onClicked, this);
            leftButton.setTitleText(this._confirmText);

            var rightButton = this._layer.getElement("rightButton");
            rightButton.addTouchEventListener(this.onClicked, this);
            rightButton.setTitleText(this._rightText);
            break;
        }
        case 3:
        {
            // 确认按钮
            var confirmButton2 = this._layer.getElement("confirm");
            confirmButton2.addTouchEventListener(this.onClicked, this);
            confirmButton2.setTitleText(this._confirmText);

            // 标题
            var title2 = this._layer.getElement("title2");
            title2.setString(this._title2);

            this._percentageA = this._layer.getElement("percentageA");
            this._percentageB = this._layer.getElement("percentageB");

            var backGround = this._layer.getElement("background");
            var size = backGround.getContentSize();
            this._slider = new ccui.Slider();
            this._slider.setTouchEnabled(true);
            this._slider.loadBarTexture(res.MaskBlack);
            this._slider.loadSlidBallTextures(res.SliderThumb, res.SliderThumb_P, "");
            //this._slider.loadProgressBarTexture(res.SliderGray);MaskBlack
            this._slider.loadProgressBarTexture(res.MaskBlack);
            this._slider.setPosition(size.width * 0.5, size.height * 0.5);
            this._slider.addEventListener(this.sliderEvent, this);
            backGround.addChild(this._slider);

            this._slider.setScaleY(4);
            this._slider.setPercent(this._percentA);
            this._percentageA.setString(this._percentA + "%");
            this._percentageB.setString((100 - this._percentA) + "%");
            break;
        }

        default:
        {
            break;
        }
    }


    // 标题
    var title = this._layer.getElement("title");
    title.setString(this._title);
};

/**
 * 滑块事件
 * */
PopUpBox.prototype.sliderEvent = function(sender, type)
{
    switch (type)
    {
        case ccui.Slider.EVENT_PERCENT_CHANGED:
            var slider = sender;
            var percent = slider.getPercent();
            this._percentA = percent;
            this.updatePercentage();
            break;
        default:
            break;
    }
};

/**
 * 更新滑动条和滑动参数
 * */
PopUpBox.prototype.updatePercentage = function()
{
    if (this._percentA < 50)
    {

        //this._slider.loadBarTexture(res.SliderBlue);
        //this._slider.loadProgressBarTexture(res.SliderGray);
        this._slider.loadBarTexture(res.MaskBlack);
        this._slider.loadProgressBarTexture(res.MaskBlack);
    } else
    {
        //this._slider.loadBarTexture(res.SliderGray);
        //this._slider.loadProgressBarTexture(res.SliderBlue);

        this._slider.loadBarTexture(res.MaskBlack);
        this._slider.loadProgressBarTexture(res.MaskBlack);
    }
    this._percentageA.setString(this._percentA.toFixed(0) + "%");
    this._percentageB.setString((100 - this._percentA.toFixed(0)) + "%");
};

/**
 * 手动更新视图
 * */
PopUpBox.prototype.updateView = function(percent)
{
    this._percentA = percent;
    this._slider.setPercent(percent);
    this.updatePercentage();
};


/**
 * 执行回调
 * */
PopUpBox.prototype.onClicked = function(object, type)
{
    switch (type)
    {
        case ccui.Widget.TOUCH_BEGAN:
            break;
        case ccui.Widget.TOUCH_MOVED:
            break;
        case ccui.Widget.TOUCH_ENDED:
        {
            this.disappear();
            switch (object.getName())
            {
                case  "leftButton":
                case "confirm":
                {
                    if (this._callBack)
                    {
                        this._callBack(this._percentA);
                    }
                    break;
                }
                case "rightButton":
                {
                    if (this._rightCallBack)
                    {
                        this._rightCallBack();
                    }
                    break;
                }
            }
            break;
        }
        case ccui.Widget.TOUCH_CANCELED:
            break;
        default:
    }
};

/**
 * 关闭
 * */
PopUpBox.prototype.onClose = function(object, type)
{
    switch (type)
    {
        case ccui.Widget.TOUCH_BEGAN:
            break;
        case ccui.Widget.TOUCH_MOVED:
            break;
        case ccui.Widget.TOUCH_ENDED:
        {
            this.disappear();
            break;
        }
        case ccui.Widget.TOUCH_CANCELED:
            break;
        default:
    }
};


/**
 * 显示在pSender之上
 * @param {object} pSender
 * */
PopUpBox.prototype.show = function(pSender)
{
    var self = this;
    this._layer.show(pSender);

    // 高斯模糊
    //if (this._type == 1)
    //{
    //    this._layer.getNode().schedule(function()
    //    {
    //        var mask = self._layer.getElement("mask");
    //        mask.setVisible(false);
    //        globalApi.getGaussianBlur(function(spriteBlur)
    //        {
    //            mask.setVisible(true);
    //            if (self._backGround)
    //            {
    //                self._backGround.setTexture(spriteBlur.getTexture());
    //            } else
    //            {
    //                self._backGround = spriteBlur;
    //                var size = self._layer.getNode().getContentSize();
    //                self._backGround.setLocalZOrder(-1);
    //                self._backGround.setPosition(size.width * 0.5, size.height * 0.5);
    //                mask.addChild(self._backGround);
    //                self._backGround.setTexture(spriteBlur.getTexture());
    //            }
    //        })
    //    }, 0.5, 2);
    //}else
    //{
    //}
};

/**
 * 消失
 * */
PopUpBox.prototype.disappear = function()
{
    this._layer.disappear();
};


