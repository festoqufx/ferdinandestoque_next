!function (t) {
  var e = function (e) {
    var s = this;
    this.poster = e;
    this.posterItemMain = e.find("ul.poster-list");
    this.nextBtn = e.find("div.poster-next-btn");
    this.prevBtn = e.find("div.poster-prev-btn");
    this.posterItems = e.find("li.poster-item");
    if (this.posterItems.size() % 2 == 0) {
      this.posterItemMain.append(this.posterItems.eq(0).clone());
      this.posterItems = this.posterItemMain.children();
    }
    this.posterFirstItem = this.posterItems.first();
    this.posterLastItem = this.posterItems.last();
    this.rotateFlag = !0;
    this.setting = {
      width: 1e3,
      height: 270,
      posterWidth: 640,
      posterHeight: 270,
      scale: .9,
      speed: 500,
      autoPlay: !1,
      delay: 5e3,
      verticalAlign: "middle"
    };
    t.extend(this.setting, this.getSetting());
    this.baseSetting = t.extend({}, this.setting);
    this.fitToContainer();
    this.nextBtn.click(function () {
      s.rotateFlag && (s.rotateFlag = !1, s.carouseRotate("left"));
    });
    this.prevBtn.click(function () {
      s.rotateFlag && (s.rotateFlag = !1, s.carouseRotate("right"));
    });
    if (this.setting.autoPlay) {
      this.autoPlay();
      this.poster.hover(function () {
        window.clearInterval(s.timer);
      }, function () {
        s.autoPlay();
      });
    }
    t(window).on("resize.carousel", function () {
      clearTimeout(s.resizeTimer);
      s.resizeTimer = setTimeout(function () {
        s.fitToContainer();
      }, 150);
    });
  };
  e.prototype = {
    autoPlay: function () {
      var t = this;
      this.timer = window.setInterval(function () {
        t.nextBtn.click();
      }, this.setting.delay);
    },
    fitToContainer: function () {
      var viewport = window.innerWidth || document.documentElement.clientWidth || this.baseSetting.width;
      var parentWidth = this.poster.parent().width() || viewport;
      var available = Math.min(parentWidth, viewport);
      if (available < 1) available = viewport;
      var scale = available < this.baseSetting.width ? available / this.baseSetting.width : 1;
      this.setting.width = Math.round(this.baseSetting.width * scale);
      this.setting.height = Math.round(this.baseSetting.height * scale);
      this.setting.posterWidth = Math.round(this.baseSetting.posterWidth * scale);
      this.setting.posterHeight = Math.round(this.baseSetting.posterHeight * scale);
      this.setSettingValue();
      this.setPosterPos();
    },
    carouseRotate: function (e) {
      var s = this, i = [];
      if ("left" === e) {
        this.posterItems.each(function () {
          var e = t(this),
            h = e.prev().get(0) ? e.prev() : s.posterLastItem,
            n = h.width(),
            o = h.height(),
            r = h.css("opacity"),
            a = h.css("left"),
            c = h.css("top"),
            g = h.css("zIndex");
          i.push(g);
          e.animate({ width: n, height: o, opacity: r, left: a, top: c }, s.setting.speed, function () {
            s.rotateFlag = !0;
          });
        });
        this.posterItems.each(function (e) {
          t(this).css("zIndex", i[e]);
        });
      } else if ("right" === e) {
        this.posterItems.each(function () {
          var e = t(this),
            h = e.next().get(0) ? e.next() : s.posterFirstItem,
            n = h.width(),
            o = h.height(),
            r = h.css("opacity"),
            a = h.css("left"),
            c = h.css("top"),
            g = h.css("zIndex");
          i.push(g);
          e.animate({ width: n, height: o, opacity: r, left: a, top: c }, s.setting.speed, function () {
            s.rotateFlag = !0;
          });
        });
        this.posterItems.each(function (e) {
          t(this).css("zIndex", i[e]);
        });
      }
    },
    setPosterPos: function () {
      var e = this,
        s = this.posterItems.slice(1),
        i = s.size() / 2,
        h = s.slice(0, i),
        n = Math.floor(this.posterItems.size() / 2),
        o = s.slice(i),
        r = (this.setting.width - this.setting.posterWidth) / 2,
        a = this.setting.posterWidth,
        c = r + a,
        g = this.setting.posterHeight,
        p = (this.setting.width - this.setting.posterWidth) / 2 / n;
      h.each(function (s) {
        n--;
        a *= e.setting.scale;
        g *= e.setting.scale;
        var i = s;
        t(this).css({
          zIndex: n,
          width: a,
          height: g,
          opacity: 1 / ++i,
          left: c + ++s * p - a,
          top: e.setVerticalAlign(g)
        });
      });
      var l = h.last().width(),
        d = h.last().height(),
        u = Math.floor(this.posterItems.size() / 2);
      o.each(function (s) {
        t(this).css({
          zIndex: s,
          width: l,
          height: d,
          opacity: 1 / u,
          left: s * p,
          top: e.setVerticalAlign(d)
        });
        l /= e.setting.scale;
        d /= e.setting.scale;
        u--;
      });
    },
    setVerticalAlign: function (t) {
      var e = this.setting.verticalAlign;
      return "middle" === e ? (this.setting.height - t) / 2 : "top" === e ? 0 : "bottom" === e ? this.setting.height - t : (this.setting.height - t) / 2;
    },
    setSettingValue: function () {
      this.poster.css({ width: this.setting.width, height: this.setting.height });
      this.posterItemMain.css({ width: this.setting.width, height: this.setting.height });
      var t = (this.setting.width - this.setting.posterWidth) / 2;
      this.nextBtn.css({ width: t, height: this.setting.height, zIndex: Math.ceil(this.posterItems.size() / 2) });
      this.prevBtn.css({ width: t, height: this.setting.height, zIndex: Math.ceil(this.posterItems.size() / 2) });
      this.posterFirstItem.css({
        width: this.setting.posterWidth,
        height: this.setting.posterHeight,
        left: t,
        top: 0,
        zIndex: Math.floor(this.posterItems.size() / 2)
      });
    },
    getSetting: function () {
      var e = this.poster.attr("data-setting");
      return e && "" != e ? t.parseJSON(e) : {};
    }
  };
  e.init = function (e) {
    var s = this;
    e.each(function () {
      new s(t(this));
    });
  };
  window.Carousel = e;
}(jQuery);
