/**
 * Created by FanJiaHe on 2016/2/19.
 */

var modifyTime = {};


/**
 * 修改时间
 * */
var ModifyTime = function()
{

};

ModifyTime.prototype._confirmCallBack = null;

ModifyTime.prototype._curMatch = null;
ModifyTime.prototype._curTime = null;
ModifyTime.prototype._layer = null;
ModifyTime.prototype._customData = null;
ModifyTime.prototype._curStageIndex = null;
ModifyTime.prototype._curMinuteIndex = null;
ModifyTime.prototype._curSecondIndex = null;


ModifyTime.prototype._cellSize = null;

ModifyTime.prototype._secondArray = [];
ModifyTime.prototype._minuteArray = [];
ModifyTime.prototype._stageArray = [];


/**
 * 获取一个新的实例
 *
 * */
modifyTime.getNewInstance = function(match, curStageIndex, curTime, callBack)
{
    var ModifyTimeLayer = new ModifyTime();

    ModifyTimeLayer._curMatch = match;
    ModifyTimeLayer._curStageIndex = curStageIndex;
    ModifyTimeLayer._curTime = curTime;
    ModifyTimeLayer._confirmCallBack = callBack;

    ModifyTimeLayer.initLayer();
    return ModifyTimeLayer;
};


/**
 * 初始化基础数据
 * */
ModifyTime.prototype.initData = function()
{
    this.initSecond();
    this.initStage();
};

/**
 * 初始化秒钟
 * */
ModifyTime.prototype.initSecond = function()
{
    this._secondArray = [];
    var originalFirstNumber = 0;
    var nowFirstNumber = originalFirstNumber - 2;

    for (var count = 0; count < 64; count++)
    {

        var curNumber = nowFirstNumber;
        if (nowFirstNumber < 0 || nowFirstNumber > 59)
        {
            curNumber = null;
        }
        this._secondArray.push(curNumber);
        nowFirstNumber++;
    }
};


/**
 * 初始化阶段数据
 * */
ModifyTime.prototype.initStage = function()
{
    var stage = this._curMatch.getStage();
    var rule = this._curMatch.getRule();

    this._minuteArray = [];
    this._stageArray = [];
    var tempStageArray = [];
    var tempMinuteArray = [];

    for (var count = 0; count < stage.length; count++)
    {
        var curStage = stage[count];
        var text = "";
        var auxiliaryTime = 0;
        switch (curStage.getType())
        {
            case StageData._type.USUALLY:
            {
                text = "第";
                auxiliaryTime = rule.getSectionTime();
                break;
            }
            case StageData._type.OVERTIME:
            {
                text = "加";
                auxiliaryTime = rule.getSectionTimeOvertime();
                break;
            }
            case StageData._type.PENALTY:
            {
                continue;
            }
            default:
            {
                text = "第";
                auxiliaryTime = rule.getSectionTime();
                break;
            }
        }
        text = text + (curStage.getIndex() + 1) + "节";
        tempStageArray.push(text);
        tempMinuteArray.push(auxiliaryTime);
    }

    // 加工
    var originalFirstNumber = 0;
    var nowFirstNumber = originalFirstNumber - 2;
    var length = tempStageArray.length + 4;
    for (count = 0; count < length; count++)
    {
        curStage = null;
        var curMinute = null;
        if (nowFirstNumber < 0 || nowFirstNumber > length - 1)
        {
            curStage = null;
            curMinute = null;
        } else
        {
            curStage = tempStageArray[nowFirstNumber];
            if (count >= 2 && count < length - 2)
            {
                this._minuteArray.push([]);
                var originalFirstNumber1 = 0;
                var nowFirstNumber1 = originalFirstNumber1 - 2;
                var length1 = tempMinuteArray[count - 2] + 1;
                for (var temp_x = 0; temp_x < length1 + 4; temp_x++)
                {
                    var curNumber = nowFirstNumber1;
                    if (nowFirstNumber1 < 0 || nowFirstNumber1 > length1 - 1)
                    {
                        curNumber = null;
                    }
                    this._minuteArray[count - 2].push(curNumber);
                    nowFirstNumber1++;
                }
            }
        }
        this._stageArray.push(curStage);
        nowFirstNumber++;
    }
};


/**
 * 初始化界面
 * */
ModifyTime.prototype.initLayer = function()
{
    // 初始化数据
    this.initData();

    this._layer = LoadLayer.load(res.ModifyTime_json);

    // 关闭按钮
    var closeButton = this._layer.getElement("close");
    closeButton.addTouchEventListener(this.onClicked, this);


    // 确定按钮
    var confirmButton = this._layer.getElement("confirm");
    confirmButton.addTouchEventListener(this.onClicked, this);

    var tempTime = this._curTime.split(":"); //字符分割
    var curMinute = tempTime[0];
    var curSecond = tempTime[1];


    var stageArea = this._layer.getElement("area1");
    var minuteArea = this._layer.getElement("area2");
    var secondArea = this._layer.getElement("area3");

    var areaSize = stageArea.getContentSize();
    var margin = stageArea.getChildByName("margin");
    var marginSize = margin.getContentSize();

    this._cellSize = cc.size(marginSize.width / 1, marginSize.height / 5);

    var pos = cc.p((areaSize.width - marginSize.width) * 0.5, (areaSize.height - marginSize.height) * 0.5);
    this._stageView = TableViewDelegate.newInstance(pos, marginSize,
        5, this._stageArray.length, 1, null, cc.SCROLLVIEW_DIRECTION_VERTICAL, cc.TABLEVIEW_FILL_TOPDOWN, true,
        stageArea, this.createStageArea.bind(this), this.updateStageArea.bind(this),
        null
    );
    this._stageView._scrollCellCallBack = this.StageScrollCellCallBack.bind(this);
    this._stageView.setTableViewCellPos(1 + this._curStageIndex, 0, true);


    this.minuteView = TableViewDelegate.newInstance(pos, marginSize,
        5, this._minuteArray[this._curStageIndex].length, 1, null, cc.SCROLLVIEW_DIRECTION_VERTICAL, cc.TABLEVIEW_FILL_TOPDOWN, true,
        minuteArea, this.createMinuteArea.bind(this), this.updateMinuteArea.bind(this),
        null
    );
    this.minuteView._scrollCellCallBack = this.MinuteScrollCellCallBack.bind(this);
    this.minuteView.setTableViewCellPos(1 + Number(curMinute), 0);

    this.secondView = TableViewDelegate.newInstance(pos, marginSize,
        5, this._secondArray.length, 1, null, cc.SCROLLVIEW_DIRECTION_VERTICAL, cc.TABLEVIEW_FILL_TOPDOWN, true,
        secondArea, this.createSecondArea.bind(this), this.updateSecondArea.bind(this),
        null
    );
    this.secondView._scrollCellCallBack = this.SecondScrollCellCallBack.bind(this);
    this.secondView.setTableViewCellPos(1 + Number(curSecond), 0);
};


/**
 * Stage列表滑动回调
 * */
ModifyTime.prototype.StageScrollCellCallBack = function(table, maxIndex, displayRows)
{
    var curIndex = this.scrollCellCallBack(table, maxIndex, displayRows);
    if (curIndex != this._curStageIndex + 2)
    {
        this._curStageIndex = curIndex - 2;
        this.minuteView.reshow(this._minuteArray[this._curStageIndex].length);
    }
};


/**
 * Stage列表滑动回调
 * */
ModifyTime.prototype.MinuteScrollCellCallBack = function(table, maxIndex, displayRows)
{
    var curIndex = this.scrollCellCallBack(table, maxIndex, displayRows);
    if (curIndex != this._curMinuteIndex)
    {
        this._curMinuteIndex = curIndex;
    }
};


/**
 * Stage列表滑动回调
 * */
ModifyTime.prototype.SecondScrollCellCallBack = function(table, maxIndex, displayRows)
{
    var curIndex = this.scrollCellCallBack(table, maxIndex, displayRows);
    if (curIndex != this._curSecondIndex)
    {
        this._curSecondIndex = curIndex;
    }
};


/**
 * 滑动回调
 * */
ModifyTime.prototype.scrollCellCallBack = function(table, maxIndex, displayRows)
{
    if (maxIndex < displayRows)
    {
        return null;
    }

    var middleIndex = parseInt(displayRows * 0.5);
    var index = table.getIndex(middleIndex);

    for (var count = -middleIndex; count < middleIndex + 1; count++)
    {
        if (index + count > 0 && index + count < maxIndex)
        {
            var cell = table.getCurrentCell(index - count);
            if (cell)
            {
                var numberLabel = cell.getChildByTag(101);
                var base = (Math.abs(count) + 1);

                numberLabel.setScale(3 / base);
                numberLabel.setColor(cc.color(255 / base, 255 / base, 255 / base));
            }
        }
    }

    return index;
};

/**
 * 创建 SecondArea
 * */
ModifyTime.prototype.createSecondArea = function(node, idx)
{
    this.createCell(node, idx, this._secondArray);
};

/**
 * 更新 SecondArea
 * */
ModifyTime.prototype.updateSecondArea = function(cell, idx)
{
    this.updateCell(cell, idx, this._secondArray);
};

/**
 * 创建 StageArea
 * */
ModifyTime.prototype.createStageArea = function(node, idx)
{
    this.createCell(node, idx, this._stageArray);
};

/**
 * 更新 StageArea
 * */
ModifyTime.prototype.updateStageArea = function(cell, idx)
{
    this.updateCell(cell, idx, this._stageArray);
};

/**
 * 创建 MinuteArea
 * */
ModifyTime.prototype.createMinuteArea = function(node, idx)
{
    this.createCell(node, idx, this._minuteArray[this._curStageIndex]);
};

/**
 * 更新 MinuteArea
 * */
ModifyTime.prototype.updateMinuteArea = function(cell, idx)
{
    this.updateCell(cell, idx, this._minuteArray[this._curStageIndex]);
};


/**
 * 创建cell
 * */
ModifyTime.prototype.createCell = function(node, idx, data)
{
    var size = this._cellSize;
    var curSecond = data[idx];

    var numberLabel = new cc.LabelTTF("", globalApi.cikers.FONT, 36, null, cc.TEXT_ALIGNMENT_CENTER, cc.TEXT_ALIGNMENT_CENTER);
    numberLabel.setTag(101);
    numberLabel.setPosition(size.width * 0.5, size.height * 0.5);
    numberLabel.setColor(cc.color(100, 100, 100));
    node.addChild(numberLabel);

    if (curSecond != null)
    {
        numberLabel.setString(String(curSecond));
    }
};

/**
 * 更新cell
 * */
ModifyTime.prototype.updateCell = function(cell, idx, data)
{
    var numberLabel = cell.getChildByTag(101);
    numberLabel.setColor(cc.color(100, 100, 100));

    var curSecond = data[idx];

    if (curSecond != null)
    {
        numberLabel.setString(String(curSecond));
    } else
    {
        numberLabel.setString("");
    }
};


/**
 * 点击按钮的事件分发
 * */
ModifyTime.prototype.onClicked = function(object, type)
{
    var objectName = object.getName();  // 获取名称标识

    switch (type)
    {
        case ccui.Widget.TOUCH_BEGAN:
            break;
        case ccui.Widget.TOUCH_MOVED:
            break;
        case ccui.Widget.TOUCH_ENDED:
        {
            switch (objectName)
            {
                case "close":
                {
                    this.disappear();
                    break;
                }
                case "confirm":
                {
                    var curStage = this._stageArray[this._curStageIndex + 2];
                    var curMinute = this._minuteArray[this._curStageIndex][this._curMinuteIndex];
                    var curSecond = this._secondArray[this._curSecondIndex];

                    this._customData = {
                        stage: curStage,
                        minute: curMinute,
                        second: curSecond
                    };
                    console.log("当前选中是" + JSON.stringify(this._customData));
                    this.disappear();
                    // 返回自定义参数据
                    if (this._confirmCallBack)
                    {
                        this._confirmCallBack(this._customData);
                    }
                    break;
                }
                default:
                    break;
            }
            break;
        }
        case ccui.Widget.TOUCH_CANCELED:
            break;
        default:
    }
};


/**
 * 显示在pSender之上
 * @param {object} pSender
 * */
ModifyTime.prototype.show = function(pSender)
{
    this._layer.show(pSender);
};


/**
 * 消失
 * */
ModifyTime.prototype.disappear = function()
{
    this._layer.disappear();
};