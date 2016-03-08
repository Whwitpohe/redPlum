#include "GameOverScene.h"
#include "GameOverLayer.h"
using namespace cocos2d;

GameOverScene::GameOverScene(void)
{
}


GameOverScene::~GameOverScene(void)
{
}


bool GameOverScene::init()
{
	bool bRct = false;

	do 
	{
		CC_BREAK_IF(! CCScene::init());

		GameOverLayer *pGameOverLayer = NULL;
		pGameOverLayer = GameOverLayer::create();
		CC_BREAK_IF(! pGameOverLayer);

		this->addChild(pGameOverLayer);

		bRct = true;
	} while (0);

	return bRct;
}