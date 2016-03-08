#include "GameOverLayer.h"
using namespace cocos2d;

GameOverLayer::GameOverLayer(void)
{
}


GameOverLayer::~GameOverLayer(void)
{
}


bool GameOverLayer::init()
{
	bool bRct = false;

	do 
	{
		CC_BREAK_IF(! CCLayerColor::initWithColor(ccc4(255, 255, 255, 255)));

		bRct = true;
	} while (0);

	return bRct;
}