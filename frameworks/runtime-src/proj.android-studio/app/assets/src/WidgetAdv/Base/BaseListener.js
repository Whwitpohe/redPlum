/**
 * Created by FanJiaHe on 2015/11/11.
 */

var baseListener = {};
/**
 * 获取中心点坐标。目前所有节点都以 0.5, 0.5 作为锚点，所以中心点直接返回锚点坐标。
 */
baseListener.getCenterPosition = function(pSender)
{
    var actualX = pSender.getPosition().x + pSender.getBoundingBox().width * (0.5 - pSender.getAnchorPoint().x);
    var actualY = pSender.getPosition().y + pSender.getBoundingBox().height * (0.5 - pSender.getAnchorPoint().y);
    return cc.p(actualX, actualY);
};

baseListener.getCustomListener = function()
{
    return {
        event: cc.EventListener.TOUCH_ONE_BY_ONE,
        swallowTouches: false,
        _oScale: 0,
        _oPosition: null,
        onTouchBegan: function(touch, event)
        {
            var target = event.getCurrentTarget();
            if(!target._isEnable)
            {
                return false;
            }
            var pos = target.getParent().convertTouchToNodeSpace(touch);   // 世界坐标转换 (子节点相对于父节点的位置)
            // 如果触碰起始地点在本区域中
            if (!cc.rectContainsPoint(target.getBoundingBox(), pos))
            {
                return false;
            }
            if (this._oScale == 0)
            {
                this._oScale = target.getScale();
            }
            this._oPosition = pos;
            target.setColor(cc.color(200, 200, 200));
            target.runAction(cc.scaleTo(0.2,this._oScale * 0.95 ));
            var pX = -(pos.y - baseListener.getCenterPosition(target).y)
                     / target.getBoundingBox().height * 2 * target._maxOffset || 10;
            var pY = (pos.x - baseListener.getCenterPosition(target).x) / target.getBoundingBox().width * 2
                     * target._maxOffset || 10;
            target.setRotation3D(cc.math.vec3(pX, pY, 0));
            return true;
        },
        onTouchMoved: function(touch, event)
        {
            var target = event.getCurrentTarget();
            var pos = target.getParent().convertTouchToNodeSpace(touch);
            // 如果触碰起始地点在本区域中
            if (!cc.rectContainsPoint(target.getBoundingBox(), pos))
            {
                return false;
            }
            target.setRotation3D(cc.math.vec3(-(pos.y - baseListener.getCenterPosition(target).y)
                                              / target.getBoundingBox().height * 2 * target._maxOffset || 10
                , (pos.x - baseListener.getCenterPosition(target).x) / target.getBoundingBox().width * 2
                  *                                                                                    target._maxOffset || 10
                , 0));
            return true;
        },

        onTouchEnded: function(touch, event)
        {
            var target = event.getCurrentTarget();
            var pos = target.getParent().convertTouchToNodeSpace(touch);

            target.runAction(cc.scaleTo(0.2,this._oScale));
            target.setRotation3D(cc.math.vec3(0, 0, 0));
            target.setColor(cc.color(255, 255, 255));
            this._oScale = 0;
            if (!cc.rectContainsPoint(target.getBoundingBox(), pos))
            {
                return false;
            }

            // 如果初次点击位置跟以后点击位置相同则执行点击事件,否则是在滑动,不执行
            if (this._oPosition.x <= pos.x + 5 && this._oPosition.x >= pos.x - 5 && this._oPosition.y <= pos.y + 5 && this._oPosition.y >= pos.y - 5)
            {
                if (target._callBack)
                {
                    target._callBack();
                }
            }
            return true;
        },

        onTouchCancelled: function(touch, event)
        {
            var target = event.getCurrentTarget();
            var pos = target.getParent().convertTouchToNodeSpace(touch);
            //if (cc.rectContainsPoint(target.getBoundingBox(), pos))
            {
                target.runAction(cc.scaleTo(0.2,this._oScale));
                target.setRotation3D(cc.math.vec3(0, 0, 0));
                target.setColor(cc.color(255, 255, 255));
                this._oScale = 0;
                return true;
            }

            return false;
        }
    };
};