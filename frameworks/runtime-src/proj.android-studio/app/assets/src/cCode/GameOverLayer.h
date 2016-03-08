#pragma once
#include "cocos2d.h"
class GameOverLayer : public cocos2d::CCLayerColor
{
public:
	GameOverLayer(void);
	~GameOverLayer(void);

	bool init();
	CREATE_FUNC(GameOverLayer);
};

