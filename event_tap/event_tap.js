(function () {

    HTMLElement.prototype._addEventListener = HTMLElement.prototype.addEventListener;

    /**
     * 实现核心代码
     * @param {HTMLElement} el 元素
     * @param {Function} callback 回调函数
     */
    var tap = (el, callback) => {

        var userAgent = navigator.userAgent;

        // 非mobile模式，兼容为click
        if (!(/Mobile/g.test(userAgent))) {
            el._addEventListener('click', callback.bind(event));

            return;
        }

        let touchX = 0,
            touchY = 0,
            pageX = 0,
            pageY = 0;

        let count = 0,
            timmer = null;

        //  先从 touchstart 开始
        el._addEventListener('touchstart', function (e) {
            let targetTouches = e.targetTouches[0];

            touchX = targetTouches.pageX;
            touchY = targetTouches.pageY;
            pageY = touchY;
            pageX = touchX;

            timmer = setInterval(() => {
                count++;
            }, 1000);
        });

        // 判断位移距离
        el._addEventListener('touchmove', function (e) {
            let targetTouches = e.targetTouches[0];

            pageX = targetTouches.pageX;
            pageY = targetTouches.pageY;
        });

        el._addEventListener('touchend', function (e) {
            if (count < 1 && (Math.abs(pageX - touchX) < 30) && (Math.abs(pageY - touchY) < 30)) {
                callback && callback.call(this, e);
            }

            count = 0;
            clearInterval(timmer);
        });
    };

    HTMLElement.prototype.addEventListener = function (type, cb, options) {
        if (type === 'tap') {
            tap(this, cb);
        }
        else {
            this._addEventListener(type, cb, options || {});
        }
    };
}());