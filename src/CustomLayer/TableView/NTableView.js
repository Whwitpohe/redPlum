/**
 * Created by bingling on 11/19/15.
 */

/**
 * TableViewCell, 用于创建TableView上的Cell
 */
NTableViewCell = cc.Node.extend({
    _idx:0,
    _className:"TableViewCell",

    /**
     * 获取与设置 Cell的ID
     */
    getIdx:function () {
        return this._idx;
    },
    setIdx:function (idx) {
        this._idx = idx;
    },

    /**
     * 重置Cell的ID
     */
    reset:function () {
        this._idx = cc.INVALID_INDEX;
    },

    /**
     * 设置cell对象的ID
     * @param {number} idx 用于表示cell的ID
     */
    setObjectID:function (idx) {
        this._idx = idx;
    },
    getObjectID:function () {
        return this._idx;
    }
});

/**
 * TableView的代理类，可以通过重写代理类中的函数，给触摸事件使用
 */
NTableViewDelegate = cc.Class.extend(/** @lends cc.TableViewDelegate# */{

    /**
     * 代理类中响应触摸事件的函数
     *
     * @param {NTableView} 包含触摸的cell的TableView
     * @param {NTableViewCell} cell  当前被触摸的cell
     */
    tableCellTouched:function (table, cell) {
    },

    /**
     * 代理类中响应按下cell响应的函数
     *
     * @param {NTableView} 包含按压的cell的TableView
     * @param {NTableViewCell} cell  当前被按压的cell
     */
    tableCellHighlight:function(table, cell){
    },

    /**
     * 代理类中响应释放的函数
     *
     * @param {NTableView} tableN 包含被释放的cell的TableView
     * @param {TableViewCell} cell 当前释放被按压的cll
     */
    tableCellUnhighlight:function(table, cell){

    },

    /**
     * 代理类中释放cell的方法，当被调用时，移除当前的cell
     * @param {NTableView} tableN 包含被释放的cell的TableView
     * @param {TableViewCell} cell 当前被释放的cell
     */
    tableCellWillRecycle:function(table, cell){

    }
});

/**
 * TableView的数据类，用于设置创建cell的属性
 */
NTableViewDataSource = cc.Class.extend(/** @lends cc.TableViewDataSource# */{
    /**
     * 指定cell的大小
     * @param {NTableView} table 保存cell对象的TableView
     * @param {Number} idx 当前cell的ID
     * @return {cc.Size} size 指定idx的cell的大小
     */
    tableCellSizeForIndex:function(table, idx){
        return this.cellSizeForTable(table);
    },

    /**
     *  在指定的TableView里给定cell的大小
     * @param {NTableView} table 保存cell对象的TableView
     * @return {cc.Size} cell Table中cell的size
     */
    cellSizeForTable:function (table) {
        return cc.size(0,0);
    },

    /**
     * 给定idx的cell实例
     * @param {NTableView} table 保存cell对象的TableView
     * @param {number} idx 搜索当前index的cell
     * @return {NTableView} cell 返回找到cell
     */
    tableCellAtIndex:function (table, idx) {
        return null;
    },

    /**
     * 返回cell的总数量.
     * @param {NTableView} table 保存cell对象的TableView
     * @return {Number} number of cells
     */
    numberOfCellsInTableView:function (table) {
        return 0;
    },

    /**
     * 返回TableView中cell的行数， 在TableView设置为横模式时，表示实际的列
     * @param {NTableView} table 保存cell对象的TableView
     * @return {Number} 返回行的数量
     */
    numberOfCellsInRowTableView:function (table) {
        return 0;
    },


    /**
     * 返回TableView中cell的列数， 在tableView设置为横模式时，表示实际显示到屏幕上的行。
     * @param {cc.TableView} table 保存cell对象的TableView
     * @return {Number} 返回列的数量
     */
    numberOfCellsInColTableView:function (table) {
        return 0;
    },

    /**
     * 返回TableView中cell的列数， 在tableView设置为横模式时，表示实际显示到屏幕上的行。
     * @param {cc.TableView} table 保存cell对象的TableView
     * @return {Number} 返回列的数量
     */
    numberOfCellsRowShowTableView:function (table) {
        return 0;
    }

});

/**
 * 该TableView目前只是支持，上下滑动多行多列， 横排多行多列滑动暂时不支持。
 * @class 创建TableView的类
 * @extends cc.ScrollView
 *
 * @property {NTableViewDataSource}   dataSource  TableView中cell的属性
 * @property {NTableViewDelegate}     delegate  TableView中事件的代理
 * @property {Number}    verticalFillOrder 设置TableView的模式
 *
 */
var NTableView = cc.ScrollView.extend(/** @lends cc.TableView# */{
    _vOrdering:null,
    _indices:null,
    _cellsFreed:null,
    _dataSource:null,
    _tableViewDelegate:null,
    _oldDirection:null,
    _cellsPositions:null,
    _cellsUsed:null,
    //vector with all cell positions
    _touchedCell:null,
    _touches: null,
    _isTouch: true,
    _startPos: cc.p(0, 0),
    _tableViewSize: cc.size(0, 0),
    _totalCells: 0,
    _disapearFlag: false,
    _disapearCallback: null,
    _startIdx: 5,
    //_searchFlag: false,

    //TODO: 横向显示还没有实现,目前支持竖向显示,待完善

    /**
     * 构造函数
     * @param {NTableViewDataSource} dataSource 设置TableView中cell的属性
     * @param {cc.size} size  设置TAbleView的Size
     * @param {object} container 设置承载TableView的对象
     */

    ctor: function(dataSource, size, container) {
        cc.ScrollView.prototype.ctor.call(this, size, container);
        self = this;
        this._oldDirection = cc.SCROLLVIEW_DIRECTION_NONE;
        this._cellsPositions = [];
        this._touches = [];
        this._initWithViewSize(size, container);
        this.setDataSource(dataSource);
        this._updateCellPositions();
        this._updateContentSize();
        this.addTouchListener();
    },

    /**
     * 初始化TableView的默认参数
     * @param {cc.size} size  设置TAbleView的Size
     * @param {object} container 设置承载TableView的对象
     */
    _initWithViewSize: function(size, container)
    {
        if (cc.ScrollView.prototype.initWithViewSize.call(this, size)) {
            this._cellsUsed = new NewArrayForObjectSorting();
            this._cellsFreed = new NewArrayForObjectSorting();
            this._indices = [];
            this._tableViewDelegate = null;
            this._vOrdering = cc.TABLEVIEW_FILL_BOTTOMUP;
            this.setDirection(cc.SCROLLVIEW_DIRECTION_VERTICAL);
            this.setTableViewSize(size);
            cc.ScrollView.prototype.setDelegate.call(this, this);
            return true;
        }
        return false;
    },

    /**
     * 根据offset，获取cell的index
     * @param {cc.p} offset cell的位置
     */
    __indexFromOffset: function(offset)
    {
        var low = 0;
        var col = this._dataSource.numberOfCellsInColTableView(this);
        var row = this._dataSource.numberOfCellsInRowTableView(this);
        var total = this._dataSource.numberOfCellsInTableView(this);
        var high = total;
        var search;
        switch (this.getDirection()) {
            case cc.SCROLLVIEW_DIRECTION_HORIZONTAL:
                search = offset.x;
                break;
            default:
                search = offset.y;
                break;
        }

        var locCellsPositions = this._cellsPositions;

        //for(var i = 0; i < locCellsPositions.length; i++) {
        //    console.log("----->:   " + locCellsPositions[i]);
        //}

        //console.log("search.y:  " + search);

        while (high >= low){
            var index = 0|(low + (high - low) / 2);
            var cellStart = locCellsPositions[index];
            var cellEnd = locCellsPositions[index + 1];

            if (search >= cellStart && search <= cellEnd){
               //this._searchFlag = true;
                return index;
            } else if (search < cellStart){
                high = index - 1;
            }else {
                low = index + 1;
            }
        }

        if (low <= 0)
            return 0;
        return -1;
    },

    /**
     * 根据offset，获取cell的index
     * @param {cc.p} offset cell的位置
     */
    _indexFromOffset: function(offset)
    {
        var locOffset = {x: offset.x, y: offset.y};
        var locDataSource = this._dataSource;
        var col = locDataSource.numberOfCellsInColTableView(this);
        var row = locDataSource.numberOfCellsInRowTableView(this);
        var total = this._dataSource.numberOfCellsInTableView(this);
        var maxIdx = total - 1;
        var cellSize = locDataSource.tableCellSizeForIndex();


        if (this._vOrdering === cc.TABLEVIEW_FILL_TOPDOWN) {
            locOffset.y = this.getContainer().getContentSize().height - locOffset.y;
        }


        var index = this.__indexFromOffset(locOffset);

        if (index === cc.INVALID_INDEX) {
            return cc.INVALID_INDEX;
        }


        if (index !== -1) {
            index = Math.max(0, index);
            if (index > maxIdx)
                index = cc.INVALID_INDEX;
        }

        if (index === cc.INVALID_INDEX) {
            return cc.INVALID_INDEX;
        }

        switch (this.getDirection()) {
            case cc.SCROLLVIEW_DIRECTION_HORIZONTAL:
                break;
            default:
                var tmp = Math.floor(offset.x / cellSize.width);
                break;
        }

        return index + tmp;
    },


    /**
     * 根据cell的index，返回cell的位置
     * @param {cc.p} index cell的ID
     */
    __offsetFromIndex: function(index)
    {
        var offset;
        var col = this._dataSource.numberOfCellsInColTableView(this);
        var row = this._dataSource.numberOfCellsInRowTableView(this);
        var colPos = index % col;
        switch (this.getDirection()) {
            case cc.SCROLLVIEW_DIRECTION_HORIZONTAL:
                offset = cc.p(this._cellsPositions[index], this._tableViewSize.height / col * colPos);
                break;
            default:
                offset = cc.p(this._tableViewSize.width / col * colPos, this._cellsPositions[index]);
                break;
        }
        return offset;
    },

    /**
     * 根据cell的index，返回cell的位置
     * @param {cc.p} index cell的ID
     */
    _offsetFromIndex: function(index)
    {
        var offset = this.__offsetFromIndex(index);
        var col = this._dataSource.numberOfCellsInColTableView(this);
        var cellSize = this._dataSource.tableCellSizeForIndex(this, index);


        //根据不同模式，来设置cell的位置
        if (this.getDirection() === cc.SCROLLVIEW_DIRECTION_VERTICAL) {
            if (this._vOrdering === cc.TABLEVIEW_FILL_TOPDOWN) {
                if ((index % col) === 0) {
                    offset.y = this.getContainer().getContentSize().height - offset.y - cellSize.height;
                } else {
                    offset.y = this.getContainer().getContentSize().height - offset.y;
                }
            }
        } else {
            if (this._vOrdering === cc.TABLEVIEW_FILL_TOPDOWN) {
                //if ((index % col) === 0) {
                //    offset.y = this.getContainer().getContentSize().height - offset.y - cellSize.height;
                //} else {
                //    offset.y = this.getContainer().getContentSize().height - offset.y;// + cellSize.height; // - cellSize.width;
                //}
            }
        }
        return offset;
    },


    /**
     * 当滑动时，及时更新Cell的位置
     * @private
     */
    _updateCellPositions: function()
    {
        var col = this._dataSource.numberOfCellsInColTableView(this);
        var row = this._dataSource.numberOfCellsInRowTableView(this);
        var total = this._dataSource.numberOfCellsInTableView(this);
        var cellsCount = total;
        var locCellsPositions = this._cellsPositions;

        if (cellsCount > 0){
            var currentPos = 0;
            var tmpPos = 0;
            var cellSize, locDataSource = this._dataSource;
            for (var i = 0; i < cellsCount; i++) {
                locCellsPositions[i] = currentPos;
                cellSize = locDataSource.tableCellSizeForIndex(this, i);
                switch (this.getDirection()) {
                    case cc.SCROLLVIEW_DIRECTION_HORIZONTAL:
                        currentPos = cellSize.width * (parseInt(i / col));
                        if ((i % col) === (col - 1)) {
                            currentPos += cellSize.width;
                        }
                        break;
                    default:
                        if (i % col === 0) {
                            tmpPos += cellSize.height;
                            currentPos = tmpPos;
                        } else {
                            currentPos = tmpPos;
                        }
                        break;
                }
            }
            this._cellsPositions[cellsCount] = currentPos;
        }
    },

    /**
     * 更新cell的Size
     * @private
     */
    _updateContentSize: function()
    {
        var size = cc.size(0, 0);
        var col = this._dataSource.numberOfCellsInColTableView(this);
        var row = this._dataSource.numberOfCellsInRowTableView(this);
        var total = this._dataSource.numberOfCellsInTableView(this);
        var cellsCount = total;

        if(cellsCount > 0){
            var maxPosition = this._cellsPositions[cellsCount];
            switch (this.getDirection()) {
                case cc.SCROLLVIEW_DIRECTION_HORIZONTAL:
                    size = cc.size(maxPosition, this._tableViewSize.height);
                    break;
                default:
                    size = cc.size(this._tableViewSize.width, maxPosition);
                    break;
            }
        }

        this.setContentSize(size);

        if (this._oldDirection !== this._direction) {
            if (this._direction === cc.SCROLLVIEW_DIRECTION_HORIZONTAL) {
                this.setContentOffset(cc.p(0, 0));
            } else {
                this.setContentOffset(cc.p(0, this.minContainerOffset().y));
            }
            this._oldDirection = this._direction;
        }
    },


    /**
     * cell在消失的时候执行，把cell放入释放的cell的数组中， 更新正在使用的cell
     * @param {NTableViewCell} cell 即将被移除的cell
     * @private
     */
    _moveCellOutOfSight: function(cell)
    {
        if(this._tableViewDelegate && this._tableViewDelegate.tableCellWillRecycle)
            this._tableViewDelegate.tableCellWillRecycle(this, cell);

        this._cellsFreed.addObject(cell);
        this._cellsUsed.removeSortedObject(cell);
        cc.arrayRemoveObject(this._indices, cell.getIdx());

        cell.reset();

        if (cell.getParent() === this.getContainer()) {
            cell.retain();
            this.getContainer().removeChild(cell, true);
        }
    },

    /**
     * 设置Cell的锚点， 位置， index
     * @param {number} index 需要设置的cell的index
     * @param {NtableViewCell} cell 当前需要设置的cell
     * @private
     */
    _setIndexForCell: function(index, cell)
    {
        cell.setAnchorPoint(0, 0);

        //console.log("index: " + index + " pos: " + JSON.stringify(this._offsetFromIndex(index)));
        cell.setPosition(this._offsetFromIndex(index));

        cell.setIdx(index);
    },


    /**
     * 在必要时添加新的cell
     * @param {NTableViewCell} cell 把cell添加到TableView中，并显示
     * @private
     */
    _addCellIfNecessary: function(cell)
    {
        if (cell.getParent() !== this.getContainer()) {
            this.getContainer().addChild(cell);
        }
        this._cellsUsed.insertSortedObject(cell);
        var locIndices = this._indices, addIdx = cell.getIdx();
        if(locIndices.indexOf(addIdx) === -1){
            locIndices.push(addIdx);
            //sort
            locIndices.sort(function(a,b){return a-b;});
        }
    },



    /**
     * 返回TableView 的Size
     */
    getTableViewSize: function()
    {
        return this._tableViewSize;
    },
    /**
     * 设置当前TableView的size
     * @param {cc.size} tableViewSize 指定的TableView的Size
     */
    setTableViewSize: function(tableViewSize)
    {
        this._tableViewSize = tableViewSize;
    },


    /**
     * 返回Cell的属性，给TableView进行设置
     */
    getDataSource: function()
    {
        return this._dataSource;
    },

    /**
     * 设置TableView的Data Source
     * @param {NTabaleViewDataSource} source 指定的需要代理的Data Source
     */
    setDataSource: function(source)
    {
        this._dataSource = source;
    },

    /**
     * delegate
     */
    getDelegate: function()
    {
        return this._tableViewDelegate;
    },

    /**
     * 设置TableView的代理方法
     * @param {NTabaleViewDelegate} delegate 指定的需要代理
     */
    setDelegate: function(delegate)
    {
        this._tableViewDelegate = delegate;
    },


    /**
     * 设置TableView的移动到当前Idx
     * @param {number}  idx 指定需要移动到的index
     */
    getViewSize: function()
    {
        return this._tableViewSize;
    },



    /**
     * 设置TableView的移动到当前Idx
     * @param {number}  idx 指定需要移动到的index
     */
    setStartIdx: function(idx)
    {
        this._startIdx = idx;
    },


    setDisapearFlag: function(flag, callback)
    {
        if (!flag)
            return;
        this._disapearFlag = flag;
        this._disapearCallback = callback;
    },


    /**
     * 设置TableView的模式，横， 竖
     */
    setVerticalFillOrder: function(fillOrder)
    {
        if (this._vOrdering !== fillOrder) {
            this._vOrdering = fillOrder;
            if (this._cellsUsed.count() > 0) {
                this.reloadData();
            }
        }
    },

    /**
     * 获得当前TableView的排列显示顺序
     * @returns {null}
     */
    getVerticalFillOrder: function()
    {
        return this._vOrdering;
    },

    /**
     * 更新当前指定index的cell
     *
     * @param {number} idx 根据index找到相应的cell
     */
    updateCellAtIndex: function(idx)
    {
        var col = this._dataSource.numberOfCellsInColTableView(this);
        var row = this._dataSource.numberOfCellsInRowTableView(this);
        var total = this._dataSource.numberOfCellsInTableView(this);
        var maxIdx = total - 1;
        if (idx === cc.INVALID_INDEX || idx > maxIdx)
            return;

        var cell = this.cellAtIndex(idx);
        if (cell) {
            this._moveCellOutOfSight(cell);
        }

        cell = this._dataSource.tableCellAtIndex(this, idx);

        this._setIndexForCell(idx, cell);
        this._addCellIfNecessary(cell);
    },

    /**
     * 添加一个index为idx的cell
     *
     * @param {number} idx 需要添加的位置
     */
    insertCellAtIndex: function(idx)
    {
        var col = this._dataSource.numberOfCellsInColTableView(this);
        var row = this._dataSource.numberOfCellsInRowTableView(this);
        var total = this._dataSource.numberOfCellsInTableView(this);
        var maxIdx = total - 1;
        if (idx === cc.INVALID_INDEX || idx > maxIdx)
            return;

        var newIdx, locCellsUsed = this._cellsUsed;
        var cell = locCellsUsed.objectWithObjectID(idx);
        if (cell) {
            newIdx = locCellsUsed.indexOfSortedObject(cell);
            for (var i = newIdx; i < locCellsUsed.count(); i++) {
                cell = locCellsUsed.objectAtIndex(i);
                this._setIndexForCell(cell.getIdx(), cell);
            }
        }

        //insert a new cell
        cell = this._dataSource.tableCellAtIndex(this, idx);
        this._setIndexForCell(idx, cell);
        this._addCellIfNecessary(cell);

        this._updateCellPositions();
        this._updateContentSize();
    },

    /**
     * 移除给定index的cell
     *
     * @param {number} idx 根据index找到相应的cell
     */
    removeCellAtIndex: function(idx)
    {
        var col = this._dataSource.numberOfCellsInColTableView(this);
        var row = this._dataSource.numberOfCellsInRowTableView(this);
        var total = this._dataSource.numberOfCellsInTableView(this);
        var maxIdx = total - 1;
        if (idx === cc.INVALID_INDEX || idx > maxIdx)
            return;

        var cell = this.cellAtIndex(idx);
        if (!cell)
            return;

        var locCellsUsed = this._cellsUsed;
        var newIdx = locCellsUsed.indexOfSortedObject(cell);

        //remove first
        this._moveCellOutOfSight(cell);
        cc.arrayRemoveObject(this._indices, idx);
        this._updateCellPositions();

        for (var i = locCellsUsed.count(); i > newIdx; i--) {
            cell = locCellsUsed.objectAtIndex(i);
            this._setIndexForCell(cell.getIdx(), cell);
        }
    },

    /**
     * 重新加载DataSource中指定的数据， 刷新TableView
     */
    reloadData: function()
    {
        this._oldDirection = cc.SCROLLVIEW_DIRECTION_NONE;
        this._cellsFreed = new NewArrayForObjectSorting();
        var locCellsUsed = this._cellsUsed, locCellsFreed = this._cellsFreed, locContainer = this.getContainer();

        for (var i = 0, len = locCellsUsed.count(); i < len; i++) {
            var cell = locCellsUsed.objectAtIndex(i);
            if(this._tableViewDelegate && this._tableViewDelegate.tableCellWillRecycle)
                this._tableViewDelegate.tableCellWillRecycle(this, cell);

            locCellsFreed.addObject(cell);
            cell.reset();
            if (cell.getParent() === locContainer) {
                cell.retain();
                locContainer.removeChild(cell, true);
            }
        }

        this._indices = [];
        this._cellsUsed = new NewArrayForObjectSorting();

        this._updateCellPositions();
        this._updateContentSize();

        var col = this._dataSource.numberOfCellsInColTableView(this);
        var row = this._dataSource.numberOfCellsInRowTableView(this);

        var total = this._dataSource.numberOfCellsInTableView(this);
        var maxIdx = total;

        /**
         * 在确定每一个Cell的位置后，重新更新全部cell并显示
         */
        //console.log("reloadData:  maxIdx: " + maxIdx);
        //for (var i = 0; i < maxIdx; i++)
        //    this.updateCellAtIndex(i);

        if (maxIdx > 0){
            this._updateCellPositions();
            this.scrollViewDidScroll(this);
        }
    },

    /**
     * 如果cell存在降序排列cell，如何为nil，返回空
     */
    dequeueCell: function()
    {
        if (this._cellsFreed.count() === 0) {
            return null;
        } else {
            var cell = this._cellsFreed.objectAtIndex(0);
            this._cellsFreed.removeObjectAtIndex(0);
            return cell;
        }
    },

    /**
     * 返回一个指定idx的cell，并且如果获取的nil，返回null
     *
     * @param {number} idx 指定cell的index
     * @return {cc.TableViewCell} a cell at a given index
     */
    cellAtIndex: function(idx)
    {

        var i = this._indices.indexOf(idx);
        if (i === -1)
            return null;
        return this._cellsUsed.objectWithObjectID(idx);
    },

    /**
     * 滑动cell时，触发，并且实时更新cell的内容与信息。
     * @param {object} view 当前的TableView
     */
    scrollViewDidScroll: function(view)
    {
        var locDataSource = this._dataSource;
        /**
         * @param {number} col 当前的TableView可以显示的列
         * @param {number} row 当前TableView可以承载的总的行数
         * @param {number} total 当前TableView承载cell的总个数
         */
        var col = this._dataSource.numberOfCellsInColTableView(this);
        var row = this._dataSource.numberOfCellsInRowTableView(this);
        var total = this._dataSource.numberOfCellsInTableView(this);
        var countOfItems = total;
        if (0 === countOfItems)
            return;

        if (this._tableViewDelegate !== null && this._tableViewDelegate.scrollViewDidScroll)
            this._tableViewDelegate.scrollViewDidScroll(this);

        var  idx = 0, locViewSize = cc.size(this._tableViewSize.width, this._tableViewSize.height), locContainer = this.getContainer();
        var offset = this.getContentOffset();
        offset.x *= -1;
        offset.y *= -1;

        var maxIdx = Math.max(countOfItems - 1, 0);

        if (this._vOrdering === cc.TABLEVIEW_FILL_TOPDOWN)
            offset.y = offset.y + locViewSize.height/locContainer.getScaleY();


        var startIdx = this._indexFromOffset(offset);

        if (startIdx === cc.INVALID_INDEX)
            startIdx = countOfItems - 1;

        if (this._vOrdering === cc.TABLEVIEW_FILL_TOPDOWN) {
            offset.y -= locViewSize.height/locContainer.getScaleY();
        } else {
            offset.y += locViewSize.height/locContainer.getScaleY();
        }

        offset.x += locViewSize.width/locContainer.getScaleX();

        var endIdx = this._indexFromOffset(offset);


        //console.log("endIdx: " + endIdx + "  offset: " + JSON.stringify(offset));
        if (endIdx === cc.INVALID_INDEX)
            endIdx = countOfItems - 1;

        /**
         * 以下三行保证在向上移动到末尾时，不出现黑屏的情况， 但是目前修改了其他的错误
         * 暂时不会出现黑屏的现象。所以先注释掉， 如有问题在打开。
         * 有时最后一个cell的纵坐标大于0, 当offset.y为0的时候,取不到最后一个cell, 会引起回收掉最后所有显示的cell
         * 所以添加对offset的判断.
         */
        if (offset.y <= 0) {
            endIdx = countOfItems;
        }

        var cell, locCellsUsed = this._cellsUsed;
        if (locCellsUsed.count() > 0) {
            /**
             * 计算当前的idx，与向下滑动时，移进屏幕的开始cell的idx。
             */

            for (var i = 0; i < col; i++) {
                cell = locCellsUsed.objectAtIndex(0);
                idx = cell.getIdx();
                while (idx < startIdx) {
                    this._moveCellOutOfSight(cell);
                    if (locCellsUsed.count() > 0) {
                        cell = locCellsUsed.objectAtIndex(0);
                        idx = cell.getIdx();
                    } else
                        break;
                }
            }
        }

        if (locCellsUsed.count() > 0) {

            /**
             * 原endIdx是按照单行单列计算得出的，所以endIdx在多行时代表每一行的第一cell，需要重新计算。
             * 计算向上移动时，移进屏幕的最后一个cell，保证能够正常显示。如果endCell加上 col - 1个cell
             * 如果依然小于总数，代表可以指代这一行的最后一个， else endIdx 代表最后一个cell， 这样就可以
             * 保证向上移动时不会出现错误
             */
            if ((endIdx + col -1) < total) {
                endIdx += col -1;
            } else {
                endIdx = total - 1;
            }

            for (var i = 0; i < col; i++) {
                cell = locCellsUsed.lastObject();
                idx = cell.getIdx();
                //console.log("22:   idx: " + idx + "  maxIdx: " + maxIdx + "  endIdx: " + endIdx);
                while (idx <= maxIdx && idx > endIdx) {
                    this._moveCellOutOfSight(cell);
                    if (locCellsUsed.count() > 0) {
                        cell = locCellsUsed.lastObject();
                        idx = cell.getIdx();
                    } else
                        break;
                }
            }
        }

        var locIndices = this._indices;

        for (var i = startIdx; i <= endIdx; i++) {
            if (locIndices.indexOf(i) !== -1)
                continue;
            this.updateCellAtIndex(i);
        }

        //console.log(JSON.stringify(this.getContentOffset()));
    },

    /**
     * 设置触摸不可相应
     * @param isTouch
     */
    setTouch: function(isTouch)
    {
        this._isTouch = isTouch;
    },

    /**
     * 设置触摸的监听事件，并绑定到相应函数上
     */
    addTouchListener: function()
    {
        if (!this._isTouch) {
            return;
        } else {
            //console.log("设置触摸事件");
            var listener = cc.EventListener.create({
                event: cc.EventListener.TOUCH_ONE_BY_ONE,
            });
            if(this.onTouchBegan)
                listener.onTouchBegan = this.onTouchBegan.bind(this);
            if(this.onTouchMoved)
                listener.onTouchMoved = this.onTouchMoved.bind(this);
            if(this.onTouchEnded)
                listener.onTouchEnded = this.onTouchEnded.bind(this);
            if(this.onTouchCancelled)
                listener.onTouchCancelled = this.onTouchCancelled.bind(this);
            this._touchListener = listener;
            cc.eventManager.addListener(listener, this);
        }
    },


    /**
     * 触摸结束方法
     * @param {object} touch
     * @param {object} event
     */
    onTouchEnded: function(touch, event)
    {
        //console.log("NT on touch End:  " + this._isTouch);
        if (!this.isVisible())
            return;


        if (this._disapearFlag) {
            var target = event.getCurrentTarget();
            var pos = target.getParent().convertTouchToNodeSpace(touch);   // 世界坐标转换 (子节点相对于父节点的位置)
            // 如果触碰起始地点不在本区域中
            if (!cc.rectContainsPoint(target.getBoundingBox(), pos))
            {
                this._disapearFlag = false;
                if (this._disapearCallback)
                    this._disapearCallback(this.getParent());
                this._disapearCallback = null;
            }
        }



        if (this._touchedCell){
            var bb = this.getBoundingBox();
            var tmpOrigin = cc.p(bb.x, bb.y);
            tmpOrigin = this.getParent().convertToWorldSpace(tmpOrigin);
            bb.x = tmpOrigin.x;
            bb.y = tmpOrigin.y;
            var locTableViewDelegate = this._tableViewDelegate;
            if (cc.rectContainsPoint(bb, touch.getLocation()) && locTableViewDelegate !== null){
                if(locTableViewDelegate.tableCellUnhighlight)
                    locTableViewDelegate.tableCellUnhighlight(this, this._touchedCell);
                if(locTableViewDelegate.tableCellTouched)
                    locTableViewDelegate.tableCellTouched(this, this._touchedCell);
            }
            this._touchedCell = null;
        }
    },

    /**
     * 触摸开始方法
     * @param {object} touch
     * @param {object} event
     * @returns {boolean}
     */
    onTouchBegan: function(touch, event)
    {
        if (!this._isTouch) {
            return false;
        }

        for (var c = this; c != null; c = c.parent) {
            if (!c.isVisible())
                return false;
        }
        var target = event.getCurrentTarget();
        var frame = target.getParent().convertTouchToNodeSpace(touch);

        // TODO: can fixme
        if (!cc.rectContainsPoint(target.getBoundingBox(), frame))
        {
            return false;
        }

            var result;

        var locContainer = this.getContainer();
        var locPoint = locContainer.convertToWorldSpace(locContainer.convertTouchToNodeSpace(touch));
        var locTouches = this._touches;

        if (locTouches.length > 2 || this._touchMoved) {
            result = false;
            return result;
        }


        this._touches.push(touch);

        if (locTouches.length === 1) {
            this._touchPoint = this.convertTouchToNodeSpace(touch);
            this._touchMoved = false;
            console.log("xxx");
        } else if (locTouches.length === 2) {
            result = false;
            return result;
        }

        result = true;

        if (this._touches.length === 1) {
            var index, point;

            point = this.getContainer().convertTouchToNodeSpace(touch);

            //console.log("point:  " + JSON.stringify(point));

            index = this._indexFromOffset(point);
            //console.log("index:  " + index);

            //
            // 这里可能需要通过_searchFlag进行判断
            //if (index <= cc.INVALID_INDEX) {
            //    this._touchedCell = null;
            //} else {
            //    if (!this._searchFlag) {
            //        index = cc.INVALID_INDEX;
            //    } else {
            //        this._touchedCell  = this.cellAtIndex(index);
            //    }
            //
            //    this._searchFlag = false;
            //}


            //if (this._disapearFlag) {
            //    var target = event.getCurrentTarget();
            //    var pos = target.getParent().convertTouchToNodeSpace(touch);   // 世界坐标转换 (子节点相对于父节点的位置)
            //    // 如果触碰起始地点在本区域中
            //    if (!cc.rectContainsPoint(target.getBoundingBox(), pos))
            //    {
            //        this._disapearFlag = false;
            //        if (this._disapearCallback)
            //            this._disapearCallback(this.getParent());
            //        this._disapearCallback = null;
            //    }
            //    if (index === cc.INVALID_INDEX)
            //        this._touchedCell = null;
            //    else
            //        this._touchedCell  = this.cellAtIndex(index);
            //    return true;
            //}

            if (index === cc.INVALID_INDEX)
                this._touchedCell = null;
            else
                this._touchedCell  = this.cellAtIndex(index);

            if (this._touchedCell && this._tableViewDelegate !== null && this._tableViewDelegate.tableCellHighlight)
                this._tableViewDelegate.tableCellHighlight(this, this._touchedCell);
        } else if (this._touchedCell) {
            if (this._tableViewDelegate !== null && this._tableViewDelegate.tableCellUnhighlight)
                this._tableViewDelegate.tableCellUnhighlight(this, this._touchedCell);
            this._touchedCell = null;
        }
        this._touches = [];
        return result;
    },


    /**
     * 触摸移动方法
     * @param {object} touch
     * @param {object} event
     * @returns {boolean}
     */
    onTouchMoved: function(touch, event)
    {
        if (this._touchedCell && this.isTouchMoved()) {
            if (this._tableViewDelegate !== null && this._tableViewDelegate.tableCellUnhighlight)
                this._tableViewDelegate.tableCellUnhighlight(this, this._touchedCell);
            this._touchedCell = null;
        }
    },


    /**
     * 触摸取消方法
     * @param {object} touch
     * @param {object} event
     * @returns {boolean}
     */
    onTouchCancelled: function(touch, event)
    {
        if (this._touchedCell) {
            if (this._tableViewDelegate !== null && this._tableViewDelegate.tableCellUnhighlight)
                this._tableViewDelegate.tableCellUnhighlight(this, this._touchedCell);
            this._touchedCell = null;
        }
    }
});
