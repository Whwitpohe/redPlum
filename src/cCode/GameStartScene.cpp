#include "GameStartScene.h"
#include "GamePlayLayer.h"
USING_NS_CC;

GameStartScene::GameStartScene(void)
{
}


GameStartScene::~GameStartScene(void)
{
}


bool GameStartScene::init()
{
	bool bRct = false;

	do 
	{
		CC_BREAK_IF(! CCScene::init());

		GamePlayLayer *pGamePlatLayer = GamePlayLayer::create();
		CC_BREAK_IF(! pGamePlatLayer);

		this->addChild(pGamePlatLayer, 1);

		bRct = true;
	} while (0);

	return bRct;
}
