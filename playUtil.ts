interface PlayUtil{
    timer:number,
    ws:any,
    i:number,
    j:number
    msgID:number,
    getMsgCb:any
}
class PlayUtil{
    constructor(){
        this.timer = null;
        this.ws = null;
        this.i = 1;
        this.j = 1;
        this.msgID = 0
        //获取值的回调函数
        this.getMsgCb = undefined
    }
    _init(msgcb:any){
        this.getMsgCb = msgcb
        this.socketConnect()
        this.getSocketMsg(this.getMsgCb)   
    }
    //socket连接
    socketConnect(params?:any){
        let vm = this
        this.ws = new WebSocket("ws://127.0.0.1:29700");
        //连接失败
        this.ws.onclose = function () {
            //连接关闭
            // this.getConnect(this.socketConnect)
        }
        //连接成功
        this.ws.onopen = function () {
            params&&vm.sendSocketMsg(params)
        };
        this.ws.onerror = function () {
            //连接异常
            vm.getConnect(params)
        }
    }
    //socket重连监测
    socketReConnent(params){
        if(this.ws.readyState!==1){
            this.socketConnect(params)
        }else{
            this.sendSocketMsg(params)
        }
    }
    //下发播放信息，进行播放
    doPlay (url:string, name:string, serviceId:number= 0, hidePlayer:number = 0, VID:string = "", AID:string = "") {
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
    }
    //设置获取重复音量值
    setReportVolumeVal (value) {
        var info = {
            msgID: this.msgID++,
            type: "setReportElectricalLevel",
            "interval": value,
            "enable": 1
        };
        this.socketReConnent(info);
    }
    //设置音量
    setVolumeVal (value:number) {
        if (value==undefined) {
            return false
        }
        var info = {
            msgID: this.msgID++,
            type: "setVolumn",
            value
        };
        this.socketReConnent(info);
    }
    //发送socket信息
    sendSocketMsg(info:any){
        this.ws.send(JSON.stringify(info));
    }
    //socket接受的回调函数
    getSocketMsg(msgCb:any){
        this.ws.onmessage = (e:any) => {
            msgCb(JSON.parse(e.data))
        }
    }
    //socket异常事件
    onSocketError(params){
        //连接异常
        //进行重连
        this.getConnect(params)
    }
    //socket连接信息异常处理
    getConnect  (params:any) {
        var vm = this
        if (vm.timer) {
            window.clearTimeout(vm.timer);
            vm.timer = null;
        }
        vm.timer = window.setTimeout(function () {
            if (vm.i === 3) {
                vm.i=1
                alert("尚未安装/启动播放器插件，请安装/启动后再执行");
                return false;
            }
            vm.i++;
            vm.socketConnect(params) 
        }, 500);
    }
    //信息错误异常
    getMessage() {
        if (this.timer) {
            window.clearTimeout(this.timer);
            this.timer = null;
        }
        alert("播放插件异常，请重新启动播放器插件");
    }
}

// export default PlayUtil