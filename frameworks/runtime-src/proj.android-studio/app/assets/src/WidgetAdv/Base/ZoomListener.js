/**
 * Created by FanJiaHe on 2015/11/27.
 */

var ZoomListener = function()
{

};

ZoomListener.prototype._maxScale = 0;   // 最大放大倍数
ZoomListener.prototype._reference = cc.pDistance(cc.p(0, 0), cc.p(cc.winSize.width, cc.winSize.height));  // 获取屏幕距离
ZoomListener.prototype._firstDistance = 0;  // 获取第一次双点触摸的距离
ZoomListener.prototype._touchDistance = 0;       // 触摸点之间的距离
ZoomListener.prototype._nowScale = 1;      // 当前缩放比例
ZoomListener.prototype._baseScale = 0;  // 基础缩放倍数
ZoomListener.prototype._lastPos = cc.p(0, 0);   // 最后一次触摸的位置

ZoomListener.getNewInstance = function(maxScale)
{
    var zoomListener = new ZoomListener();
    zoomListener._maxScale = maxScale || 4;
    return zoomListener;
};

ZoomListener.getCustomListener = function(maxScale)
{
    return {
        event: cc.EventListener.TOUCH_ALL_AT_ONCE,
        _zoomListener: new ZoomListener(maxScale),
        onTouchesBegan: function(touches, event)
        {
            var target = event.getCurrentTarget();
            this._zoomListener._firstDistance = 0;
            this._zoomListener._baseScale = target.getScale();
            this._zoomListener._lastPos = touches[0].getLocation();

            return true;
        },
        onTouchesMoved: function(touches, event)
        {
            var target = event.getCurrentTarget();

            if (touches.length >= 2)
            {
                var point1 = touches[0].getLocation();
                var point2 = touches[1].getLocation();

                if (cc.pDistance(point1, point2) > this._zoomListener._firstDistance &&
                    cc.pDistance(point1, point2) < this._zoomListener._touchDistance ||
                    cc.pDistance(point1, point2) < this._zoomListener._firstDistance &&
                    cc.pDistance(point1, point2) > this._zoomListener._touchDistance)
                {
                    this._zoomListener._firstDistance = 0;
                }
                this._zoomListener._touchDistance = cc.pDistance(point1, point2);  // 记录当前两点之间的距离
                if (this._zoomListener._firstDistance == 0)
                {
                    this._zoomListener._firstDistance = this._zoomListener._touchDistance; // 获取第一次的距离
                    this._zoomListener._baseScale = target.getScale();
                }
                var differ = this._zoomListener._touchDistance - this._zoomListener._firstDistance;
                this._zoomListener._nowScale = 1 + differ / this._zoomListener._reference * (differ > 0 ? 4 : 1.5);
                target.setScale(this._zoomListener._nowScale * this._zoomListener._baseScale);
            }
            else
            {
                var curPos = touches[0].getLocation();
                var differPos = cc.p(curPos.x - this._zoomListener._lastPos.x, curPos.y -
                                                                               this._zoomListener._lastPos.y);
                target.setPosition(target.getPosition().x + differPos.x, target.getPosition().y +
                                                                         differPos.y);
                this._zoomListener._lastPos = curPos;
            }
            return true;
        },
        onTouchesEnded: function(touches, event)
        {
            return true;
        },
        onTouchesCancelled: function(touches, event)
        {
            return true;
        }
    };
};
