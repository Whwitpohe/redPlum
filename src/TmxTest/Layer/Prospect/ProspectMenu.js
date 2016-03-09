/**
 * Created by FanJiaHe on 2016/2/27.
 */


var ProspectMenu = cc.Layer.extend({
    _mainLayer: null,
    _labelGold: null,
    ctor: function()
    {
        this._super();
        var prospect = LoadLayer.load(res.ProspectMenu);
        this._mainLayer = prospect;
        prospect.show(this);

        var personal = prospect.getElement("personal");
        var gold =  prospect.getElement("gold");
        var backGround = cc.Sprite(imageOperation.mask.CIRCLE);

        var personalPhoto = imageOperation.makeCutButton(prospectMenuControl._hero._image, imageOperation.type.CIRCLE, 1, "personalPhoto", prospectMenuControl.onClicked, this);
        personalPhoto.setPosition(backGround.getContentSize().width * 0.5, backGround.getContentSize().height * 0.5);
        backGround.addChild(personalPhoto);

        this._labelGold = new cc.LabelTTF(prospectMenuControl._hero._gold + "金币", "", 32);
        gold.addChild(this._labelGold);

        personal.addChild(backGround);
        return true;
    }

});