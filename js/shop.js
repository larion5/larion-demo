// Витрина: карточки товаров, страница каталога и страница товара.
(function () {
  var data = window.LARION_DATA;
  var money = window.LarionCart.money;
  var PER_PAGE = 24;

  // Старая цена показывается слева от текущей, если заполнена.
  function priceHtml(p) {
    if (p.giftcard) return '<span class="price price--any">любая сумма</span>';
    return (p.oldPrice ? '<s class="price-old">' + money(p.oldPrice) + '</s>' : '') +
      '<span class="price">' + money(p.price) + '</span>';
  }

  function shuffle(list) {
    var a = list.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  function cardHtml(p) {
    var url = 'product.html?id=' + p.id;
    return '<article class="card">' +
      '<a class="card__img" href="' + url + '" aria-label="' + p.title + '"><img src="' + p.images[0] + '" alt="' + p.title + '" loading="lazy"></a>' +
      '<div class="card__body">' +
        '<div class="card__head"><a class="card__title" href="' + url + '">' + p.title + '</a><span class="price-box">' + priceHtml(p) + '</span></div>' +
        '<p class="card__descr">' + p.descr + '</p>' +
        (p.stock === 0
          ? '<button class="btn" type="button" disabled>Нет в наличии</button>'
          : p.giftcard
            ? '<a class="btn" href="' + url + '">Выбрать сумму</a>'
          : p.bundle
            ? '<a class="btn" href="' + url + '">Собрать набор</a>'
          : p.options
            ? '<a class="btn" href="' + url + '">Выбрать</a>'
            : '<button class="btn" type="button" data-add="' + p.id + '">В корзину</button>') +
      '</div>' +
    '</article>';
  }
  // На витрине и в рекомендациях только товары в наличии. Страница проданного товара
  // по прямой ссылке продолжает открываться с надписью «Нет в наличии».
  var available = data.products.filter(function (p) { return p.stock !== 0; });
  function inCategory(slug) { return available.filter(function (p) { return p.category === slug; }); }

  // Делит описание товара: основной текст, характеристики для раскрывающегося блока
  // и текст после них. Характеристика — строка, начинающаяся с одного из слов ниже.
  var SPEC_LINE = /^(Материал|Размер|Диаметр|Вес|Формат|Пиала\s*\d|Товар\s*14)/;
  var INVITE_LINE = /^Смотри, что ещё есть/;

  function splitDescription(html) {
    var parts = { before: [], after: [] };
    var specs = [];
    html.split(/<br\s*\/?>/).forEach(function (raw) {
      var line = raw.replace(/<\/?span[^>]*>/g, '').trim();
      var plain = line.replace(/<[^>]+>/g, '').replace(/&nbsp;| /g, ' ').trim();
      if (INVITE_LINE.test(plain)) return;
      if (SPEC_LINE.test(plain)) { specs.push(line); return; }
      (specs.length ? parts.after : parts.before).push(line);
    });
    function paragraphs(lines) {
      return lines.join('\n').split(/\n\s*\n/).map(function (block) {
        return block.trim().replace(/\n/g, '<br>');
      }).filter(Boolean).map(function (block) { return '<p>' + block + '</p>'; }).join('');
    }
    return { before: paragraphs(parts.before), specs: specs, after: paragraphs(parts.after) };
  }

  // Блоки <div data-products="zhabi" data-limit="3"> на любой странице.
  // Можно несколько разделов через пробел; с data-random товары перемешиваются при каждом заходе.
  document.querySelectorAll('[data-products]').forEach(function (el) {
    var list = [];
    el.getAttribute('data-products').split(/\s+/).forEach(function (slug) { if (slug) list = list.concat(inCategory(slug)); });
    if (el.hasAttribute('data-random')) list = shuffle(list);
    var limit = Number(el.getAttribute('data-limit')) || list.length;
    el.innerHTML = list.slice(0, limit).map(cardHtml).join('');
  });
  window.LarionCart.refresh();

  /* Страница каталога
     ------------------------------------------------------------------------ */
  var catalog = document.querySelector('[data-catalog]');
  if (catalog) {
    var params = new URLSearchParams(location.search);
    var state = { cat: params.get('cat') || '', q: '', sort: 'default', shown: PER_PAGE };

    var cats = document.querySelector('[data-cats]');
    var crumbs = document.querySelector('[data-crumbs]');
    var search = document.querySelector('[data-search]');
    var sort = document.querySelector('[data-sort]');
    var more = document.querySelector('[data-load-more]');
    var searchEmpty = document.querySelector('[data-search-empty]');
    var stockEmpty = document.querySelector('[data-stock-empty]');

    // Разделы с нарисованными иконками, как в подменю «каталог». Первым — «Все»: четыре иконки квадратиком.
    var allIcons = data.categories.slice(0, 4).map(function (c) { return '<img src="' + (c.menuIcon || c.image) + '" alt="">'; }).join('');
    cats.innerHTML = '<a href="catalog.html" data-cat=""><span class="cats__all">' + allIcons + '</span>Все</a>' +
      data.categories.map(function (c) {
        return '<a href="catalog.html?cat=' + c.slug + '" data-cat="' + c.slug + '"><img src="' + (c.menuIcon || c.image) + '" alt="">' + c.title + '</a>';
      }).join('');

    var SORTERS = {
      default: function (list) { return list; },
      'price-asc': function (list) { return list.slice().sort(function (a, b) { return a.price - b.price; }); },
      'price-desc': function (list) { return list.slice().sort(function (a, b) { return b.price - a.price; }); },
      'name-asc': function (list) { return list.slice().sort(function (a, b) { return a.title.localeCompare(b.title, 'ru'); }); },
      'name-desc': function (list) { return list.slice().sort(function (a, b) { return b.title.localeCompare(a.title, 'ru'); }); },
      newest: function (list) { return list; },
      oldest: function (list) { return list.slice().reverse(); }
    };

    var draw = function () {
      var category = data.categories.filter(function (c) { return c.slug === state.cat; })[0];
      if (!category) state.cat = '';

      cats.querySelectorAll('a').forEach(function (a) {
        a.classList.toggle('is-active', a.getAttribute('data-cat') === state.cat);
      });
      crumbs.innerHTML = '<a href="index.html">Главная</a><span aria-hidden="true">›</span>' +
        (category
          ? '<a href="catalog.html">Наличие</a><span aria-hidden="true">›</span><span aria-current="page">' + category.title + '</span>'
          : '<span aria-current="page">Наличие</span>');
      document.title = category ? category.title + ' | Larion' : 'Каталог | Larion';
      // описание раздела слева над карточками (descr у категории в data/catalog.js)
      var catDescr = document.querySelector('[data-cat-descr]');
      if (catDescr) {
        catDescr.textContent = category && category.descr ? category.descr : '';
        catDescr.hidden = !catDescr.textContent;
      }

      // поиск идёт по всему каталогу, а не только по открытому разделу
      var q = state.q.replace(/ /g, ' ').trim().toLowerCase().replace(/ё/g, 'е');
      var list = state.cat && !q ? inCategory(state.cat) : available;
      if (q) list = list.filter(function (p) {
        var cat = data.categories.filter(function (c) { return c.slug === p.category; })[0];
        var hay = (p.title + ' ' + (p.descr || '') + ' ' + (cat ? cat.title : '')).replace(/ /g, ' ').toLowerCase().replace(/ё/g, 'е');
        return hay.indexOf(q) !== -1;
      });
      list = SORTERS[state.sort](list);

      catalog.innerHTML = list.slice(0, state.shown).map(cardHtml).join('');
      searchEmpty.hidden = !q || list.length > 0;
      stockEmpty.hidden = !!q || list.length > 0;
      more.hidden = list.length <= state.shown;
      window.LarionCart.refresh();
    };

    cats.addEventListener('click', function (e) {
      var a = e.target.closest('a');
      if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      e.preventDefault();
      var nextCategory = a.getAttribute('data-cat');
      if (nextCategory === state.cat) return;
      state.cat = nextCategory;
      state.shown = PER_PAGE;
      history.pushState(null, '', a.getAttribute('href'));
      draw();
      window.scrollTo({ top: 0, behavior: 'instant' });
    });
    window.addEventListener('popstate', function (e) {
      state.cat = new URLSearchParams(location.search).get('cat') || '';
      state.shown = (e.state && e.state.shown) || PER_PAGE;
      draw();
    });
    search.addEventListener('input', function () { state.q = search.value; state.shown = PER_PAGE; draw(); });
    sort.addEventListener('change', function () { state.sort = sort.value; state.shown = PER_PAGE; draw(); });
    // Запоминаем, сколько товаров открыто, чтобы при возврате из карточки список был тот же.
    var loadMore = function () {
      state.shown += PER_PAGE;
      history.replaceState({ shown: state.shown }, '');
      draw();
    };
    more.addEventListener('click', loadMore);
    // Кнопки не видно: следующие товары подгружаются сами, когда человек долистал почти до конца списка.
    // Кнопка остаётся запасной для браузеров без IntersectionObserver.
    if (window.IntersectionObserver) {
      more.classList.add('is-auto');
      var nearEnd = function () { return !more.hidden && more.getBoundingClientRect().top < window.innerHeight + 600; };
      new IntersectionObserver(function (entries) {
        if (!entries[0].isIntersecting) return;
        // если и после подгрузки конец списка всё ещё близко, догружаем ещё
        (function step() { if (nearEnd()) { loadMore(); requestAnimationFrame(step); } })();
      }, { rootMargin: '0px 0px 600px 0px' }).observe(more);
    }
    if (history.state && history.state.shown) state.shown = history.state.shown;
    draw();
  }

  /* Страница товара
     ------------------------------------------------------------------------ */
  // Карточка товара: галерея, цена, наличие, описание и характеристики.
  // Одна и та же для страницы товара и для попапа в конструкторе.
  function isVideo(src) { return /\.(mp4|webm)(\?|#|$)/i.test(src); }
  // ---------- Набор (подарочный набор): покупатель выбирает жабагочи, три цветочка (можно одинаковые) и шляпу до N ₽,
  // коврик входит сам. В корзину кладётся «свой» товар set:<набор>:<жабка>:<шляпа[.вариант]>:<цветочки через запятую>,
  // сервер (api/order.php) проверяет состав, наличие и цену и списывает остатки каждой составляющей.
  function kitHtml(p) {
    var B = window.LarionBundle, b = p.bundle;
    var tile = function (attr, img, title, sub) {
      return '<button type="button" class="kit__tile" ' + attr + '><img src="' + img + '" alt="" loading="lazy"><span>' + title + '</span>' + (sub ? '<small>' + sub + '</small>' : '') + '</button>';
    };
    var fl = B.flower(b), mat = B.mat(b);
    return '<div class="kit" data-kit>' +
      '<div class="kit__step"><div class="kit__head">1. Жабагочи</div><div class="kit__list">' +
        B.frogs(b).map(function (x) { return tile('data-kit-frog="' + x.id + '"', x.images[0], x.title.replace(/^Жабагочи\s*/i, '')); }).join('') + '</div></div>' +
      '<div class="kit__step"><div class="kit__head">2. Три цветочка <b data-kit-label="flowers">0 из ' + b.flowers.count + '</b></div>' +
        '<p class="kit__hint">Нажимайте на цветочек, можно выбрать одинаковые. Нажатие на выбранный внизу — убрать.</p>' +
        '<div class="kit__list kit__list--round">' + fl.options.map(function (o) { return tile('data-kit-flower="' + o.id + '"', o.image, o.title); }).join('') + '</div>' +
        '<div class="kit__chosen" data-kit-chosen></div></div>' +
      '<div class="kit__step"><div class="kit__head">3. Шляпа до ' + b.hatMaxPrice + ' ₽</div><div class="kit__list">' +
        B.hats(b).map(function (x) { return tile('data-kit-hat="' + x.id + '"', x.images[0], x.title.replace(/^Шляпа\s*/i, '')); }).join('') + '</div>' +
        '<div class="kit__sub" data-kit-hatopts hidden></div></div>' +
      '<div class="kit__step"><div class="kit__head">4. ' + mat.title + ' <b>входит в набор</b></div>' +
        '<div class="kit__list"><span class="kit__tile is-active is-fixed"><img src="' + mat.images[0] + '" alt=""><span>' + mat.title.replace(/^Коврик\s*/i, '') + '</span></span></div></div>' +
      '<p class="kit__missing" data-kit-missing></p>' +
      '<button class="btn is-wait" type="button" data-kit-add>Добавить набор в корзину</button>' +
    '</div>';
  }
  function kitBind(el, p) {
    var B = window.LarionBundle, b = p.bundle, fl = B.flower(b);
    var st = { frog: null, hat: null, hatOpt: null, flowers: [] };
    var byId = function (id) { return data.products.filter(function (x) { return x.id === id; })[0]; };
    var plain = function (html) { var t = document.createElement('textarea'); t.innerHTML = html; return t.value; };
    var flowerOf = function (id) { return fl.options.filter(function (o) { return o.id === id; })[0]; };
    var draw = function () {
      el.querySelectorAll('[data-kit-frog]').forEach(function (t) { t.classList.toggle('is-active', t.getAttribute('data-kit-frog') === st.frog); });
      el.querySelectorAll('[data-kit-hat]').forEach(function (t) { t.classList.toggle('is-active', t.getAttribute('data-kit-hat') === st.hat); });
      el.querySelectorAll('[data-kit-flower]').forEach(function (t) {
        var n = st.flowers.filter(function (f) { return f === t.getAttribute('data-kit-flower'); }).length;
        t.classList.toggle('is-active', n > 0);
        t.setAttribute('data-count', n > 1 ? '×' + n : '');
        var have = optStock(fl, flowerOf(t.getAttribute('data-kit-flower')));
        t.classList.toggle('is-out', have === 0);
      });
      el.querySelector('[data-kit-chosen]').innerHTML = st.flowers.map(function (f, i) {
        var o = flowerOf(f);
        return '<button type="button" class="kit__chip" data-kit-unflower="' + i + '" title="Убрать"><img src="' + o.image + '" alt="">' + o.title + ' ✕</button>';
      }).join('');
      var frog = st.frog && byId(st.frog), hat = st.hat && byId(st.hat);
      el.querySelector('[data-kit-label="flowers"]').textContent = st.flowers.length + ' из ' + b.flowers.count;
      var box = el.querySelector('[data-kit-hatopts]');
      box.hidden = !(hat && hat.options);
      if (hat && hat.options) box.innerHTML = '<div class="kit__hint">' + (hat.optionTitle || 'Вариант') + ':</div><div class="kit__list kit__list--round">' +
        hat.options.map(function (o) { var out = optStock(hat, o) === 0; return '<button type="button" class="kit__tile' + (o.id === st.hatOpt ? ' is-active' : '') + (out ? ' is-out' : '') + '" data-kit-hatopt="' + o.id + '"' + (out ? ' data-out' : '') + '><img src="' + o.image + '" alt=""><span>' + o.title + '</span></button>'; }).join('') + '</div>';
      var miss = [];
      if (!frog) miss.push('жабагочи');
      if (st.flowers.length < b.flowers.count) miss.push('ещё ' + (b.flowers.count - st.flowers.length === 1 ? '1 цветочек' : (b.flowers.count - st.flowers.length) + ' цветочка'));
      if (!hat) miss.push('шляпу');
      else if (hat.options && !st.hatOpt) miss.push((hat.optionTitle || 'вариант').toLowerCase() + ' шляпы');
      el.querySelector('[data-kit-missing]').textContent = miss.length ? 'Осталось выбрать: ' + miss.join(', ') : '';
      el.querySelector('[data-kit-add]').classList.toggle('is-wait', miss.length > 0);
    };
    el.addEventListener('click', function (e) {
      var t;
      if ((t = e.target.closest('[data-kit-frog]'))) st.frog = t.getAttribute('data-kit-frog');
      else if ((t = e.target.closest('[data-kit-hat]'))) { if (st.hat !== t.getAttribute('data-kit-hat')) st.hatOpt = null; st.hat = t.getAttribute('data-kit-hat'); }
      else if ((t = e.target.closest('[data-kit-hatopt]'))) { if (t.hasAttribute('data-out')) return window.LarionSay('Этого варианта шляпы сейчас нет в наличии'); st.hatOpt = t.getAttribute('data-kit-hatopt'); }
      else if ((t = e.target.closest('[data-kit-flower]'))) {
        // уже три — самый первый заменяется; одинаковых не больше, чем этого цветочка есть (вместе со шляпой-цветочком)
        var fid = t.getAttribute('data-kit-flower'), have = optStock(fl, flowerOf(fid));
        var used = st.flowers.filter(function (x) { return x === fid; }).length + (st.hat === fl.id && st.hatOpt === fid ? 1 : 0);
        if (have === 0) return window.LarionSay('«' + flowerOf(fid).title + '» сейчас нет в наличии');
        if (have !== null && used >= have) return window.LarionSay('Больше нет: «' + flowerOf(fid).title + '» в наличии всего ' + have + ' шт');
        if (st.flowers.length >= b.flowers.count) st.flowers.shift();
        st.flowers.push(fid);
      }
      else if ((t = e.target.closest('[data-kit-unflower]'))) st.flowers.splice(+t.getAttribute('data-kit-unflower'), 1);
      else if ((t = e.target.closest('[data-kit-add]'))) {
        if (t.classList.contains('is-wait')) return window.LarionSay(el.querySelector('[data-kit-missing]').textContent);
        var frog = byId(st.frog), hat = byId(st.hat), mat = B.mat(b);
        var hatOpt = st.hatOpt ? hat.options.filter(function (o) { return o.id === st.hatOpt; })[0] : null;
        var names = st.flowers.map(function (f) { return flowerOf(f).title.toLowerCase(); });
        var id = 'set:' + p.id + ':' + frog.id + ':' + hat.id + (hatOpt ? '.' + hatOpt.id : '') + ':' + st.flowers.join(',');
        window.LarionCart.add(id, 1, {
          title: plain(p.title) + '\n' + plain(frog.title) + '\nЦветочки: ' + names.join(', ') + '\n' + plain(hat.title) + (hatOpt ? ' — ' + hatOpt.title.toLowerCase() : '') + '\n' + plain(mat.title),
          price: p.price, image: frog.images[0], category: frog.category, max: 1,
          parts: [{ label: 'Жабагочи', title: plain(frog.title), img: frog.images[0] }]
            .concat(st.flowers.map(function (f) { var o = flowerOf(f); return { label: 'Цветочек', title: o.title, img: o.image }; }))
            .concat([{ label: 'Шляпа', title: plain(hat.title) + (hatOpt ? ' — ' + hatOpt.title.toLowerCase() : ''), img: hatOpt ? hatOpt.image : hat.images[0] },
              { label: 'Коврик', title: plain(mat.title), img: mat.images[0] }])
        });
        t.textContent = 'Набор в корзине!';
        setTimeout(function () { t.textContent = 'Добавить набор в корзину'; }, 1500);
        return;
      } else return;
      draw();
    });
    draw();
  }

  // ---------- Подарочный сертификат: сумму пишет покупатель (от min, шаг step), кнопки-подсказки с частыми суммами.
  // В корзину — «свой» товар gift:<сумма>:<случайное>, каждый сертификат отдельной строкой.
  function giftHtml(p, description) {
    var g = p.giftcard;
    var ruble = '<span class="currency-symbol">₽</span>';
    return '<div class="gift" data-gift>' +
      '<div class="gift__presets">' + g.presets.map(function (v) { return '<button type="button" class="gift__preset" data-gift-sum="' + v + '">' + money(v).replace('₽', ruble) + '</button>'; }).join('') + '</div>' +
      '<label class="gift__field"><span>Своя сумма, ' + ruble + '</span><input type="number" inputmode="numeric" min="' + g.min + '" max="' + g.max + '" step="' + g.step + '" placeholder="от ' + g.min + '" data-gift-input></label>' +
      '<p class="gift__hint">От ' + money(g.min).replace('₽', ruble) + ', шаг ' + money(g.step).replace('₽', ruble) + '. Картинка с номером придёт на почту после оплаты.</p>' +
      description +
      '<button class="btn" type="button" data-gift-add>Добавить в корзину</button>' +
    '</div>';
  }
  function giftBind(el, p) {
    var g = p.giftcard, input = el.querySelector('[data-gift-input]');
    var draw = function () {
      el.querySelectorAll('[data-gift-sum]').forEach(function (b) { b.classList.toggle('is-active', +b.getAttribute('data-gift-sum') === +input.value); });
    };
    el.addEventListener('click', function (e) {
      var b = e.target.closest('[data-gift-sum]');
      if (b) { input.value = b.getAttribute('data-gift-sum'); draw(); return; }
      var add = e.target.closest('[data-gift-add]');
      if (!add) return;
      var sum = Math.round(Number(input.value));
      // если сумма не подходит — объясняем почему (просьба Леры)
      if (!sum) { input.focus(); return window.LarionSay('Напишите сумму сертификата или выберите готовую'); }
      if (sum < g.min) return window.LarionSay('Сертификат — от ' + money(g.min));
      if (sum > g.max) return window.LarionSay('Сертификат — до ' + money(g.max) + '. Нужно больше — напишите мне');
      if (sum % g.step) return window.LarionSay('Сумма должна делиться на ' + g.step + ', например ' + money(Math.round(sum / g.step) * g.step));
      var id = 'gift:' + sum + ':' + Date.now().toString(36);
      window.LarionCart.add(id, 1, { title: 'Подарочный сертификат на ' + money(sum), price: sum, image: p.images[0], category: 'gift', max: 1 });
      add.textContent = 'Сертификат в корзине!';
      setTimeout(function () { add.textContent = 'Добавить в корзину'; }, 1500);
    });
    input.addEventListener('input', draw);
  }

  // Остаток варианта (цветочек, цвет): у варианта своё поле stock, если Лера его задала; иначе — общий остаток товара
  function optStock(p, o) { return o && o.stock != null ? o.stock : p.stock; }
  function firstOpt(p) { for (var i = 0; i < p.options.length; i++) if (optStock(p, p.options[i]) !== 0) return i; return 0; }
  function fillProduct(el, p) {
    var current = 0;
    var many = p.images.length > 1;
    var content = splitDescription(p.text);
    // В этих категориях на фото одна фигурка, поэтому показываем крупный квадрат.
    // У остальных (руки, упаковка, открытки) фото остаётся вертикальным и целым.
    var SQUARE_PHOTO = ['zhabi', 'zhabagochi', 'shlyapi', 'kovriki'];
    el.classList.toggle('product--square', SQUARE_PHOTO.indexOf(p.category) !== -1);
    el.innerHTML =
      '<div class="product__thumbs">' + (many ? p.images.map(function (src, i) {
        return isVideo(src)
          ? '<button class="is-video" type="button" data-thumb="' + i + '" aria-label="Видео"><img src="' + src.replace(/\.mp4$/i, '-poster.webp') + '" alt="" loading="lazy"></button>'
          : '<button type="button" data-thumb="' + i + '" aria-label="Фото ' + (i + 1) + '"><img src="' + src + '" alt=""></button>';
      }).join('') : '') + '</div>' +
      '<div class="product__main">' +
        '<img data-main src="' + (isVideo(p.images[0]) ? '' : p.images[0]) + '" alt="' + p.title + '">' +
        '<video data-main-video controls muted loop playsinline preload="none" hidden></video>' +
        (many ? '<button class="arrow arrow--prev product__arrow" type="button" data-step="-1" aria-label="Предыдущее фото"></button><button class="arrow product__arrow product__arrow--next" type="button" data-step="1" aria-label="Следующее фото"></button>' : '') +
      '</div>' +
      '<div class="product__info">' +
        '<h1>' + p.title + '</h1>' +
        '<div class="price-box">' + priceHtml(p) + '</div>' +
        (p.stock > 0 ? '<div class="stock">В наличии ' + p.stock + ' шт</div>' : '') +
        (p.stock === 0
          // проданный товар по прямой ссылке: жабку — заказать похожую через предзаказ, остальное — «скоро сделаю ещё»
          ? (/^(zhabi|zhabagochi|)$/.test(p.category || '')
            ? '<div class="sold"><p class="sold__title">Эту жабку уже забрали домой 🐸</p><p>Каждая жабка единственная, но я могу слепить похожую — выберите позу, мордочку и окрас.</p><a class="btn" href="preorder.html">Заказать похожую</a></div>'
            : '<div class="sold"><p class="sold__title">Всё разобрали 🐸</p><p>Скоро сделаю ещё — загляните позже или посмотрите, что есть сейчас.</p><a class="btn" href="catalog.html">Смотреть каталог</a></div>')
          : p.giftcard
            ? giftHtml(p, content.before ? '<div class="product__text">' + content.before.replace(/₽/g, '<span class="currency-symbol">₽</span>') + '</div>' : '')
          : p.bundle
            ? (content.before ? '<div class="product__text">' + content.before + '</div>' : '') + kitHtml(p)
          : p.options
            // товар с выбором (цвет сердечка, какой цветочек): кружки с картинками, в корзину — выбранный вариант
            ? '<div class="opt-pick"><div class="opt-pick__head">' + (p.optionTitle || 'Вариант') + ': <b data-opt-name>' + p.options[firstOpt(p)].title + '</b></div>' +
                '<div class="opt-pick__list">' + p.options.map(function (o, i) {
                  var out = optStock(p, o) === 0;
                  return '<button class="opt-pick__item' + (i === firstOpt(p) ? ' is-active' : '') + (out ? ' is-out' : '') + '" type="button" data-opt="' + i + '" title="' + o.title + (out ? ' — нет в наличии' : '') + '" aria-label="' + o.title + '"' + (out ? ' data-out' : '') + '><img src="' + o.image + '" alt=""></button>';
                }).join('') + '</div></div>' +
              '<button class="btn" type="button" data-add-opt>Добавить в корзину</button>'
            : '<button class="btn" type="button" data-add="' + p.id + '">Добавить в корзину</button>') +
        (content.before && (p.stock === 0 || (!p.giftcard && !p.bundle)) ? '<div class="product__text">' + content.before + '</div>' : '') +
        (content.specs.length
          ? '<details class="specs"><summary>Характеристики</summary><ul>' + content.specs.map(function (s) { return '<li>' + s + '</li>'; }).join('') + '</ul></details>'
          : '') +
        (content.after ? '<div class="product__text">' + content.after + '</div>' : '') +
      '</div>';

    var main = el.querySelector('[data-main]');
    var video = el.querySelector('[data-main-video]');
    // выбор варианта: если у варианта есть своё фото среди фото товара — показываем его
    var optIndex = p.options ? firstOpt(p) : 0;
    if (p.bundle && p.stock !== 0) kitBind(el, p);
    if (p.giftcard) giftBind(el, p);
    // «В наличии N шт» — у выбранного варианта свой остаток
    var drawOptStock = function () {
      var box = el.querySelector('.stock'), n = optStock(p, p.options[optIndex]);
      if (box && n !== null) box.textContent = 'В наличии ' + n + ' шт';
    };
    if (p.options) {
      drawOptStock();
      el.addEventListener('click', function (e) {
        var b = e.target.closest('[data-opt]');
        if (b && b.hasAttribute('data-out')) return window.LarionSay('«' + p.options[+b.getAttribute('data-opt')].title + '» сейчас нет в наличии');
        if (b) {
          optIndex = Number(b.getAttribute('data-opt'));
          el.querySelectorAll('[data-opt]').forEach(function (x) { x.classList.toggle('is-active', x === b); });
          el.querySelector('[data-opt-name]').textContent = p.options[optIndex].title;
          drawOptStock();
          var at = p.images.indexOf(p.options[optIndex].image);
          if (at !== -1) show(at);
          return;
        }
        var add = e.target.closest('[data-add-opt]');
        if (!add) return;
        var o = p.options[optIndex];
        var plain = document.createElement('textarea');
        plain.innerHTML = p.title;
        window.LarionCart.add(p.id + ':' + o.id, 1, { title: plain.value + ' — ' + o.title.toLowerCase(), price: p.price, image: o.image, category: p.category, max: optStock(p, o) });
        add.textContent = 'Добавлено';
        setTimeout(function () { add.textContent = 'Добавить в корзину'; }, 1200);
      });
    }
    // во весь экран открываются только фото, видео играет прямо в карточке
    var photos = p.images.filter(function (src) { return !isVideo(src); });
    var show = function (i) {
      current = (i + p.images.length) % p.images.length;
      var src = p.images[current];
      var vid = isVideo(src);
      main.hidden = vid;
      video.hidden = !vid;
      if (vid) {
        video.muted = true;
        if (video.getAttribute('src') !== src) {
          video.poster = src.replace(/\.mp4$/i, '-poster.webp');
          video.src = src;
        }
        var playing = video.play();
        if (playing && playing.catch) playing.catch(function () {});
      } else {
        video.pause();
        main.src = src;
      }
      el.querySelectorAll('[data-thumb]').forEach(function (b, n) { b.classList.toggle('is-active', n === current); });
    };
    show(0);
    var openBig = function () { window.LarionLightbox.open(photos, Math.max(0, photos.indexOf(p.images[current]))); };
    main.tabIndex = 0;
    main.setAttribute('role', 'button');
    main.setAttribute('aria-label', 'Открыть фото на весь экран');
    var mobilePhoto = matchMedia('(pointer: coarse)');
    var touchStart = null;
    var swipeEnded = 0;
    function turnPhoto(direction) {
      if (!many) return;
      show(current + direction);
      if (!main.hidden && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
        main.getAnimations().forEach(function (animation) { animation.cancel(); });
        main.animate([{ transform: 'translateX(' + direction * 25 + 'px)', opacity: .7 }, { transform: 'none', opacity: 1 }], { duration: 160 });
      }
    }
    main.addEventListener('touchstart', function (e) {
      touchStart = e.touches.length === 1 ? [e.touches[0].clientX, e.touches[0].clientY] : null;
    }, { passive: true });
    main.addEventListener('touchcancel', function () { touchStart = null; });
    main.addEventListener('touchend', function (e) {
      if (!touchStart || e.touches.length) return;
      var dx = e.changedTouches[0].clientX - touchStart[0];
      var dy = e.changedTouches[0].clientY - touchStart[1];
      touchStart = null;
      if (Math.abs(dx) < 42 || Math.abs(dx) < Math.abs(dy)) return;
      swipeEnded = Date.now();
      turnPhoto(dx < 0 ? 1 : -1);
    }, { passive: true });
    main.addEventListener('click', function (e) {
      if (Date.now() - swipeEnded < 350) return;
      if (many && mobilePhoto.matches && e.detail > 0) {
        var rect = main.getBoundingClientRect();
        var fraction = (e.clientX - rect.left) / rect.width;
        if (fraction < .28 || fraction > .72) {
          turnPhoto(fraction < .28 ? -1 : 1);
          return;
        }
      }
      openBig();
    });
    main.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openBig(); }
    });
    el.addEventListener('click', function (e) {
      var t = e.target.closest('[data-thumb]');
      if (t) show(Number(t.getAttribute('data-thumb')));
      var s = e.target.closest('[data-step]');
      if (s) show(current + Number(s.getAttribute('data-step')));
    });
    window.LarionCart.refresh();
  }
  // Карусель карточек: <section> с [data-track], [data-carousel-prev], [data-carousel-next].
  // Нужна на странице товара («Смотри, что ещё есть») и в предзаказе.
  function carousel(section, list) {
    var track = section.querySelector('[data-track]');
    var toPrev = section.querySelector('[data-carousel-prev]');
    var toNext = section.querySelector('[data-carousel-next]');
    section.hidden = false;
    track.innerHTML = list.map(cardHtml).join('');
    window.LarionCart.refresh();

    var updateArrows = function () {
      var end = track.scrollWidth - track.clientWidth;
      toPrev.hidden = track.scrollLeft < 4;
      toNext.hidden = track.scrollLeft > end - 4;
    };
    var scrollByCards = function (direction) {
      var card = track.querySelector('.card');
      var gap = parseFloat(getComputedStyle(track).columnGap) || 0;
      track.scrollBy({ left: direction * (card.offsetWidth + gap), behavior: 'smooth' });
    };
    toPrev.addEventListener('click', function () { scrollByCards(-1); });
    toNext.addEventListener('click', function () { scrollByCards(1); });
    track.addEventListener('scroll', updateArrows, { passive: true });
    if (section.classList.contains('related')) bindMouseScroll(track, matchMedia('(max-width: 639px)'));
    window.addEventListener('resize', updateArrows);
    updateArrows();
  }
  window.LarionShop = { fillProduct: fillProduct, carousel: carousel, available: available, shuffle: shuffle };

  var root = document.querySelector('[data-product]');  if (root) {
    var id = new URLSearchParams(location.search).get('id');
    var p = data.products.filter(function (x) { return x.id === id; })[0];
    if (!p) {
      root.innerHTML = '<div class="empty" style="grid-column:1/-1">Такого товара нет. <a href="catalog.html" style="border-bottom:1px solid">Вернуться в каталог</a></div>';
      return;
    }
    var plainTitle = document.createElement('textarea');
    plainTitle.innerHTML = p.title;
    document.title = plainTitle.value + ' | Larion';

    var category = data.categories.filter(function (c) { return c.slug === p.category; })[0];
    var backUrl = category ? 'catalog.html?cat=' + category.slug : 'catalog.html';

    var crumbs = document.querySelector('[data-product-crumbs]');
    crumbs.innerHTML =
      '<a href="index.html">Главная</a><span aria-hidden="true">›</span>' +
      '<a href="catalog.html">Наличие</a><span aria-hidden="true">›</span>' +
      (category ? '<a href="' + backUrl + '">' + category.title + '</a><span aria-hidden="true">›</span>' : '') +
      '<span aria-current="page">' + p.title + '</span>';

    fillProduct(root, p);
    crumbs.insertAdjacentHTML('beforeend', '<a class="product__close" href="' + backUrl + '" data-back aria-label="Закрыть и вернуться назад"></a>');

    // Крестик возвращает на страницу, откуда пришли. Если её нет, например, товар открыли
    // по прямой ссылке, ведёт в категорию товара.
    crumbs.querySelector('[data-back]').addEventListener('click', function (e) {
      var fromSite = document.referrer.indexOf(location.origin + '/') === 0;
      if (fromSite && history.length > 1) {
        e.preventDefault();
        history.back();
      }
    });

    // Рекомендации: какие категории показывать к товару. Для остальных категорий —
    // случайные товары из всего каталога (не больше RANDOM_COUNT).
    var RELATED = {
      zhabagochi: ['shlyapi', 'kovriki'],
      kovriki: ['kovriki', 'zhabi', 'zhabagochi'],
      zhabi: ['kovriki'],
      shlyapi: ['shlyapi', 'zhabagochi']
    };
    var RANDOM_COUNT = 12;
    var related = document.querySelector('[data-related]');
    var from = RELATED[p.category];
    var pool = (from
      ? available.filter(function (x) { return from.indexOf(x.category) !== -1; })
      : available).filter(function (x) { return x.id !== p.id; });
    var picked = shuffle(pool);
    if (!from) picked = picked.slice(0, RANDOM_COUNT);

    carousel(related, picked);
  }
  // Разделы каталога на телефоне листаются вбок: мышью можно тянуть (на компьютере колёсиком вбок не все умеют),
  // а пока справа есть ещё разделы, край растворяется — видно, что можно листать (заметка Леры).
  (function () {
    var cats = document.querySelector('.cats');
    if (!cats) return;
    var end = function () { cats.classList.toggle('is-end', cats.scrollLeft + cats.clientWidth >= cats.scrollWidth - 4); };
    cats.addEventListener('scroll', end);
    window.addEventListener('resize', end);
    setTimeout(end, 0);
    bindMouseScroll(cats);
  })();

  function bindMouseScroll(track, narrow) {
    var down = null, moved = false;
    track.addEventListener('mousedown', function (e) {
      moved = false;
      if (e.button !== 0 || (narrow && !narrow.matches) || track.scrollWidth <= track.clientWidth) return;
      down = { x: e.clientX, left: track.scrollLeft };
    });
    window.addEventListener('mousemove', function (e) {
      if (!down) return;
      var dx = e.clientX - down.x;
      if (!moved && Math.abs(dx) <= 4) return;
      moved = true;
      track.classList.add('is-dragging');
      track.scrollLeft = down.left - dx;
    });
    window.addEventListener('mouseup', function () {
      if (!down) return;
      down = null;
      setTimeout(function () {
        track.classList.remove('is-dragging');
        moved = false;
      }, 0);
    });
    track.addEventListener('click', function (e) {
      if (moved) { e.preventDefault(); e.stopPropagation(); }
    }, true);
    track.addEventListener('dragstart', function (e) { if (down) e.preventDefault(); });
  }
})();
