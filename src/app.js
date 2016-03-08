var HelloWorldLayer = cc.Layer.extend({
    sprite: null,
    ctor: function()
    {
        //////////////////////////////
        // 1. super init first
        this._super();

        /////////////////////////////
        // 2. add a menu item with "X" image, which is clicked to quit the program
        //    you may modify it.
        // ask the window size
        var size = cc.winSize;

        //开始执行吧 少年们
        //只有在native才需要进行复制
        if (!cc.sys.isNative)
        {
            console.log("只能在Native下使用");
            return true;
        }
        this._db = new sql.SQLiteWrapper();
        this._dbPath = this._db.initializing("test.sqlite", "", "");
        this._isOpen = this._db.open(this._dbPath);


        console.log("数据库打开结果:" + this._isOpen ? "已打开..." : "未打开...");


        if (this._isOpen)
        {
            var st = this._db.statement("select * from equip");

            var ary = [];
            while (st.nextRow())
            {
                var equipVO = new CEquipVO();
                equipVO.wid = parseInt(st.valueString(0));
                equipVO.name = st.valueString(1);
                equipVO.desc = st.valueString(2);
                equipVO.level = st.valueString(3);
                equipVO.icon = st.valueString(4);
                equipVO.quality = st.valueString(5);
                ary.push(equipVO);
            }


            for (var vo in ary)
            {
                console.log("equipData:" + ary[vo].toString());
            }

        }

        // this._db.directStatement("sqlite3 mydatabase.db");
        //this._db.directStatement("CREATE TABLE mesfile (ID Varchar(20)  PRIMARY KEY DEFAULT NULL,name Varchar(255),dir Varchar(255),size rchar(255),creationTime Varchar(32),modificationTime Varchar(32),shared Varchar(8) DEFAULT NULL,shareByName Varchar(20),shareById Varchar(20),url Varchar(255),md5 Varchar(32),type Varchar(5) DEFAULT NULL,favorite Varchar(5) DEFAULT NULL,userID Varchar(20) DEFAULT NULL)");
        //var st = this._db.directStatement("insert into equip values(1,'king','king', 1, 'hhh',1,1,1,1,1)");

        var mainscene = ccs.load(res.MainScene_json);
        this.addChild(mainscene.node);

        /* you can create scene with following comment code instead of using csb file.
         /////////////////////////////
         // 3. add your codes below...
         // add a label shows "Hello World"
         // create and initialize a label
         var helloLabel = new cc.LabelTTF("Hello World", "Arial", 38);
         // position the label on the center of the screen
         helloLabel.x = size.width / 2;
         helloLabel.y = size.height / 2 + 200;
         // add the label as a child to this layer
         this.addChild(helloLabel, 5);

         // add "HelloWorld" splash screen"
         this.sprite = new cc.Sprite(res.HelloWorld_png);
         this.sprite.attr({
         x: size.width / 2,
         y: size.height / 2
         });
         this.addChild(this.sprite, 0);
         */


        for (var i = 0; i < 100; i++)
        {
            var tempArray = [];
            for (var j = 0; j < 4; j++)
            {
                var number = parseInt(Math.random() * (25 - j));
                tempArray.push(number);
            }
            console.log("++++++++++++"+ tempArray);
            console.log("-----------"+ JSON.stringify(translateToName(tempArray)));
            translateToName(tempArray);
        }


        return true;
    }
});

var translateToName = function(array)
{
    var length = array.length;
    var tempNameArray =  zimu.slice(0);
    var nameArray = [];
    for (var temp_x = 0; temp_x < length; temp_x++)
    {
        var pos = array[temp_x];
        tempNameArray.splice(pos,1);
        nameArray.push(tempNameArray[pos]);
    }
    return nameArray;
};


var zimu = ["a", "b", "c", "d", "e", "f", "g", "h",
    "i", "j", "k", "l", "m", "n", "o", "p", "q",
    "r", "s", "t", "u", "v", "w", "x", "y", "z"];


var HelloWorldScene = cc.Scene.extend({
    onEnter: function()
    {
        this._super();
        var layer = new HelloWorldLayer();
        this.addChild(layer);
    }
});


var CEquipVO = cc.Class.extend({
    wid: null,//like 10000001
    name: null,//like 银票
    level: null,//like 1
    type: null,//like 1
    price: null,//like 200
    stackCount: null,//like 99
    bind: null,//like 1
    desc: null,//like 加银两
    quality: null,//like 1
    icon: null,//like item/article/10000001.png
    toString: function()
    {
        return this.wid + " " + this.name + " " + this.level + " " + this.desc + " " + this.icon;
    }
});

