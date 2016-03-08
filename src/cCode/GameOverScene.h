#pragma once
#include "cocos2d.h"
class GameOverScene : public cocos2d::CCScene
{
public:
	GameOverScene(void);
	~GameOverScene(void);

	bool init();
	CREATE_FUNC(GameOverScene);
};

