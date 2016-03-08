/**
 * Created by FanJiaHe on 2015/11/24.
 */

var drawerLayerManager = {};
drawerLayerManager.layerManager = [];


/**
 * 创建一个抽屉式layer
 * @param {cc.Point} popPosition 弹出位置
 * @param {cc.size} drawerSize 弹出大小
 * @param {globalApi.direction.} popDirection 弹出方向
 * @param {boolean} isCover 是否有遮罩
 * */
drawerLayerManager.addLayer = function (popPosition, drawerSize, popDirection, isCover)
{
    var master = DrawerLayer.getNewInstance(popPosition, drawerSize, popDirection, isCover);
    //drawerLayer.layerManager.push(master);
    return master;
};


/**
 * @prototype {cc.Point} _popPosition 弹出位置
 * @prototype {globalApi.direction.} _popDirection 弹出方向
 * @prototype {cc.size} _drawerSize 弹出大小
 * @prototype {boolean} _isCover 是否有遮罩
 * @prototype {boolean} _isFocus 是否是焦点
 * @prototype {array} _JointRelationTable 连带关系表
 * */
var DrawerLayer = function()
{

};

DrawerLayer.prototype._layer = null;
DrawerLayer.prototype._backGround = null;
DrawerLayer.prototype._popPosition = cc.p(0, 0);
DrawerLayer.prototype._popDirection = globalApi.direction.RIGHT;
DrawerLayer.prototype._drawerSize = cc.size(0, 0);
DrawerLayer.prototype._isCover = false;
DrawerLayer.prototype._isFocus = false;
DrawerLayer.prototype._JointRelationTable = [];
DrawerLayer.prototype._animation = null;
DrawerLayer.prototype._listener = null;


/**
 * 创建一个抽屉式layer
 * @param {cc.Point} popPosition 弹出位置
 * @param {cc.size} drawerSize 弹出大小
 * @param {globalApi.direction.} popDirection 弹出方向
 * @param {boolean} isCover 是否有遮罩
 * */
DrawerLayer.getNewInstance = function(popPosition, drawerSize, popDirection, isCover)
{
    var drawerLayer = new DrawerLayer();
    drawerLayer._popPosition = popPosition || cc.p(0, 0);
    drawerLayer._popDirection = popDirection || globalApi.direction.RIGHT;
    drawerLayer._drawerSize = drawerSize || cc.size(0, 0);
    drawerLayer._isCover = isCover || false;
    drawerLayer._JointRelationTable = [];
    drawerLayer._isFocus = false;
    drawerLayer._animation = null;
    drawerLayer._listener = null;
    drawerLayer._layer = null;
    drawerLayer._backGround = null;

    drawerLayer.init();
    return drawerLayer;
};

/**
 * 初始化layer
 * */
DrawerLayer.prototype.init = function()
{
    this._layer = new cc.LayerColor(cc.color(255, 255, 255, 255), this._drawerSize.width, this._drawerSize.height);
    this._layer.setPosition(this.getPositionOfDirection());
    this._layer.ignoreAnchorPointForPosition(false);
};

/**
 * 获取动画前位置
 * */
DrawerLayer.prototype.getPositionOfDirection = function()
{
    var pos = this._popPosition;
    switch (this._popDirection)
    {
        case globalApi.direction.UP:
        {
            pos.y -= this._drawerSize.height;
            break;
        }
        case globalApi.direction.DOWN:
        {
            pos.y += this._drawerSize.height;
            break;
        }
        case globalApi.direction.LEFT:
        {
            pos.x += this._drawerSize.width;
            break;
        }
        case globalApi.direction.RIGHT:
        {
            pos.x -= this._drawerSize.width;
            break;
        }
        default:
            break;
    }
    return pos;
};

/**
 * 获取位移
 * */
DrawerLayer.prototype.getEjectPosition = function()
{
    var offset = cc.p(0,0);
    switch (this._popDirection)
    {
        case globalApi.direction.UP:
        {
            offset.y += this._drawerSize.height;
            break;
        }
        case globalApi.direction.DOWN:
        {
            offset.y -= this._drawerSize.height;
            break;
        }
        case globalApi.direction.LEFT:
        {
            offset.x -= this._drawerSize.width;
            break;
        }
        case globalApi.direction.RIGHT:
        {
            offset.x += this._drawerSize.width;
            break;
        }
        default:
            break;
    }
    return offset;
};

/**
 * 加载到pSender
 * @param {cc.Layer|cc.scene|cc.node} pSender 加载到pSender之上
 * */
DrawerLayer.prototype.eject = function(pSender)
{
    if (globalApi.variableCheck("pSender", pSender, "object"))
    {
        return;
    }
    if (this._isCover)
    {
        this._backGround = new cc.LayerColor(cc.color(0, 0, 0, 90));

        this._listener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function (touch, event) {
                return true;
            }
        });
        cc.eventManager.addListener(this._listener, this._backGround);

        pSender.addChild(this._backGround);
    }

    pSender.addChild(this._layer);
    var offset = this.getEjectPosition();
    var moveBy = new cc.MoveBy(0.6,offset.x, offset.y);
    this._animation = new cc.EaseElasticInOut(moveBy, 1);
    this._animation.retain();
    this._layer.runAction(this._animation);
};

/**
 * 回收
 * */
DrawerLayer.prototype.recovery = function()
{
    var self = this;
    var seqAc = new cc.Sequence(this._animation.reverse(),
        new cc.CallFunc(function()
        {
            this._animation.release();
            cc.eventManager.removeListener(this._listener);
            this._layer.removeFromParent();
            if (this._backGround)
            {
                this._backGround.removeFromParent();
            }
        }, self)
    );
    this._layer.runAction(seqAc);
};

/**
 * 设置归属关系表
 * @param {DrawerLayer} subordinate 从属关系
 * */
DrawerLayer.prototype.setJointRelation = function(subordinate)
{
    this._JointRelationTable.push(subordinate);
};

/**
 * 删除从属关系下的所有弹出窗
 */
DrawerLayer.prototype.recoveryAll = function()
{
    if (!this._JointRelationTable) return false;
    for (var count = 0; count < this._JointRelationTable.length; count ++)
    {
        var me = this._JointRelationTable[count];
        if (!me) continue;
        me.recoveryAll();
    }
    this.recovery();
};
