#pragma once
#include "cocos2d.h"
class GamePlayLayer : public cocos2d::CCLayer
{
public:
	GamePlayLayer(void);
	~GamePlayLayer(void);

	bool init();
	CREATE_FUNC(GamePlayLayer);

	// 1����ͼ
	// �����ͼ
	CC_SYNTHESIZE_RETAIN(cocos2d::CCTMXTiledMap*, _tileMap, TileMap);
	// ������
	CC_SYNTHESIZE_RETAIN(cocos2d::CCTMXLayer*, _background, Background);
	// ���ֲ�
	CC_SYNTHESIZE_RETAIN(cocos2d::CCTMXLayer*, _mask, Mask);
	// ǰ����
	CC_SYNTHESIZE_RETAIN(cocos2d::CCTMXLayer*, _foreground, Foreground);

	// 2����������ʾ��Ҿ���
	CC_SYNTHESIZE_RETAIN(cocos2d::CCSprite*, _pPlayerSprite, PlayerSprite);

	// 3����Ҿ�����ƶ�,��ͼ���ƶ�
	// ������Ӧ
	void registerWithTouchDispatcher();
	bool ccTouchBegan(cocos2d::CCTouch *pTouch, cocos2d::CCEvent *pEvent);
	// ������Ҿ���͵�ͼ��λ��
	void UpdatePlayerAndMapPositions(cocos2d::CCPoint &ptPos);
	// ��õ����ڵĵ�ͼ����
	cocos2d::CCPoint tileCoordForPosition(const cocos2d::CCPoint &ptPos);

	// 4��������ʾ
	cocos2d::CCLabelTTF *_scoreLabel;
	int _score;

	// 6��׷�Ͼ���
	CC_SYNTHESIZE_RETAIN(cocos2d::CCSprite*, _pCatcherSprite, CatcherSprite);
	void update(float dt);

};

