/**
 * Created by FanJiaHe on 2015/12/14.
 */

var EditLayer = function()
{

};

EditLayer.prototype._editBox = null;
EditLayer.prototype._callBack = null;
EditLayer.prototype._layer = null;
EditLayer.prototype._text = null;
EditLayer.prototype._title = null;
EditLayer.prototype._type = null;
EditLayer.prototype._maxLength = 0;
EditLayer.prototype._regularChange = null;
EditLayer.prototype._regularEnd = null;
/**
 * 创建一个编辑界面
 * @param {string} title 标题
 * @param {string} originalText 初始字符
 * @param {string} type 输入框输入类型
 * @param {number} maxLength 最大输入字符
 * */
EditLayer.getNewInstance = function(title, originalText, type, maxLength)
{
    var editLayer = new EditLayer();
    editLayer._text = originalText || "";
    editLayer._title = title || "编辑";
    editLayer._type = type;
    editLayer._maxLength = maxLength || 255;
    editLayer.initLayer();
    return editLayer;
};


/**
 * 设置正则表达式,用于输入
 * @param {object || function || string} regularChange 正则表达式,用于输入时的验证
 * @param {object || function || string} regularEnd 正则表达式,用于输入完成的验证
 * */
EditLayer.prototype.setRegular = function(regularChange, regularEnd)
{
    this._regularChange = regularChange;
    this._regularEnd = regularEnd;
};
/**
 * 初始化界面
 * */
EditLayer.prototype.initLayer = function()
{
    var size = cc.winSize;
    this._layer = LoadLayer.load(res.EditLayer_json);

    var edit_Layer = this._layer.getElement("edit_Layer");
    edit_Layer.setContentSize(size);
    // 遮罩
    var mask = this._layer.getElement("mask");
    mask.setContentSize(size);
    mask.setPosition(size.width * 0.5, size.height * 0.5);

    // 输入框背景
    var editLayer = this._layer.getElement("edit_PopWindow");
    editLayer.setPosition(size.width * 0.5, size.height * 0.5);

    // 输入框
    var editBoxBackGround = this._layer.getElement("input");
    var editBoxBackGroundSize = editBoxBackGround.getContentSize();
    var editBox = new cc.EditBox(cc.size(editBoxBackGroundSize.width *
                                         0.9, editBoxBackGroundSize.height), new cc.Scale9Sprite(res.EditBoxTransparent));
    editBox.setOpacity(0);
    editBox.setFontSize(48);
    editBox.setTag(1);
    editBox.setFontColor(cc.color(255, 255, 255));
    editBox.setDelegate(this);
    switch (this._type)
    {
        case "text":
        {
            editBox.setInputMode(cc.EDITBOX_INPUT_MODE_ANY);
            break;
        }
        case "number":
        {
            editBox.setInputMode(cc.EDITBOX_INPUT_MODE_NUMERIC);
            break;
        }
        case "idCardNo":
        {
            editBox.setInputMode(cc.EDITBOX_INPUT_MODE_EMAILADDR);
            editBox.myType = "idCardNo";
            break
        }
        default:
        {
            editBox.setInputMode(cc.EDITBOX_INPUT_MODE_ANY);
            break;
        }
    }
    editBox.setReturnType(cc.KEYBOARD_RETURNTYPE_DONE);
    editBox.setPosition(editBoxBackGround.getPosition());
    editBox.setString(this._text);
    editBox.setMaxLength(this._maxLength);
    editLayer.addChild(editBox);

    // 确认按钮
    var confirm = this._layer.getElement("btn_confirm");
    confirm.addTouchEventListener(this.onConfirm, this);

    // 关闭按钮
    var onClose = this._layer.getElement("btn_close");
    onClose.addTouchEventListener(this.onClose, this);

    // 标题
    var title = this._layer.getElement("headline");
    title.setString(this._title.substr(0, 9));
};

/**
 * 设置执行完成回调
 * @param {function} callBack 回调
 * */
EditLayer.prototype.setCallBack = function(callBack)
{
    this._callBack = callBack;
};


/**
 * 输入开始
 * */
EditLayer.prototype.editBoxEditingDidBegin = function(editBox)
{
    //logger.createTips("begin" + editBox.getTag());
};

/**
 * 输入结束
 * */
EditLayer.prototype.editBoxEditingDidEnd = function(editBox)
{
    //logger.createTips("end" + editBox.getTag());
};

/**
 * 正在输入
 * */
EditLayer.prototype.editBoxTextChanged = function(editBox, str)
{
    // 删除空格
    var string = str.replace(/\s/, "");

    var canInput = true;
    // 特殊格式
    if (this._regularChange)
    {
        canInput = this._regularChange.test(string);
        if (!canInput)
        {
            string = string.substr(0, string.length - 1);
        }
    }

    if (string != str)
    {
        editBox.setString(string);
    }
    this._text = string;
};

/**
 * 按下return
 * */
EditLayer.prototype.editBoxReturn = function(editBox)
{
    //logger.createTips("return" + editBox.getTag());
};

/**
 * 确认按钮回调
 * */
EditLayer.prototype.onConfirm = function(object, type)
{
    switch (type)
    {
        case ccui.Widget.TOUCH_BEGAN:
            break;
        case ccui.Widget.TOUCH_MOVED:
            break;
        case ccui.Widget.TOUCH_ENDED:
        {
            if (this.checkText())
            {
                this._layer.getElement("btn_confirm").setTouchEnabled(false);
                if (this._callBack)
                {
                    this._callBack(this._text);
                }
                this.disappear();
            }
            break;
        }
        case ccui.Widget.TOUCH_CANCELED:
            break;
        default:
    }
};

/**
 * 判定输入是否满足条件
 * */
EditLayer.prototype.checkText = function()
{
    var ret = 1;
    if (this._regularEnd)
    {
        var canInput = this._regularEnd.test(this._text);
        logger.createTips(this._text);
        if (!canInput)
        {
            var moveBy = cc.moveBy(0.05, -20, 20);
            var seqAc = cc.sequence(moveBy, moveBy.reverse());
            var rep = cc.repeat(seqAc, 3);
            this._layer.getElement("edit_PopWindow").runAction(rep);
            logger.createTips("输入错误,请重新输入");
            ret = 0;
        }
    }
    return ret;
};

/**
 * 关闭按钮回调
 * */
EditLayer.prototype.onClose = function(object, type)
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
 * 显示在某个pSender之上
 * @param {object} pSender
 * */
EditLayer.prototype.show = function(pSender)
{
    var editLayer = this._layer.getElement("edit_PopWindow");
    editLayer.setPositionX(-editLayer.getContentSize().width);
    var moveTo = new cc.moveTo(1, this._layer.getNode().getContentSize().width * 0.5, editLayer.getPositionY());

    var easeElasticOut = new cc.EaseElasticOut(moveTo, 0.5);
    editLayer.runAction(easeElasticOut);
    this._layer.show(pSender);
};

EditLayer.prototype.disappear = function()
{
    var editLayer = this._layer.getElement("edit_PopWindow");
    var moveTo = new cc.moveTo(0.8, this._layer.getNode().getContentSize().width * 1.5, editLayer.getPositionY());
    var easeElasticIn = new cc.EaseElasticIn(moveTo, 0.5);
    var self = this;
    var seqAc = new cc.Sequence(easeElasticIn, new cc.CallFunc(function()
    {
        self._layer.disappear();
    }));
    editLayer.runAction(seqAc);
};