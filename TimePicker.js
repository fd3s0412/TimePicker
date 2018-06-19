/**
 * TimePicker
 */
jQuery.fn.timePicker = function (callback) {
	$.timePicker(this, callback);
	return this;
};

jQuery.timePicker = function (container, callback) {
	var $container = $(container).get(0);
	if ($container) new jQuery._timePicker($container, callback);
};

jQuery._timePicker = function ($container, callback) {
	$container = $($container);

	var settings = {};
	settings.top = $container.offset().top + $container.outerHeight() + 2;
	settings.left = $container.offset().left + 2;
	settings.value = $container.val();
	settings.readonly = "readonly";

	new TimePicker(settings, $container);

	if (callback) callback();

};
// ------------------------------------------------------------
// TimePicker.
// ------------------------------------------------------------
function TimePicker (settings, $container) {
	var self = this;
	self.settings = settings;
	self.$container = $container;

	// 初期化
	self.init();
	// 切替
	self.$dom.find('i.icon_kirikae').click(function() {
		self.changeHourSub();
	});
	// 展開イベント設定
	$container.click(function() {
		self.open();
	});
	// 時クリックイベント設定
	self.$dom.find('.time_picker_hour li[data-time_picker_value]').click(function() {
		self.clickHour($(this).text());
	});
	// 分クリックイベント設定
	self.$dom.find('.time_picker_minute li[data-time_picker_value]').click(function() {
		self.clickMinute($(this).text());
	});
}
//------------------------------------------------------------
// 初期処理.
//------------------------------------------------------------
TimePicker.prototype.init = function() {
	this.$dom = this.createDom();
	var $body = $('body');
	$body.append(this.createOverlay());
	$body.append(this.$dom);

	// 位置設定
	this.setPosition(this.settings);

	// readonly
	this.$container.attr("readonly", this.settings.readonly);
};
// ------------------------------------------------------------
// DOMを生成
// ------------------------------------------------------------
TimePicker.prototype.createDom = function() {
	return $((function() {/*
		<div class="time_picker">
			<ul class="time_picker_hour main">
				<li class="time_picker_header">時</li>
				<li data-time_picker_value="07">07</li>
				<li data-time_picker_value="08">08</li>
				<li data-time_picker_value="09">09</li>
				<li data-time_picker_value="10">10</li>
				<li data-time_picker_value="11">11</li>
				<li data-time_picker_value="12">12</li>
				<li data-time_picker_value="13">13</li>
				<li data-time_picker_value="14">14</li>
				<li data-time_picker_value="15">15</li>
				<li data-time_picker_value="16">16</li>
				<li data-time_picker_value="17">17</li>
				<li data-time_picker_value="18">18</li>
				<li data-time_picker_value="19">19</li>
				<li class="icon_cell"><i class="icon_kirikae"></i></li>
			</ul>
			<ul class="time_picker_hour sub">
				<li class="time_picker_header">時</li>
				<li data-time_picker_value="00">00</li>
				<li data-time_picker_value="01">01</li>
				<li data-time_picker_value="02">02</li>
				<li data-time_picker_value="03">03</li>
				<li data-time_picker_value="04">04</li>
				<li data-time_picker_value="05">05</li>
				<li data-time_picker_value="06">06</li>
				<li data-time_picker_value="20">20</li>
				<li data-time_picker_value="21">21</li>
				<li data-time_picker_value="22">22</li>
				<li data-time_picker_value="23">23</li>
				<li>&nbsp;</li>
				<li>&nbsp;</li>
				<li class="icon_cell"><i class="icon_kirikae"></i></li>
			</ul>
			<ul class="time_picker_minute">
				<li class="time_picker_header">分</li>
				<li data-time_picker_value="00">00</li>
				<li data-time_picker_value="02">05</li>
				<li data-time_picker_value="10">10</li>
				<li data-time_picker_value="15">15</li>
				<li data-time_picker_value="20">20</li>
				<li data-time_picker_value="25">25</li>
				<li data-time_picker_value="30">30</li>
				<li data-time_picker_value="35">35</li>
				<li data-time_picker_value="40">40</li>
				<li data-time_picker_value="45">45</li>
				<li data-time_picker_value="50">50</li>
				<li data-time_picker_value="55">55</li>
			</ul>
		</div>
		*/}).toString().match(/\/\*([^]*)\*\//)[1]);
};
//------------------------------------------------------------
// Overlayを生成
//------------------------------------------------------------
TimePicker.prototype.createOverlay = function() {
	var self = this;

	var $overlay = $((function() {/*
		<div class="time_picker_overlay"></div>
	*/}).toString().match(/\/\*([^]*)\*\//)[1]);
	this.$overlay = $overlay;

	// 閉じるイベント
	this.$overlay.click(function() {
		self.close();
	});

	return this.$overlay;
};
// ------------------------------------------------------------
// 時間切替.
// ------------------------------------------------------------
TimePicker.prototype.changeHourSub = function() {
	var $dom = this.$dom.find('.time_picker_hour').not('.sub');
	this.$dom.find('.time_picker_hour').removeClass('sub');
	$dom.addClass('sub');
};
// ------------------------------------------------------------
// 時間選択イベント
// ------------------------------------------------------------
TimePicker.prototype.clickHour = function(value) {
	var target = this.$container.val() || "";
	if (target.length > 2) {
		target = target.replace(/^../, value);
	} else {
		target = value + ":";
	}
	this.$container.val(target);
	this.valueActivate();
};
// ------------------------------------------------------------
// 分選択イベント
// ------------------------------------------------------------
TimePicker.prototype.clickMinute = function(value) {
	var target = this.$container.val() || "";
	if (target.length === 5) {
		target = target.replace(/..$/, value);
	} else {
		target = "00:" + value;
	}
	this.$container.val(target);
	this.valueActivate();
};
// ------------------------------------------------------------
// 表示設定
// ------------------------------------------------------------
TimePicker.prototype.setPosition = function(settings) {
	this.$dom.css('top', settings.top + "px");
	this.$dom.css('left', settings.left + "px");
};
//------------------------------------------------------------
// 展開.
//------------------------------------------------------------
TimePicker.prototype.open = function() {
	this.$dom.show(100, "swing");
	this.$overlay.show();
	this.valueActivate();
};
//------------------------------------------------------------
// 閉じる.
//------------------------------------------------------------
TimePicker.prototype.close = function() {
	this.$dom.hide();
	this.$overlay.hide();
};
//------------------------------------------------------------
// 入力値を活性化.
//------------------------------------------------------------
TimePicker.prototype.valueActivate = function() {
	var target = this.$container.val();
	if (target.length >= 3) {
		var targetHour = target.substr(0, 2);
		this.$dom.find('.time_picker_hour li').removeClass('time_picker_active');
		this.$dom.find('.time_picker_hour li').filter(function() {
			return $(this).text() === targetHour;
		}).addClass('time_picker_active');
	}
	if (target.length === 5) {
		var targetMinute = target.substr(3, 2);
		this.$dom.find('.time_picker_minute li').removeClass('time_picker_active');
		this.$dom.find('.time_picker_minute li').filter(function() {
			return $(this).text() === targetMinute;
		}).addClass('time_picker_active');
	}
};
