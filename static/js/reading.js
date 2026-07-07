// Sort + search for the finished reading list. Progressive enhancement over
// server-rendered rows: reorders/hides existing <li>s, no data payload. All
// row data derives from the DOM the template rendered, so there is no second
// source of truth to drift.
(function () {
  var list = document.getElementById("finished-list");
  var sortBar = document.getElementById("book-sort");
  var search = document.getElementById("book-search");
  var empty = document.getElementById("book-empty");
  if (!list || !sortBar || !search || !empty) return;

  function fold(s) {
    return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  }

  var rows = Array.prototype.map.call(list.children, function (el, i) {
    var title = el.querySelector(".book-title");
    var author = el.querySelector(".book-author");
    var time = el.querySelector("time");
    var stars = el.querySelector(".stars");
    var titleText = title ? title.textContent.trim() : "";
    var authorText = author ? author.textContent.trim() : "";
    return {
      el: el,
      index: i,
      title: fold(titleText),
      date: time ? time.getAttribute("datetime") || "" : "",
      rating: stars ? (stars.textContent.match(/★/g) || []).length : 0,
      haystack: fold(titleText + " " + authorText),
    };
  });

  var DEFAULT_DIR = { title: 1, date: -1, rating: -1 };
  // Template order is date desc; with the stable index tiebreak in
  // applySort, this state reproduces it exactly, so "cleared" needs no
  // separate representation.
  var NATURAL_KEY = "date";
  var NATURAL_DIR = -1;
  var key = NATURAL_KEY;
  var dir = NATURAL_DIR;

  function applySort() {
    rows.sort(function (a, b) {
      var r = a[key] < b[key] ? -1 : a[key] > b[key] ? 1 : 0;
      return r ? r * dir : a.index - b.index;
    });
    var frag = document.createDocumentFragment();
    for (var i = 0; i < rows.length; i++) frag.appendChild(rows[i].el);
    list.appendChild(frag);
  }

  function applyFilter() {
    var q = fold(search.value.trim());
    var shown = 0;
    rows.forEach(function (r) {
      var hit = !q || r.haystack.indexOf(q) !== -1;
      if (r.el.hidden === hit) r.el.hidden = !hit;
      if (hit) shown++;
    });
    empty.hidden = shown > 0;
  }

  var buttons = sortBar.querySelectorAll(".sort-btn");
  function paint() {
    buttons.forEach(function (b) {
      var active = b.getAttribute("data-key") === key;
      b.setAttribute("aria-pressed", String(active));
      b.querySelector(".sort-arrow").textContent = active
        ? dir === 1
          ? " ▴"
          : " ▾"
        : "";
    });
  }

  sortBar.addEventListener("click", function (e) {
    var b = e.target.closest(".sort-btn");
    if (!b) return;
    var k = b.getAttribute("data-key");
    if (k === key) {
      if (dir === DEFAULT_DIR[k]) {
        dir = -dir;
      } else {
        key = NATURAL_KEY;
        dir = NATURAL_DIR;
      }
    } else {
      key = k;
      dir = DEFAULT_DIR[k];
    }
    paint();
    applySort();
  });
  search.addEventListener("input", applyFilter);

  paint();
  sortBar.hidden = false;
  search.hidden = false;
})();
