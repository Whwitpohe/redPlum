/**
 * Created by FanJiaHe on 2016/2/25.
 */

var BiologyData = function()
{

};

BiologyData.prototype._idx = null;   // index
BiologyData.prototype._gameId = null;  // 游戏Id
BiologyData.prototype._age = null; // 年龄
BiologyData.prototype._sex = null; // 性别
BiologyData.prototype._race = null;    // 种族
BiologyData.prototype._grade = null;   // 等级
BiologyData.prototype._name = null;    // 姓名
BiologyData.prototype._icon = null;    // 图标
BiologyData.prototype._character = null;   // 性格
BiologyData.prototype._talent = null;  //天赋
BiologyData.prototype._hp = null;  // 血量
BiologyData.prototype._mp = null;  // 魔法值
BiologyData.prototype._sp = null;  // 学习点
BiologyData.prototype._attack = null;  // 攻击力
BiologyData.prototype._defense = null; // 防御力
BiologyData.prototype._aspd = null;    // 攻速
BiologyData.prototype._mspd = null;    // 移速
BiologyData.prototype._rspd = null;    // 释放速度
BiologyData.prototype._image = null;    // 静态图像
BiologyData.prototype._gold = null;    // 金币啊大金币


//
BiologyData.prototype._sprite = null;    // 携带精灵
BiologyData.prototype._bagItems = null; // 背包呀啊


BiologyData.prototype.getIndex = function()
{
    return this._idx;
};