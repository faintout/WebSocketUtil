var PlayUtil = /** @class */ (function () {
    function PlayUtil() {
        this.timer = null;
        this.ws = null;
        this.i = 1;
        this.j = 1;
        this.msgID = 0;
        //获取值的回调函数
        this.getMsgCb = undefined;
    }
    PlayUtil.prototype._init = function (msgcb) {
        this.getMsgCb = msgcb;
        this.socketConnect();
        this.getSocketMsg(this.getMsgCb);
    };
    //socket连接
    PlayUtil.prototype.socketConnect = function (params) {
        var vm = this;
        this.ws = new WebSocket("ws://127.0.0.1:29700");
        //连接失败
        this.ws.onclose = function () {
            //连接关闭
            // this.getConnect(this.socketConnect)
        };
        //连接成功
        this.ws.onopen = function () {
            params && vm.sendSocketMsg(params);
        };
        this.ws.onerror = function () {
            //连接异常
            vm.getConnect(params);
        };
    };
    //socket重连监测
    PlayUtil.prototype.socketReConnent = function (params) {
        if (this.ws.readyState !== 1) {
            this.socketConnect(params);
        }
        else {
            this.sendSocketMsg(params);
        }
    };
    //下发播放信息，进行播放
    PlayUtil.prototype.doPlay = function (url, name, serviceId, hidePlayer, VID, AID) {
        if (serviceId === void 0) { serviceId = 0; }
        if (hidePlayer === void 0) { hidePlayer = 0; }
        if (VID === void 0) { VID = ""; }
        if (AID === void 0) { AID = ""; }
        var info = {
            msgID: this.msgID++,
            type: "videoPlay",
            url: url,
            displayInfo: name,
            hidePlayer: hidePlayer,
            serviceId: serviceId,
            VID: VID,
            AID: AID
        };
        this.socketReConnent(info);
    };
    //设置获取重复音量值
    PlayUtil.prototype.setReportVolumeVal = function (value) {
        var info = {
            msgID: this.msgID++,
            type: "setReportElectricalLevel",
            "interval": value,
            "enable": 1
        };
        this.socketReConnent(info);
    };
    //设置音量
    PlayUtil.prototype.setVolumeVal = function (value) {
        if (value == undefined) {
            return false;
        }
        var info = {
            msgID: this.msgID++,
            type: "setVolumn",
            value: value
        };
        this.socketReConnent(info);
    };
    //发送socket信息
    PlayUtil.prototype.sendSocketMsg = function (info) {
        this.ws.send(JSON.stringify(info));
    };
    //socket接受的回调函数
    PlayUtil.prototype.getSocketMsg = function (msgCb) {
        this.ws.onmessage = function (e) {
            msgCb(JSON.parse(e.data));
        };
    };
    //socket异常事件
    PlayUtil.prototype.onSocketError = function (params) {
        //连接异常
        //进行重连
        this.getConnect(params);
    };
    //socket连接信息异常处理
    PlayUtil.prototype.getConnect = function (params) {
        var vm = this;
        if (vm.timer) {
            window.clearTimeout(vm.timer);
            vm.timer = null;
        }
        vm.timer = window.setTimeout(function () {
            if (vm.i === 3) {
                vm.i = 1;
                alert("尚未安装/启动播放器插件，请安装/启动后再执行");
                return false;
            }
            vm.i++;
            vm.socketConnect(params);
        }, 500);
    };
    //信息错误异常
    PlayUtil.prototype.getMessage = function () {
        if (this.timer) {
            window.clearTimeout(this.timer);
            this.timer = null;
        }
        alert("播放插件异常，请重新启动播放器插件");
    };
    return PlayUtil;
}());
// export default PlayUtil
