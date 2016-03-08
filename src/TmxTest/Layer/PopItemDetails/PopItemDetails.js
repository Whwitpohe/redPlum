/**
 * Created by FanJiaHe on 2016/3/4.
 */

var PopItemDetails = cc.Layer.extend({
    _mainLayer: null,
    _mask: null,
    _area: null,
    _animationShowA: null,
    _animationShowB: null,
    _animationDisappear: null,
    _image: null,
    _name: null,
    _weight: null,
    _levelRestrictions: null,
    _coolingTime: null,
    _max: null,
    _type: null,
    _effect: null,
    _info: null,
    ctor: function()
    {
        this._super();
        console.log("创建我 + PopItemDetails");

        var popItemDetails = LoadLayer.load(res.PopItemDetails);
        this._mainLayer = popItemDetails;
        popItemDetails.show(this);

        this._mask = this._mainLayer.getElement("mask");
        this._area = this._mainLayer.getElement("area");

        this._mask.setScale(2);
        this._area.setScale(0.5);

        this.initAnimation();
        this.initTouchListener();
        this.dealWidgets();
        this.initLayer();

        return true;
    },
    dealWidgets: function()
    {
        this._image = this._mainLayer.getElement("image");
        this._name = this._mainLayer.getElement("name");
        this._weight = this._mainLayer.getElement("weight");
        this._levelRestrictions = this._mainLayer.getElement("levelRestrictions");
        this._coolingTime = this._mainLayer.getElement("coolingTime");
        this._max = this._mainLayer.getElement("max");
        this._type = this._mainLayer.getElement("type");
        this._effect = this._mainLayer.getElement("effect");
        this._info = this._mainLayer.getElement("info");
    },
    initLayer: function()
    {
        var item = popItemDetailsControl._item;
        this._image.setTexture(item._image);
        this._name.setString(languageControl.getCurLanguage(item["_key"]));
        this._weight.setString(item._weight + "Kg");
        this._type.setString(languageControl.getCurLanguage(item._type));
        this._levelRestrictions.setString(item.getLevelRestrictions());
        this._info.setString(item.getInfo());
        this._effect.setString(item.getEffectText());
        this._coolingTime.setString("冷却时间:" + item._coolingTime + "秒");
        this._max.setString("携带上限:" + item._max + "个");
    },
    initAnimation: function()
    {
        var scaleToA = cc.scaleTo(0.5, 1, 1);
        this._animationShowA = new cc.EaseElasticOut(scaleToA, 0.5);
        this._animationShowA.retain();

        var scaleToB = cc.scaleTo(0.5, 1, 1);
        this._animationShowB = new cc.EaseElasticOut(scaleToB, 0.5);
        this._animationShowB.retain();

        var scaleToC = cc.scaleTo(0.1, 1, 0.001);
        this._animationDisappear = new cc.EaseElasticOut(scaleToC, 0.2);
        this._animationDisappear.retain();

    },
    initTouchListener: function()
    {
        var self = this;

        var offsetX = null;
        var offsetY = null;
        var listener = {
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            onTouchBegan: function(touch, event)
            {
                var target = event.getCurrentTarget();
                var pos = target.getParent().convertTouchToNodeSpace(touch);   // 世界坐标转换 (子节点相对于父节点的位置)
                // 如果触碰起始地点不在本区域中
                if (!cc.rectContainsPoint(target.getBoundingBox(), pos))
                {
                    return true;
                }
                offsetX = pos.x - target.getPositionX();
                offsetY = pos.y - target.getPositionY();
                return true;
            },
            onTouchMoved: function(touch, event)
            {
                var target = event.getCurrentTarget();
                var pos = target.getParent().convertTouchToNodeSpace(touch);   // 世界坐标转换 (子节点相对于父节点的位置)
                // 如果触碰起始地点不在本区域中
                if (!cc.rectContainsPoint(target.getBoundingBox(), pos) || offsetX == null || offsetX == null)
                {
                    return false;
                }

                target.setPosition(cc.p(pos.x - offsetX, pos.y - offsetY));
                self._area.setPosition(cc.p(pos.x - offsetX, pos.y - offsetY));
                return true;
            },
            onTouchEnded: function(touch, event)
            {
                offsetX = null;
                offsetY = null;

                var target = event.getCurrentTarget();
                var pos = target.getParent().convertTouchToNodeSpace(touch);   // 世界坐标转换 (子节点相对于父节点的位置)
                // 如果触碰起始地点不在本区域中
                if (!cc.rectContainsPoint(target.getBoundingBox(), pos))
                {
                    var callFunc = new cc.CallFunc(function()
                    {
                        popItemDetailsControl.disappear();
                    });

                    var seq = cc.sequence(self._animationDisappear, callFunc);
                    self.runAction(seq);
                    return false;
                }


                if (!cc.rectContainsPoint(self.getBoundingBox(), target.getPosition()))
                {
                    self._area.runAction(cc.moveTo(0.2, cc.winSize.width * 0.5, cc.winSize.height * 0.5));
                    target.runAction(cc.moveTo(0.2, cc.winSize.width * 0.5, cc.winSize.height * 0.5));
                    return false;
                }

                return true;
            },
            onTouchCancelled: function(touch, event)
            {
                offsetX = null;
                offsetY = null;
                return true;
            }
        };
        cc.eventManager.addListener(listener, this._mask);
    },
    onEnter: function()
    {
        this._super();

        this._area.runAction(this._animationShowA);
        this._mask.runAction(this._animationShowB);

        if (popItemDetailsControl._lastKey && popItemDetailsControl._lastKey != popItemDetailsControl._item._key)
        {
            this.initLayer();
        }
    },
    onExit: function()
    {
        this._super();

        this.setScale(1);
        this._mask.setScale(2);
        this._area.setScale(0.5);
    }
});