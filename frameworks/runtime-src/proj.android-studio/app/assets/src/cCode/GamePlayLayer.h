#pragma once
#include "cocos2d.h"
class GamePlayLayer : public cocos2d::CCLayer
{
public:
	GamePlayLayer(void);
	~GamePlayLayer(void);

	bool init();
	CREATE_FUNC(GamePlayLayer);

	// 1、地图
	// 方块地图
	CC_SYNTHESIZE_RETAIN(cocos2d::CCTMXTiledMap*, _tileMap, TileMap);
	// 背景层
	CC_SYNTHESIZE_RETAIN(cocos2d::CCTMXLayer*, _background, Background);
	// 遮罩层
	CC_SYNTHESIZE_RETAIN(cocos2d::CCTMXLayer*, _mask, Mask);
	// 前景层
	CC_SYNTHESIZE_RETAIN(cocos2d::CCTMXLayer*, _foreground, Foreground);

	// 2、创建和显示玩家精灵
	CC_SYNTHESIZE_RETAIN(cocos2d::CCSprite*, _pPlayerSprite, PlayerSprite);

	// 3、玩家精灵的移动,地图的移动
	// 触摸响应
	void registerWithTouchDispatcher();
	bool ccTouchBegan(cocos2d::CCTouch *pTouch, cocos2d::CCEvent *pEvent);
	// 更新玩家精灵和地图的位置
	void UpdatePlayerAndMapPositions(cocos2d::CCPoint &ptPos);
	// 求得点所在的地图方块
	cocos2d::CCPoint tileCoordForPosition(const cocos2d::CCPoint &ptPos);

	// 4、分数显示
	cocos2d::CCLabelTTF *_scoreLabel;
	int _score;

	// 6、追赶精灵
	CC_SYNTHESIZE_RETAIN(cocos2d::CCSprite*, _pCatcherSprite, CatcherSprite);
	void update(float dt);

};

