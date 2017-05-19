/**
 * 提示与加载工具类
 */
export default class Tips {

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

    static loading(title) {
        wx.showLoading({
            title: title,
            mask: true
        });
    }

    static loaded(){
        wx.hideLoading();
    }
}
