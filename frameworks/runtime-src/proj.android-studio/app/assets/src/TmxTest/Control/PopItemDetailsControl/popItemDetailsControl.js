/**
 * Created by FanJiaHe on 2016/3/4.
 */

var popItemDetailsControl = {};


popItemDetailsControl._layer = null;

popItemDetailsControl._lastKey = null;
popItemDetailsControl._item = null;

popItemDetailsControl.getLayer = function(item)
{
    popItemDetailsControl._lastKey = popItemDetailsControl._item ? popItemDetailsControl._item._key : null;
    popItemDetailsControl._item = item;
    if (!popItemDetailsControl._layer)
    {
        popItemDetailsControl._layer = new PopItemDetails();
        popItemDetailsControl._layer.retain();
    }
    return popItemDetailsControl._layer;
};



/**
 * 消失
 * */
popItemDetailsControl.disappear = function(isClear)
{
    popItemDetailsControl._layer.removeFromParent();
    if (isClear)
    {
        popItemDetailsControl._layer.release();
    }
};