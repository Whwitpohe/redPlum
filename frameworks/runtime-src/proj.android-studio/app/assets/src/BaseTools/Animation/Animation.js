/**
 * Created by FanJiaHe on 2015/11/25.
 */

var Animation = function()
{

};

Animation.createAnimation = function()
{
    var frames = [];
    var prefix = "res/man/";
    for (var temp_x = 0; temp_x < 4; temp_x++)
    {
        var fileName = prefix + temp_x + ".png";
        var frame = cc.SpriteFrame.create(fileName, cc.rect(0,0,495,495));
        frames.push(frame);
    }
    var animation = new cc.Animation(frames, 0.05);
    var action = new cc.Animate(animation);
    return action;
};