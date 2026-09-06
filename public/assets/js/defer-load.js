(function () {
  "use strict";

  var cache = {};

  function loadScript(src) {
    if (cache[src]) return cache[src];
    cache[src] = new Promise(function (resolve, reject) {
      var existing = document.querySelector('script[src="' + src + '"]');
      if (existing) {
        resolve();
        return;
      }
      var script = document.createElement("script");
      script.src = src;
      script.async = true;
      script.onload = resolve;
      script.onerror = reject;
      document.body.appendChild(script);
    });
    return cache[src];
  }

  function idle(fn, timeout) {
    if ("requestIdleCallback" in window) {
      requestIdleCallback(fn, { timeout: timeout || 2500 });
    } else {
      setTimeout(fn, timeout || 2500);
    }
  }

  function whenNear(selector, fn, timeout) {
    var ran = false;
    function run() {
      if (ran) return;
      ran = true;
      fn();
    }
    var el = document.querySelector(selector);
    if (!el || !("IntersectionObserver" in window)) {
      idle(run, timeout || 2000);
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      if (entries.some(function (entry) { return entry.isIntersecting; })) {
        io.disconnect();
        run();
      }
    }, { rootMargin: "1400px 0px" });
    io.observe(el);
    idle(run, timeout || 4000);
  }

  if (location.hash === "#portfolio") {
    Promise.all([
      loadScript("assets/vendor/isotope-layout/isotope.pkgd.min.js"),
      loadScript("assets/vendor/glightbox/js/glightbox.min.js")
    ]).then(function () {
      if (typeof window.initPortfolio === "function") window.initPortfolio();
    });
  }

  whenNear("#portfolio", function () {
    Promise.all([
      loadScript("assets/vendor/isotope-layout/isotope.pkgd.min.js"),
      loadScript("assets/vendor/glightbox/js/glightbox.min.js")
    ]).then(function () {
      if (typeof window.initPortfolio === "function") window.initPortfolio();
    });
  }, 2500);

  whenNear("#infinity", function () {
    loadScript("assets/js/jquery-1.12.0.min.js").then(function () {
      if (window.jQuery) {
        window.jQuery(".hover").mouseleave(function () {
          window.jQuery(this).removeClass("hover");
        });
      }
      return loadScript("assets/js/carousel.js");
    }).then(function () {
      if (window.jQuery && window.Carousel) {
        window.Carousel.init(window.jQuery(".pictureSlider"));
      }
    });
  }, 3000);

  whenNear("#contact", function () {
    loadScript("assets/vendor/php-email-form/validate.js");
  }, 4000);
})();
