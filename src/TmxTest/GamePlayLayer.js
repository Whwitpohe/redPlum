/**
 * Created by FanJiaHe on 2016/2/23.
 */


var timeCount = 0;
var timeMax = 1;

var GamePlayLayer = cc.Layer.extend({
    _tileMap: null,
    _background: null,
    _mask: null,
    _foreground: null,
    _pPlayerSprite: null,
    _scoreLabel: null,
    _score: 0,
    _pCatcherSprite: null,
    _hero: null,
    _enemy: null,
    ctor: function()
    {
        this._super();
        if (true)
        {
            this.initData();
            this.initLayer();
            this.initHero();
            this.initTouch();
            this.initSound();
        }
        return true;
    },
    initData: function()
    {
        var curDataBase = sqlControl.openSql("base.sqlite");
        // cc.gotoFrameAndPlay()
        if (!curDataBase)
        {
            console.log("数据库读取失败,请重新启动或者安装程序");
            return;
        }

        languageControl.initLanguage(curDataBase);          // 初始化语言
        itemControl.initItemData(curDataBase);              // 初始化道具
        var sex = sexControl.initData(curDataBase, false);  // 初始化性别
        attributeImageControl.initAttributeImage(curDataBase);  // 初始化属性图片

        console.log("sex: " + JSON.stringify(sex));

        // 初始化人物
        this._hero = biologyControl.getNewInstance(curDataBase, 1);
        this._enemy = biologyControl.getNewInstance(curDataBase, 2);

        var curHeroBag = bagControl.initHeroBag(curDataBase, 1);
        bagControl.handleHeroBag(this._hero, curHeroBag);

        curHeroBag = bagControl.initHeroBag(curDataBase, 2);
        bagControl.handleHeroBag(this._enemy, curHeroBag);

        customPopMenu.initMenu();   // 初始化弹出按钮

        // var tableName = "sex";
        // var sexArray = curDataBase.getData("select * from " + tableName, tableName);
        // console.log("+++++++++" + JSON.stringify(sexArray));

        // st.valueString(0)
        // console.log("读取的资料为" + st);
    },
    initLayer: function()
    {
        // 地图
        this._tileMap = cc.TMXTiledMap(res.TmxFile);

        // 背景
        this._background = this._tileMap.getLayer("background");

        // 遮罩
        this._mask = this._tileMap.getLayer("mask");

        // 前景
        this._foreground = this._tileMap.getLayer("foreground");

        this.addChild(this._tileMap);
    },
    initHero: function()
    {
        // 创建 hero
        this._pPlayerSprite = cc.Sprite(this._hero._image);

        // 获取玩家精灵在地图中的位置(预先设置的)
        var pObject = this._tileMap.getObjectGroup("objects");
        var pDict = pObject.getObject("playerPoint");

        var x = pDict["x"];
        var y = pDict["y"];

        this._pPlayerSprite.setPosition(x, y);

        this.addChild(this._pPlayerSprite);


        // 追赶精灵

        this._pCatcherSprite = new cc.Sprite(this._enemy._image);
        // 获取追赶精灵在地图中的位置
        pDict = pObject.getObject("catcherPoint");

        x = pDict["x"];
        y = pDict["y"];

        this._pCatcherSprite.setPosition(x, y);
        this._pCatcherSprite.setColor(cc.color(0, 255, 255));
        this.addChild(this._pCatcherSprite);

        this.scheduleUpdate();
    },
    initTouch: function()
    {
        var self = this;
        var listener = {
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            onTouchBegan: function(touch, event)
            {
                // var target = event.getCurrentTarget();
                // var pos = target.getParent().convertTouchToNodeSpace(touch);   // 世界坐标转换 (子节点相对于父节点的位置)
                // // 如果触碰起始地点在本区域中
                // if (!cc.rectContainsPoint(target.getBoundingBox(), pos))
                // {
                //     return false;
                // }

                var touchPos = self.convertTouchToNodeSpace(touch);
                var playerPos = self._pPlayerSprite.getPosition();

                var ptMinus = cc.pSub(touchPos, playerPos);
                if (Math.abs(ptMinus.x) > Math.abs(ptMinus.y))
                {
                    if (ptMinus.x > 0)
                    {
                        playerPos.x += self._tileMap.getTileSize().width;
                    } else
                    {
                        playerPos.x -= self._tileMap.getTileSize().width;
                    }
                } else
                {
                    if (ptMinus.y > 0)
                    {
                        playerPos.y += self._tileMap.getTileSize().height;
                    }
                    else
                    {
                        playerPos.y -= self._tileMap.getTileSize().height;
                    }
                }
                self.updatePlayerAndMapPositions(playerPos);
                return true;
            },
            onTouchMoved: function(touch, event)
            {
                return true;
            },
            onTouchEnded: function(touch, event)
            {
                // var target = event.getCurrentTarget();
                // var pos = target.getParent().convertTouchToNodeSpace(touch);   // 世界坐标转换 (子节点相对于父节点的位置)
                // // 如果触碰起始地点在本区域中
                // if (!cc.rectContainsPoint(target.getBoundingBox(), pos))
                // {
                //     target.setPosition(pos);
                //     return false;
                // }
                // return true;

                // console.log("卧槽尼玛的");
            },
            onTouchCancelled: function(touch, event)
            {
                return true;
            }
        };
        cc.eventManager.addListener(listener, this);
    },
    initSound: function()
    {
        // 预加载
        jsb.AudioEngine.preload(res.BackGroundMusic);
        jsb.AudioEngine.preload(res.HitSound);
        jsb.AudioEngine.preload(res.MoveSound);
        jsb.AudioEngine.preload(res.PewPewLeiSound);
        jsb.AudioEngine.preload(res.PickupSound);
        jsb.AudioEngine.preload(res.TileMapSound);

        // jsb.AudioEngine.play2d(res.BackGroundMusic);
    },
    update: function(dt)
    {
        if (++timeCount < timeMax)
        {
            // 30帧率更新一次
            return;
        }

        timeCount = 0;
        var playerPos = this._pPlayerSprite.getPosition();
        var catcherPos = this._pCatcherSprite.getPosition();

        // console.log(JSON.stringify(playerPos) + "||" + JSON.stringify(catcherPos));

        var newCatcherPos = cc.p(catcherPos.x, catcherPos.y);

        if (cc.rectIntersectsRect(this._pPlayerSprite.getBoundingBox(), this._pCatcherSprite.getBoundingBox()))
        {
            this.gameOver();
        }

        var pX = parseInt(playerPos.x);
        var pY = parseInt(playerPos.y);
        var cX = parseInt(catcherPos.x);
        var cY = parseInt(catcherPos.y);

        if (pX > cX)
        {
            newCatcherPos = cc.p(cX + 1, cY);
        } else if (pX < cX)
        {
            newCatcherPos = cc.p(cX - 1, cY);
        } else if (pY > cY)
        {
            newCatcherPos = cc.p(cX, cY + 1);
        } else if (pY < cY)
        {
            newCatcherPos = cc.p(cX, cY - 1);
        }

        this._pCatcherSprite.setPosition(newCatcherPos);
    },
    updatePlayerAndMapPositions: function(playerPos)
    {
        var mapPos = this.tileCoordForPosition(playerPos);
        var tileId = this._mask.getTileGIDAt(mapPos);
        if (tileId != 0)
        {
            console.log("哈哈");

            var pDic = this._tileMap.getPropertiesForGID(tileId);

            if (pDic != null)
            {
                // 障碍物
                var str1 = pDic["obstacles"];
                if (str1 && str1 == "true")
                {
                    // jsb.AudioEngine.play2d(res.HitSound);
                    return;
                }

                // 碰撞检测
                var str2 = pDic["eat"];
                if (str2 && str2 == "can")
                {
                    // jsb.AudioEngine.play2d(res.PickupSound);
                    this._mask.removeTileAt(mapPos);
                    this._foreground.removeTileAt(mapPos);
                    // 更新分数
                }
            }
        }


        {
            // a、设置人物位置(防止人物走出地图)
            if (playerPos.x < this._tileMap.getTileSize().width * this._tileMap.getMapSize().width
                && playerPos.y < this._tileMap.getTileSize().height * this._tileMap.getMapSize().height
                && playerPos.x > 0
                && playerPos.y > 0)
            {

                // jsb.AudioEngine.play2d(res.MoveSound);
                // this._pPlayerSprite.setPosition(playerPos);
                var moveTo = cc.moveTo(0.1, playerPos.x, playerPos.y);
                this._pPlayerSprite.runAction(moveTo);
            }


            // b、设置窗口显示的地图范围
            // 得到窗口尺寸
            var sz = cc.winSize;


            // 防止窗口移出地图边界
            var x = (Math.max(playerPos.x, sz.width * 0.5));  // 左边
            var y = (Math.max(playerPos.y, sz.height * 0.5)); // 下边
            x = Math.min(x, this._tileMap.getTileSize().width * this._tileMap.getMapSize().width - sz.width / 2);     // 右边
            y = Math.min(y, this._tileMap.getTileSize().height * this._tileMap.getMapSize().height - sz.height / 2);  // 上边

            var ptDesire = cc.p(x, y);
            var centerOfView = cc.p(sz.width * 0.5, sz.height * 0.5);  // 中间点

            var ptActual = cc.pSub(centerOfView, ptDesire);
            // this.setPosition(ptActual);  //

            var moveTo2 = cc.moveTo(0.1, ptActual.x, ptActual.y);

            this.runAction(moveTo2);  //
        }


    },
    tileCoordForPosition: function(position)
    {
        var pt = cc.p(0, 0);
        pt.x = position.x / this._tileMap.getTileSize().width;
        pt.y = (this._tileMap.getTileSize().height * this._tileMap.getMapSize().height - position.y) /
               this._tileMap.getTileSize().height;
        pt.x = parseInt(pt.x);
        pt.y = parseInt(pt.y);
        return pt;
    },
    gameOver: function()
    {
        // console.log("popopopopopopopopopopopopopopopopopopopopopopopopopopopop");
    }
});


var GamePlayScene = cc.Scene.extend({
    onEnter: function()
    {
        this._super();
        var layer = new GamePlayLayer();
        this.addChild(layer);

        var prospectMenu = prospectMenuControl.getLayer(layer._hero);
        this.addChild(prospectMenu);
    }
});
