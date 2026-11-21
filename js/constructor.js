// Конструктор: жабагочи + шляпа + коврик. Картинки накладываются слоями:
// коврик снизу, жабка посередине, шляпа сверху. Слои описаны в data/constructor.js.
// Каждый ряд тянется вбок и крутится по кругу: сверху шляпы, в середине жабки, снизу коврики.
(function () {
  var layers = window.LARION_CONSTRUCTOR;
  var cart = window.LarionCart;
  var products = window.LARION_DATA.products;

  // Размер сцены в единицах слоёв (100 = 1 см). Точка, где жабка стоит на коврике, — CX, BASE.
  // На компьютере сцена шире, на телефоне уже, чтобы жабка оставалась крупной.
  var STAGE_W, CX, RADIUS;
  var STAGE_H = 970;
  var BASE = 620;
  var HAT_LEVEL = 370;      // исходная высота макушки; ряд шляп сдвигается под выбранную жабку

  // Круг: как далеко расходятся соседи и насколько они меньше
  var narrow = window.matchMedia('(max-width: 639px)');
  function applyLayout() {
    STAGE_W = narrow.matches ? 920 : 1240;
    CX = STAGE_W / 2;
    RADIUS = narrow.matches ? { frog: 430, mat: 450 } : { frog: 540, mat: 560 };
  }
  applyLayout();
  var SIDE_DROP = { hat: 0, frog: 0, mat: 190 };   // соседние коврики ниже, чтобы не смешиваться с жабками
  var SIDE_SCALE = 0.45;
  var SIDE_OPACITY = 0.65;
  // Шляпы занимают по три места с каждой стороны и плавно уходят за край ряда.
  var HAT_X = [0, 0.18, 0.315, 0.44, 0.51];
  var HAT_SCALE = [1, 0.59, 0.43, 0.29, 0.24];
  var HAT_OPACITY = [1, 0.8, 0.65, 0.5, 0];

  var reduceMotion = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  function product(id) { return products.filter(function (p) { return p.id === id; })[0]; }
  // В конструкторе только товары, которые есть в наличии.
  function inStock(item) {
    var p = product(item.id);
    return p && p.stock !== 0;
  }

  function withEmptyChoice(layers) {
    var available = layers.filter(inStock);
    available.splice(Math.ceil(available.length / 2), 0, null);
    return available;
  }

  var LISTS = {
    hat: withEmptyChoice(layers.hats),
    frog: layers.frogs.filter(inStock),
    mat: withEmptyChoice(layers.mats)
  };

  var root = document.querySelector('[data-constructor]');
  if (!LISTS.frog.length || new URLSearchParams(location.search).get('preview') === 'empty') {
    root.replaceWith(document.querySelector('#builder-empty').content.cloneNode(true));
    return;
  }

  var stage = root.querySelector('[data-stage]');
  var shadow = stage.querySelector('[data-layer="shadow"]');
  var summary = root.querySelector('[data-summary]');
  var total = root.querySelector('[data-total]');
  var addBtn = root.querySelector('[data-add-set]');
  var note = root.querySelector('[data-set-note]');

  // pos — положение ряда: дробное во время движения, целое, когда предмет встал по центру.
  var pos = { hat: 0, frog: 0, mat: 0 };
  var tweens = {};
  var slots = { hat: [], frog: [], mat: [] };

  function pct(value, totalValue) { return (value / totalValue * 100) + '%'; }
  function mod(a, n) { return ((a % n) + n) % n; }
  function index(kind) { return mod(Math.round(pos[kind]), LISTS[kind].length); }
  function selected(kind) { return LISTS[kind][index(kind)]; }

  // Опорная точка предмета: ею он стоит на своём месте, вокруг неё уменьшается.
  function anchor(kind, item) {
    if (!item) return { x: 110, y: 32 };
    if (kind === 'hat') return { x: item.ax, y: item.ay };
    if (kind === 'frog') return { x: item.ax, y: item.by };
    return { x: item.w / 2, y: item.h / 2 };
  }

  function buildBand(kind) {
    var band = stage.querySelector('[data-band="' + kind + '"]');
    LISTS[kind].forEach(function (item, i) {
      var slot = document.createElement('div');
      slot.className = 'slot';
      var w = item ? item.w : 220;
      var h = item ? item.h : 64;
      var a = anchor(kind, item);
      slot.style.height = pct(h, STAGE_H);
      slot.style.transformOrigin = pct(a.x, w) + ' ' + pct(a.y, h);
      var img = null;
      if (item) {
        img = document.createElement('img');
        if (kind !== 'mat') img.src = item.src;
        img.alt = '';
        img.draggable = false;
        if (item.transform) img.style.transform = item.transform;
        slot.appendChild(img);
      } else {
        slot.classList.add('slot--none');
        slot.textContent = kind === 'hat' ? 'без шляпы' : 'без коврика';
      }
      band.appendChild(slot);
      slots[kind][i] = { el: slot, img: img, item: item, anchor: a, w: w };
    });
  }

  function placeBand(kind) {
    var n = LISTS[kind].length;
    var levelY = kind === 'hat' ? HAT_LEVEL : BASE;
    slots[kind].forEach(function (s, i) {
      // d — насколько предмет отстоит от центра: 0 — в центре, ±1 — сосед.
      var d = mod(i - pos[kind] + n / 2, n) - n / 2;
      var abs = Math.abs(d);
      if (kind === 'mat' && s.img && abs < 2.1 && !s.img.hasAttribute('src')) {
        s.img.src = s.item.src.replace(/\.webp$/, '-stage.webp');
      }
      var limited = Math.max(-1.5, Math.min(1.5, d));
      var x, scale, opacity;
      if (kind === 'hat') {
        var step = Math.min(Math.floor(abs), 3);
        var fraction = Math.min(abs - step, 1);
        x = Math.sign(d) * STAGE_W * (HAT_X[step] + (HAT_X[step + 1] - HAT_X[step]) * fraction);
        scale = HAT_SCALE[step] + (HAT_SCALE[step + 1] - HAT_SCALE[step]) * fraction;
        opacity = HAT_OPACITY[step] + (HAT_OPACITY[step + 1] - HAT_OPACITY[step]) * fraction;
      } else {
        x = RADIUS[kind] * Math.sin(limited * Math.PI / 3.2);
        scale = abs <= 1 ? 1 - (1 - SIDE_SCALE) * abs : SIDE_SCALE - 0.1 * Math.min(abs - 1, 0.5) * 2;
        opacity = abs <= 1 ? 1 - (1 - SIDE_OPACITY) * abs : Math.max(0, SIDE_OPACITY * (1.5 - abs) * 2);
      }
      if (!s.item) {
        // Подпись «без шляпы» не уменьшается, иначе её не прочитать, и в центре исчезает.
        scale = 1;
        opacity = abs < 0.5 ? 0 : Math.min(1, opacity * 1.5);
      }
      s.el.style.width = pct(s.w, STAGE_W);
      s.el.style.left = pct(CX + x - s.anchor.x, STAGE_W);
      s.el.style.top = pct(levelY - s.anchor.y + SIDE_DROP[kind] * Math.min(abs, 1), STAGE_H);
      s.el.style.transform = 'scale(' + scale + ')';
      s.el.style.opacity = opacity;
      s.el.style.visibility = opacity <= 0.01 ? 'hidden' : 'visible';
      s.el.style.zIndex = Math.round((2 - abs) * 10);
    });
  }

  // Шляпы садятся на макушку той жабки, что сейчас в центре, и плавно меняют высоту при её смене.
  function headY(frog) { return BASE - (frog.by - frog.ay); }

  function placeHatLevel() {
    var frogs = LISTS.frog;
    var n = frogs.length;
    var low = Math.floor(pos.frog);
    var f = pos.frog - low;
    var y = headY(frogs[mod(low, n)]) * (1 - f) + headY(frogs[mod(low + 1, n)]) * f;
    stage.querySelector('[data-band="hat"]').style.transform = 'translateY(' + pct(y - HAT_LEVEL, STAGE_H) + ')';
  }

  function placeShadow() {
    var frog = selected('frog');
    var off = Math.abs(pos.frog - Math.round(pos.frog));
    shadow.style.left = pct(CX - frog.w * 0.46, STAGE_W);
    shadow.style.top = pct(BASE - 26, STAGE_H);
    shadow.style.width = pct(frog.w * 0.92, STAGE_W);
    shadow.style.height = pct(52, STAGE_H);
    shadow.style.opacity = Math.max(0, 1 - off * 2.5);
  }

  function current() {
    return [selected('hat'), selected('frog'), selected('mat')].filter(Boolean);
  }

  // «Шляпа пчела» в строке «Шляпа» показываем как «Пчела», чтобы не было «Шляпа Шляпа пчела».
  // В карточке товара и в корзине название остаётся полным.
  function shortTitle(title, label) {
    var start = label + ' ';
    if (title.toLowerCase().indexOf(start.toLowerCase()) !== 0) return title;
    var rest = title.slice(start.length);
    return rest.charAt(0).toUpperCase() + rest.slice(1);
  }

  function renderSummary() {
    var LABELS = ['Шляпа', 'Жабагочи', 'Коврик'];
    summary.innerHTML = [selected('hat'), selected('frog'), selected('mat')].map(function (item, i) {
      if (!item) return '<li><span class="set__kind">' + LABELS[i] + '</span><span class="set__name set__name--none">нет</span><span></span></li>';
      var p = product(item.id);
      return '<li><span class="set__kind">' + LABELS[i] + '</span><a class="set__name" href="product.html?id=' + p.id + '">' + shortTitle(p.title, LABELS[i]) + '</a><span class="set__price">' + cart.money(p.price) + '</span></li>';
    }).join('');
    total.textContent = cart.money(current().reduce(function (s, item) { return s + product(item.id).price; }, 0));
  }

  function renderButton() {
    if (addBtn.getAttribute('data-flash')) return;
    var items = current();
    // Кнопка кладёт только то, чего ещё нет в корзине. Так можно собрать несколько шляп и ковриков:
    // добавить набор, выбрать другую шляпу или коврик и нажать ещё раз — добавится только новое.
    var fresh = toAdd();
    var inCart = items.filter(function (item) { return inCartQty(item.id) > 0; });
    var soldOut = items.filter(function (item) { return !inCartQty(item.id) && !cart.canAdd(item.id); });
    addBtn.disabled = !fresh.length;
    addBtn.textContent = !fresh.length ? 'Уже в корзине' : (inCart.length ? 'Добавить ' + fresh.map(function (item) { return KIND_WORD[kindOf(item)]; }).join(' и ') : 'Добавить набор в корзину');
    // Заметный блок «можно взять ещё»: появляется, как только что-то из набора легло в корзину.
    more.hidden = !inCart.length;
    note.hidden = !soldOut.length;
    note.innerHTML = soldOut.map(function (item) { return product(item.id).title; }).join(', ') + ' — больше нетю';
  }
  var KIND_WORD = { hat: 'шляпу', frog: 'жабагочи', mat: 'коврик' };
  var more = root.querySelector('[data-set-more]');
  function kindOf(item) { return item === selected('hat') ? 'hat' : item === selected('frog') ? 'frog' : 'mat'; }
  function inCartQty(id) { return cart.qtyOf ? cart.qtyOf(id) : 0; }
  function toAdd() { return current().filter(function (item) { return !inCartQty(item.id) && cart.canAdd(item.id); }); }

  var lastKey = '';
  function refreshChoice() {
    var key = index('hat') + '/' + index('frog') + '/' + index('mat');
    if (key === lastKey) return;
    lastKey = key;
    renderSummary();
    renderButton();
  }

  function draw(kind) {
    placeBand(kind);
    if (kind === 'frog') {
      placeHatLevel();
      placeShadow();
    }
    refreshChoice();
  }

  // Плавно докручиваем ряд до нужного предмета.
  function spinTo(kind, target, length) {
    if (tweens[kind]) cancelAnimationFrame(tweens[kind]);
    if (reduceMotion) {
      pos[kind] = target;
      draw(kind);
      return;
    }
    var from = pos[kind];
    var started = null;
    var duration = length || 320;
    (function frame(now) {
      if (started === null) started = now;
      var t = Math.min(1, (now - started) / duration);
      var eased = 1 - Math.pow(1 - t, 3);
      pos[kind] = from + (target - from) * eased;
      draw(kind);
      tweens[kind] = t < 1 ? requestAnimationFrame(frame) : null;
    })(performance.now());
  }

  // Подсказка: шляпа слегка качается, будто её начали поворачивать и не довернули.
  // Навсегда останавливается, как только человек сам потянет любой ряд.
  var WIGGLE_FIRST = 1200;
  var WIGGLE_PAUSE = 6500;
  var WIGGLE_LENGTH = 1500;
  var WIGGLE_SIZE = 0.16;
  var wiggleTimer = null;
  var wiggleFrame = null;
  var wiggleBase = null;
  var wiggleOff = reduceMotion;

  function stopWiggle() {
    wiggleOff = true;
    clearTimeout(wiggleTimer);
    if (wiggleFrame) cancelAnimationFrame(wiggleFrame);
    wiggleFrame = null;
    if (wiggleBase !== null) {
      pos.hat = wiggleBase;
      wiggleBase = null;
      draw('hat');
    }
  }

  function wiggleOnce() {
    if (wiggleOff) return;
    // В скрытой вкладке или за пределами экрана не качаем, а ждём следующего раза.
    var r = stage.getBoundingClientRect();
    if (document.hidden || r.bottom < 0 || r.top > window.innerHeight) {
      wiggleTimer = setTimeout(wiggleOnce, WIGGLE_PAUSE);
      return;
    }
    wiggleBase = pos.hat;
    var started = null;
    (function frame(now) {
      if (wiggleOff) return;
      if (started === null) started = now;
      var t = Math.min(1, (now - started) / WIGGLE_LENGTH);
      pos.hat = wiggleBase + WIGGLE_SIZE * Math.sin(t * Math.PI * 3) * Math.pow(1 - t, 1.3);
      draw('hat');
      if (t < 1) {
        wiggleFrame = requestAnimationFrame(frame);
      } else {
        pos.hat = wiggleBase;
        wiggleBase = null;
        draw('hat');
        wiggleTimer = setTimeout(wiggleOnce, WIGGLE_PAUSE);
      }
    })(performance.now());
  }

  // Перетаскивание: верхний ряд — шляпы, середина — жабки, низ — коврики.
  var drag = null;

  // Какой ряд взяли. Шляпа и жабка берутся за сам предмет, у шляп запас вокруг, потому что
  // они бывают совсем маленькими. Коврик тянется только снизу, ниже основания жабки.
  var GRAB_PADDING = { hat: { side: 28, top: 28, bottom: 6 }, frog: { side: 8, top: 0, bottom: 8 } };

  function hitsItem(kind, x, y) {
    var pad = GRAB_PADDING[kind];
    return slots[kind].some(function (s) {
      if (s.el.style.visibility === 'hidden' || Number(s.el.style.opacity) < 0.05) return false;
      var box = (s.el.firstElementChild || s.el).getBoundingClientRect();
      return x >= box.left - pad.side && x <= box.right + pad.side && y >= box.top - pad.top && y <= box.bottom + pad.bottom;
    });
  }

  function kindAt(x, y) {
    if (hitsItem('hat', x, y)) return 'hat';
    if (hitsItem('frog', x, y)) return 'frog';
    // Остальное место: выше макушки выбранной жабки — шляпы, ниже её основания — коврики,
    // а по бокам от жабки — жабки, чтобы промах мимо неё не менял коврик.
    var r = stage.getBoundingClientRect();
    var part = (y - r.top) / r.height * STAGE_H;
    if (part < headY(selected('frog'))) return 'hat';
    return part < BASE ? 'frog' : 'mat';
  }

  stage.addEventListener('pointerdown', function (e) {
    if (e.button || e.target.closest('button')) return;
    stopWiggle();
    var kind = kindAt(e.clientX, e.clientY);
    if (tweens[kind]) cancelAnimationFrame(tweens[kind]);
    tweens[kind] = null;
    drag = {
      kind: kind, id: e.pointerId, startX: e.clientX, startPos: pos[kind],
      lastX: e.clientX, lastT: e.timeStamp, speed: 0, moved: false,
      step: stage.getBoundingClientRect().width * 0.36
    };
    stage.setPointerCapture(e.pointerId);
    stage.classList.add('is-dragging');
  });

  stage.addEventListener('pointermove', function (e) {
    if (!drag || e.pointerId !== drag.id) return;
    var dx = e.clientX - drag.startX;
    if (Math.abs(dx) > 5) drag.moved = true;
    var dt = e.timeStamp - drag.lastT;
    if (dt > 0) drag.speed = (e.clientX - drag.lastX) / dt;
    drag.lastX = e.clientX;
    drag.lastT = e.timeStamp;
    pos[drag.kind] = drag.startPos - dx / drag.step;
    draw(drag.kind);
  });

  function endDrag(e) {
    if (!drag || e.pointerId !== drag.id) return;
    var d = drag;
    drag = null;
    stage.classList.remove('is-dragging');
    if (!d.moved) {
      // Просто нажали на соседа сбоку: крутим к нему.
      var r = stage.getBoundingClientRect();
      var part = (e.clientX - r.left) / r.width;
      if (Math.abs(part - 0.5) > 0.2 && e.type === 'pointerup') {
        spinTo(d.kind, Math.round(pos[d.kind]) + (part > 0.5 ? 1 : -1));
      } else {
        spinTo(d.kind, Math.round(pos[d.kind]));
      }
      return;
    }
    // Резкий бросок докручивает ещё максимум на один предмет.
    var fresh = e.timeStamp - d.lastT < 80 ? d.speed : 0;
    var extra = Math.max(-1, Math.min(1, -fresh * 120 / d.step));
    spinTo(d.kind, Math.round(pos[d.kind] + extra));
  }
  stage.addEventListener('pointerup', endDrag);
  stage.addEventListener('pointercancel', endDrag);

  // Клавиатура: стрелки появляются только при переходе по кнопке Tab.
  root.addEventListener('click', function (e) {
    var arrow = e.target.closest('[data-step]');
    if (!arrow) return;
    stopWiggle();
    var kind = arrow.getAttribute('data-kind');
    spinTo(kind, Math.round(pos[kind]) + Number(arrow.getAttribute('data-step')));
  });

  // Карточка выбранного товара открывается поверх конструктора, без рекомендаций.
  var popup = null;
  var popupFocus = null;

  function closePopup() {
    if (!popup) return;
    popup.remove();
    popup = null;
    document.body.classList.remove('is-locked');
    if (popupFocus) popupFocus.focus();
  }

  function openPopup(p, from) {
    closePopup();
    popupFocus = from;
    popup = document.createElement('div');
    popup.className = 'popup';
    popup.setAttribute('role', 'dialog');
    popup.setAttribute('aria-modal', 'true');
    popup.setAttribute('aria-label', 'Карточка товара');
    popup.innerHTML =
      '<div class="popup__box" tabindex="-1">' +
        '<button class="popup__close" type="button" data-popup-close aria-label="Закрыть"></button>' +
        '<section class="product product--popup"></section>' +
      '</div>';
    document.body.appendChild(popup);
    document.body.classList.add('is-locked');
    var card = popup.querySelector('.product');
    card.classList.toggle('product--one-photo', p.images.length < 2);
    window.LarionShop.fillProduct(card, p);
    popup.addEventListener('click', function (e) {
      // Ссылка «в конструкторе» внутри попапа просто возвращает к набору, он не сбрасывается.
      if (e.target.closest('a[href="constructor.html"]')) {
        e.preventDefault();
        closePopup();
        return;
      }
      if (e.target === popup || e.target.closest('[data-popup-close]')) closePopup();
    });
    // Фокус на окне, а не на крестике: вокруг него не появляется рамка.
    popup.querySelector('.popup__box').focus();
  }

  document.addEventListener('keydown', function (e) {
    // Если поверх открыт просмотр фото, Esc закрывает сначала его.
    if (e.key === 'Escape' && popup && !document.querySelector('.lightbox:not([hidden])')) closePopup();
  }, true); // true: проверяем раньше, чем просмотр фото успеет закрыться

  summary.addEventListener('click', function (e) {
    var link = e.target.closest('a.set__name');
    // Ctrl и средняя кнопка мыши по-прежнему открывают страницу товара в новой вкладке.
    if (!link || e.ctrlKey || e.metaKey || e.shiftKey) return;
    e.preventDefault();
    openPopup(product(link.getAttribute('href').split('id=')[1]), link);
  });

  // Случайная комбинация: каждый ряд делает круг и встаёт на новый предмет.
  // Пункты «без шляпы» и «без коврика» не выпадают, чтобы набор был полным.
  function pickOther(kind) {
    var n = LISTS[kind].length;
    var now = index(kind);
    var options = [];
    LISTS[kind].forEach(function (item, i) { if (item && i !== now) options.push(i); });
    if (!options.length) return now;
    return options[Math.floor(Math.random() * options.length)];
  }

  root.querySelector('[data-random]').addEventListener('click', function () {
    stopWiggle();
    [['hat', 800], ['frog', 1000], ['mat', 1200]].forEach(function (row) {
      var kind = row[0];
      var n = LISTS[kind].length;
      var base = Math.round(pos[kind]);
      var delta = mod(pickOther(kind) - mod(base, n), n);
      spinTo(kind, base + delta + n, row[1]);
    });
  });

  addBtn.addEventListener('click', function () {
    toAdd().forEach(function (item) { cart.add(item.id); });
    addBtn.setAttribute('data-flash', '1');
    addBtn.textContent = 'Добавлено';
    setTimeout(function () {
      addBtn.removeAttribute('data-flash');
      renderButton();
    }, 1100);
  });

  window.addEventListener('larion-cart-change', renderButton);

  buildBand('hat');
  buildBand('frog');
  buildBand('mat');
  draw('mat');
  draw('hat');
  draw('frog');
  narrow.addEventListener('change', function () {
    applyLayout();
    draw('mat');
    draw('hat');
    draw('frog');
  });
  if (!wiggleOff) wiggleTimer = setTimeout(wiggleOnce, WIGGLE_FIRST);
  window.LarionConstructor = { pos: pos, selected: selected, kindAt: kindAt, slots: slots, spinTo: spinTo, stopWiggle: stopWiggle };
})();
