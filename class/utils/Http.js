
class Http{
    //构造函数
    constructor(){}

    //GET
    static get(url, onSuccess, onError){
        wx.request({
            url : url,
            method : "GET",
            success : function(res){
                onSuccess(res.data)
            }
        })
    }

    //POST
    static post(url, data, onSuccess, onError){
        wx.request({
            url : url,
            method : "POST",
            data : data,
            success : function(res){
                onSuccess(res.data);
            }
        })
    }
}

export {Http};