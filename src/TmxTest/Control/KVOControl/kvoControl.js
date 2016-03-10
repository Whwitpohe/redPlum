/**
 * Created by FanJiaHe on 2016/3/10.
 */



//通用代码
var observer = {
    //订阅
    addSubscriber: function(callback)
    {
        this.subscribers[this.subscribers.length] = callback;
    },
    //退订
    removeSubscriber: function(callback)
    {
        for (var i = 0; i < this.subscribers.length; i++)
        {
            if (this.subscribers[i] === callback)
            {
                delete (this.subscribers[i]);
            }
        }
    },
    //发布
    publish: function(what)
    {
        for (var i = 0; i < this.subscribers.length; i++)
        {
            if (typeof this.subscribers[i] === 'function')
            {
                this.subscribers[i](what);
            }
        }
    },
    // 将对象o具有观察者功能
    make: function(o)
    {
        for (var i in this)
        {
            o[i] = this[i];
            o.subscribers = [];
        }
    }
};


var kvoControl = {};
kvoControl._allObserver = {};

/**
 * 创建kvo
 * */
kvoControl.getNewInstance = function(object, key, value, name)
{
    var tempObserver = null;
    // 如果没有这个kvo的话,则创建一个新的
    if (!(name in kvoControl._allObserver))
    {
        tempObserver = {
            refresh: function(value, custom)
            {
                this.publish(arguments);
            }
        };
        observer.make(tempObserver);
        kvoControl._allObserver[name] = tempObserver;
    }else
    {
        // 取出之前的kvo实例
        tempObserver = kvoControl._allObserver[name];
    }

    var setValue = function(value)
    {
        this["real" + key] = value;
        tempObserver.refresh(value, this);
    };

    var getValue = function()
    {
        return this["real" + key];
    };

    Object.defineProperty(object, key, {
        set: setValue,
        get: getValue
    });

    object[key] = value;
    return tempObserver;
};

/**
 * 创建kvo
 * @param {object} object
 * @param {string} key
 * @param {string|number} value
 * @param {string} name 索引名称
 * */
kvoControl.createKVO = function(object, key, value, name)
{
    var tempObserver = kvoControl.getNewInstance(object, key, value, name);
    return tempObserver;
};

/**
 * 添加函数到kvo中
 * @param {string} observerName 观察者名称
 * @param {function} whatFunction 回调函数
 * */
kvoControl.addSubscriber = function(observerName, whatFunction)
{
    if (!(observerName in kvoControl._allObserver))
    {
        console.log("订阅时出现错误 + kvoControl.addSubscriber");
        return ;
    }

    var curObserver = kvoControl._allObserver[observerName];
    curObserver.addSubscriber(whatFunction);
};

/**
 * 添加函数到kvo中
 * @param {string} observerName 观察者名称
 * @param {function} whatFunction 回调函数
 * */
kvoControl.removeSubscriber = function(observerName, whatFunction)
{
    var curObserver = kvoControl._allObserver[observerName];
    if (whatFunction)
    {
        curObserver.removeSubscriber(whatFunction);
    }else
    {
        delete kvoControl._allObserver[observerName];
    }
};