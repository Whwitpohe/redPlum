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

		// 1����ͼ
		// ���õ�ͼ
		CCTMXTiledMap *pTileMap = CCTMXTiledMap::create("tileMap.tmx");
		CC_BREAK_IF(! pTileMap);
		setTileMap(pTileMap);
		// ���ñ�����
		this->setBackground(_tileMap->layerNamed("background"));
		CC_BREAK_IF(! _background);
		// �������ֲ�
		this->setMask(_tileMap->layerNamed("mask"));
		CC_BREAK_IF(! _mask);
		// ����ǰ����
		this->setForeground(_tileMap->layerNamed("foreground"));
		CC_BREAK_IF(! _foreground);
		// ����ͼ��ӽ�ͼ��
		this->addChild(_tileMap, 1);


		//2����������ʾ��Ҿ���
		// ��������
		CCSprite *pSpritePlayer = CCSprite::create("Player.png");
		CC_BREAK_IF(! pSpritePlayer);
		this->setPlayerSprite(pSpritePlayer);
		// ��ȡ��Ҿ����ڵ�ͼ�е�λ�ã�Ԥ�����ã�
		CCTMXObjectGroup *pObject = _tileMap->objectGroupNamed("objects");
		CC_BREAK_IF(! pObject);
		CCDictionary *pDict = pObject->objectNamed("playerPoint");
		CC_BREAK_IF(! pDict);
		int x = pDict->valueForKey("x")->intValue();
		int y = pDict->valueForKey("y")->intValue();
		// ��������������ȡ��λ��
		_pPlayerSprite->setPosition(ccp(x, y));
		// ����Ҿ��������ͼ��
		this->addChild(_pPlayerSprite, 1);

		// 3����Ҿ�����ƶ�,��ͼ���ƶ�
		// ����������
		this->setTouchEnabled(true);

		// 4��������ʾ
		// ����Label
		_scoreLabel = CCLabelTTF::create("Your Score:0", "Arial", 22);
		CC_BREAK_IF(! _scoreLabel);
		// ������ɫ
		_scoreLabel->setColor(ccc3(0, 0, 0));
		// ����λ��
		_scoreLabel->setPosition(CCPointMake(CCDirector::sharedDirector()->getWinSize().width - 80, CCDirector::sharedDirector()->getWinSize().height - 20));
		// ��Label�����ͼ��
		this->addChild(_scoreLabel, 1);

		// 5���������ֺ���Ч
		// Ԥ��
		CocosDenshion::SimpleAudioEngine::sharedEngine()->preloadBackgroundMusic("background-music-aac.wav");
		CocosDenshion::SimpleAudioEngine::sharedEngine()->preloadEffect("hit.wav");
		CocosDenshion::SimpleAudioEngine::sharedEngine()->preloadEffect("move.wav");
		CocosDenshion::SimpleAudioEngine::sharedEngine()->preloadEffect("pew-pew-lei.wav");
		CocosDenshion::SimpleAudioEngine::sharedEngine()->preloadEffect("pickup.wav");
		CocosDenshion::SimpleAudioEngine::sharedEngine()->preloadEffect("TileMap.wav");
		// ���ű�������
		if (! CocosDenshion::SimpleAudioEngine::sharedEngine()->isBackgroundMusicPlaying())
		{
			CocosDenshion::SimpleAudioEngine::sharedEngine()->playBackgroundMusic("background-music-aac.wav", true);
		}


		//6��׷�Ͼ���
		// ��������
		CCSprite *pSpriteCatcher = CCSprite::create("Player.png");
		CC_BREAK_IF(! pSpriteCatcher);
		this->setCatcherSprite(pSpriteCatcher);
		// ��ȡ׷�Ͼ����ڵ�ͼ�е�λ�ã�Ԥ�����ã�
		pObject = NULL;
		pObject = _tileMap->objectGroupNamed("objects");
		CC_BREAK_IF(! pObject);
		pDict = NULL;
		pDict = pObject->objectNamed("catcherPoint");
		CC_BREAK_IF(! pDict);
		x = pDict->valueForKey("x")->intValue();
		y = pDict->valueForKey("y")->intValue();
		// ����׷���������ȡ��λ��
		_pCatcherSprite->setPosition(ccp(x, y));
		// ��׷�Ͼ��������ͼ��
		this->addChild(_pCatcherSprite, 1);

		// ���ü�ʱ��
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
		false); // �Ƿ�������ͼ�㴦�����¼�
}

// ע�⣺��Ӧ���㴥�������������������ʵ�֣�����ֻʵ��ccTouchEnded
bool GamePlayLayer::ccTouchBegan(cocos2d::CCTouch *pTouch, cocos2d::CCEvent *pEvent)
{
	// 3����Ҿ�����ƶ�
	// ���ݴ��������ж��ƶ����򣬲��õ���λ�õ�����
	CCPoint ptTouch = this->convertTouchToNodeSpace(pTouch); // ����ʱ��λ��
	CCPoint ptPlayer = _pPlayerSprite->getPosition();     // ��Ҿ����λ��
	CCPoint ptMinus = ccpSub(ptTouch, ptPlayer);          // �����������Ĳ�
	// �ж�
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

	// ������Ҿ���͵�ͼ��λ��
	UpdatePlayerAndMapPositions(ptPlayer);

	return true;
}

void GamePlayLayer::UpdatePlayerAndMapPositions(cocos2d::CCPoint &ptPos)
{
	// �����µ���Ҿ���λ�ã�������ڵĵ�ͼ��
	CCPoint ptMap = tileCoordForPosition(ptPos);
	// ������ֲ�ͼ��ID
	int tileID = _mask->tileGIDAt(ptMap);
	// ���ID��Ϊ0
	if (tileID != 0)
	{
		CCDictionary *pDic = _tileMap->propertiesForGID(tileID);
		if (pDic != NULL)
		{
			// �ϰ���
			const CCString *str1 = pDic->valueForKey("obstacles");
			if (str1 && str1->compare("true") == 0)
			{
				CocosDenshion::SimpleAudioEngine::sharedEngine()->playEffect("hit.wav");
				return;
			}

			// ��ײ���
			const CCString *str2 = pDic->valueForKey("eat");
			if (str2 && str2->compare("can") == 0)
			{
				CocosDenshion::SimpleAudioEngine::sharedEngine()->playEffect("pickup.wav");
				_mask->removeTileAt(ptMap);
				_foreground->removeTileAt(ptMap);
				// ������ʾ����
				char str[100] = {0};
				sprintf(str, "Your Score:%d", ++_score);
				_scoreLabel->setString(str);
			}
		}
	}

	{
		static int x = 0;
		static int y = 0;
		// ��ʾ����(ʼ�������Ͻ�)
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

	// a����������λ��(��ֹ�����߳���ͼ)
	if (ptPos.x < _tileMap->getTileSize().width * _tileMap->getMapSize().width
		&& ptPos.y < _tileMap->getTileSize().height * _tileMap->getMapSize().height
		&& ptPos.x > 0
		&& ptPos.y >0 )
	{
		CocosDenshion::SimpleAudioEngine::sharedEngine()->playEffect("move.wav");
		_pPlayerSprite->setPosition(ptPos);
	}

	// b�����ô�����ʾ�ĵ�ͼ��Χ
	// �õ����ڳߴ�
	CCSize sz = CCDirector::sharedDirector()->getWinSize();
	// ��ֹ�����Ƴ���ͼ�߽�
	int x = MAX(ptPos.x, sz.width/2);  // ���
	int y = MAX(ptPos.y, sz.height/2); // �±�
	x = MIN(x, _tileMap->getTileSize().width * _tileMap->getMapSize().width - sz.width/2);     // �ұ�
	y = MIN(y, _tileMap->getTileSize().height * _tileMap->getMapSize().height - sz.height/2);  // �ϱ�

	CCPoint ptDesire = ccp(x, y);
	CCPoint centerOfView = CCPointMake(sz.width/2, sz.height/2);  // �м��
	CCPoint ptActual = ccpSub(centerOfView, ptDesire);

	this->setPosition(ptActual);  // �Ʊ���
}

cocos2d::CCPoint GamePlayLayer::tileCoordForPosition(const cocos2d::CCPoint &ptPos)
{
	CCPoint pt;
	pt.x = ptPos.x / _tileMap->getTileSize().width;
	pt.y = (_tileMap->getTileSize().height * _tileMap->getMapSize().height - ptPos.y) / _tileMap->getTileSize().height;
	// ��Ϊ����
	pt.x = (int)pt.x;
	pt.y = (int)pt.y;
	
	// ����
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