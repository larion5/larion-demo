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
  var FROG_IDS = ['146011476013', '235460268133', '749964285913'];
  // Цветочки на булавках: flower-1.png … flower-7.png — 1 клевер, 2 оранжевая звёздочка, 3 красный с завитком,
  // 4 белый, 5 розовый, 6 коралловый, 7 сиреневая звёздочка (вырезаны с фото, проволочка дорисована).
  function flowerSrc(n) { return DIR + 'flower-' + n + '.webp'; }

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

  // На каждой кочке постоянно сидит одна и та же жабка.
  function setGuest(s, guest) {
    s.guest = guest;
    s.box = null;
    s.hatOnly = null;
    var href = null, label = '';
    if (guest) {
      var fh = s.hill.frogHat == null ? null : layers.hats[s.hill.frogHat];
      var portrait = Object.assign({}, guest, { src: DIR + 'frog-' + guest.id + '.webp' });
      s.box = frogBox(portrait, fh);
      label = product(guest.id).title + ' прячется во мху. Попросить квакнуть';
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
    if (href) s.el.setAttribute('href', href);
    if (label) s.el.setAttribute('aria-label', label);
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
      var f = s.guest;
      var bodyH = BODY_BOTTOM[f.id] || f.h;
      var k = Math.min(w * 0.62, FW * FROG_SIZE, h * 0.95 * f.w / bodyH) / f.w;
      var frogH = bodyH * k;
      var REST = 0.12;
      g.style.width = (b.W * k) + 'px';
      g.style.height = (b.H * k) + 'px';
      g.style.left = (w * (s.hill.frogX || 0.5) - (f.ax - b.left) * k) + 'px';
      g.style.top = (h * 0.03 - frogH * REST - (f.ay - b.top) * k) + 'px';
      g.style.setProperty('--peek', (-frogH * (0.46 - REST)) + 'px');
      g.style.setProperty('--up', (-frogH * (0.70 - REST)) + 'px');
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
      var spot = document.createElement(hill.seat ? 'button' : 'a');
      if (hill.seat) spot.type = 'button';
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
    spots.forEach(function (s) {
      var frog = layers.frogs.find(function (item) { return item.id === FROG_IDS[s.hill.seat - 1]; });
      setGuest(s, frog || null);
      place(s);
    });
    fitField();
  }

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
      if (!s.guest && !s.el.hasAttribute('href')) continue;
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
  function nearbyFrog(x, y) {
    for (var radius = 6; radius <= 24; radius += 6) {
      for (var direction = 0; direction < 8; direction++) {
        var angle = direction * Math.PI / 4;
        var hit = hitSpot(x + Math.cos(angle) * radius, y + Math.sin(angle) * radius);
        if (hit && hit.guest) return hit;
      }
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
  function croak(s) {
    var directions = ['26px', '-26px', '0px'];
    var direction = s.croakDirection || 0;
    s.croakDirection = (direction + 1) % directions.length;
    var word = document.createElement('span');
    word.className = 'swamp__croak';
    word.textContent = 'КВА';
    word.setAttribute('aria-hidden', 'true');
    word.style.setProperty('--croak-drift', directions[direction]);
    s.el.insertBefore(word, s.holder);
    word.style.left = (parseFloat(s.holder.style.left) + parseFloat(s.holder.style.width) / 2) + 'px';
    word.style.top = (parseFloat(s.holder.style.top) + parseFloat(s.holder.style.getPropertyValue('--up'))) + 'px';
    setTimeout(function () { word.remove(); }, 1000);
  }
  var tapped = null;
  var hideTimer;
  var touchStart = null;
  var lastTouchAt = 0;
  var lastFrogTap = null;
  field.addEventListener('touchstart', function (e) {
    touchStart = e.touches.length === 1 ? e.touches[0] : null;
    lastTouchAt = Date.now();
  }, { passive: true });
  field.addEventListener('touchcancel', function () { touchStart = null; });
  field.addEventListener('touchend', function (e) {
    var start = touchStart;
    touchStart = null;
    lastTouchAt = Date.now();
    if (!start || e.touches.length || e.changedTouches.length !== 1) return;
    var finger = e.changedTouches[0];
    var x = finger.clientX, y = finger.clientY;
    if (Math.hypot(x - start.clientX, y - start.clientY) > 14) return;

    var hit = hitSpot(x, y);
    if (!hit && !hitFlower(x, y)) {
      hit = tapped && Math.hypot(x - tapped.x, y - tapped.y) < 24 ? tapped.spot : nearbyFrog(x, y);
    }
    clearTimeout(hideTimer);
    if (!hit || !hit.guest) {
      tapped = null;
      setHover(null);
      return;
    }
    // The touch event owns the frog tap, even when the browser also emits a click.
    if (e.cancelable) e.preventDefault();
    lastFrogTap = { x: x, y: y, at: lastTouchAt };
    if (tapped && tapped.spot === hit) {
      croak(hit);
      hideTimer = setTimeout(function () {
        tapped = null;
        setHover(null);
      }, 2000);
    }
    tapped = { spot: hit, x: x, y: y };
    setHover(hit);
  }, { passive: false });
  field.addEventListener('click', function (e) {
    var spot = e.target.closest('.swamp__spot');
    var keyboard = e.detail === 0;
    if (keyboard && spot && spot.hasAttribute('href')) return;
    var hit = keyboard ? spots.find(function (s) { return s.el === spot; }) : hitSpot(e.clientX, e.clientY);
    var afterTap = lastFrogTap && Date.now() - lastFrogTap.at < 700 &&
      Math.hypot(e.clientX - lastFrogTap.x, e.clientY - lastFrogTap.y) < 22;
    if (afterTap) { e.preventDefault(); return; }
    if (hit && hit.guest) {
      e.preventDefault();
      if (e.pointerType !== 'touch' && !(e.sourceCapabilities && e.sourceCapabilities.firesTouchEvents)) croak(hit);
      return;
    }
    if (keyboard) return;
    if (!hit && hitFlower(e.clientX, e.clientY)) { e.preventDefault(); location.href = FLOWER_HREF; return; }
    // клик мимо жабки (по кочке) ничего не открывает
    if (!spot || !hit || hit.el !== spot) {
      e.preventDefault();
      if (hit) location.href = hit.el.getAttribute('href');
    }
  });
  field.addEventListener('pointermove', function (e) {
    if (e.pointerType === 'touch' || Date.now() - lastTouchAt < 700) return;
    clearTimeout(hideTimer);
    tapped = null;
    var s = hitSpot(e.clientX, e.clientY);
    setHover(s, !s && hitFlower(e.clientX, e.clientY));
  });
  field.addEventListener('pointerleave', function (e) {
    if (e.pointerType !== 'touch' && Date.now() - lastTouchAt >= 700) setHover(null);
  });

  // Время от времени случайная жабка выглядывает сама.
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var timer = null;
  var running = false;
  function peek() {
    if (!running) return;
    var visible = spots.filter(function (s) {
      return s.guest && !s.el.classList.contains('is-up');
    });
    if (visible.length) {
      var s = visible[Math.floor(Math.random() * visible.length)];
      s.el.classList.add('is-peek');
      setTimeout(function () { s.el.classList.remove('is-peek'); }, 1500);
    }
    timer = setTimeout(peek, PEEK_MIN + Math.random() * PEEK_SPREAD);
  }

  build();
  Promise.allSettled(Array.from(field.querySelectorAll('img'), function (img) { return img.decode(); }))
    .then(function () { field.classList.add('is-ready'); });
  var observer = new IntersectionObserver(function (entries) {
    var visible = entries[0].isIntersecting;
    if (reduceMotion) return;
    if (visible && !running) { running = true; timer = setTimeout(peek, 1500); }
    if (!visible) { running = false; clearTimeout(timer); }
  }, { rootMargin: '200px' });
  observer.observe(field);

  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(redraw, 150);
  });
})();
