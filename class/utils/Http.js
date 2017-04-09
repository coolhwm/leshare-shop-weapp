
// HTTP工具类
class Http{
    //构造函数
    constructor(){}
    
    //默认异常处理方法
    static defaultOnFail(url, data, result){
        console.error(`[ERROR]request error, url=${url}`);
        console.error(data);
        console.error(result);
    }

    //通用HTTP方法
    static request(url, data, method, onSuccess, onFail){
        wx.request({
            url : url,
            method : method,
            data : data,
            success : (res) => {
                //请求业务错误，打印日志
                if(res.statusCode != "200"){
                    this.defaultOnFail(url, data, res);
                }
                //处理成功数据
                onSuccess(res.data);
            },
            fail : (res) =>{
                //打印异常日志
                this.defaultOnFail(url, data, res);
            }
        });
    }

    //GET（重载）
    static get(){
        //传递data的情况
        if(this.isFunction(arguments[1])){
            var onFail = arguments[2] ? arguments[2] : this.defaultOnFail;
            this.request(arguments[0], {}, "GET", arguments[1], onFail);
        }
        //不传递data的情况
        else if(arguments[1] instanceof Object){
            var onFail = arguments[3] ? arguments[3] : this.defaultOnFail;
            this.request(arguments[0], arguments[1], "GET", arguments[2], onFail);
        }
        
    }

    //POST
    static post(url, data, onSuccess, onFail=this.defaultOnFail){
        this.request(url, data, "POST", onSuccess, onFail);
    }

    //PUT
    static put(url, data, onSuccess, onFail=defaultOnFail){
        this.request(url, data, "PUT", onSuccess, onFail);
    }

    //PATCH
    static patch(url, data, onSuccess, onFail=defaultOnFail){
        this.request(url, data, "PATCH", onSuccess, onFail);
    }

    //DELETE
    static patch(url, onSuccess, onFail=defaultOnFail){
        this.request(url, {}, "DELETE", onSuccess, onFail);
    }
    
    static isFunction(fn) {
        return Object.prototype.toString.call(fn)=== '[object Function]';
    }
}

export {Http};