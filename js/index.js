(function () {
    var app=document.querySelector('#app')
    app.addEventListener('touchstart',function (event) {
        event.preventDefault();
    })


    var aNodes=document.querySelectorAll('a[href]')
    aNodes.forEach(function (aNode) {
        aNode.addEventListener('touchend',function () {
            location.href=this.href;
        })
    })

})();

//动态创建
(function () {
    var imgArr=[];
    for (var i=0;i<30;i++){
        imgArr.push('img/'+(i%10+1)+'.jpg')
    }
    //获取相关元素
    var albumList=document.querySelector('.album .album-list')
    var header=document.querySelector('#header')
    var mainNode=document.querySelector('#main')
    var album=document.querySelector('.album')
    var scrollBar=document.querySelector('#scrollBar')
    var albumFooter=document.querySelector('.album-footer')
    var bigImage=document.querySelector('#bigImage')
    var spanNode=bigImage.querySelector('.close')
    var bigImgNode=bigImage.querySelector('img')


    //footer设置
    transformCss(albumFooter,'scale',0);



    var start=0;//开始加载的索引
    var length=12;//每次加载的数量
    var isComplete=false;


    //默认隐藏大图
    transformCss(bigImage,'scale',0)


    creatAlbumItem();

    //点击关闭大图
    spanNode.addEventListener('touchend',function () {
        transformCss(bigImage,'scale',0)
    })

    //给所有的li注册touchend
    var isMove=false;//标记是否再滑动
    albumList.addEventListener('touchend',function (event) {

        if (isMove){
            isMove=false;
            return;
        }

            //如果点击的是图片区域  触发事件
        if(event.target.nodeName==='IMG'){

            //出现中心
            var x=event.target.getBoundingClientRect().left+event.target.offsetWidth/2 + 'px';
            var y=event.target.getBoundingClientRect().top+event.target.offsetHeight/2 + 'px';
            bigImage.style.transformOrigin=x+' '+y;


            transformCss(bigImage,'scale',1)//大图显示
            //展示图片
            bigImgNode.src=event.target.parentNode.dataset.src;
        }


    })

    //防止误触
        //监听touchmove时间  触发了右滑动操作  禁止点击
        albumList.addEventListener('touchmove',function () {
            isMove=true;
        })
    var imgScale=1,imgRotate=0;
        gesture(bigImgNode,{
            start:function () {
                imgScale=transformCss(bigImgNode,'scale')
                imgRotate=transformCss(bigImgNode,'rotate')
            },
            change:function (event) {
                transformCss(bigImgNode,'scale',imgScale*event.scale)
                transformCss(bigImgNode,'rotate',imgRotate+event.rotation)
            }
        })






    //页面可以滑动
    touchscroll(mainNode,album,scrollBar,{
        move:function () {
            //判断超过零界点  显示footer
            var minY = mainNode.clientHeight-album.offsetHeight;
           var currY=transformCss(album,'translateY');//此时内容的位置
            if (currY<minY){

                if (isComplete){
                    albumFooter.innerHTML='小可爱到这里就结束了'
                }
                //计算缩放比例
                var albumScale=(minY-currY)/albumFooter.offsetHeight;
                //范围限制
                albumScale=albumScale>1? 1 : albumScale;

                transformCss(albumFooter,'scale',albumScale)

            }
            lazyLoad();
        },
        touchend:function(){
            //判断超过零界点  显示footer
            var minY = mainNode.clientHeight-album.offsetHeight;
            var currY=transformCss(album,'translateY');//此时内容的位置

            if (currY<minY){
                if (isComplete){
                    return;
                }
                //加载数据
                creatAlbumItem();

                //重新设置滚动条的高度
                main.scale2=mainNode.clientHeight/album.offsetHeight;

                scrollBar.style.height=mainNode.clientHeight*main.scale2+'px';

                //清除定时器
                clearInterval(main.timeId);

                transformCss(albumFooter,'scale',0)
            }
        },
        end:function () {
            
        }
    });



    function creatAlbumItem() {
        //计算结束位置的索引
        var end=start+length;

        //end超出边界咋整
        if (end>imgArr.length){
            end=imgArr.length
        }

        for (var i=start;i<end;i++){
            //创建li
            var liNode=document.createElement('li')

            //给liNode添加自定义属性  存储图片地址
            liNode.dataset.src=imgArr[i];

            albumList.appendChild(liNode)
        }
        start=end;
        lazyLoad();

        if (start>=imgArr.length){
            isComplete=true;
        }
    }

    //实现图片懒加载
    function lazyLoad() {
        var liNodes=albumList.querySelectorAll('li');

        liNodes.forEach(function (liNode,index) {
            //如果li有图片 直接跳过
            if (liNode.isloaded){
                return;
            }
            var liTop=liNode.getBoundingClientRect().top;//元素距离视口顶端的距离
            var liBottom=liNode.getBoundingClientRect().bottom
            var headerHeight=header.offsetHeight
            var viewHeight=document.documentElement.clientHeight;//视口高度

            if (liBottom>headerHeight && liTop<viewHeight){
                var imgNode=document.createElement('img');
                imgNode.src=liNode.dataset.src;

                //图片文件下载完毕
                imgNode.addEventListener('load',function () {
                    this.style.opacity=1;

                })
                //如果图片加载失败
                imgNode.addEventListener('error',function () {
                    this.src='img/noimage.png';
                })


               liNode.appendChild(imgNode);
                //imgNode.src=imgArr[index];

                //设置li已经加载了图片
                liNode.isloaded=true;

            }
        })
    }



})();

//audio标签
(function () {
    var audio=document.querySelector('#audio')
    var app=document.querySelector('#app')
    app.addEventListener('touchstart',function () {
        audio.play();
    });
})();