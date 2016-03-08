#pragma once
#include "cocos2d.h"
class GameStartScene : public cocos2d::CCScene
{
public:
	GameStartScene(void);
	~GameStartScene(void);

	bool init();
	CREATE_FUNC(GameStartScene);
};

