(function (w) {
    w.gesture =  function (ele, callback) {
        var isStart = false;  //表示gesturestart是否已经出发

        // 手指触碰当前元素，元素上有超过两个以上的手指
        ele.addEventListener('touchstart', function (event) {
            if (event.touches.length >= 2) {
                isStart = true;  //标记触发了gesturestart

                // 记录两个触点的初始距离
                this.startDistance = getDistance(event.touches[0], event.touches[1]);

                // 记录两个触点的初始角度
                this.startDeg = getDeg(event.touches[0], event.touches[1]);

                //调用回调函数
                if (callback && typeof callback['start'] === 'function') {
                    callback['start']();
                }

            }
        });

        //手指触碰当前元素，屏幕上有两个或者两个以上的手指位置在发生移动
        ele.addEventListener('touchmove', function (event) {
            if (event.touches.length >= 2) {

                // 计算当前两个触点的处理
                var currDistance = getDistance(event.touches[0], event.touches[1]);

                // 当前角度
                var currDeg = getDeg(event.touches[0], event.touches[1]);

                //计算当前距离与初始距离的比例
                event.scale = currDistance / this.startDistance;
                event.rotation = currDeg - this.startDeg;

                // 调用回调函数
                if (callback && typeof callback['change'] === 'function') {
                    callback['change'](event);
                }

                this.innerHTML = event.scale;
            }
        });

        // 手指离开当前元素，屏幕上只有两根一下的手指（不包括两根）
        ele.addEventListener('touchend', function (event) {
            if (!isStart) {
                return;
            }
            if (event.touches.length < 2) {
                // 调用回调函数
                if (callback && typeof(callback['change']) === 'function') {
                    callback['end']();
                }
            }
            isStart = false; //重置
        });

        // 获取两个点之间的距离
        function getDistance(touch1, touch2) {
            var a = touch1.clientX - touch2.clientX;
            var b = touch1.clientY - touch2.clientY;

            var c = Math.sqrt(a * a + b * b);

            return c;
        }

        // 获取两个触点的的角度
        function getDeg(touch1, touch2){
            var x  = touch1.clientX - touch2.clientX;
            var y = touch1.clientY - touch2.clientY;

            var radian = Math.atan2(y, x);
            var deg = radian / Math.PI * 180;

            return deg;
        }
    }
})(window);