/**
 * Created by bingling on 11/25/15.
 */

var CustomCreateCell = {
    /**
     * 为TableView 创建新的TableViewCell
     * @param {cc.size} size: 每一个Cell的size
     * @param {number} numCol: 需要创建的列的数量
     * @param {object} targetNode: 要创建TableView的对象
     */
    createCell: function(idx, targetNode)
    {
        var cell = new NTableViewCell();
        targetNode.createCell(cell, idx);
        return cell;
    },

    /**
     * 更新TableViewCell
     * @param {object} cell: 需要更新的Cell
     * @param {number} idx: 需要更新的Cell的 index
     * @param {object} targetNode: 要创建的TableView的对象
     */
    updateCell: function(cell, idx, targetNode)
    {
        targetNode.updateCell(cell, idx);
    }

};


var CustomTableView = cc.Layer.extend({
    _tableView: null,
    _canSliding: true,
    _slidingRounding: false,
    _numRows: 0,
    _totalCells: 0,
    _displayRows: 0,  //cellCnt 所有涉及到Cell 都需要改名。
    _numCols: 0,
    _type: 0,
    _numberCells: 0,
    _fileOrder: 0,
    _tablePos: cc.p(0, 0),
    _callBack: null,
    _tableSize: cc.size(0, 0),
    _rowSize: cc.size(0, 0),
    _pSender: null,
    _file: null,
    _node: null,
    _nodePos: cc.p(0, 0),
    _cellLayer: null,
    _touchEnabled: true,
    _touchStartPos: cc.p(0, 0),
    _targetStartPos: cc.p(0, 0),
    _createCellCallBack: null,
    _updateCellCallBack: null,
    _scrollCellCallBack: null,

    ctor: function()
    {
        self = this;
        this._super();
    },

    /**
     * 触摸触发
     * @param {object} table 当前的TableView
     * @param {object} cell 当前触摸到的cell
     */
    tableCellTouched: function(table, cell)
    {
        console.log("current touch cell index is " + cell.getIdx());
        if (!(this._pSender && this._callBack))
        {
            return;
        }
        this._callBack(cell.getIdx(), this._pSender, cell);
    },

    scrollViewDidScroll: function(table)
    {
        if (!(this._pSender && this._scrollCellCallBack))
        {
            return;
        }
        this._scrollCellCallBack(this, this._numRows, this._displayRows);
    },


    /**
     * 获取每一个Cell的size
     * @param {object} table: 当前的TableView
     * @param {number} idx: Cell的索引
     * @returns {*}
     */
    tableCellSizeForIndex: function(table, idx)
    {
        return cc.size(this._tableSize.width / this._numCols, this._tableSize.height / this._displayRows);
    },

    /**
     * 复写TableView Data Source函数，用于创建和更新Cell
     * @param {object} table: 当前的TableView
     * @param {number} idx: Cell的索引
     * @returns {*}
     */
    tableCellAtIndex: function(table, idx)
    {
        var cell = table.dequeueCell();
        var node;
        if (!cell)
        {
            cell = new NTableViewCell();
            if (!this._file)
            {
                this._createCellCallBack(cell, idx);
            } else
            {
                node = this.getCellNode(this._file);
                this._createCellCallBack(node, idx);
                cell.addChild(node);
            }

            //另外一种创建Cell的方式
            //console.log("new cell");
            //cell = CustomCreateCell.createCell(idx, this._pSender);


        } else
        {
            this._updateCellCallBack(cell, idx);

            //var node = cell.getChildren();
            //LoadLayer.printAllWidgetName(node);

            //另外一种更新cell的方式
            //console.log("update cell: " + cell.getChildrenCount());
            //CustomCreateCell.updateCell(cell, idx, this._pSender);

        }
        return cell;
    },

    /**
     * 返回TableView中的Cell的总数
     * @param {NTableView} table
     * @returns {number}
     */
    numberOfCellsInTableView: function(table)
    {
        return this._totalCells;
    },

    /**
     * 获取需要的Cell的行数量
     * @param {object} table: 当前的TableView
     * @returns {number} 返回能够显示的Cell的总数量
     */
    numberOfCellsInRowTableView: function(table)
    {
        this._numRows = Math.ceil(this._totalCells / this._numCols);
        return this._numRows;
    },


    numberOfCellsRowShowTableView: function(table)
    {
        return this._displayRows;
    },

    /**
     * 获取需要的Cell的总数量
     * @param {object} table: 当前的TableView
     * @returns {number} 返回能够显示的Cell的总数量
     */
    numberOfCellsInColTableView: function(table)
    {
        return this._numCols;
    },

    /**
     * @param {number} numbCells: cell的总数量，并刷新
     * 刷新TableView
     */
    reshow: function(numCells)
    {

        this._totalCells = numCells;
        this._tableView.reloadData();
        console.log("reShow tableView");
    },

    getCurrentCell: function(idx)
    {
        return this._tableView.cellAtIndex(idx);
    }

});

/**
 * 设置是否可以触摸
 * @param {boolean} isEnable: true 可以触摸， false: 屏蔽触摸
 */
CustomTableView.prototype.setCustomTouchEnable = function(isEnable)
{
    this._tableView.setTouch(isEnable);
    this._tableView.setTouchEnabled(isEnable)
};

/**
 *  创建一个新的TableView，设置相关参数，与代理方法
 */
CustomTableView.prototype.showTableView = function()
{
    var tableView = new NTableView(this, this._tableSize);
    tableView.setDirection(this._type);
    tableView.x = 0;
    tableView.y = 0;
    tableView.setDelegate(this);
    tableView.setDataSource(this);
    tableView.setVerticalFillOrder(this._fileOrder);
    tableView.setPosition(this._tablePos);
    this._tableView = tableView;

    if (this._pSender)
    {
        this._pSender.addChild(tableView);
    }
    tableView.reloadData();
    //tableView.setOpacity(100);
    tableView.setTouch(this._touchEnabled);
    return true;
};


/**
 * TableView 动画效果
 * @param originPos
 * @param destPos
 * @param duration
 */
CustomTableView.prototype.tableViewRunAction = function(originPos, destPos, duration)
{
    this._tableView.setPosition(originPos);
    this._tableView.runAction(new cc.MoveTo(duration, destPos));
};


/**
 * @param {string} file 获取添加到TableViewCell上的Node
 * 刷新TableView
 */
CustomTableView.prototype.getCellNode = function(file)
{
    //var node = ccs.load(file.toString()).node;
    var container = LoadLayer.load(file.toString());
    var node = container.getNode();
    return node;
};

/**
 * 设置TableView的参数
 * @param {cc.p} _tablePos: TableView的位置
 * @param {cc.szie} _tableSize： TableView的大小
 * @param {cc.p} _tablePos:  TableView显示的位置
 * @param {number} _displayRows： TableViewCell的屏幕显示数量
 * @param {number} _totalCells： TableViewCell的总数量
 * @param {number} _numCols： 总Cell的数量
 * @param {string} _file: 需要添加到cell上的模板，使用cocosStudio制作
 * @param {number} _type: TableView的类型，是横着滑动还是竖着滑动
 * @param {number} _fileOrder: tableViewCell的排列顺序，是升序排列还是降序排列
 * @param {boolean} _touchEnabled: 当前TableView是否可以接受触摸事件
 * @param {object} _pSender：管理tableView的节点
 * @param {function} _createCellCallBack: 创建cell时的
 * @param {function} _updateCellCallBack: 更新cell时的回调函数
 * @param {function} _callBaack：当触摸Cell时可以触发的动作
 */
CustomTableView.prototype.setParams = function(params)
{
    // 参数按如下顺序传递
    //_tablePos, _tableSize, _displayRows, _totalCells, _numCols, _file, _type, _fileOrder, _touchEnabled, targetNode, callBack
    this._tablePos = params[0];
    this._tableSize = params[1];
    this._displayRows = params[2];
    this._totalCells = params[3];
    this._numCols = params[4];
    this._file = params[5];
    this._type = params[6];
    this._fileOrder = params[7];
    this._touchEnabled = params[8];
    this._pSender = params[9];
    this._createCellCallBack = params[10];
    this._updateCellCallBack = params[11];
    this._callBack = params[12];

};

/**
 * 设置Layer是否可见
 * @param flag
 */
CustomTableView.prototype.setVisible = function(flag)
{
    this._tableView.setVisible(flag);
};


/**
 * 计算某个cell在tableView中的位置, 并且把cell摆到当前显示的位置.
 * @param {number} viewHight TableView可视区域的高度
 * @param {number} cellHight 单个cell的高度
 * @param {number} cellCnt cell的总数
 * @param {number} cellCntShow 可视区域可显示的cell的数量
 * @param {number} cellIdx 指定cell的索引
 * @param {number} localIdx 需要将指定的cell 放到可视区域的第几个
 * @returns {*}
 */
CustomTableView.prototype.calculateTableCellOffsetByCellIdx = function(viewHight, cellHight, cellCnt, cellCntShow, cellIdx, localIdx)
{
    var totalHeight = cellHight * cellCnt;
    var offsetY;

    console.log("totalHeight: " + totalHeight);
    console.log("viewHeight: " + viewHight);

    if (totalHeight > viewHight)
    {
        offsetY = 0.0 - (cellCnt - (cellIdx + (cellCntShow - 1 - localIdx))) * cellHight;
    } else
    {
        offsetY = viewHight - totalHeight;
    }
    return offsetY;
};

/**
 * 设置TableViewCell的位置
 * @param {number} cellIdx 需要设置的cell的索引
 * @param {number} localIdx 需要放到可视区域的第几个
 */
CustomTableView.prototype.setTableViewCellPos = function(cellIdx, localIdx, noSlide)
{
    var offsetY = this.calculateTableCellOffsetByCellIdx(this._tableSize.height, this._tableSize.height /
                                                                                 this._displayRows,
        this._numRows, this._displayRows, cellIdx, localIdx);
    this._tableView.setContentOffset(cc.p(0, offsetY), !noSlide);
};

/**
 * 获取当前界面cellPos位置的index
 * */
CustomTableView.prototype.getIndex = function(cellPos)
{
    var cellHeight = this._tableSize.height / this._displayRows;
    var offset = this._tableView.getContentOffset().y;

    var num = offset / cellHeight;
    num += this._numRows + cellPos - this._displayRows;

    var index = Math.round(num);

    if (index < 0)
    {
        index = 0;
    }
    else if (index > this._numRows)
    {
        index = this._numRows;
    }
    return index;
};


/**
 * 设置TableViewCell的位置
 * @param {number} offsetY tableView的Y轴位置
 */
CustomTableView.prototype.setTableViewOffset = function(offsetY)
{
    this._tableView.setContentOffset(cc.p(0, offsetY), false);
};

/**
 * 获取当前点击的TableView的offset
 */
CustomTableView.prototype.getTableViewOffset = function()
{
    var offset = this._tableView.getContentOffset();
    return offset;
};


var TableViewDelegate = {
    /**
     * 创建新的tableView， 需要传入的参数按如下顺序
     * _tableSize, _displayRows, _numCols, _file, _type, _fileOrder, _touchEnabled, targetNode, callBack
     * @param {cc.szie} _tableSize： TableView的大小
     * @param {number} _displayRows： TableViewCell的屏幕显示数量
     * @param {number} _totalCells： TableViewCell的总数量
     * @param {number} _numCols： 总Cell的数量
     * @param {string} _file: 需要添加到cell上的模板，使用cocosStudio制作
     * @param {number} _type: TableView的类型，是横着滑动还是竖着滑动
     * @param {number} _fileOrder: tableViewCell的排列顺序，是升序排列还是降序排列
     * @param {object} _pSender：管理tableView的节点
     * @param {object} _callBaack：当触摸Cell时可以触发的动作
     * @returns {*}
     */
    newInstance: function()
    {
        var tableViewLayer = new CustomTableView();
        tableViewLayer.setParams(arguments);
        //tableViewLayer.setCustomTouchEnable(true);
        tableViewLayer.showTableView();
        return tableViewLayer;
    }
};