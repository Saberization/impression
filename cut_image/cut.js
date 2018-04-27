/*
 * @Author: guotq
 * @Date: 2018-04-03 09:38:15
 * @Last Modified by: guotq
 * @Last Modified time: 2018-04-03 16:14:29
 * @Description: 选择头像
 */

(function () {
    'use strict';

    var imgEle = document.getElementById('img');
    var rangeRectangleEle = document.getElementById('range-rectangle');
    var containerEle = document.getElementById('container');

    var startX,
        startY,
        pageX,
        pageY,
        translateX = 0,
        translateY = 0;

    function init() {
        addEvent();
        initPicPosition();
    }

    /**
     * 事件处理集合
     */
    function addEvent() {
        rangeRectangleEle.addEventListener('touchstart', function (e) {
            var touch = e.touches[0],
                transform = imgEle.style.transform;

            startX = touch.pageX;
            startY = touch.pageY;

            if (transform) {
                translateX = parseInt(transform.match(/\(+(-?\d*\.?\d*)px/)[1], 10) || 0;
                translateY = parseInt(transform.match(), 10) || 0;
            }

            console.log(transform);

        });

        rangeRectangleEle.addEventListener('touchmove', function (e) {
            var touch = e.touches[0];

            pageX = touch.pageX;
            pageY = touch.pageY;

            imgEle.style.transform = 'translate3d(' + (pageX - startX + translateX) + 'px, ' + 20 + 'px, 0)';
        });
    }

    /**
     * 初始化图片坐标位置 并且插入遮罩元素
     */
    function initPicPosition() {

        var differenceHeight = imgEle.offsetHeight - rangeRectangleEle.offsetHeight;

        if (differenceHeight > 0) {
            imgEle.style.top = -differenceHeight / 2 + 'px';
        }

        // 创建顶部的遮罩
        createMaskOpactiy('top');

        // 创建底部的遮罩
        createMaskOpactiy('bottom');
    }

    /**
     * 创建透明遮罩
     * @param {String} position 位置
     */
    function createMaskOpactiy(position) {
        var computedStyle = document.defaultView.getComputedStyle(rangeRectangleEle, null),
            divEle = document.createElement('div'),
            difference = parseInt(computedStyle.top, 10) + parseInt(computedStyle.marginTop, 10);

        divEle.style.cssText = 'position: absolute; left: 0; right: 0; opacity: .5; background: #333;';

        if (position === 'top') {
            divEle.style.top = 0;
            divEle.style.height = difference + 'px';
        } else {
            divEle.style.transform = rangeRectangleEle.offsetHeight + difference + 'px';
            divEle.style.bottom = 0;
        }

        containerEle.insertBefore(divEle, rangeRectangleEle);
    }

    init();
}());