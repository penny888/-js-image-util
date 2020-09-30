/*
* 图片工具类
* 图片压缩缩放
* ImageUtil.compress({
*   file: file, // 需要压缩的图片文件对象
*   quality: quality, // 压缩质量（可选）
*   scale: scale, // 缩放比例（可选）
*   target: target, // 显示图片的img目标元素（可选）
*   callback: callback, // 回调函数（当target不为空时可选）
*   rotateDirection: rotateDirection, // 旋转方向 'left' 'right'
*   rotateTimes: rotateTimes // 旋转次数
* });
* 图片旋转
* ImageUtil.rotate({
*   img: img, // 需要旋转的图片元素
*   direction: direction, // 旋转方向 'left' 'right'
*   times: times, // 旋转次数
*   canvas: canvas // 旋转画布（可选）
* });
*
* */
!function (A) {
    var document = A.document;
    var ImageUtil = {};
    ImageUtil.compress = function (options) {
        var that = this;
        if (!options.file) {
            alert('请传入图片文件对象');
            return;
        }
        if (!/^image\/\w+/.test(options.file.type)) {
            alert('文件类型必须为图片');
            return;
        }
        var fileReader = new FileReader();
        var fileType = options.file.type;
        var scale = options.scale || 1;
        fileReader.onload = function () {
            var image = new Image();
            image.onload = function () {
                var canvas = document.createElement('canvas');
                canvas.width = this.width * scale;
                canvas.height = this.height * scale;
                var context = canvas.getContext('2d');
                context.drawImage(this, 0, 0, canvas.width, canvas.height);
                var base64 = canvas.toDataURL(fileType, options.quality || 0.7);
                if (options.rotateDirection && options.rotateTimes) {
                    var imgTmp = new Image();
                    imgTmp.src = base64;
                    imgTmp.onload = function () {
                        var cvsTmp = document.createElement('canvas');
                        that.rotate({
                            img: this,
                            direction: options.rotateDirection,
                            times: options.rotateTimes,
                            canvas: cvsTmp
                        });
                        base64 = cvsTmp.toDataURL(fileType, options.quality || 0.7);
                        process(options, base64);
                    };
                } else {
                    process(options, base64);
                }


                function process(options, base64) {
                    if (options.target) {
                        options.target.src = base64;
                        if (options.callback) {
                            options.callback(base64);
                        }
                    } else {
                        if (options.callback) {
                            options.callback(base64);
                        } else {
                            alert('回调函数不能为空');
                        }
                    }
                }
            };
            image.src = this.result;
        };
        fileReader.readAsDataURL(options.file);
    };

    ImageUtil.rotate = function (options) {
        var canvas = options.canvas || document.createElement('canvas');
        if (!options.img) {alert('请传入图片元素');return;}
        var height = options.img.height;
        var width = options.img.width;
        var min_step = 0;
        var max_step = 3;
        var step = 0;
        for (var i = 0; i < options.times; i++) {
            if (options.direction === 'right') {
                step++;
                step > max_step && (step = min_step);
            } else {
                step--;
                step < min_step && (step = max_step);
            }
        }
        var ctx = canvas.getContext('2d');
        var angle = step * 90 * Math.PI / 180;
        switch (step) {
            case 0:
                canvas.width = width;
                canvas.height = height;
                ctx.drawImage(options.img, 0, 0);
                break;
            case 1:
                canvas.width = height;
                canvas.height = width;
                ctx.rotate(angle);
                ctx.drawImage(options.img, 0, -height);
                break;
            case 2:
                canvas.width = width;
                canvas.height = height;
                ctx.rotate(angle);
                ctx.drawImage(options.img, -width, -height);
                break;
            case 3:
                canvas.width = height;
                canvas.height = width;
                ctx.rotate(angle);
                ctx.drawImage(options.img, -width, 0);
                break;
        }
        return canvas;
    };
    A.ImageUtil = ImageUtil;
}(window);