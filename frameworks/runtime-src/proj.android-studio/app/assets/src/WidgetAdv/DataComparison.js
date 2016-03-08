/**
 * Created by FanJiaHe on 2016/1/6.
 */

// 数据对比
var DataComparison = function()
{

};


DataComparison.prototype._type = 1;
DataComparison.prototype._numericalA = 0;
DataComparison.prototype._numericalB = 0;


/**
 * @param {number} numericalA 数值A
 * @param {number} numericalB 数值B
 * @param {number} type 类型   1是两个和一起是100%的,2是每个单独占据100%的
 * */
DataComparison.getNewInstance = function(numericalA, numericalB, type)
{
    var dataComparison = new DataComparison();
    dataComparison._type = type;
    dataComparison._numericalA = numericalA;
    dataComparison._numericalB = numericalB;
    return dataComparison.init();
};

/**
 * 刷新
 * @param {number} node
 * @param {number} numericalA 数值A
 * @param {number} numericalB 数值B
 * @param {number} type 类型   1是两个和一起是100%的,2是每个单独占据100%的
 * */
DataComparison.refresh = function(node, numericalA, numericalB, type)
{
    var sum = 0;
    if (type == 1)
    {
        sum = numericalA + numericalB;
    } else if (type == 2)
    {
        sum = 100;
    }

    if (sum == 0)
    {
        numericalA = 50;
        numericalB = 50;
    }



    var loadingBar = node.getChildByTag(1);
    loadingBar.setPercent(100 * (numericalA / sum) || 0);
    loadingBar.setAnchorPoint(numericalA / sum, 0.5);
    loadingBar.setScaleX(0.5);

    var loadingBar2 = node.getChildByTag(2);
    loadingBar2.setPercent(100 * (numericalB / sum) || 0);
    loadingBar2.setAnchorPoint(numericalB / sum, 0.5);
    loadingBar2.setScaleX(0.5);
    loadingBar2.setFlippedX(true);

    loadingBar.loadTexture(numericalA >= numericalB
        ? res.SliderGreen
        : res.SliderOrange);

    loadingBar2.loadTexture(numericalA >= numericalB
        ? res.SliderOrange
        : res.SliderGreen);

};

DataComparison.prototype.init = function()
{
    var sum = 0;
    if (this._type == 1)
    {
        sum = this._numericalA + this._numericalB;
    } else if (this._type == 2)
    {
        sum = 100;
    }

    if (sum == 0)
    {
        this._numericalA = 50;
        this._numericalB = 50;
    }
    var node = new cc.Node();
    var loadingBar = new ccui.LoadingBar(
        this._numericalA >= this._numericalB
            ? res.SliderGreen
            : res.SliderOrange,
        100 * (this._numericalA / sum)
    );
    loadingBar.setAnchorPoint(this._numericalA / sum, 0.5);
    loadingBar.setTag(1);
    loadingBar.setScaleX(0.5);

    var loadingBar2 = new ccui.LoadingBar(this._numericalA >= this._numericalB
            ? res.SliderOrange
            : res.SliderGreen,
        100 * (this._numericalB / sum));
    loadingBar2.setAnchorPoint(this._numericalB / sum, 0.5);
    loadingBar2.setScaleX(0.5);
    loadingBar2.setTag(2);
    loadingBar2.setFlippedX(true);

    // 背景
    var backGround = new cc.Sprite(res.MaskWhite);
    backGround.setAnchorPoint(0.5, 0.5);

    node.addChild(backGround);
    node.addChild(loadingBar);
    node.addChild(loadingBar2);
    return node;
};