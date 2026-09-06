(function () {
  "use strict";

  var root = document.querySelector(".viewers");
  if (!root) return;

  var countEl = root.querySelector(".presence-num");
  var labelEl = root.querySelector(".viewers__label");
  var endpoint = new URL("api/presence.php", window.location.href).href;
  var storeKey = "fe_presence_heartbeats";
  var ttlMs = 20000;
  var pollMs = 2500;
  var lastCount = null;
  var pollTimer = 0;
  var id = "";
  var useServer = false;
  var channel = null;

  try {
    channel = new BroadcastChannel("fe_presence");
  } catch (e) {}

  function sessionId() {
    if (id) return id;
    try {
      id = sessionStorage.getItem("presence_session_id") || "";
    } catch (e) {}
    if (!id) {
      id = Math.random().toString(36).slice(2) + Date.now().toString(36);
      try {
        sessionStorage.setItem("presence_session_id", id);
      } catch (e) {}
    }
    return id;
  }

  function presenceUrl(extra) {
    var joiner = endpoint.indexOf("?") >= 0 ? "&" : "?";
    var q = "sessionId=" + encodeURIComponent(sessionId());
    if (extra) q += extra;
    return endpoint + joiner + q;
  }

  function readLocal() {
    var map = {};
    try {
      map = JSON.parse(localStorage.getItem(storeKey) || "{}") || {};
    } catch (e) {
      map = {};
    }
    return map;
  }

  function localCount() {
    var now = Date.now();
    var map = readLocal();
    var sid = sessionId();
    var key;
    map[sid] = now;
    for (key in map) {
      if (!Object.prototype.hasOwnProperty.call(map, key)) continue;
      if (now - Number(map[key]) > ttlMs) delete map[key];
    }
    try {
      localStorage.setItem(storeKey, JSON.stringify(map));
    } catch (e) {}
    var n = 0;
    for (key in map) {
      if (Object.prototype.hasOwnProperty.call(map, key)) n += 1;
    }
    return Math.max(1, n);
  }

  function render(count) {
    var n = Math.max(0, parseInt(count, 10) || 0);
    if (!n) n = 1;
    root.classList.remove("is-loading");
    root.removeAttribute("hidden");

    if (countEl && lastCount !== n) {
      countEl.textContent = String(n);
      countEl.classList.remove("is-pop");
      void countEl.offsetWidth;
      countEl.classList.add("is-pop");
    }

    if (labelEl) {
      labelEl.textContent = n === 1 ? "person viewing now" : "people viewing now";
    }

    lastCount = n;

    if (channel) {
      try {
        channel.postMessage({ type: "presence", count: n, from: sessionId() });
      } catch (e) {}
    }
  }

  function tickLocal() {
    if (useServer) return;
    render(localCount());
  }

  function tickServer() {
    if (!/^(https?:)$/i.test(window.location.protocol)) return;

    var ctrl = typeof AbortController === "function" ? new AbortController() : null;
    var timer = 0;
    if (ctrl) timer = window.setTimeout(function () { ctrl.abort(); }, 4000);

    fetch(presenceUrl(), {
      cache: "no-store",
      credentials: "same-origin",
      signal: ctrl ? ctrl.signal : undefined
    })
      .then(function (res) {
        if (!res.ok) throw new Error("bad status");
        return res.json();
      })
      .then(function (data) {
        if (!data || typeof data.count !== "number") throw new Error("bad payload");
        useServer = true;
        render(Math.max(1, data.count));
      })
      .catch(function () {
        useServer = false;
        tickLocal();
      })
      .then(function () {
        if (timer) window.clearTimeout(timer);
      });
  }

  function leave() {
    var map = readLocal();
    try {
      delete map[sessionId()];
      localStorage.setItem(storeKey, JSON.stringify(map));
    } catch (e) {}
    if (useServer && navigator.sendBeacon) {
      navigator.sendBeacon(presenceUrl("&leave=1"));
    }
  }

  if (channel) {
    channel.onmessage = function (event) {
      if (useServer || !event || !event.data) return;
      if (event.data.from === sessionId()) return;
      if (event.data.type === "presence") tickLocal();
    };
  }

  window.addEventListener("storage", function (event) {
    if (useServer || event.key !== storeKey) return;
    tickLocal();
  });

  window.addEventListener("pagehide", function (event) {
    if (event.persisted) return;
    leave();
  });

  tickLocal();
  tickServer();
  pollTimer = window.setInterval(function () {
    if (useServer) tickServer();
    else tickLocal();
  }, pollMs);
})();
