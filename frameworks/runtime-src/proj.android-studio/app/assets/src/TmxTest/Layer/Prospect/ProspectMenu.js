/**
 * Created by FanJiaHe on 2016/2/27.
 */


var ProspectMenu = cc.Layer.extend({
    _mainLayer: null,
    ctor: function()
    {
        this._super();
        var prospect = LoadLayer.load(res.ProspectMenu);
        this._mainLayer = prospect;
        prospect.show(this);

        var personal = prospect.getElement("personal");
        var backGround = cc.Sprite(imageOperation.mask.CIRCLE);

        var personalPhoto = imageOperation.makeCutButton(prospectMenuControl._hero._image, imageOperation.type.CIRCLE, 1, "personalPhoto", prospectMenuControl.onClicked, this);
        personalPhoto.setPosition(backGround.getContentSize().width * 0.5, backGround.getContentSize().height * 0.5);
        backGround.addChild(personalPhoto);

        personal.addChild(backGround);
        return true;
    }

});