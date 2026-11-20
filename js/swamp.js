// Куст на первом экране: круглые кочки-помпоны, за которыми прячутся жабагочи.
// Жабки иногда сами выглядывают, при наведении поднимаются, по клику открывают свою карточку.
// Свободные жабки (в наличии и не лежат целиком в корзине) ведут на свою карточку.
// Если жабку забрали, она ныряет за кочку, а на её место вылезает следующая свободная.
// Когда свободные жабки кончаются, в кочках сидят жабки «для красоты» (DECOR) — они ведут в раздел жабагочи.
// Картинки: кочки, цветочки и жабки для красоты — assets/img/swamp, жабагочи и шляпки — слои конструктора.
(function () {
  var field = document.querySelector('[data-swamp]');
  var layers = window.LARION_CONSTRUCTOR;
  if (!field || !layers) return;

  var products = window.LARION_DATA.products;
  function product(id) { return products.filter(function (p) { return p.id === id; })[0]; }

  var DIR = 'assets/img/swamp/';
  // Кочки-помпоны: файл и размер картинки в пикселях.
  var MOSS = {
    olive: { src: DIR + 'moss-olive.webp', w: 367, h: 315 },
    bright: { src: DIR + 'moss-bright.webp', w: 353, h: 311 },
    lime: { src: DIR + 'moss-lime.webp', w: 366, h: 313 }
  };
  // Жабки «для красоты»: появляются, когда жабагочи в наличии не хватает на все места.
  var DECOR = [
    { src: DIR + 'decor-2.webp', w: 420, h: 394 },
    { src: DIR + 'decor-3.webp', w: 420, h: 396 },
    { src: DIR + 'decor-1.webp', w: 420, h: 296 },
    { src: DIR + 'decor-4.webp', w: 420, h: 349 }
  ];
  // Цветочки на булавках: flower-1.png … flower-7.png — 1 клевер, 2 оранжевая звёздочка, 3 красный с завитком,
  // 4 белый, 5 розовый, 6 коралловый, 7 сиреневая звёздочка (вырезаны с фото, проволочка дорисована).
  function flowerSrc(n) { return DIR + 'flower-' + n + '.png'; }

  // Размеры относительно ширины куста (доли): жабка, цветочек, воткнутая шляпа.
  var FROG_SIZE = 0.17;
  var FLOWER_SIZE = 0.05;
  var HAT_SIZE = 0.06;

  // Где у жабки низ фигурки (в пикселях её картинки), если на картинке перед ней что-то стоит.
  // У жабки с квакбуком низ — место между передних лап, а ноутбук просто ближе к зрителю.
  var BODY_BOTTOM = { '749964285913': 265 };

  // Кочки куста (по эскизу Леры). x, w — в процентах ширины куста; b — насколько кочка приподнята, тоже в % ширины.
  // z — что ближе к зрителю (больше — ближе). moss — цвет помпона.
  // seat — место для жабки (1 — первое, дальше по порядку); frogX — где жабка выглядывает по ширине кочки (0…1, по умолчанию середина);
  // frogHat — шляпа на жабке (номер из data/constructor.js или null).
  // stuck — шляпа, воткнутая в кочку (номер или null), hatSize — её ширина в долях ширины куста.
  // flowers — цветочки: [номер, где воткнут по ширине 0…1, наклон, глубина].
  //   Без глубины цветочек торчит из макушки; с глубиной (доля высоты кочки от макушки) — воткнут в бок, видна только головка.
  var HILLS = [
    { x: 24, w: 11, b: 17, z: 1, moss: 'lime', stuck: 1, hatSize: 0.045 },
    { x: 55.5, w: 14, b: 11, z: 1, moss: 'olive', stuck: 3, hatSize: 0.055 },
    { x: 63.5, w: 22.7, b: 4, z: 2, moss: 'lime', seat: 2, frogX: 0.53 },
    { x: 11.4, w: 24.8, b: 1, z: 2, moss: 'olive', seat: 3, frogX: 0.41, flowers: [[5, 0.6, 8, 0.42]] },
    { x: 30.8, w: 34.2, b: 1, z: 3, moss: 'bright', seat: 1, frogX: 0.46, flowers: [[2, 0.8, 12, 0.5]] },
    { x: 0.6, w: 15.5, b: 1, z: 4, moss: 'bright', flowers: [[4, 0.42, 0]] },
    { x: 59.2, w: 12.2, b: 0.7, z: 4, moss: 'olive' },
    { x: 79.7, w: 14, b: 1.8, z: 4, moss: 'bright', flowers: [[7, 0.75, 24]] }
  ];

  // На телефоне куст шире экрана и края обрезаны — два крайних цветочка переезжают туда, где их видно
  // (места отметила Лера): белый — в бок большой кочки слева, сиреневая звёздочка — в бок правой кочки.
  if (window.matchMedia && window.matchMedia('(max-width: 639px)').matches) {
    HILLS[5].flowers = [];
    HILLS[4].flowers = HILLS[4].flowers.concat([[4, 0.27, -10, 0.36]]);
    HILLS[7].flowers = [[7, 0.42, 10, 0.32]];
  }

  // Сколько ждать между подглядываниями (мс): случайно от MIN до MIN + SPREAD.
  var PEEK_MIN = 2800;
  var PEEK_SPREAD = 3200;

  var spots = [];

  function inStock(item) { var p = product(item.id); return p && p.stock !== 0; }
  // Жабка свободна: есть в наличии и ещё не разобрана в корзину.
  function isFree(f) { return inStock(f) && (!window.LarionCart || window.LarionCart.canAdd(f.id)); }

  // Картинки жабки и шляпы в одном блоке. Размеры в единицах слоёв, потом в процентах блока.
  function frogBox(frog, hat) {
    var left = 0, top = 0, right = frog.w, bottom = frog.h;
    var hx = 0, hy = 0;
    if (hat) {
      hx = frog.ax - hat.ax;
      hy = frog.ay - hat.ay;
      left = Math.min(left, hx);
      top = Math.min(top, hy);
      right = Math.max(right, hx + hat.w);
    }
    var W = right - left, H = bottom - top;
    var pct = function (v, t) { return (v / t * 100) + '%'; };
    var html = '<img class="swamp__img" src="' + frog.src + '" alt="" draggable="false" style="left:' + pct(-left, W) + ';top:' + pct(-top, H) + ';width:' + pct(frog.w, W) + '">';
    if (hat) html += '<img class="swamp__img" src="' + hat.src + '" alt="" draggable="false" style="left:' + pct(hx - left, W) + ';top:' + pct(hy - top, H) + ';width:' + pct(hat.w, W) + '">';
    return { html: html, W: W, H: H, left: left, top: top };
  }

  function decorLayer(d) { return { src: d.src, w: d.w, h: d.h, ax: d.w / 2, ay: 0 }; }

  // Гость кочки: жабагочи ({frog}), жабка для красоты ({decor}) или воткнутая шляпа (null + stuck).
  function setGuest(s, guest) {
    s.guest = guest;
    s.box = null;
    s.hatOnly = null;
    var href = null, label = '';
    if (guest && guest.decor) {
      s.box = frogBox(decorLayer(guest.decor), null);
      href = 'catalog.html?cat=zhabagochi';
      label = 'Жабка во мху. Посмотреть жабагочи в наличии';
    } else if (guest && guest.frog) {
      var fh = s.hill.frogHat == null ? null : layers.hats[s.hill.frogHat];
      s.box = frogBox(guest.frog, fh);
      href = 'product.html?id=' + guest.frog.id;
      label = product(guest.frog.id).title + ' прячется во мху. Открыть карточку';
    } else if (s.hill.stuck != null) {
      var hat = layers.hats[s.hill.stuck];
      if (hat && inStock(hat)) {
        s.box = frogBox(hat, null);
        s.hatOnly = hat;
        href = 'product.html?id=' + hat.id;
        label = product(hat.id).title + ' во мху. Открыть карточку';
      }
    }
    s.holder.innerHTML = s.box ? s.box.html : '';
    if (href) { s.el.setAttribute('href', href); s.el.setAttribute('aria-label', label); s.el.removeAttribute('tabindex'); }
    else { s.el.removeAttribute('href'); s.el.removeAttribute('aria-label'); s.el.setAttribute('tabindex', '-1'); }
  }

  // Верх купола кочки на доле ширины t (0…1), в долях высоты картинки.
  function domeTop(t) { var d = (t - 0.5) / 0.5; return 0.62 * (1 - Math.sqrt(Math.max(0, 1 - d * d))); }

  function draw(s) {
    var w = s.el.offsetWidth;
    var h = s.el.offsetHeight;
    var FW = field.offsetWidth;

    // Цветочки: из макушки торчат на проволочке, в боку видна только головка.
    var fh = FW * FLOWER_SIZE * 2.2;
    s.flowers.forEach(function (img, i) {
      var f = s.hill.flowers[i];
      img.style.height = fh + 'px';
      img.style.left = (w * f[1]) + 'px';
      img.style.top = (f[3] == null ? h * domeTop(f[1]) - fh * 0.42 : h * (domeTop(f[1]) + f[3]) - fh * 0.2) + 'px';
      img.style.transform = 'translateX(-50%) rotate(' + f[2] + 'deg)';
    });

    var g = s.holder;
    if (!s.box) return;
    var b = s.box;
    if (s.guest) {
      // Жабка уже кочки и сидит за ней: в покое из-за кочки виден только краешек головы (REST доли высоты),
      // при подглядывании — глаза, при наведении — почти вся мордочка.
      var f = s.guest.frog || decorLayer(s.guest.decor);
      var bodyH = (s.guest.frog && BODY_BOTTOM[f.id]) || f.h;
      var k = Math.min(w * 0.62, FW * FROG_SIZE, h * 0.95 * f.w / bodyH) / f.w;
      var frogH = bodyH * k;
      var REST = 0.12;
      g.style.width = (b.W * k) + 'px';
      g.style.height = (b.H * k) + 'px';
      g.style.left = (w * (s.hill.frogX || 0.5) - (f.ax - b.left) * k) + 'px';
      g.style.top = (h * 0.03 - frogH * REST - (f.ay - b.top) * k) + 'px';
      g.style.setProperty('--peek', (-frogH * (0.46 - REST)) + 'px');
      g.style.setProperty('--up', (-frogH * (0.70 - REST)) + 'px');
      g.style.setProperty('--gone', (frogH * 0.45) + 'px');
    } else {
      // Шляпа воткнута штырьком в макушку кочки.
      var hat = s.hatOnly;
      var kh = FW * (s.hill.hatSize || HAT_SIZE) / hat.w;
      g.style.width = (hat.w * kh) + 'px';
      g.style.height = (hat.h * kh) + 'px';
      g.style.left = (w / 2 - hat.ax * kh) + 'px';
      g.style.top = (h * 0.12 - hat.ay * kh) + 'px';
    }
  }

  function place(s) {
    var moss = MOSS[s.hill.moss];
    s.el.style.left = s.hill.x + '%';
    s.el.style.width = s.hill.w + '%';
    s.el.style.bottom = (s.hill.b / 100 * field.offsetWidth) + 'px';
    s.el.style.zIndex = s.hill.z;
    s.el.style.aspectRatio = moss.w + ' / ' + moss.h;
    draw(s);
    s.drawn = true;
  }

  // Высота куста: верх самой высокой кочки плюс место, куда жабка поднимается.
  function fitField() {
    var top = 0;
    spots.forEach(function (s) { top = Math.max(top, parseFloat(s.el.style.bottom) + s.el.offsetHeight); });
    field.style.height = Math.round(top + field.offsetWidth * FROG_SIZE * 0.9) + 'px';
  }

  function redraw() { spots.forEach(place); fitField(); }

  function build() {
    HILLS.forEach(function (hill) {
      var spot = document.createElement('a');
      spot.className = 'swamp__spot' + (hill.seat ? ' swamp__spot--seat' : '');
      var flowers = hill.flowers || [];
      var flowerImg = function (f, i) {
        return '<img class="swamp__flower' + (f[3] == null ? '' : ' swamp__flower--side') + '" data-i="' + i + '" src="' + flowerSrc(f[0]) + '" alt="" draggable="false">';
      };
      spot.innerHTML =
        '<span class="swamp__shadow"></span>' +
        flowers.map(function (f, i) { return f[3] == null ? flowerImg(f, i) : ''; }).join('') +
        '<span class="swamp__frog"></span>' +
        '<img class="swamp__moss" src="' + MOSS[hill.moss].src + '" alt="" draggable="false">' +
        flowers.map(function (f, i) { return f[3] == null ? '' : flowerImg(f, i); }).join('');
      field.appendChild(spot);
      var imgs = [];
      [].forEach.call(spot.querySelectorAll('.swamp__flower'), function (img) { imgs[+img.getAttribute('data-i')] = img; });
      spots.push({ el: spot, hill: hill, holder: spot.querySelector('.swamp__frog'), flowers: imgs, guest: null });
    });
    spots.forEach(function (s) { if (!s.hill.seat) { setGuest(s, null); place(s); } });
    seat(false);
    fitField();
  }

  function sameGuest(a, b) {
    if (!a || !b) return a === b;
    return a.frog ? a.frog === b.frog : a.decor === b.decor;
  }

  // Рассаживает жабок по местам seat. Свободные жабки остаются там, где сидели;
  // новые свободные занимают пустые места по порядку, а оставшиеся места — жабки для красоты.
  function seat(animate) {
    var seats = spots.filter(function (s) { return s.hill.seat; }).sort(function (a, b) { return a.hill.seat - b.hill.seat; });
    var free = layers.frogs.filter(isFree);
    var plan = seats.map(function (s) { return s.guest && s.guest.frog && free.indexOf(s.guest.frog) !== -1 ? s.guest : null; });
    var used = plan.filter(Boolean).map(function (g) { return g.frog; });
    free.forEach(function (f) {
      if (used.indexOf(f) !== -1) return;
      var i = plan.indexOf(null);
      if (i !== -1) { plan[i] = { frog: f }; used.push(f); }
    });
    // Жабки для красоты: та же, что уже сидела, или первая не занятая.
    var decorUsed = [];
    seats.forEach(function (s, i) {
      if (plan[i] || !s.guest || !s.guest.decor) return;
      plan[i] = s.guest;
      decorUsed.push(s.guest.decor);
    });
    seats.forEach(function (s, i) {
      if (plan[i]) return;
      var d = DECOR.filter(function (x) { return decorUsed.indexOf(x) === -1; })[0];
      if (d) { plan[i] = { decor: d }; decorUsed.push(d); }
    });

    seats.forEach(function (s, i) {
      var next = plan[i];
      if (s.drawn && sameGuest(s.guest, next)) return;
      if (!animate || !s.drawn) { setGuest(s, next); place(s); return; }
      // Жабка ныряет за кочку, потом вылезает новая.
      s.el.classList.remove('is-up', 'is-peek');
      s.el.classList.add('is-gone');
      setTimeout(function () {
        setGuest(s, next);
        place(s);
        setTimeout(function () { s.el.classList.remove('is-gone'); }, 350);
      }, 550);
    });
  }

  // На телефоне первое касание поднимает жабку, второе открывает ссылку.
  var touch = false;
  field.addEventListener('pointerdown', function (e) { touch = e.pointerType === 'touch'; });
  // Наводить и нажимать можно только на саму жабку (или шляпу), а не на кочку вокруг неё.
  // Проверяем по пикселям: точка должна попасть в непрозрачную часть жабки и не быть закрыта мхом.
  var alphaCache = {};
  function alphaAt(img, x, y) {
    var r = img.getBoundingClientRect();
    if (x < r.left || x >= r.right || y < r.top || y >= r.bottom || !img.naturalWidth) return 0;
    var a = alphaCache[img.src];
    if (!a) {
      try {
        var c = document.createElement('canvas');
        c.width = img.naturalWidth; c.height = img.naturalHeight;
        var cx = c.getContext('2d');
        cx.drawImage(img, 0, 0);
        a = alphaCache[img.src] = { w: c.width, h: c.height, d: cx.getImageData(0, 0, c.width, c.height).data };
      } catch (err) { return 255; }
    }
    var px = Math.floor((x - r.left) / r.width * a.w), py = Math.floor((y - r.top) / r.height * a.h);
    return a.d[(py * a.w + px) * 4 + 3];
  }
  function zOf(s) { return parseInt(s.el.style.zIndex || getComputedStyle(s.el).zIndex, 10) || 0; }
  function hitSpot(x, y) {
    for (var i = spots.length - 1; i >= 0; i--) {
      var s = spots[i];
      if (!s.el.hasAttribute('href')) continue;
      var on = [].some.call(s.holder.querySelectorAll('.swamp__img'), function (img) { return alphaAt(img, x, y) > 40; });
      if (!on) continue;
      // закрыта ли эта точка мхом своей кочки или кочек, что ближе к зрителю
      var z = zOf(s);
      var covered = spots.some(function (o) {
        if (o !== s && zOf(o) < z) return false;
        return alphaAt(o.el.querySelector('.swamp__moss'), x, y) > 40;
      });
      if (!covered) return s;
    }
    return null;
  }
  // Цветочки Леры ведут на «Шляпу цветочек». Проверяем по пикселям, не закрыт ли цветочек мхом.
  var FLOWER_HREF = 'product.html?id=559100002902';
  function hitFlower(x, y) {
    return spots.some(function (s) {
      var z = zOf(s);
      return s.flowers.some(function (img) {
        if (!img || alphaAt(img, x, y) <= 40) return false;
        var side = img.classList.contains('swamp__flower--side'); // в боку — поверх своего мха
        return !spots.some(function (o) {
          if (o === s ? side : zOf(o) <= z) return false;
          return alphaAt(o.el.querySelector('.swamp__moss'), x, y) > 40;
        });
      });
    });
  }
  var hovered = null;
  function setHover(s, flower) {
    field.style.cursor = s || flower ? 'pointer' : '';
    if (s === hovered) return;
    if (hovered) hovered.el.classList.remove('is-up');
    hovered = s;
    if (s) s.el.classList.add('is-up');
  }
  field.addEventListener('click', function (e) {
    var spot = e.target.closest('.swamp__spot');
    var hit = hitSpot(e.clientX, e.clientY);
    if (!hit && hitFlower(e.clientX, e.clientY)) { e.preventDefault(); location.href = FLOWER_HREF; return; }
    // клик мимо жабки (по кочке) ничего не открывает
    if (!spot || !hit || hit.el !== spot) {
      e.preventDefault();
      if (hit) {
        // жабка видна поверх чужой кочки: открываем её
        if (!touch || hit.el.classList.contains('is-up')) location.href = hit.el.getAttribute('href');
        else { spots.forEach(function (s) { s.el.classList.remove('is-up'); }); hit.el.classList.add('is-up'); }
      }
      return;
    }
    if (!touch || !spot.classList.contains('swamp__spot--seat')) return;
    if (!spot.classList.contains('is-up')) {
      e.preventDefault();
      spots.forEach(function (s) { s.el.classList.remove('is-up'); });
      spot.classList.add('is-up');
    }
  });
  field.addEventListener('mousemove', function (e) {
    if (touch) return;
    var s = hitSpot(e.clientX, e.clientY);
    setHover(s, !s && hitFlower(e.clientX, e.clientY));
  });
  field.addEventListener('mouseleave', function () { setHover(null); });

  // Время от времени случайная жабка выглядывает сама.
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var timer = null;
  var running = false;
  function peek() {
    if (!running) return;
    var visible = spots.filter(function (s) {
      return s.guest && !s.el.classList.contains('is-up') && !s.el.classList.contains('is-gone');
    });
    if (visible.length) {
      var s = visible[Math.floor(Math.random() * visible.length)];
      s.el.classList.add('is-peek');
      setTimeout(function () { s.el.classList.remove('is-peek'); }, 1500);
    }
    timer = setTimeout(peek, PEEK_MIN + Math.random() * PEEK_SPREAD);
  }

  var built = false;
  var observer = new IntersectionObserver(function (entries) {
    var visible = entries[0].isIntersecting;
    if (visible && !built) { built = true; build(); }
    if (reduceMotion) return;
    if (visible && !running) { running = true; timer = setTimeout(peek, 1500); }
    if (!visible) { running = false; clearTimeout(timer); }
  }, { rootMargin: '200px' });
  observer.observe(field);

  // Жабку положили в корзину целиком (или вернули) — пересаживаем.
  window.addEventListener('larion-cart-change', function () { if (built) seat(true); });

  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () { if (built) redraw(); }, 150);
  });
})();
