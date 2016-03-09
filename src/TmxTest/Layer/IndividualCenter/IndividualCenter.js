/**
 * Created by FanJiaHe on 2016/3/3.
 */

var IndividualCenter = cc.Layer.extend({
    _mainLayer: null,
    _itemView: null,
    _attributeView: null,
    _title: null,
    _buttonAttribute: null,
    _buttonBag: null,
    _buttonPet: null,
    _tab: null,
    ctor: function()
    {
        console.log("创建 IndividualCenter");
        this._super();
        this.initData();
        this.initLayer();
        this.initControl();
        this.createView();
        this.reshowView();
        return true;
    },
    onEnter: function()
    {
        this._super();
        this.refreshUi();
        console.log("显示 IndividualCenter");
    },
    initData: function()
    {
        globalApi.removeAllData(individualCenterControl._heroAttribute);
        individualCenterControl._heroAttribute = [];
        individualCenterControl._heroAttribute = globalApi.o2a_2(individualCenterControl._hero);
        // 删除第十九个
        individualCenterControl._heroAttribute.pop();

        individualCenterControl._curBag = individualCenterControl._hero._bagItems[individualCenterControl._curBagType];
    },
    initLayer: function()
    {
        var IndividualCenter = LoadLayer.load(res.IndividualCenter);
        this._mainLayer = IndividualCenter;
        IndividualCenter.show(this);
    }
    ,
    initControl: function()
    {
        this._title = this._mainLayer.getElement("title");
        this._buttonAttribute = this._mainLayer.getElement("attribute");
        this._buttonAttribute.addTouchEventListener(individualCenterControl.onClicked, this);

        this._buttonBag = this._mainLayer.getElement("bag");
        this._buttonBag.addTouchEventListener(individualCenterControl.onClicked, this);

        this._buttonPet = this._mainLayer.getElement("pet");
        this._buttonPet.addTouchEventListener(individualCenterControl.onClicked, this);

        this._tab = this._mainLayer.getElement("tab");
        this._tab.setVisible(false);

        console.log("this._tab is" + JSON.stringify(this._tab.getContentSize()));
        var back = this._mainLayer.getElement("back");
        back.addTouchEventListener(individualCenterControl.onClicked, this);
    },
    createView: function()
    {
        this.createAttributeView();
        this.createItemView();
    },
    createAttributeView: function()
    {
        var totalCell = individualCenterControl._heroAttribute.length;
        var itemArea = this._mainLayer.getElement("item");
        var rows = 5;
        var columns = 2;
        individualCenterControl._heroAttributeCellSize = cc.size(itemArea.getContentSize().width / columns
            , itemArea.getContentSize().height / rows);

        this._attributeView = TableViewDelegate.newInstance(cc.p(0, 0), itemArea.getContentSize(), rows, totalCell, columns,
            null, cc.SCROLLVIEW_DIRECTION_VERTICAL, cc.TABLEVIEW_FILL_TOPDOWN,
            true, itemArea, individualCenterControl.createAttributeCell,
            individualCenterControl.updateAttributeCell,
            individualCenterControl.touchAttributeCellCallBack.bind(this));

        this._attributeView.setVisible(false);

        // // 设置第一个的位置
        // if (!taskControl._notRecordOffset)
        // {
        //     return;
        // }
        // console.log("卧槽竟然有偏移量");
        // this._notRecordView.setTableViewOffset(taskControl._notRecordOffset.y);
    },
    createItemView: function()
    {
        var totalCell = individualCenterControl._curBag.length;

        var itemArea = this._mainLayer.getElement("item");
        var rows = 5;
        var columns = 6;
        var itemAreaSize = cc.size(itemArea.getContentSize().width,
            itemArea.getContentSize().height - this._tab.getContentSize().height);

        individualCenterControl._heroItemSize = cc.size(itemAreaSize.width / columns
            , itemAreaSize.height / rows);

        this._itemView = TableViewDelegate.newInstance(cc.p(0, 0), itemAreaSize, rows, totalCell, columns,
            null, cc.SCROLLVIEW_DIRECTION_VERTICAL, cc.TABLEVIEW_FILL_TOPDOWN,
            true, itemArea, individualCenterControl.createItemCell,
            individualCenterControl.updateItemCell,
            individualCenterControl.touchItemCellCallBack.bind(this));

        this._itemView.setVisible(false);
        this.createExpandMenu();
    },
    createExpandMenu: function()
    {
        // 创建菜单
        var expandMenu = ExpandMenu.getNewInstance(cc.p(this._tab.getContentSize().width *
                                                        0.5, this._tab.getContentSize().height * 0.5),
            ExpandMenu.actionType.LEFT_DOWN, 4, this._tab.getContentSize(), ExpandMenu._directionType.HORIZONTAL);
        expandMenu.getListView().setAnchorPoint(0.5, 0.5);
        expandMenu._autoDisappear = false;

        for (var key in individualCenterControl._hero._bagItems)
        {
            if (individualCenterControl._hero._bagItems.hasOwnProperty(key))
            {
                // 闭包导致只能取到最终值, 解决方法,创建一个立即执行的函数取到当前值
                (function(index)
                {
                    var item = expandMenu.createItem(languageControl.getCurLanguage(index), true, function()
                    {
                        individualCenterControl.switchBagView(index);
                    }, null, true);

                    expandMenu.getListView().pushBackCustomItem(item);
                })(key);
            }
        }
        expandMenu.show(this._tab);
    },
    reshowView: function()
    {
        var attributeViewCellCount = individualCenterControl._heroAttribute.length;
        this._attributeView.reshow(attributeViewCellCount);

        var itemCellCount = individualCenterControl._curBag.length;
        this._itemView.reshow(itemCellCount);
    },
    refreshUi: function()
    {
        this.initData();
        this.reshowView();
        individualCenterControl.refreshView();
        // console.log("-----------------这个是猪脚" + JSON.stringify(individualCenterControl._hero));
    }
});

