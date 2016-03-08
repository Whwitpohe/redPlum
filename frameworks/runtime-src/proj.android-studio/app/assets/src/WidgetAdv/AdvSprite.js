/**
 * Created by FanJiaHe on 2015/11/10.
 */

/**
 * 创建高级控件Sprite
 * @property {number} maxOffset 倾斜量角度
 * * */
var AdvSprite = cc.Sprite.extend({
    _maxOffset: 20,
    _callBack: null,
    _isEnable: true,
    _listener: null,
    onEnter: function()
    {
        this._super();
        if (this._listener)
        {
            console.log("不需要创建我两次,大傻逼");
            return;
        }
        // 获取自定义监听事件处理方法的承载对象
        var customListener = baseListener.getCustomListener();
        // 根据自定义对象，获得系统事件监听器
        this._listener = cc.EventListener.create(customListener);
        // 注册监听器
        cc.eventManager.addListener(this._listener, this);
    },
    /**
     * 设置回调
     * @param {function} callBack   回调
     * */
    setCallBack: function(callBack)
    {
        this._callBack = callBack;
    },
    /**
     * 设置最大倾斜量
     * @param {number} maxOffset 最大倾斜量
     * */
    setMaxOffset: function(maxOffset)
    {
        this._maxOffset = maxOffset;
    },

    setEnable: function(isEnable)
    {
        if (this._isEnable == isEnable)
        {
            return;
        }

        this._isEnable = isEnable;

        if (this._isEnable)
        {
            this.setColor(cc.color(255 ,255, 255));
            this.setOpacity(255);
        }
        else
        {
            this.setColor(cc.color(0 ,0, 0));
            this.setOpacity(100);
        }
    }
});
