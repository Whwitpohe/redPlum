/**
 * Created by FanJiaHe on 2016/3/3.
 */

var IndividualCenter = cc.Layer.extend({
    _mainLayer: null,
    _itemView: null,
    _attributeView: null,
    ctor: function()
    {
        console.log("创建");
        this._super();
        this.initData();
        this.initLayer();
        this.initControl();
        this.createView();

        return true;
    },
    onEnter: function()
    {
        this._super();
        this.refreshUi();
        console.log("显示");
    },
    initData: function()
    {
        globalApi.removeAllData(individualCenterControl._heroAttribute);
        individualCenterControl._heroAttribute = [];
        individualCenterControl._heroAttribute = globalApi.o2a_2(individualCenterControl._hero);


        globalApi.removeAllData(individualCenterControl._heroItems);
        individualCenterControl._heroItems = [];
        individualCenterControl._heroItems = globalApi.o2a(itemControl._allItem);
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
        console.log("属性有这么多" + totalCell);
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
        // taskControl._notStartView = this._notRecordView;
        // if (!taskControl._notRecordOffset)
        // {
        //     return;
        // }
        // console.log("卧槽竟然有偏移量");
        // this._notRecordView.setTableViewOffset(taskControl._notRecordOffset.y);
    },
    createItemView:function()
    {
        var totalCell = individualCenterControl._heroItems.length;

        console.log("道具有这么多" + totalCell);
        var itemArea = this._mainLayer.getElement("item");
        var rows = 5;
        var columns = 5;
        individualCenterControl._heroItemSize = cc.size(itemArea.getContentSize().width / columns
            , itemArea.getContentSize().height / rows);

        this._itemView = TableViewDelegate.newInstance(cc.p(0, 0), itemArea.getContentSize(), rows, totalCell, columns,
            null, cc.SCROLLVIEW_DIRECTION_VERTICAL, cc.TABLEVIEW_FILL_TOPDOWN,
            true, itemArea, individualCenterControl.createItemCell,
            individualCenterControl.updateItemCell,
            individualCenterControl.touchItemCellCallBack.bind(this));
    },
    refreshUi: function()
    {
        console.log("-----------------这个是猪脚" + JSON.stringify(individualCenterControl._hero));
    }
});

