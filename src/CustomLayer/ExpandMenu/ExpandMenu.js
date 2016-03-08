/**
 * Created by FanJiaHe on 2015/12/4.
 */

var ExpandMenu = function()
{
};
ExpandMenu.actionType = {
    LEFT_UP: 1,
    RIGHT_UP: 2,
    LEFT_DOWN: 3,
    RIGHT_DOWN: 4
};

ExpandMenu.prototype._listView = null;
ExpandMenu.prototype._size = null;
ExpandMenu.prototype._count = null;
ExpandMenu.prototype._position = null;
ExpandMenu.prototype._animationType = null;
ExpandMenu.prototype._itemCount = 0;
ExpandMenu.prototype._listener = null;
ExpandMenu.prototype._disappearCallBack = null;

/**
 * 创建一个拓展菜单
 * @param {cc.Point} position 显示位置
 * @param {ExpandMenu.actionType.} actionType 出场的动画
 * @param {number} count 设置多少个item
 * @param {cc.Size} size 设置框框占用多大位置
 * */
ExpandMenu.getNewInstance = function(position, actionType, count, size)
{
    if (arguments.length < 2)
    {
        logger.createTips("参数不可以少于两个");
        return null;
    }

    var expandMenu = new ExpandMenu();
    expandMenu._size = size || cc.size(229, 76 * (count || 4));
    expandMenu._count = count || 4;
    expandMenu._position = position;
    expandMenu._animationType = actionType;
    expandMenu.initLayer();
    expandMenu.setAction();

    return expandMenu;
};

ExpandMenu.prototype.initLayer = function()
{
    this._listView = new ccui.ListView();
    this._listView.setDirection(ccui.ScrollView.DIR_VERTICAL);    // 无方向滑动,就是两个方向
    this._listView.setScrollBarEnabled(false);    // 设置滑动状态栏是否显示
    this._listView.setTouchEnabled(true);       // 设置触摸是否启用
    this._listView.setBounceEnabled(true);   // 设置反弹是否启用 滑动启用
    this._listView.setBackGroundImage(res.ExpandMenuDefaultBackGround);  // 背景图
    this._listView.setBackGroundImageScale9Enabled(true); // 是否是九宫图
    this._listView.setContentSize(this._size);
    this._listView.setPosition(this._position);
    this._listView.setScale(0.1);

    this._listener = cc.EventListener.create({
        event: cc.EventListener.TOUCH_ONE_BY_ONE,
        swallowTouches: true,
        onTouchBegan: this.onTouchBegan.bind(this),
        onTouchEnded: this.onTouchEnded.bind(this)
    });
    cc.eventManager.addListener(this._listener, -1);
};

ExpandMenu.prototype.onTouchBegan = function(touch, event)
{
    var target = this._listView;
    var pos = target.getParent().convertTouchToNodeSpace(touch);   // 世界坐标转换 (子节点相对于父节点的位置)

    if (!cc.rectContainsPoint(target.getBoundingBox(), pos))
    {
        return true;
    }
    return false;
};


ExpandMenu.prototype.onTouchEnded = function(touch, event)
{
    var target = this._listView;
    var pos = target.getParent().convertTouchToNodeSpace(touch);   // 世界坐标转换 (子节点相对于父节点的位置)

    if (!cc.rectContainsPoint(target.getBoundingBox(), pos))
    {
        this.disappear();
        return true;
    }
    return false;
};


/**
 * 添加自定义item
 * @param {string} text 文字
 * @param {boolean} isEnable 是否启用
 * @param {function} callBack   回调
 * @param {string} fileName 文件名
 * */
ExpandMenu.prototype.pushBackItem = function(text, isEnable, callBack, fileName)
{
    this._itemCount++;
    var lblLayer = new ccui.Layout();
    lblLayer.setContentSize(cc.size(this._size.width, this._size.height / this._count));

    var buttonSp = new AdvSprite(fileName || res.menuItemGrey);
    buttonSp.setTextureRect(cc.rect(0, 0, this._size.width, this._size.height / this._count));
    buttonSp.setPosition(lblLayer.getContentSize().width * 0.5, lblLayer.getContentSize().height * 0.5);
    buttonSp.setMaxOffset(10);
    buttonSp.setEnable(isEnable);
    var self = this;
    buttonSp.setCallBack(function()
    {
        self.disappear();
        callBack();
    });
    lblLayer.addChild(buttonSp);

    var label = new cc.LabelTTF(text);
    label.setFontSize(24);
    label.setColor(cc.color(250, 250, 250));
    label.setPosition(buttonSp.getContentSize().width * 0.5, buttonSp.getContentSize().height * 0.5);
    buttonSp.addChild(label);

    var line = new ccui.Scale9Sprite(res.Point);
    line.setPreferredSize(cc.size(this._size.width, 2.5));
    line.setPosition(lblLayer.getContentSize().width * 0.5, 0);
    lblLayer.addChild(line);

    this._listView.pushBackCustomItem(lblLayer);
    this._listView.setGravity(ccui.ListView.GRAVITY_CENTER_VERTICAL);
};

/**
 * 设置动作产生的位置和动作
 * */
ExpandMenu.prototype.setAction = function()
{
    var anchorX = 0.5;
    var anchorY = 0.5;
    switch (this._animationType)
    {
        case ExpandMenu.actionType.LEFT_UP:
        {
            anchorX = 1;
            anchorY = 0;
            break;
        }
        case ExpandMenu.actionType.LEFT_DOWN:
        {
            anchorX = 1;
            anchorY = 1;
            break;
        }
        case ExpandMenu.actionType.RIGHT_UP:
        {
            anchorX = 0;
            anchorY = 0;
            break;
        }
        case ExpandMenu.actionType.RIGHT_DOWN:
        {
            anchorX = 0;
            anchorY = 1;
            break;
        }
        default:
            break;
    }

    this._listView.setAnchorPoint(anchorX, anchorY);
};

/**
 * 设置消失后的回调
 * @param {function} callBack 回调
 * */
ExpandMenu.prototype.setDisappearCallBack = function(callBack)
{
    this._disappearCallBack = callBack;
};

/**
 * 显示在pSender之上
 * @param {object} pSender
 * */
ExpandMenu.prototype.show = function(pSender)
{
    pSender.addChild(this._listView);
    var scaleToA = cc.scaleTo(0.2, 2);
    var easeIn = cc.EaseIn(scaleToA, 0.2);

    var seqAc = new cc.Sequence(easeIn, new cc.CallFunc(function(self)
    {

    }, this._listView));
    this._listView.runAction(seqAc);
};

/**
 * 消失的动画
 * */
ExpandMenu.prototype.disappear = function()
{
    cc.eventManager.removeListener(this._listener);
    var scaleToA = cc.scaleTo(0.2, 0.1);
    var easeIn = cc.EaseIn(scaleToA, 0.2);
    //var spAc = new cc.Spawn(scaleToA);    // 同步
    var pSender = this;
    var seqAc = new cc.Sequence(easeIn, new cc.CallFunc(function(self)
    {
        if (pSender._disappearCallBack)
        {
            pSender._disappearCallBack();
        }
        self.removeFromParent();
    }, this._listView));
    this._listView.runAction(seqAc);
};