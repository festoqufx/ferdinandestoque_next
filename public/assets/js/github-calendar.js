(function () {
  "use strict";

  var USERNAME = "festoqufx";
  var PROFILE = "https://github.com/" + USERNAME;
  var MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  var root = document.getElementById("github-calendar");
  if (!root) return;

  var gridEl = root.querySelector("[data-gh-grid]");
  var totalEl = root.querySelector("[data-gh-total]");
  if (!gridEl) return;

  function localEndpoint() {
    return new URL("api/github-calendar.php", window.location.href).href;
  }

  function remoteEndpoint() {
    return "https://github-contributions-api.jogruber.de/v4/" + USERNAME + "?y=last";
  }

  function formatDate(iso) {
    var parts = iso.split("-");
    var month = MONTHS[parseInt(parts[1], 10) - 1] || parts[1];
    return month + " " + parseInt(parts[2], 10) + ", " + parts[0];
  }

  function titleFor(day) {
    var n = day.count;
    var word = n === 1 ? "contribution" : "contributions";
    return n + " " + word + " on " + formatDate(day.date);
  }

  function groupWeeks(days) {
    if (!days.length) return [];
    var first = new Date(days[0].date + "T00:00:00");
    var pad = first.getDay();
    var cells = [];
    var i;
    for (i = 0; i < pad; i += 1) cells.push(null);
    for (i = 0; i < days.length; i += 1) cells.push(days[i]);
    while (cells.length % 7 !== 0) cells.push(null);

    var weeks = [];
    for (i = 0; i < cells.length; i += 7) {
      weeks.push(cells.slice(i, i + 7));
    }
    return weeks;
  }

  function cellHtml(day) {
    if (!day) {
      return '<div class="gh-cal__cell" aria-hidden="true"><span class="gh-cal__dot gh-cal__dot--empty"></span></div>';
    }
    var level = Math.max(0, Math.min(4, parseInt(day.level, 10) || 0));
    var tip = titleFor(day);
    return (
      '<div class="gh-cal__cell" title="' + tip.replace(/"/g, "&quot;") + '">' +
        '<span class="gh-cal__dot gh-cal__dot--' + level + '" aria-hidden="true"></span>' +
        '<span class="visually-hidden">' + tip + "</span>" +
      "</div>"
    );
  }

  function render(data) {
    var days = (data && data.contributions) || [];
    if (!days.length) throw new Error("empty calendar");

    var weeks = groupWeeks(days);
    var html = "";
    var w;
    for (w = 0; w < weeks.length; w += 1) {
      html += '<div class="gh-cal__week">';
      html += weeks[w].map(cellHtml).join("");
      html += "</div>";
    }
    gridEl.innerHTML = html;
    gridEl.removeAttribute("aria-busy");
    root.classList.remove("is-loading");
    root.classList.remove("is-error");

    var total = 0;
    if (data.total && typeof data.total.lastYear === "number") {
      total = data.total.lastYear;
    } else {
      days.forEach(function (day) {
        total += day.count || 0;
      });
    }
    if (totalEl) {
      totalEl.textContent =
        total.toLocaleString("en-US") + " contributions in the last year";
    }
  }

  function fail() {
    root.classList.remove("is-loading");
    root.classList.add("is-error");
    gridEl.removeAttribute("aria-busy");
    if (totalEl) {
      totalEl.innerHTML =
        'Could not load contributions. <a href="' + PROFILE + '" target="_blank" rel="noopener">View on GitHub</a>';
    }
  }

  function getJson(url) {
    return fetch(url, { cache: "no-store" }).then(function (res) {
      if (!res.ok) throw new Error("bad status");
      return res.json();
    });
  }

  function load() {
    var chain = /^(https?:)$/i.test(window.location.protocol)
      ? getJson(localEndpoint())
      : Promise.reject(new Error("no php"));

    chain
      .catch(function () {
        return getJson(remoteEndpoint());
      })
      .then(render)
      .catch(fail);
  }

  load();
})();
