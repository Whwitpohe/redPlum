#include "GamePlayLayer.h"
#include "SimpleAudioEngine.h"
#include "GameOverScene.h"
USING_NS_CC;

GamePlayLayer::GamePlayLayer(void)
	:_tileMap(NULL)
	,_background(NULL)
	,_mask(NULL)
	,_foreground(NULL)
	,_pPlayerSprite(NULL)
	,_scoreLabel(NULL)
	,_score(0)
	,_pCatcherSprite(NULL)
{
}


GamePlayLayer::~GamePlayLayer(void)
{
}

bool GamePlayLayer::init()
{
	bool bRct = false;

	do 
	{
		CC_BREAK_IF(! CCLayer::init());

		// 1、地图
		// 设置地图
		CCTMXTiledMap *pTileMap = CCTMXTiledMap::create("tileMap.tmx");
		CC_BREAK_IF(! pTileMap);
		setTileMap(pTileMap);
		// 设置背景层
		this->setBackground(_tileMap->layerNamed("background"));
		CC_BREAK_IF(! _background);
		// 设置遮罩层
		this->setMask(_tileMap->layerNamed("mask"));
		CC_BREAK_IF(! _mask);
		// 设置前景层
		this->setForeground(_tileMap->layerNamed("foreground"));
		CC_BREAK_IF(! _foreground);
		// 将地图添加进图层
		this->addChild(_tileMap, 1);


		//2、创建和显示玩家精灵
		// 创建精灵
		CCSprite *pSpritePlayer = CCSprite::create("Player.png");
		CC_BREAK_IF(! pSpritePlayer);
		this->setPlayerSprite(pSpritePlayer);
		// 获取玩家精灵在地图中的位置（预先设置）
		CCTMXObjectGroup *pObject = _tileMap->objectGroupNamed("objects");
		CC_BREAK_IF(! pObject);
		CCDictionary *pDict = pObject->objectNamed("playerPoint");
		CC_BREAK_IF(! pDict);
		int x = pDict->valueForKey("x")->intValue();
		int y = pDict->valueForKey("y")->intValue();
		// 设置玩家至上面获取的位置
		_pPlayerSprite->setPosition(ccp(x, y));
		// 将玩家精灵添加至图层
		this->addChild(_pPlayerSprite, 1);

		// 3、玩家精灵的移动,地图的移动
		// 设置允许触摸
		this->setTouchEnabled(true);

		// 4、分数显示
		// 创建Label
		_scoreLabel = CCLabelTTF::create("Your Score:0", "Arial", 22);
		CC_BREAK_IF(! _scoreLabel);
		// 设置颜色
		_scoreLabel->setColor(ccc3(0, 0, 0));
		// 设置位置
		_scoreLabel->setPosition(CCPointMake(CCDirector::sharedDirector()->getWinSize().width - 80, CCDirector::sharedDirector()->getWinSize().height - 20));
		// 将Label添加至图层
		this->addChild(_scoreLabel, 1);

		// 5、背景音乐和音效
		// 预载
		CocosDenshion::SimpleAudioEngine::sharedEngine()->preloadBackgroundMusic("background-music-aac.wav");
		CocosDenshion::SimpleAudioEngine::sharedEngine()->preloadEffect("hit.wav");
		CocosDenshion::SimpleAudioEngine::sharedEngine()->preloadEffect("move.wav");
		CocosDenshion::SimpleAudioEngine::sharedEngine()->preloadEffect("pew-pew-lei.wav");
		CocosDenshion::SimpleAudioEngine::sharedEngine()->preloadEffect("pickup.wav");
		CocosDenshion::SimpleAudioEngine::sharedEngine()->preloadEffect("TileMap.wav");
		// 播放背景音乐
		if (! CocosDenshion::SimpleAudioEngine::sharedEngine()->isBackgroundMusicPlaying())
		{
			CocosDenshion::SimpleAudioEngine::sharedEngine()->playBackgroundMusic("background-music-aac.wav", true);
		}


		//6、追赶精灵
		// 创建精灵
		CCSprite *pSpriteCatcher = CCSprite::create("Player.png");
		CC_BREAK_IF(! pSpriteCatcher);
		this->setCatcherSprite(pSpriteCatcher);
		// 获取追赶精灵在地图中的位置（预先设置）
		pObject = NULL;
		pObject = _tileMap->objectGroupNamed("objects");
		CC_BREAK_IF(! pObject);
		pDict = NULL;
		pDict = pObject->objectNamed("catcherPoint");
		CC_BREAK_IF(! pDict);
		x = pDict->valueForKey("x")->intValue();
		y = pDict->valueForKey("y")->intValue();
		// 设置追赶至上面获取的位置
		_pCatcherSprite->setPosition(ccp(x, y));
		// 将追赶精灵添加至图层
		this->addChild(_pCatcherSprite, 1);

		// 设置计时器
		this->scheduleUpdate();


		bRct = true;
	} while (0);

	return bRct;
}

void GamePlayLayer::registerWithTouchDispatcher()
{
	CCDirector::sharedDirector()->getTouchDispatcher()->addTargetedDelegate(
		this,
		1,
		false); // 是否允许别的图层处理触摸事件
}

// 注意：响应单点触摸操作，这个函数必须实现，不能只实现ccTouchEnded
bool GamePlayLayer::ccTouchBegan(cocos2d::CCTouch *pTouch, cocos2d::CCEvent *pEvent)
{
	// 3、玩家精灵的移动
	// 根据触摸操作判断移动方向，并得到新位置的坐标
	CCPoint ptTouch = this->convertTouchToNodeSpace(pTouch); // 触摸时的位置
	CCPoint ptPlayer = _pPlayerSprite->getPosition();     // 玩家精灵的位置
	CCPoint ptMinus = ccpSub(ptTouch, ptPlayer);          // 求出上述两点的差
	// 判断
	if (abs(ptMinus.x) > abs(ptMinus.y))
	{
		if (ptMinus.x > 0)
		{
			ptPlayer.x += _tileMap->getTileSize().width;
		}
		else
		{
			ptPlayer.x -= _tileMap->getTileSize().width;
		}
	}
	else
	{
		if (ptMinus.y > 0)
		{
			ptPlayer.y += _tileMap->getTileSize().height;
		}
		else
		{
			ptPlayer.y -= _tileMap->getTileSize().height;
		}
	}

	// 更新玩家精灵和地图的位置
	UpdatePlayerAndMapPositions(ptPlayer);

	return true;
}

void GamePlayLayer::UpdatePlayerAndMapPositions(cocos2d::CCPoint &ptPos)
{
	// 根据新的玩家精灵位置，求得所在的地图块
	CCPoint ptMap = tileCoordForPosition(ptPos);
	// 获得遮罩层图块ID
	int tileID = _mask->tileGIDAt(ptMap);
	// 如果ID不为0
	if (tileID != 0)
	{
		CCDictionary *pDic = _tileMap->propertiesForGID(tileID);
		if (pDic != NULL)
		{
			// 障碍物
			const CCString *str1 = pDic->valueForKey("obstacles");
			if (str1 && str1->compare("true") == 0)
			{
				CocosDenshion::SimpleAudioEngine::sharedEngine()->playEffect("hit.wav");
				return;
			}

			// 碰撞检测
			const CCString *str2 = pDic->valueForKey("eat");
			if (str2 && str2->compare("can") == 0)
			{
				CocosDenshion::SimpleAudioEngine::sharedEngine()->playEffect("pickup.wav");
				_mask->removeTileAt(ptMap);
				_foreground->removeTileAt(ptMap);
				// 更新显示分数
				char str[100] = {0};
				sprintf(str, "Your Score:%d", ++_score);
				_scoreLabel->setString(str);
			}
		}
	}

	{
		static int x = 0;
		static int y = 0;
		// 显示分数(始终在有上角)
		if (ptPos.x <= _tileMap->getMapSize().width * _tileMap->getTileSize().width -  CCDirector::sharedDirector()->getWinSize().width/2)
		{
			x = ptPos.x + CCDirector::sharedDirector()->getWinSize().width/2 - 80;
			x = x > CCDirector::sharedDirector()->getWinSize().width - 80 ? x : CCDirector::sharedDirector()->getWinSize().width - 80;
		}
		if (ptPos.y <= _tileMap->getMapSize().height * _tileMap->getTileSize().height -  CCDirector::sharedDirector()->getWinSize().height/2)
		{
			y = ptPos.y + CCDirector::sharedDirector()->getWinSize().height/2 - 20;
			y = y > CCDirector::sharedDirector()->getWinSize().height - 20 ? y : CCDirector::sharedDirector()->getWinSize().height - 20;
		}

		_scoreLabel->setPosition(ccp(x, y));
	}

	// a、设置人物位置(防止人物走出地图)
	if (ptPos.x < _tileMap->getTileSize().width * _tileMap->getMapSize().width
		&& ptPos.y < _tileMap->getTileSize().height * _tileMap->getMapSize().height
		&& ptPos.x > 0
		&& ptPos.y >0 )
	{
		CocosDenshion::SimpleAudioEngine::sharedEngine()->playEffect("move.wav");
		_pPlayerSprite->setPosition(ptPos);
	}

	// b、设置窗口显示的地图范围
	// 得到窗口尺寸
	CCSize sz = CCDirector::sharedDirector()->getWinSize();
	// 防止窗口移出地图边界
	int x = MAX(ptPos.x, sz.width/2);  // 左边
	int y = MAX(ptPos.y, sz.height/2); // 下边
	x = MIN(x, _tileMap->getTileSize().width * _tileMap->getMapSize().width - sz.width/2);     // 右边
	y = MIN(y, _tileMap->getTileSize().height * _tileMap->getMapSize().height - sz.height/2);  // 上边

	CCPoint ptDesire = ccp(x, y);
	CCPoint centerOfView = CCPointMake(sz.width/2, sz.height/2);  // 中间点
	CCPoint ptActual = ccpSub(centerOfView, ptDesire);

	this->setPosition(ptActual);  // 移背景
}

cocos2d::CCPoint GamePlayLayer::tileCoordForPosition(const cocos2d::CCPoint &ptPos)
{
	CCPoint pt;
	pt.x = ptPos.x / _tileMap->getTileSize().width;
	pt.y = (_tileMap->getTileSize().height * _tileMap->getMapSize().height - ptPos.y) / _tileMap->getTileSize().height;
	// 化为整数
	pt.x = (int)pt.x;
	pt.y = (int)pt.y;
	
	// 返回
	return pt;
}

void GamePlayLayer::update(float dt)
{
	static int timeCount = 0;
	static int timeMax = 30;

	if (++timeCount < timeMax)
	{
		return;
	}

	CCPoint ptPlayer = _pPlayerSprite->getPosition();
	CCPoint ptCatcher = _pCatcherSprite->getPosition();
	CCPoint ptNewCatcher;

	//if (CCPoint::CCPointEqualToPoint(ptPlayer, ptCatcher))
	if (ptPlayer.equals(ptCatcher))
	{
		//CCDirector::sharedDirector()->end();
		GameOverScene *pGameOverScene = NULL;
		pGameOverScene = GameOverScene::create();
		if (pGameOverScene != NULL)
		{
			CCDirector::sharedDirector()->replaceScene(pGameOverScene);
		}
	}

	if (ptPlayer.x > ptCatcher.x)
	{
		ptNewCatcher = CCPointMake(ptCatcher.x + 1, ptCatcher.y);
	}
	else if (ptPlayer.x < ptCatcher.x)
	{
		ptNewCatcher = CCPointMake(ptCatcher.x - 1, ptCatcher.y);
	}
	else if (ptPlayer.y > ptCatcher.y)
	{
		ptNewCatcher = CCPointMake(ptCatcher.x, ptCatcher.y + 1);
	}
	else if (ptPlayer.y < ptCatcher.y)
	{
		ptNewCatcher = CCPointMake(ptCatcher.x, ptCatcher.y - 1);
	}

	_pCatcherSprite->setPosition(ptNewCatcher);
}