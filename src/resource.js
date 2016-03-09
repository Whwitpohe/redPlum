var res = {
    HelloWorld_png : "res/HelloWorld.png",
    MainScene_json : "res/MainScene.json",

    //Json
    EditLayer_json: "res/edit_Layer.json",

    HeaderBar_json: "res/HeaderBar.json",
    CrossHeaderBar_json: "res/crossHeaderBar.json",
    CrossHeaderBar_s_json: "res/crossHeaderBar_s.json",
    CrossHeaderBar_ss: "res/crossHeaderBar_ss.json",
    CrossHeaderBar_m_json: "res/crossHeaderBar_m.json",

    ModifyTime_json: "res/modifyTime.json",
    SelectPhotoOperation_json: "res/bottomBar_Selection.json",


    // PopUpBox
    PopUpBox: "res/popUpBox.json",
    PopUpBox_cross: "res/popUpBox_cross.json",
    PopUpBox_option: "res/popUpBox_option.json",
    PopUpBox_slider: "res/popUpBox_slider.json",

    // headerBar
    menuItemGrey: "res/Resources/HeaderBar/menuItemGrey.png",
    headerBack: "res/Resources/HeaderBar/back.png",
    headerForward: "res/Resources/HeaderBar/right.png",


    // slider
    MaskWhite: "res/Resources/Slider/maskWhite.png",
    MaskBlack: "res/Resources/Slider/maskBlack.png",
    SliderThumb: "res/Resources/Slider/sliderThumb.png",
    SliderThumb_P: "res/Resources/Slider/sliderThumb.png",
    SliderGreen: "res/Resources/Slider/sliderGreen.png",
    SliderOrange: "res/Resources/Slider/sliderOrange.png",



    // Global
    Point: "res/Resources/Global/point.png",

    ExpandMenuDefaultBackGround: "res/Resources/Global/black.png",

    // EditBox
    EditBoxTransparent: "res/Resources/EditBox/editBoxTransparent.png",

    // TMX
    TmxFile: "res/Resources/Test/tileMap.tmx",
    Player: "res/Resources/Test/Player.png",
    BackGroundMusic: "res/Resources/Test/background-music-aac.wav",
    HitSound: "res/Resources/Test/hit.wav",
    MoveSound: "res/Resources/Test/move.wav",
    PewPewLeiSound: "res/Resources/Test/pew-pew-lei.wav",
    PickupSound: "res/Resources/Test/pickup.wav",
    TileMapSound: "res/Resources/Test/TileMap.wav",

    Default: "res/Resources/Attribute/default.png",

    // 个人中心界面
    ProspectMenu: "res/ProspectMenu.json",
    IndividualCenter: "res/IndividualCenter.json",
    PopItemDetails: "res/PopItemDetails.json"



};

var g_resources = [];
for (var i in res) {
    g_resources.push(res[i]);
}
