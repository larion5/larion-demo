// Живая анимация конструктора на главной: шляпы, жабки и коврики сами сменяются по кругу.
// Картинки загружаются, только когда блок подходит к экрану, а движение идёт, только пока он виден.
(function () {
  var box = document.querySelector('[data-teaser]');
  var layers = window.LARION_CONSTRUCTOR;
  if (!box || !layers) return;

  var products = window.LARION_DATA.products;
  function inStock(item) {
    var p = products.filter(function (x) { return x.id === item.id; })[0];
    return p && p.stock !== 0;
  }
  var LISTS = { hat: layers.hats.filter(inStock), frog: layers.frogs.filter(inStock), mat: layers.mats.filter(inStock) };
  if (!LISTS.frog.length) return;

  var narrow = window.matchMedia('(max-width: 639px)');
  var STAGE_H = 970;
  var BASE = 620;
  var HAT_LEVEL = 370;
  var DROP = { hat: 0, frog: 0, mat: 190 };
  var pos = { hat: 0, frog: 0, mat: 0 };
  var slots = { hat: [], frog: [], mat: [] };

  function mod(a, n) { return ((a % n) + n) % n; }
  function pct(v, t) { return (v / t * 100) + '%'; }
  function anchor(kind, item) {
    if (kind === 'hat') return { x: item.ax, y: item.ay };
    if (kind === 'frog') return { x: item.ax, y: item.by };
    return { x: item.w / 2, y: item.h / 2 };
  }

  function build() {
    ['mat', 'frog', 'hat'].forEach(function (kind) {
      var band = document.createElement('div');
      band.className = 'teaser__band teaser__band--' + kind;
      band.setAttribute('data-band', kind);
      LISTS[kind].forEach(function (item) {
        var slot = document.createElement('div');
        slot.className = 'teaser__slot';
        var a = anchor(kind, item);
        slot.style.height = pct(item.h, STAGE_H);
        slot.style.transformOrigin = pct(a.x, item.w) + ' ' + pct(a.y, item.h);
        var img = document.createElement('img');
        img.src = item.src;
        img.alt = '';
        if (item.transform) img.style.transform = item.transform;
        slot.appendChild(img);
        band.appendChild(slot);
        slots[kind].push({ el: slot, item: item, a: a });
      });
      box.appendChild(band);
    });
  }

  function place(kind) {
    var W = narrow.matches ? 920 : 1240;
    var R = narrow.matches ? { hat: 410, frog: 430, mat: 450 } : { hat: 520, frog: 540, mat: 560 };
    var n = LISTS[kind].length;
    var level = kind === 'hat' ? HAT_LEVEL : BASE;
    slots[kind].forEach(function (s, i) {
      var d = mod(i - pos[kind] + n / 2, n) - n / 2;
      var abs = Math.abs(d);
      var x = R[kind] * Math.sin(Math.max(-1.5, Math.min(1.5, d)) * Math.PI / 3.2);
      var scale = abs <= 1 ? 1 - 0.55 * abs : 0.45 - 0.1 * Math.min(abs - 1, 0.5) * 2;
      var opacity = abs <= 1 ? 1 - 0.35 * abs : Math.max(0, 0.65 * (1.5 - abs) * 2);
      s.el.style.width = pct(s.item.w, W);
      s.el.style.left = pct(W / 2 + x - s.a.x, W);
      s.el.style.top = pct(level - s.a.y + DROP[kind] * Math.min(abs, 1), STAGE_H);
      s.el.style.transform = 'scale(' + scale + ')';
      s.el.style.opacity = opacity;
      s.el.style.zIndex = Math.round((2 - abs) * 10);
    });
    if (kind === 'frog') {
      var frogs = LISTS.frog;
      var low = Math.floor(pos.frog);
      var f = pos.frog - low;
      var head = function (fr) { return BASE - (fr.by - fr.ay); };
      var y = head(frogs[mod(low, frogs.length)]) * (1 - f) + head(frogs[mod(low + 1, frogs.length)]) * f;
      box.querySelector('[data-band="hat"]').style.transform = 'translateY(' + pct(y - HAT_LEVEL, STAGE_H) + ')';
    }
  }

  function placeAll() { place('mat'); place('hat'); place('frog'); }

  // Порядок показа: две шляпы, жабка, коврик и по новой.
  var ORDER = ['hat', 'hat', 'frog', 'mat', 'hat', 'mat', 'frog'];
  var step = 0;
  var timer = null;
  var running = false;

  function spin(kind, done) {
    var from = pos[kind];
    var started = null;
    (function frame(now) {
      if (started === null) started = now;
      var t = Math.min(1, (now - started) / 750);
      var eased = 1 - Math.pow(1 - t, 3);
      pos[kind] = from + eased;
      place(kind);
      if (t < 1) requestAnimationFrame(frame);
      else done();
    })(performance.now());
  }

  function next() {
    if (!running) return;
    spin(ORDER[step % ORDER.length], function () {
      step += 1;
      if (running) timer = setTimeout(next, 1300);
    });
  }

  var built = false;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var observer = new IntersectionObserver(function (entries) {
    var visible = entries[0].isIntersecting;
    if (visible && !built) {
      built = true;
      build();
      placeAll();
    }
    if (reduceMotion) return;
    if (visible && !running) {
      running = true;
      timer = setTimeout(next, 900);
    } else if (!visible) {
      running = false;
      clearTimeout(timer);
    }
  }, { rootMargin: '200px' });
  observer.observe(box);

  narrow.addEventListener('change', function () { if (built) placeAll(); });
  window.LarionTeaser = { pos: pos };
})();
