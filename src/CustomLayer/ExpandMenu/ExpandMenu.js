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

ExpandMenu._directionType = {
    HORIZONTAL: "HORIZONTAL",
    VERTICAL: "VERTICAL"
};

ExpandMenu.prototype._listView = null;
ExpandMenu.prototype._size = null;
ExpandMenu.prototype._count = null;
ExpandMenu.prototype._position = null;
ExpandMenu.prototype._animationType = null;
ExpandMenu.prototype._listener = null;
ExpandMenu.prototype._disappearCallBack = null;
ExpandMenu.prototype._direction = null;
ExpandMenu.prototype._autoDisappear = true;
ExpandMenu.prototype._autoRemoveListener = true;

/**
 * 创建一个拓展菜单
 * @param {cc.Point} position 显示位置
 * @param {ExpandMenu.actionType.} actionType 出场的动画
 * @param {number} count 设置多少个item
 * @param {cc.Size} size 设置框框占用多大位置
 * @param {ExpandMenu._directionType} direction 方向
 * */
ExpandMenu.getNewInstance = function(position, actionType, count, size, direction)
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
    expandMenu._direction = direction || ExpandMenu._directionType.VERTICAL;

    expandMenu.initLayer();
    expandMenu.setAction();

    return expandMenu;
};

ExpandMenu.prototype.initLayer = function()
{
    this._listView = new ccui.ListView();
    this._listView.setDirection(this._direction == ExpandMenu._directionType.VERTICAL ?
        ccui.ScrollView.DIR_VERTICAL : ccui.ScrollView.DIR_HORIZONTAL);    // 无方向滑动,就是两个方向
    {
        this._listView.setScrollBarEnabled(true);    // 设置滑动状态栏是否显示
        this._listView.setScrollBarWidth(5);
        this._direction == ExpandMenu._directionType.VERTICAL
            ? this._listView.setScrollBarPositionFromCornerForVertical({x:0,y:0})
            : this._listView.setScrollBarPositionFromCornerForHorizontal({x:0,y:0});
        this._listView.setScrollBarOpacity(150);
        this._listView.setScrollBarColor(cc.color(114,114,114));
    }
    this._listView.setTouchEnabled(true);       // 设置触摸是否启用
    this._listView.setBounceEnabled(true);   // 设置反弹是否启用 滑动启用
    this._listView.setBackGroundImage(res.ExpandMenuDefaultBackGround);  // 背景图
    this._listView.setBackGroundImageScale9Enabled(true); // 是否是九宫图
    this._listView.setContentSize(this._size);
    this._listView.setPosition(this._position);
    this._listView.setScale(0.1);
    this._listView.setGravity(this._direction == ExpandMenu._directionType.VERTICAL ?
        ccui.ListView.GRAVITY_CENTER_VERTICAL: ccui.ListView.GRAVITY_CENTER_HORIZONTAL);

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

    if (!cc.rectContainsPoint(target.getBoundingBox(), pos) && this._autoDisappear)
    {
        return true;
    }
    return false;
};


ExpandMenu.prototype.onTouchEnded = function(touch, event)
{
    var target = this._listView;
    var pos = target.getParent().convertTouchToNodeSpace(touch);   // 世界坐标转换 (子节点相对于父节点的位置)

    if (!cc.rectContainsPoint(target.getBoundingBox(), pos) && this._autoDisappear)
    {
        this.disappear();
        return true;
    }
    return false;
};

/**
 * 获取列表实例
 * */
ExpandMenu.prototype.getListView = function()
{
    return this._listView;
};

/**
 * 建造自定义item
 * @param {string} text 文字
 * @param {boolean} isEnable 是否启用
 * @param {function} callBack   回调
 * @param {object|string} fileName 文件名
 * @param {boolean} noDisappear 回调是否会消失
 * */
ExpandMenu.prototype.createItem = function(text, isEnable, callBack, fileName, noDisappear)
{
    var lblLayer = new ccui.Layout();
    lblLayer._noDisappear = noDisappear;
    var itemSize = cc.size(this._size.width / (this._direction == ExpandMenu._directionType.VERTICAL ? 1 : this._count),
        this._size.height / (this._direction == ExpandMenu._directionType.VERTICAL ? this._count : 1)
    );

    lblLayer.setContentSize(itemSize);

    var buttonSp = new AdvSprite(fileName || res.menuItemGrey);
    buttonSp.setTextureRect(cc.rect(0, 0, itemSize.width, itemSize.height));
    buttonSp.setPosition(lblLayer.getContentSize().width * 0.5, lblLayer.getContentSize().height * 0.5);
    buttonSp.setMaxOffset(15);
    buttonSp.setEnable(isEnable);
    buttonSp.setTag(100);
    var self = this;
    buttonSp.setCallBack(function()
    {
        if (!noDisappear)
        {
            self.disappear();
        }
        callBack();
    });
    lblLayer.addChild(buttonSp);

    var label = new cc.LabelTTF(text);
    label.setFontSize(24);
    label.setColor(cc.color(250, 250, 250));
    label.setPosition(buttonSp.getContentSize().width * 0.5, buttonSp.getContentSize().height * 0.5);
    label.setTag(100);
    buttonSp.addChild(label);

    var line = new ccui.Scale9Sprite(res.Point);
    line.setPreferredSize(cc.size(itemSize.width, 2.5));
    line.setPosition(lblLayer.getContentSize().width * 0.5, 0);
    lblLayer.addChild(line);

    return lblLayer;
};

/**
 * 设置动作产生的位置和动作
 * */
ExpandMenu.prototype.setAction = function(animationType)
{
    this._animationType =  animationType || this._animationType;
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
 * 不自动释放
 * */
ExpandMenu.prototype.retain = function()
{
  if (this._autoRemoveListener)
  {
      this._listView.retain();
      this._autoRemoveListener = false;
      console.log("我进来了");
  }
};
/**
 * 对自动释放的解除
 * */
ExpandMenu.prototype.release = function()
{
    if (!this._autoRemoveListener)
    {
        this._listView.release();
        this._autoRemoveListener = true;
    }
};

/**
 * 显示在pSender之上
 * @param {object} pSender
 * */
ExpandMenu.prototype.show = function(pSender)
{
    pSender.addChild(this._listView);
    var scaleToA = cc.scaleTo(0.2, 1);
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
    this._autoRemoveListener ?cc.eventManager.removeListener(this._listener):null;
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