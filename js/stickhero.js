/**
 * created by yinshawn Rao at 2015/08/10
 */
function Stickhero() {
	this.gStart = $("#gamestart");
	this.gCont = $("#gameContainer");
	this.gOver = $("#gameover");
	this.gPage = $(".gamepage");
	this.pGroup = $("#pillarGroup");
	this.gDom = $(".gameDom");
	this.lv = $("#level");
	this.pillar = $(".pillar");
	this.fPillar = $(".pillar1");
	this.sBtn = $("#startgame");
	this.stick = $("#stick");
	this.player = $("#player");
	this.score = $(".score");
	this.scoring = $("#scoring");
	this.more = $("#moregame");
	this.cw = window.innerWidth;
	this.ch = window.innerHeight;
	this.pcw = 320;
	this.pch = 640;
	this.ua = navigator.userAgent;
	this.evStart = "";
	this.evEnd = "";
	this.pillarH = this.ch / 3;
	this.gameTimes = 0;
	this.initPillarCount = 4;
	this.initLeft = this.player.css("left");
	this.groupW = 0;
	this.startFlag = false;
	this.endFlag = true;
	this.stickW = this.stick.width();
	this.pillarIndex = 0;
	this.curPillar = $(".pillar" + (this.pillarIndex + 1));
	this.stickLen = 0;
	this.stickTimer = null;
	this.transCallback = "transitionend webkitTransitionEnd msTransitionEnd oTransitionEnd";
	this.gameScore = 0;
	this.moveY = 0;
}
/**
 * 加载游戏入口
 */
Stickhero.prototype.loadGame = function() {
	this.preventDragDefault(this.gCont);
	this.testDevice();
	this.setDom();
	this.rendererPillar();
	this.regEvents();
}
/**
 * 检测终端，调整屏幕尺寸以及调用不同事件
 */
Stickhero.prototype.testDevice = function() {
	if (/Mobile/i.test(this.ua)) {
		this.evStart = "touchstart";
		this.evEnd = "touchend";
	} else {
		this.evStart = "mousedown";
		this.evEnd = "mouseup";
		this.gPage.css({
			"max-width": this.pcw + "px",
			"max-height": this.pch + "px"
		});
		this.cw = this.pcw;
		this.ch = this.pch;
	}
}
/**
 * 设置不同屏幕下组件尺寸
 */
Stickhero.prototype.setDom = function() {
	this.pGroup.height(this.pillarH);
	this.gDom.css("bottom", this.pillarH + "px");
}
/**
 * 获取一个随机数
 */
Stickhero.prototype.getRandom = function(min, max) {
	return Math.round(Math.random() * (max - min) + min);
}
/**
 * 渲染柱子
 */
Stickhero.prototype.rendererPillar = function() {
	var _this = this;
	var arr_pillar = [];
	var level = 0;
	var sw_min, sw_max, sm_min, sm_max;
	if (this.gameTimes >= 0 && this.gameTimes < 5) {
		sw_min = 40;
		sw_max = 85;
		sm_min = 90;
		sm_max = 140;
		level = 1;
	} else if (this.gameTimes >= 5 && this.gameTimes < 10) {
		sw_min = 40;
		sw_max = 70;
		sm_min = 120;
		sm_max = 180;
		level = 2;
	} else if (this.gameTimes >= 10 && this.gameTimes < 15) {
		sw_min = 35;
		sw_max = 60;
		sm_min = 160;
		sm_max = 220;
		level = 3;
	} else {
		sw_min = 30;
		sw_max = 50;
		sm_min = 30;
		sm_max = 50;
		level = 4;
	}
	this.lv.html(level);
	for (var i = 0; i < this.initPillarCount; i++) {
		var pillar = {};
		pillar.s_width = this.getRandom(sw_min, sw_max);
		pillar.s_margin = this.getRandom(sm_min, sm_max);
		arr_pillar.push(pillar);
	}
	$.each(arr_pillar, function(k, v) {
		var pillar = "<li class='pillar pillar" + (k + 2 + _this.gameTimes * _this.initPillarCount) + "' style='width:" + v.s_width + "px;margin-left:" + v.s_margin + "px'></li>";
		_this.pGroup.append(pillar);
		_this.groupW += v.s_width + v.s_margin;
	});
	this.pGroup.width(this.groupW + this.fPillar.width());
}
/**
 * 注册游戏所有事件
 */
Stickhero.prototype.regEvents = function() {
	var _this = this;
	this.sBtn.on("tap click", function() {
		_this.gStart.hide();
	});
	this.gCont.on(this.evStart, function() {
		if (_this.startFlag) {
			return;
		} else {
			_this.startFlag = true;
		}
		_this.stick.show().css("left", _this.curPillar.width() - _this.stickW + "px");
		_this.rendererStick();
		_this.endFlag = false;
	}).on(this.evEnd, function() {
		if (_this.endFlag) {
			return;
		} else {
			_this.endFlag = true;
		}
		var curLeft = _this.player.offset().left;
		clearTimeout(_this.stickTimer);
		_this.stick.css({
			"transition": "all .5s ease 0s",
			"-webkit-transition": "all .5s ease 0s",
			"transform": "rotate(90deg)",
			"-webkit-transform": "rotate(90deg)"
		}).on(_this.transCallback, function() {
			_this.stick.off(_this.transCallback);
			_this.player.css({
				"transition": "all .5s ease 0s",
				"-webkit-transition": "all .5s ease 0s",
				"bottom": _this.pillarH + _this.stickW + "px",
				"left": curLeft + _this.stickLen + "px"
			}).on(_this.transCallback, function() {
				_this.player.off(_this.transCallback);
				_this.stick.css({
					"transition": "none",
					"-webkit-transition": "none",
					"transform": "rotate(0deg)",
					"-webkit-transform": "rotate(0deg)"
				}).hide();
				_this.stickLen = 0;
				_this.player.css({
					"transition": "none",
					"-webkit-transition": "none",
					"bottom": _this.pillarH + "px"
				});
				_this.pillarIndex++;
				_this.curPillar = $(".pillar" + (_this.pillarIndex + 1));
				if (_this.checkGame(_this.curPillar)) {
					_this.gameSuccess(_this);
					if (_this.checkNoPillar()) {
						_this.gameTimes++;
						_this.rendererPillar();
					}
				} else {
					_this.gameOver();
				}
			});
		});
	});
	this.more.on("tap click", function() {
		_this.gCont.show();
		_this.gOver.hide();
		_this.pillar.not(".pillar1").remove();
		_this.resetProperty(_this);
		_this.rendererPillar();

	});
}
/**
 * 渲染棍子
 */
Stickhero.prototype.rendererStick = function() {
	var _this = this;
	this.stickLen += 10;
	this.stick.height(this.stickLen);
	clearTimeout(this.stickTimer);
	this.stickTimer = setTimeout(function() {
		_this.rendererStick();
	}, 100);
}
/**
 * 检测游戏结果
 */
Stickhero.prototype.checkGame = function(curPillar) {
	var gameContinue = false;
	if (this.player.offset().left > curPillar.offset().left - this.player.width() && this.player.offset().left < curPillar.offset().left + curPillar.width() - this.player.width()) {
		gameContinue = true;
	}
	return gameContinue;
}
/**
 * 成功过棍子
 */
Stickhero.prototype.gameSuccess = function(_this) {
	_this.gameScore++;
	_this.score.html(_this.gameScore);
	_this.player.css({
		"transition": "all .5s ease 0s",
		"-webkit-transition": "all .5s ease 0s",
		"left": _this.curPillar.width() - _this.player.width() + "px"
	});
	_this.moveY += _this.curPillar.offset().left;
	_this.pGroup.css({
		"transition": "all .5s ease 0s",
		"-webkit-transition": "all .5s ease 0s",
		"left": -_this.moveY + "px"
	}).on(_this.transCallback, function() {
		_this.pGroup.off(_this.transCallback);
		_this.startFlag = false;
	});
}
/**
 * 游戏结束
 */
Stickhero.prototype.gameOver = function() {
	this.countMaxScore();
	this.gCont.hide();
	this.gOver.show();
}
/**
 * 检测柱子是否不够
 */
Stickhero.prototype.checkNoPillar = function() {
	var lastPillar = this.pillar.last();
	if (lastPillar.offset().left < this.cw + lastPillar.width()) {
		return true;
	} else {
		return false;
	}
}
/**
 * 存最高分
 */
Stickhero.prototype.countMaxScore = function() {
	if (window.localStorage) {
		var maxScore = localStorage.getItem("stickMaxScore");
		if (maxScore == undefined) {
			localStorage.setItem("stickMaxScore", this.gameScore);
		} else {
			if (this.gameScore > maxScore) {
				localStorage.setItem("stickMaxScore", this.gameScore);
			}
		}
		$("#maxScore").remove();
		this.scoring.after("<p id='maxScore' class='animated bounceInRight'>最高分：<span>" + localStorage.getItem("stickMaxScore") + "</span></p>");
	}
}
/**
 * 重置游戏
 */
Stickhero.prototype.resetProperty = function(_this) {
	_this.groupW = 0;
	_this.gameTimes = 0;
	_this.gameScore = 0;
	_this.stickLen = 0;
	_this.stickTimer = null;
	_this.pillarIndex = 0;
	_this.curPillar = $(".pillar" + (this.pillarIndex + 1));
	_this.moveY = 0;
	_this.startFlag = false;
	_this.endFlag = true;
	_this.player.css({
		"transition": "none",
		"-webkit-transition": "none",
		"left": _this.initLeft
	});
	_this.pGroup.css({
		"transition": "none",
		"-webkit-transition": "none",
		"left": 0
	});
	_this.score.html(0);
	_this.lv.html(1);
}
/**
 * 阻止默认事件
 */
Stickhero.prototype.preventDragDefault = function(dom) {
	dom.on("touchstart", function(e) {
		e.preventDefault();
	});
	dom.on("touchmove", function(e) {
		e.preventDefault();
	});
	dom.on("touchend", function(e) {
		e.preventDefault();
	});
}

new Stickhero().loadGame();