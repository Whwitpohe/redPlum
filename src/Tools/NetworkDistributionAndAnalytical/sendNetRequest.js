/**
 * Created by FanJiaHe on 2015/11/10.
 */

var sendNetRequest = {};
/**
 *  登录请求
 * @param {string} userName 用户名
 * @param {string} passWord 密码
 * @param {function} successCallBack 回调函数
 * */
sendNetRequest.sendLoginRequest = function(userName, passWord, successCallBack)
{
    if (globalApi.parameterCheck(3, arguments, "sendLoginRequest"))
    {
        return;
    }

    var url = "portal/login?username=" + userName + "&password=" + passWord + "&type=fieldman";
    var parseCallBack = new AnalyticalData();
    parseCallBack.setSuccessCallBack(successCallBack);
    http.sendForPost(url, "0", parseCallBack);
};

/**
 *  获取数据请求
 * @param {string} entityId 用户名Id
 * @param {function} successCallBack 回调函数
 * */
sendNetRequest.sendDataRequest = function(entityId, successCallBack)
{
    if (globalApi.parameterCheck(2, arguments, "sendDataRequest"))
    {
        return;
    }

    var url = "game/workpack?entityId=" + entityId;
    var parseCallBack = new AnalyticalData();
    parseCallBack.setSuccessCallBack(successCallBack);
    http.send(url, parseCallBack);
};


/**
 *  上传本地数据记录
 * @param {string|number} matchId 比赛id
 * @param {string|number} playerId 上传者iD 这个会填充
 * @param {string} postData 上传数据
 * @param {function} successCallBack 回调函数
 * */
sendNetRequest.uploadData = function(matchId, playerId, postData, successCallBack)
{
    if (globalApi.parameterCheck(4, arguments, "sendDataRequest"))
    {
        return;
    }

    var url = "match/postevents/" + matchId;
    var parseCallBack = new AnalyticalData();
    parseCallBack.setSuccessCallBack(successCallBack);

    var header = [];
    header.push({
        "key": "_CIKERS_KEY_",
        "value": "PID_" + playerId
    });
    header.push({
        "key": "Content-Type",
        "value": "application/json"
    });

    var customData = {"tag": matchId};
    http.sendForPost(url, postData, parseCallBack, header, customData);
};


/**
 * 为新设备获取设备标示号
 * @param {function} callBack 回调
 * */
sendNetRequest.sendClientIdRequest = function(callBack)
{
    if (globalApi.parameterCheck(1, arguments, "sendClientIdRequest"))
    {
        return;
    }
    var url = "soccermanager/matchstatistics/getNewClientId";
    var parseCallBack = new AnalyticalData();
    parseCallBack.callBack = callBack;
    http.send(url, parseCallBack.parseLoginData);
};


/**
 * 下载图片
 * @param {string} url 网址
 * @param {string} id 球员Id
 * */
sendNetRequest.downloadImg = function(url, id)
{
    var customClass = cc.CustomClass.create();
    var fileName = playerControl.getLocalIcon(String(id), url);
    console.log(fileName);
    customClass.downloadImg(url, fileName, "sendNetRequest.xxxxxxx(" + id + ")");
};

sendNetRequest.xxxxxxx = function(id)
{
    console.log(String(id));
};

/**
 * 上传图片
 * */
sendNetRequest.upLoadImage = function(oldName, callBack)
{
    var customClass = cc.CustomClass.create();
    var url = http.serverAddr + "portal/uploadimg";
    var fileName = oldName;
    console.log(fileName);
    customClass.uploadImg(url, fileName, callBack);
};


/**
 * 注册球员
 * */
sendNetRequest.registerPlayer = function(playerId, info, iconName, callBack)
{
    var customClass = cc.CustomClass.create();
    var url = http.serverAddr + "player/signupinfield";
    console.log(playerId);
    customClass.registerPlayer(url, String(playerId), String(info), iconName || "", callBack);
};


// /**
//  * 注册球员
//  * */
// sendNetRequest.updateEnrollFor = function(playerId, info, iconName, callBack)
// {
//     var customClass = cc.CustomClass.create();
//     var url = http.serverAddr + "player/signupinfield";
//     console.log(playerId);
//     customClass.registerPlayer(url, String(playerId), String(info), iconName || "", callBack);
// };
