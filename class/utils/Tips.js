/**
 * 提示与加载工具类
 */
export default class Tips {

    /**
     * 弹出提示框
     */
    static toast(title, onHide, icon = 'success') {
        this.loaded();
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
        this.loaded();
        wx.showLoading({
            title: title,
            mask: true
        });
    }

    /**
    * 加载完毕
    */
    static loaded() {
        wx.hideLoading();
    }

    /**
     * 弹出确认窗口
     */
    static confirm(text, payload= {}, title = '提示') {
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
