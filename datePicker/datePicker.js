(function () {
    "use strict";

    var tpl = document.getElementById('tpl-datepicker').innerHTML;

    function datePicker(options) {
        var self = this;

        self.el = self.getElement(options.el);
        self.el.innerHTML = tpl;
        self.year = options.year || '';
        self.month = options.month || '';
        self.callback = options.itemClick || function () {};
    }

    /**
     * 原型
     */
    datePicker.prototype = {

        /**
         * 初始化组件
         */
        init: function () {
            var self = this;

            self.getDate(self.year, self.month);
            self._initListeners();
        },

        /**
         * 获取日期
         */
        getDate: function (year, month) {
            var self = this,
                today = null;

            // 若未传入年月日的话
            if (!year || !month) {
                today = new Date();
                year = today.getFullYear();
                month = today.getMonth() + 1;
            }

            self.year = year || '';
            self.month = month || '';

            // 计算出当月第一天
            var firstDate = new Date(year, month - 1, 1),
                firstDayOfMonth = firstDate.getDate(),
                firstDayOfWeek = firstDate.getDay();

            if (firstDayOfWeek == 0) {
                firstDayOfWeek = 7;
            }

            // 计算出当月第一天前面有几个上个月的天数
            var preDayOfCount = firstDayOfWeek - 1;

            // 计算出当月最后一天 下个月的第0天就是当月的最后一天
            var lastDate = new Date(year, month, 0),
                lastDayOfMonth = lastDate.getDate(),
                lastDayOfWeek = lastDate.getDay();

            // 存储结果
            var result = [];

            for (var i = 0, len = 6 * 7; i < len; i++) {
                var date = i + 1 - preDayOfCount,
                    showMonth = month,
                    showDate = date,
                    showYear = year,
                    cls = '';

                if (date <= 0) {
                    cls = 'exceed';
                    showMonth = month - 1;
                    showDate = (new Date(year, showMonth, 0)).getDate() + date;
                } else if (date > lastDayOfMonth) {
                    cls = 'exceed';
                    showMonth = month + 1;
                    showDate = date - lastDayOfMonth;
                }

                // 小于1代表12月份
                if (showMonth < 1) {
                    showMonth = 12;
                    showYear = showYear - 1;
                }
                // 大于12代表为1月
                else if (showMonth > 12) {
                    showMonth = 1;
                    showYear = showYear + 1;
                }

                result.push({
                    showDate: showDate,
                    showMonth: showMonth,
                    cls: cls,
                    showYear: showYear
                });
            }

            this.render(result, year, month);
        },

        /**
         * 渲染数据
         * @param {Array} 数据
         * @param {String} curYear 当前年
         * @param {String} curMonth 当前月
         */
        render: function (result, curYear, curMonth) {
            var wrapEle = this.el;

            var container = wrapEle.querySelector('[data-body]'),
                monthEle = wrapEle.querySelector('[data-title]'),
                item = '';

            monthEle.innerHTML = curYear + '-' + curMonth;

            result.forEach(function (e, i) {
                var num = i % 7;

                if (num == 0) {
                    item += '<tr><td class="' + e.cls + '" data-year="' + e.showYear + '" data-month="' + e.showMonth + '">' + e.showDate + '</td>';
                } else if (num == 6) {
                    item += '<td class="' + e.cls + '" data-year="' + e.showYear + '" data-month="' + e.showMonth + '">' + e.showDate + '</td></tr>';
                } else {
                    item += '<td class="' + e.cls + '" data-year="' + e.showYear + '" data-month="' + e.showMonth + '">' + e.showDate + '</td>';
                }
            });

            container.innerHTML = item;
        },

        /**
         * 获取dom
         * @param {String HTMLElemnt} dom
         */
        getElement: function (dom) {
            if (dom.nodeType && dom.nodeType == 1) {
                return dom;
            } else {
                return document.querySelector(dom);
            }
        },

        /**
         * 显示
         */
        show: function () {
            this.el.classList.remove('hidden');
        },

        /**
         * 隐藏
         */
        hide: function () {
            this.el.classList.add('hidden');
        },

        /**
         * toggle
         */
        toggle: function () {
            var el = this.el;

            if (el.classList.contains('hidden')) {
                el.classList.remove('hidden');
            } else {
                el.classList.add('hidden');
            }
        },

        /**
         * 初始化事件监听
         */
        _initListeners: function () {
            var self = this,
                el = self.el,
                month = self.month,
                year = self.year,
                bodyEle = el.querySelector('.ui-datepicker-body'),
                goLeftBtnEle = el.querySelector('.ui-datepicker-prev-btn'),
                goRightBtnEle = el.querySelector('.ui-datepicker-next-btn');

            // 左箭头
            goLeftBtnEle.addEventListener('click', function () {
                // 递减月份
                month--;

                if (month < 1) {
                    year--;
                    month = 12;
                }

                self.getDate(year, month);
            });

            // 右箭头
            goRightBtnEle.addEventListener('click', function () {
                // 递增月份
                month++;

                if (month > 12) {
                    month = 1;
                    year++;
                }

                self.getDate(year, month);
            });

            // 选择日期
            bodyEle.addEventListener('click', function (e) {
                var _self = e.target;

                if (_self && _self.tagName === 'TD') {
                    var dataset = _self.dataset,
                        year = dataset.year,
                        month = dataset.month,
                        day = _self.innerHTML;

                    self.callback.call(self, year + '-' + month + '-' + day, {
                        year: year,
                        month: month,
                        day: day
                    });
                }
            });
        }
    };

    window.datePicker = datePicker;
}());