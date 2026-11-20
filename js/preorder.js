// Предзаказ: галерея настоящих фото. Покупатель выбирает позу, мордочку и окрас, пишет пожелания и кладёт заказ в корзину.
// Клик по фото открывает его во весь экран (листать раздел, кнопка «Выбрать»), кружок с галочкой под фото — выбрать сразу.
// Лера лепит жабку по этим трём фото. Данные — data/preorder.js.
(function () {
  var data = window.LARION_PREORDER;
  var root = document.querySelector('[data-preorder]');
  if (!data || !root) return;

  // «Как на фото» — мордочка или окрас как у выбранной позы
  var AS_POSE = { id: 'as-pose', title: 'Как на фото позы' };
  var STEPS = [
    { key: 'pose', title: 'Поза', items: data.poses },
    { key: 'face', title: 'Мордочка', items: [AS_POSE].concat(data.faces) },
    { key: 'color', title: 'Окрас', items: [AS_POSE].concat(data.colors) }
  ];
  // option — свой выбор к позе (цвет клеточек у пледа), null — первый вариант, «как на фото»
  var state = { pose: data.poses[0], face: AS_POSE, color: AS_POSE, gochi: false, option: null, look: false };
  // приписка к окрасу у некоторых поз (например, антистресс: каким окрас будет на ощупь)
  function colorNote() {
    var notes = state.pose.colorNotes || [];
    for (var i = 0; i < notes.length; i++) if (notes[i].colors.indexOf(state.color.id) !== -1) return notes[i].text;
    return '';
  }
  function optionOf() {
    var o = state.pose.option;
    return o ? (state.option || o.items[0]) : null;
  }

  function byId(list, id) { return list.filter(function (x) { return x.id === id; })[0]; }
  function stepOf(key) { return STEPS.filter(function (s) { return s.key === key; })[0]; }
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }

  // Картинка плитки: для «Как на фото» — фото выбранной позы
  function pic(key, item) {
    if (item === AS_POSE) return state.pose.photo;
    return key === 'color' ? item.swatch : item.photo;
  }
  // Что показывать во весь экран
  function big(key, item) {
    if (item === AS_POSE) return state.pose.full || state.pose.photo;
    if (key === 'pose') return item.full || item.photo;
    return key === 'face' ? item.full : item.photo;
  }

  // ---------- Галерея
  // Клик по фото или по названию выбирает. «Подробнее» на фото открывает карточку позы или фото целиком.
  var gallery = root.querySelector('[data-steps]');
  // кнопка «Случайная комбинация» встаёт справа над позами
  var randomHtml = root.querySelector('[data-random-tpl]').innerHTML;
  function tileHtml(key, item, visual, more) {
    return '<div class="pre-opt pre-opt--' + key + (item === AS_POSE ? ' pre-opt--as-pose' : '') + '" data-step="' + key + '" data-id="' + item.id + '">' +
      '<div class="pre-opt__wrap">' +
        '<button class="pre-opt__img" type="button" data-pick aria-label="Выбрать: ' + esc(item.title) + '">' + visual + '</button>' +
        (more === 'zoom' ? '<button class="pre-opt__more pre-opt__more--zoom" type="button" data-open aria-label="Посмотреть крупнее"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6"/><path d="M15 15l5 5"/></svg></button>'
          : more ? '<button class="pre-opt__more" type="button" data-open>' + more + '</button>' : '') +
      '</div>' +
      '<button class="pre-opt__foot" type="button" data-pick aria-pressed="false">' +
        '<span class="pre-opt__check" aria-hidden="true"></span><span class="pre-opt__title">' + esc(item.title) + (item.price ? '<small>' + money(item.price) + '</small>' : item.extra ? '<small>+' + money(item.extra) + '</small>' : '') + '</span>' +
      '</button>' +
    '</div>';
  }
  function stepHtml(key, title, items, extra) {
    return '<section class="pre-step pre-step--' + key + '" id="pre-' + key + '"' + (items ? '' : ' hidden') + '>' +
      '<div class="pre-step__head"><h2 class="pre-step__title"><span></span><b>' + title + '</b></h2>' + (extra || '') + '</div>' +
      '<div class="pre-step__list">' + (items || '') + '</div></section>';
  }
  function build() {
    gallery.innerHTML = STEPS.map(function (step, i) {
      var items = step.items.map(function (item, index) {
        var visiblePose = step.key === 'pose' && (index < 4 || item.id === 'antistress');
        return tileHtml(step.key, item, '<img src="' + pic(step.key, item) + '" alt="" decoding="async"' + (visiblePose ? '' : ' loading="lazy"') + '>', item === AS_POSE ? '' : (step.key === 'pose' ? 'Подробнее' : 'zoom'));
      }).join('');
      // после поз — шаг для своего выбора к позе (экран квакбука, клеточки пледа…), виден только у таких поз
      return stepHtml(step.key, step.title, items, i === 0 ? randomHtml : '') + (i === 0 ? stepHtml('option', '', '') : '');
    }).join('');
  }
  // Шаг «свой выбор к позе»: перерисовывается, когда меняется поза
  var optionPose = null;
  function buildOption() {
    var sec = gallery.querySelector('#pre-option');
    var o = state.pose.option;
    sec.hidden = !o;
    if (optionPose === state.pose) return;
    optionPose = state.pose;
    if (!o) { sec.querySelector('.pre-step__list').innerHTML = ''; return; }
    sec.querySelector('.pre-step__title b').textContent = o.title;
    sec.classList.toggle('pre-step--swatch', !o.items.some(function (it) { return it.image; }));
    sec.querySelector('.pre-step__list').innerHTML = o.items.map(function (it) {
      var visual = it.image ? '<img src="' + it.image + '" alt="" loading="lazy">'
        : it.color ? '<span class="pre-opt__swatch" style="background:' + it.color + '"></span>'
        : '<span class="pre-opt__swatch pre-opt__swatch--icon">' + (it.icon || '') + '</span>';
      return tileHtml('option', it, visual, it.full ? 'zoom' : '');
    }).join('');
  }

  function select(key, id) {
    if (key === 'option') state.option = byId(state.pose.option.items, id);
    else state[key] = byId(stepOf(key).items, id);
    if (key === 'pose') { state.option = null; state.look = false; }
    update();
  }
  function openBig(key, id) {
    if (key === 'option') return openOptionBig(id);
    var items = stepOf(key).items;
    var start = items.indexOf(byId(items, id));
    if (!window.LarionLightbox) return;
    window.LarionLightbox.open(items.map(function (it) { return big(key, it); }), Math.max(0, start), {
      captions: items.map(function (it) { return stepOf(key).title + ': ' + it.title; }),
      noCount: true,
      pick: {
        label: 'Выбрать',
        pickedLabel: 'Выбрано ✓',
        isPicked: function (i) { return state[key] === items[i]; },
        onPick: function (i) { select(key, items[i].id); }
      }
    });
  }
  // Свой выбор к позе во весь экран (например, фото готовых пледов)
  function openOptionBig(id) {
    var o = state.pose.option;
    if (!o || !window.LarionLightbox) return;
    var items = o.items.filter(function (it) { return it.full || it.image; });
    var start = items.indexOf(byId(items, id));
    window.LarionLightbox.open(items.map(function (it) { return it.full || it.image; }), Math.max(0, start), {
      captions: items.map(function (it) { return o.title + ': ' + it.title; }),
      noCount: true,
      pick: {
        label: 'Выбрать',
        pickedLabel: 'Выбрано ✓',
        isPicked: function (i) { return optionOf() === items[i]; },
        onPick: function (i) { select('option', items[i].id); }
      }
    });
  }
  // ---------- Карточка позы: как товар в каталоге (фото, цена, описание), но вместо корзины — «Выбрать»
  var popup = null, popupFrom = null;
  function closeCard() {
    if (!popup) return;
    popup.remove();
    popup = null;
    document.body.classList.remove('is-locked');
    if (popupFrom) popupFrom.focus();
  }
  function openCard(pose, from) {
    closeCard();
    popupFrom = from;
    var images = [pose.full || pose.photo].concat(pose.more || []);
    popup = document.createElement('div');
    popup.className = 'popup';
    popup.setAttribute('role', 'dialog');
    popup.setAttribute('aria-modal', 'true');
    popup.setAttribute('aria-label', 'Поза: ' + pose.title);
    popup.innerHTML = '<div class="popup__box" tabindex="-1">' +
      '<button class="popup__close" type="button" data-popup-close aria-label="Закрыть"></button>' +
      '<section class="product product--popup"></section></div>';
    document.body.appendChild(popup);
    document.body.classList.add('is-locked');
    var card = popup.querySelector('.product');
    card.classList.toggle('product--one-photo', images.length < 2);
    window.LarionShop.fillProduct(card, { id: 'pose-' + pose.id, title: pose.title, price: pose.price, stock: null, category: 'zhabi', text: pose.text || '', images: images });
    // кнопку «в корзину» меняем на выбор позы
    var picked = state.pose === pose;
    card.querySelector('[data-add]').outerHTML =
      '<button class="btn" type="button" data-pose-pick>' + (picked ? 'Поза выбрана ✓' : 'Выбрать эту позу') + '</button>' +
      '<p class="pre-card__note">' + (pose.noGochi ? 'Жабагочи в этой позе не делается.' : 'Можно сделать жабагочи — с дырочкой под шляпку, +' + data.gochiExtra + ' ₽.') +
      ' Мордочку и окрас выберете дальше.</p>';
    popup.addEventListener('click', function (e) {
      if (e.target.closest('[data-pose-pick]')) {
        select('pose', pose.id);
        closeCard();
        return;
      }
      if (e.target === popup || e.target.closest('[data-popup-close]')) closeCard();
    });
    popup.querySelector('.popup__box').focus();
  }
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && popup && !document.querySelector('.lightbox:not([hidden])')) closeCard();
  }, true);

  gallery.addEventListener('click', function (e) {
    var opt = e.target.closest('.pre-opt');
    if (!opt) return;
    var key = opt.getAttribute('data-step'), id = opt.getAttribute('data-id');
    var open = e.target.closest('[data-open]');
    if (open && key === 'pose') openCard(byId(data.poses, id), open);
    else if (open) openBig(key, id);
    else if (e.target.closest('[data-pick]')) select(key, id);
  });

  // ---------- Жабагочи, пожелания, случайный выбор
  var gochiSwitch = root.querySelector('[data-gochi]');
  gochiSwitch.addEventListener('change', function () { state.gochi = gochiSwitch.checked; update(); });
  var comment = root.querySelector('[data-comment]');
  function pick(list) { return list[Math.floor(Math.random() * list.length)]; }
  gallery.addEventListener('click', function (e) {
    if (!e.target.closest('[data-random]')) return;
    state.pose = pick(data.poses);
    state.face = pick(data.faces);
    state.color = pick(data.colors);
    state.option = null;
    state.look = false;
    update();
  });

  // ---------- Итог и корзина
  var picks = root.querySelector('[data-picks]');
  var bar = root.querySelector('[data-bar]');
  var order = root.querySelector('#pre-order');
  var barPicks = root.querySelector('[data-bar-picks]');
  function updateOrderShortcut() {
    bar.hidden = order.getBoundingClientRect().top < window.innerHeight - 64;
  }
  window.addEventListener('scroll', updateOrderShortcut, { passive: true });
  window.addEventListener('resize', updateOrderShortcut);
  window.addEventListener('hashchange', updateOrderShortcut);
  bar.addEventListener('click', function (e) {
    e.preventDefault();
    history.replaceState(null, '', bar.hash);
    order.scrollIntoView({ block: 'start', behavior: 'instant' });
    updateOrderShortcut();
  });
  var totalEl = root.querySelector('[data-total]');
  var barTotal = root.querySelector('[data-bar-total]');
  var addBtn = root.querySelector('[data-add-pre]');
  function money(n) { return window.LarionCart ? window.LarionCart.money(n) : n + ' ₽'; }
  // цена: поза + жабагочи + доплата за выбор (экран квакбука с картинкой, extra в data/preorder.js)
  function price() { var o = optionOf(); return state.pose.price + (state.gochi ? data.gochiExtra : 0) + (o && o.extra ? o.extra : 0); }
  function chosen() {
    var rows = [{ key: 'pose', label: 'Поза', title: state.pose.title, img: state.pose.photo }];
    var o = state.pose.option, cur = optionOf();
    if (o) rows.push({ key: 'option', label: o.title, title: cur.title, img: cur.image, color: cur.color, icon: cur.icon });
    rows.push(
      { key: 'face', label: 'Мордочка', title: state.face === AS_POSE ? 'как на фото позы' : state.face.title, img: pic('face', state.face) },
      { key: 'color', label: 'Окрас', title: state.color === AS_POSE ? 'как на фото позы' : state.color.title, img: pic('color', state.color) }
    );
    return rows;
  }
  // маленькая картинка выбора: фото, цвет или значок
  function thumb(c) {
    if (c.img) return '<img src="' + c.img + '" alt="">';
    return '<i class="pre-pick__sw" style="' + (c.color ? 'background:' + c.color : '') + '">' + (c.icon || '') + '</i>';
  }
  // «Как на фото позы» в мордочке: показываем лицо жабки этой позы крупно (face: [x, y, увеличение] в data/preorder.js)
  function faceFocus(img) {
    var f = state.pose.face;
    if (!f) { img.removeAttribute('style'); return; }
    var s = f[2], fx = f[0] / 100, fy = f[1] / 100;
    img.style.cssText = 'position:absolute;max-width:none;height:auto;object-fit:fill;transform:none;' +
      'width:' + (s * 100) + '%;left:' + ((0.5 - fx * s) * 100) + '%;top:' + ((0.375 - fy * s * 4 / 3) / 0.75 * 100) + '%';
  }
  var gochiLabel = gochiSwitch.closest('.switch');
  // «Взгляд в экран» — только у позы за квакбуком (lookSwitch в data/preorder.js)
  var lookBox = root.querySelector('[data-look-box]');
  var lookSwitch = root.querySelector('[data-look]');
  lookSwitch.addEventListener('change', function () { state.look = lookSwitch.checked; update(); });
  function update() {
    // жабагочи бывает не у всех поз
    if (state.pose.noGochi) state.gochi = false;
    gochiSwitch.disabled = !!state.pose.noGochi;
    gochiLabel.classList.toggle('is-disabled', !!state.pose.noGochi);
    gochiLabel.querySelector('small').textContent = state.pose.noGochi ? 'для этой позы не делается' : 'с дырочкой под шляпку, +' + data.gochiExtra + ' ₽';
    var ls = state.pose.lookSwitch;
    lookBox.hidden = !ls;
    if (ls) {
      lookBox.querySelector('[data-look-title]').textContent = ls.title;
      lookBox.querySelector('small').textContent = ls.note || '';
    }
    lookSwitch.checked = !!state.look;
    buildOption();
    // номера шагов: 1 Поза, (2 Экран), 2/3 Мордочка…
    var n = 0;
    [].forEach.call(gallery.querySelectorAll('.pre-step'), function (sec) {
      if (!sec.hidden) sec.querySelector('.pre-step__title span').textContent = ++n;
    });
    // отметки в галерее
    var cur = optionOf();
    [].forEach.call(gallery.querySelectorAll('.pre-opt'), function (opt) {
      var key = opt.getAttribute('data-step');
      var sel = key === 'option' ? cur : state[key];
      var on = !!sel && sel.id === opt.getAttribute('data-id');
      opt.classList.toggle('is-active', on);
      opt.querySelector('.pre-opt__foot').setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    [].forEach.call(gallery.querySelectorAll('.pre-opt--as-pose img'), function (img) {
      img.src = state.pose.photo;
      if (img.closest('.pre-opt--face')) faceFocus(img);
    });
    var ch = chosen();
    // «Ваша жабка»: выбранное с подписями; клик ведёт к разделу
    picks.innerHTML = ch.map(function (c) {
      return '<a class="pre-pick" href="#pre-' + c.key + '">' + thumb(c) + '<span><small>' + esc(c.label) + '</small>' + esc(c.title) + '</span></a>';
    }).join('') + (colorNote() ? '<p class="pre-note">' + esc(colorNote()) + '</p>' : '');
    barPicks.innerHTML = ch.map(thumb).join('');
    gochiSwitch.checked = state.gochi;
    totalEl.textContent = barTotal.textContent = money(price());
    updateOrderShortcut();
  }

  function hash(s) { var h = 0; for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return h.toString(36); }
  addBtn.addEventListener('click', function () {
    var wish = comment.value.trim();
    // название в корзине: заголовок и по строке на каждый выбор (переносы — \n, корзина показывает их строками)
    var rows = chosen().filter(function (c) { return c.key !== 'pose'; }).map(function (c) { return c.label + ': ' + c.title.toLowerCase(); });
    var opt = optionOf();
    if (state.look && state.pose.lookSwitch) rows.push(state.pose.lookSwitch.title);
    if (state.gochi) rows.push('Жабагочи (с дырочкой под шляпку)');
    if (wish) rows.push('Пожелания: ' + wish);
    var title = 'Предзаказ жабки «' + state.pose.title + '»\n' + rows.join('\n');
    var id = ['pre', state.pose.id + (opt ? '-' + opt.id : '') + (state.look ? '-look' : ''), state.face.id, state.color.id, state.gochi ? 'gochi' : 'plain', wish ? hash(wish) : ''].join(':');
    // parts — фото всех составляющих для кабинета мастера: Лера лепит жабку по этим фото
    var parts = chosen().map(function (c) {
      var item = c.key === 'pose' ? state.pose : c.key === 'face' ? state.face : c.key === 'color' ? state.color : null;
      return { label: c.label, title: c.title, img: item ? big(c.key, item) : (c.img || '') };
    });
    window.LarionCart.add(id, 1, { title: title, price: price(), image: state.pose.photo, parts: parts });
    addBtn.textContent = 'Добавлено';
    setTimeout(function () { addBtn.textContent = 'Добавить в корзину'; }, 1200);
  });

  build();
  update();

  // ---------- Внизу: «Не забудьте добавить в заказ» — коврики и шляпы из каталога
  var rec = document.querySelector('[data-pre-rec]');
  if (rec && window.LarionShop && window.LarionShop.carousel) {
    var shop = window.LarionShop;
    var mats = shop.shuffle(shop.available.filter(function (p) { return p.category === 'kovriki'; }));
    var hats = shop.shuffle(shop.available.filter(function (p) { return p.category === 'shlyapi'; }));
    if (mats.length + hats.length) shop.carousel(rec, shop.shuffle(mats.concat(hats))); // шляпы и коврики вперемешку
  }
})();
