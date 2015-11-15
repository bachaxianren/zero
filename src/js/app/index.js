// 适配奇葩三星机型
function initScreen() {
    $("html").css("font-size", ($('body').width() / 375 * 312.5 + "%"))
}

function _onorientationchange(e) {
    if (window.orientation == 90 || window.orientation == -90) {
        $("#forhorview").css("display", "block"); //显示竖屏浏览提示框
    } else { //竖屏下恢复默认显示效果
        var st = setTimeout(initScreen, 300);
        $("#forhorview").css("display", "none");
    }
}
initScreen();
window.addEventListener("onorientationchange" in window ? "orientationchange" : "resize", function(e) {
    _onorientationchange(e);
}, false);


var shareSDK = {

    _info: {
        shareTitle: '梦幻手游周边票选',
        descContent: '梦幻手游周边票选',
        shareTimeTitle: '梦幻手游周边票选',
        imgUrl: __uri('../../data/share.png'),
        lineLink: window.location.href
    },

    _doneCbk: function() {},

    _doneShareFriend: function() {
        // nie.config.stats.url.add('1/xsd_huanzhuang_0623.html?click=share', '分享给好友');
        this._doneCbk && this._doneCbk();
    },

    _doneShareTimeline: function() {
        // nie.config.stats.url.add('1/xsd_huanzhuang_0623.html?click=share', '分享到朋友圈');
        this._doneCbk && this._doneCbk();
    },

    set: function(info) {

        var that = this;

        if (info) {
            info.shareTitle && (this._info.shareTitle = info.shareTitle);
            info.descContent && (this._info.descContent = info.descContent);
            info.shareTimeTitle && (this._info.shareTimeTitle = info.shareTimeTitle);
            info.imgUrl && (this._info.imgUrl = info.imgUrl);
            info.doneCbk && (this._doneCbk = info.doneCbk);
        }

        wx.ready(function() {
            wx.onMenuShareAppMessage({
                title: that._info.shareTitle,
                desc: that._info.descContent,
                link: that._info.lineLink,
                imgUrl: that._info.imgUrl,
                success: function() {
                    that._doneShareFriend();
                }
            });
            wx.onMenuShareTimeline({
                title: that._info.shareTimeTitle,
                link: that._info.lineLink,
                imgUrl: that._info.imgUrl,
                success: function() {
                    that._doneShareTimeline();
                }
            });
        });

        return this;
    },

    init: function() {

        var that = this;

        document.addEventListener('YixinJSBridgeReady', function() {
            YixinJSBridge.on('menu:share:appmessage', function() {
                YixinJSBridge.invoke('sendAppMessage', {
                    img_width: '300',
                    img_height: '300',
                    img_url: that._info.imgUrl,
                    link: that._info.lineLink,
                    desc: that._info.descContent,
                    title: that._info.shareTitle
                }, function() {
                    that._doneShareFriend();
                });
            });
            YixinJSBridge.on('menu:share:timeline', function() {
                YixinJSBridge.invoke('shareTimeline', {
                    img_width: '300',
                    img_height: '300',
                    img_url: that._info.imgUrl,
                    link: that._info.lineLink,
                    desc: that._info.shareTimeTitle,
                    title: that._info.shareTimeTitle
                }, function() {
                    that._doneShareTimeline();
                });
            });
        }, false);
        wx.config(wx_conf);

        this.set();

        return this;
    }
};

shareSDK.init();

var imgLoader = {

    _srcs: [],
    _onLoaded: null,
    _onLoading: null,

    load: function() {

        var srcs = this._srcs,
            l = srcs.length,
            loadCount = 0,
            that = this,
            tmp,
            i;

        function onImgLoad() {
            if (++loadCount === l) {
                that._onLoaded && that._onLoaded();
            } else {
                that._onLoading && that._onLoading(Math.floor(loadCount / l * 100));
            }
        }

        if (!l) {
            that._onLoaded && that._onLoaded();
            return this;
        }

        for (i = l; i--;) {
            tmp = new Image();
            tmp.src = srcs[i];
            tmp.onload = onImgLoad;
        }

        return this;
    },

    init: function(arrSrcs, onLoaded, onLoading) {

        this._srcs = arrSrcs.slice(0);
        this._onLoaded = onLoaded;
        this._onLoading = onLoading;

        return this;
    }
};

//加载img的所有图片列表

var loadList = [],
    list = $('#preload_list img');

for (var i = list.length; i--;) {
    loadList.push(list.eq(i).data('src'));
}
imgLoader.init(loadList, function() {
    $(".page-1").addClass("active");
    
	$(".curtain img").eq(0).addClass("slideLeft");
	$(".curtain img").eq(1).addClass("slideRight");
	
	$(".curtain img")[0].addEventListener("webkitAnimationEnd", function(){
		$(".curtain").hide();
		$(".blackboard").addClass("show");
	});
	
	//开始学习
	var page=1;
	$(".start").on("touchstart",function(){
		$(".content").hide();
		$(".question-1").addClass("active");
	});
	
	//下一步
	$(".next").on('touchstart',function(){
		$(this).parent().hide().next('.wrong').addClass("show");
		$(this).parents(".question").find(".whip").hide();
		var instance = this;
		setTimeout(function(){
			$(instance).parents(".question").find('.techer').show();
		},1500);
	});
	//词汇解析
	$(".next2").on('touchstart',function(){
		$(this).parents(".question").find(".wrong").hide();
		$(".header,.footer").hide();
		$(this).parents(".question").find(".solution").addClass("show");
	});
	
	//下一词汇
	$(".continu").on('touchstart',function(){
		$(".header,.footer").show();
		$(".question-"+page).removeClass("active");
		$(".question-"+page).next().addClass("active");
		page++;
	});
	
	//打炮
	$(".pao")[0].addEventListener("webkitAnimationEnd", function(){
		$(".role").addClass("show");
		$(".gluss").addClass("show");
	});
	
	//点击人物
	$(".role").on("touchstart",function(){
		$(".g-page").removeClass("active");
		$(".page-2").addClass("active");
	});
	
	//分享
	$(".share").on("touchstart",function(){
		$(".page-3").addClass("active");
	});
	//关闭分享
	$(".page-3").on("touchstart",function(){
		$(".page-3").removeClass("active");
	});
	
}).load();
