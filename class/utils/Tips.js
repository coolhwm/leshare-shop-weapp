
/**
 * 提示与加载工具类
 */
export default class Tips {

    constructor() {
        this.isLoading = false;
    }

    /**
     * 弹出提示框
     */
    static toast(title, onHide, icon = 'success') {
        // this.loaded();
        wx.showToast({
            title: title,
            icon: icon,
            mask: true,
            duration: 500
        });
        //隐藏结束回调
        if (onHide) {
            setTimeout(() => {
                onHide();
            }, 500);
        }
    }

    /**
     * 弹出加载提示
     */
    static loading(title = '加载中') {
        if (Tips.isLoading) {
            return;
        }
        Tips.isLoading = true;
        wx.showLoading({
            title: title,
            mask: true
        });
    }

    /**
    * 加载完毕
    */
    static loaded() {
        if (Tips.isLoading) {
            Tips.isLoading = false;
            wx.hideLoading();
        }
    }


    /**
     * 弹出下拉动作栏
     */
    static action(items) {
        return new Promise((resolve, reject) => {
            wx.showActionSheet({
                itemList: items,
                success: function (res) {
                    const result = {
                        index: res.tapIndex,
                        text: items[res.tapIndex]
                    }
                    resolve(result);
                },
                fail: function (res) {
                    reject(res.errMsg);
                }
            })
        });
    }


    /**
     * 弹出确认窗口
     */
    static confirm(text, payload = {}, title = '提示') {
        return new Promise((resolve, reject) => {
            wx.showModal({
                title: title,
                content: text,
                showCancel: true,
                success: res => {
                    if (res.confirm) {
                        resolve(payload);
                    } else if (res.cancel) {
                        reject(payload);
                    }
                },
                fail: res => {
                    reject(payload);
                }
            })
        });
    }
}

/**
 * 静态变量，是否加载中
 */
Tips.isLoading = false;