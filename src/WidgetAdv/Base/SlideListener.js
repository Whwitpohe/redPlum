/**
 * Created by FanJiaHe on 2015/11/25.
 */

var TouchPoints = function()
{

};

/**
 * 位移方向
 * */
TouchPoints._direction = {
    LEFT: "LEFT",   // 左
    MIDDLE: "MIDDLE",   // 中
    RIGHT: "RIGHT"  //右
};
TouchPoints.prototype._originalPoint = null;  // 原件的初始位置
TouchPoints.prototype._began = null;  // 触摸点初始位置
TouchPoints.prototype._move = null;   // 触摸点移动位置
TouchPoints.prototype._cancel = cc.p(0, 0); // 触摸点结束触摸的位置
TouchPoints.prototype._end = cc.p(0, 0);    // 触摸点取消触摸的位置
TouchPoints.prototype._distance = 0;      // 最大触摸移动长度
TouchPoints.prototype._originalScale = 0;  // 原始放大倍数
TouchPoints.prototype._callBack = null;  // 自定义滑动回调
TouchPoints.prototype._canInfiniteSlide = false;    // 是否可以无限滑动
TouchPoints.prototype._prohibitDirection = null;    // 禁止方位
TouchPoints.prototype._canTouch = true;
TouchPoints.prototype._currentDirection = TouchPoints._direction.MIDDLE;    // 当前位移方向
TouchPoints.prototype._backCallBack = null; // 返回时调用的函数

/**
 * 创建一个TouchPoints
 * @param {number} maxMoveDistance 最大位移
 * @param {TouchPoints._direction.} prohibitDirection 禁止的方向 可以是左右,不可中间
 * @param {function} callBack 回调
 * @param {boolean} canInfiniteSlide 是否可以无限制滑动
 * */
TouchPoints.getNewInstance = function(maxMoveDistance, prohibitDirection, callBack, canInfiniteSlide, backCallBack)
{
    var touchPoints = new TouchPoints();
    touchPoints.setMaxMoveDistance(maxMoveDistance);
    touchPoints.setCallBack(callBack);
    touchPoints.setProhibitDirection(prohibitDirection);
    touchPoints._canInfiniteSlide = canInfiniteSlide || false;
    touchPoints._backCallBack = backCallBack;
    return touchPoints;
};


/**
 * 设置最大位移
 * */
TouchPoints.prototype.setMaxMoveDistance = function(maxMoveDistance)
{
    this._distance = maxMoveDistance || 70;
};

/**
 * 设置禁止方位
 * @param {TouchPoints._direction.} prohibitDirection   禁止方位
 * */
TouchPoints.prototype.setProhibitDirection = function(prohibitDirection)
{
    this._prohibitDirection = prohibitDirection;
};

/**
 * 设置位移回调
 * @param {function} callBack 回调
 * */
TouchPoints.prototype.setCallBack = function(callBack)
{
    this._callBack = callBack;
};

/**
 * 方向设置
 * @param {TouchPoints._direction.} direction 设置方位
 * */
TouchPoints.prototype.setDirection = function(direction)
{
    switch (direction)
    {
        case TouchPoints._direction.LEFT:
        {
            if (this._currentDirection == TouchPoints._direction.MIDDLE)
            {
                this._currentDirection = TouchPoints._direction.LEFT;
            }
            else if (this._currentDirection = TouchPoints._direction.RIGHT)
            {
                this._currentDirection = TouchPoints._direction.MIDDLE;
            }
            break;
        }

        case TouchPoints._direction.RIGHT:
        {
            if (this._currentDirection == TouchPoints._direction.MIDDLE)
            {
                this._currentDirection = TouchPoints._direction.RIGHT;
            }
            else if (this._currentDirection = TouchPoints._direction.LEFT)
            {
                this._currentDirection = TouchPoints._direction.MIDDLE;
            }
            break;
        }
        default:
            break;
    }
};

/**
 * 控制移动方向是否可行
 * */
TouchPoints.prototype.canMove = function()
{
    if (!this._canInfiniteSlide)    // 不可无限滑动
    {
        if (this._currentDirection == TouchPoints._direction.LEFT && this._move.x - this._began.x < 0)
        {
            return false;
        }
        if (this._currentDirection == TouchPoints._direction.RIGHT && this._move.x - this._began.x > 0)
        {
            return false;
        }

        // 方位屏蔽
        switch (this._prohibitDirection)
        {
            case TouchPoints._direction.LEFT:
            {
                if (this._currentDirection == TouchPoints._direction.MIDDLE && this._move.x - this._began.x < 0)
                {
                    return false;
                }
                break;
            }
            case TouchPoints._direction.RIGHT:
            {
                if (this._currentDirection == TouchPoints._direction.MIDDLE && this._move.x - this._began.x > 0)
                {
                    return false;
                }
                break;
            }
            default:
                break;
        }
    }

    return true;
};

var slideListener = {};

/**
 * 设置最大位移px
 * @param {number} maxMoveDistance 最大位移
 * @param {TouchPoints._direction.} prohibitDirection   禁止滑动的方向
 * @param {function} callBack   滑动后的回调
 * @param {boolean} canInfiniteSlide    是否可以无限制的滑动
 * */
slideListener.getCustomListener = function(maxMoveDistance, prohibitDirection, callBack, canInfiniteSlide, backCallBack)
{
    return {
        event: cc.EventListener.TOUCH_ONE_BY_ONE,
        swallowTouches: false,
        touchPoints: TouchPoints.getNewInstance(maxMoveDistance, prohibitDirection, callBack, canInfiniteSlide, backCallBack),
        onTouchBegan: function(touch, event)
        {
            var target = event.getCurrentTarget();
            var pos = target.getParent().convertTouchToNodeSpace(touch);   // 世界坐标转换 (子节点相对于父节点的位置)
            // 如果触碰起始地点在本区域中
            if (!cc.rectContainsPoint(target.getBoundingBox(), pos))
            {
                return false;
            }

            if (!this.touchPoints._canTouch)
            {
                return false;
            }

            if (!this.touchPoints._began)
            {
                this.touchPoints._began = pos;
            }
            if (!this.touchPoints._originalPoint)
            {
                this.touchPoints._originalPoint = target.getPosition();
            }
            if (this.touchPoints._originalScale == 0)
            {
                this.touchPoints._originalScale = target.getScale();
            }
            var scaleToA = cc.scaleTo(0.2, this.touchPoints._originalScale * 0.98);
            var easeIn = cc.EaseIn(scaleToA, 0.2);
            target.runAction(easeIn);
            return true;
        },
        onTouchMoved: function(touch, event)
        {
            var target = event.getCurrentTarget();
            var pos = target.getParent().convertTouchToNodeSpace(touch);   // 世界坐标转换 (子节点相对于父节点的位置)
            // 如果触碰起始地点在本区域中
            if (!cc.rectContainsPoint(target.getBoundingBox(), pos))
            {
                return false;
            }

            this.touchPoints._move = pos;
            if (pos.x - this.touchPoints._began.x > this.touchPoints._distance && this.touchPoints.canMove())
            {
                target.setPositionX(this.touchPoints._distance + this.touchPoints._originalPoint.x); // 以初始点位置为原点进行最大右位移
            } else if (this.touchPoints._began.x - pos.x > this.touchPoints._distance && this.touchPoints.canMove())
            {
                target.setPositionX(this.touchPoints._originalPoint.x - this.touchPoints._distance); // 以初始点位置为原点进行最大左位移
            } else if (this.touchPoints.canMove())
            {
                target.setPositionX(pos.x - this.touchPoints._began.x + this.touchPoints._originalPoint.x); // 以初始点位置为原点进行位移
            }
            return true;
        },
        onTouchEnded: function(touch, event)
        {
            this.touchPoints._canTouch = false;

            var target = event.getCurrentTarget();
            var pos = target.getParent().convertTouchToNodeSpace(touch);   // 世界坐标转换 (子节点相对于父节点的位置)
            // 如果触碰起始地点在本区域中
            this.touchPoints._end = pos;

            var scaleToA = cc.scaleTo(0.3, this.touchPoints._originalScale);
            var easeIn = cc.EaseIn(scaleToA, 0.3);
            var self = this;
            var seq = cc.Sequence(easeIn, new cc.CallFunc(function()
            {
                self.touchPoints._canTouch = true;
            }));

            target.runAction(seq);
            if (this.touchPoints._move)
            {
                if (Math.abs(this.touchPoints._move.x - this.touchPoints._began.x) <= this.touchPoints._distance / 1.7)
                {
                    target.runAction(cc.EaseIn(cc.moveTo(0.2, this.touchPoints._originalPoint.x, this.touchPoints._originalPoint.y), 0.2));
                } else if (this.touchPoints.canMove())
                {
                    if (this.touchPoints._currentDirection == TouchPoints._direction.MIDDLE &&
                        this.touchPoints._callBack)
                    {
                        this.touchPoints._callBack();
                    }

                    var offsetX = this.touchPoints._move.x - this.touchPoints._began.x >
                                  0 ? this.touchPoints._distance : -this.touchPoints._distance;
                    target.runAction(cc.moveTo(0.2, this.touchPoints._originalPoint.x +
                                                    offsetX, this.touchPoints._originalPoint.y));
                    this.touchPoints.setDirection(this.touchPoints._move.x - this.touchPoints._began.x >
                                                  0 ? TouchPoints._direction.RIGHT : TouchPoints._direction.LEFT);
                    if (this.touchPoints._move.x - this.touchPoints._began.x < 0 && this.touchPoints._backCallBack)
                    {
                        this.touchPoints._backCallBack();
                    }
                } else
                {
                    target.runAction(cc.EaseIn(cc.moveTo(0.2, this.touchPoints._originalPoint.x, this.touchPoints._originalPoint.y), 0.2));
                }
            }


            this.touchPoints._move = null;
            this.touchPoints._originalPoint = null;
            this.touchPoints._began = null;
            if (!cc.rectContainsPoint(target.getBoundingBox(), pos))
            {
                return false;
            }

            return true;
        },
        onTouchCancelled: function(touch, event)
        {
            this.touchPoints._canTouch = false;

            var target = event.getCurrentTarget();
            var pos = target.getParent().convertTouchToNodeSpace(touch);   // 世界坐标转换 (子节点相对于父节点的位置)
            // 如果触碰起始地点在本区域中
            this.touchPoints._cancel = pos;

            var scaleToA = cc.scaleTo(0.3, this.touchPoints._originalScale);
            var easeIn = cc.EaseIn(scaleToA, 0.3);
            var self = this;
            var seq = cc.Sequence(easeIn, new cc.CallFunc(function()
            {
                self.touchPoints._canTouch = true;
            }));
            target.runAction(seq);

            if (Math.abs(this.touchPoints._move.x - this.touchPoints._began.x) <= this.touchPoints._distance / 1.7)
            {
                target.runAction(cc.EaseIn(cc.moveTo(0.2, this.touchPoints._originalPoint.x, this.touchPoints._originalPoint.y), 0.2));

            } else if (this.touchPoints.canMove())
            {
                var offsetX = this.touchPoints._move.x - this.touchPoints._began.x >
                              0 ? this.touchPoints._distance : -this.touchPoints._distance;
                target.runAction(cc.moveTo(0.2, this.touchPoints._originalPoint.x +
                                                offsetX, this.touchPoints._originalPoint.y));
                this.touchPoints.setDirection(this.touchPoints._move.x - this.touchPoints._began.x >
                                              0 ? TouchPoints._direction.RIGHT : TouchPoints._direction.LEFT);
            } else
            {
                target.runAction(cc.EaseIn(cc.moveTo(0.2, this.touchPoints._originalPoint.x, this.touchPoints._originalPoint.y), 0.2));
            }

            this.touchPoints._move = null;
            this.touchPoints._originalPoint = null;
            this.touchPoints._began = null;
            if (!cc.rectContainsPoint(target.getBoundingBox(), pos))
            {
                return false;
            }

            return true;
        },
        getTouchPoint: function()
        {
            return this.touchPoints;
        }
    }
};