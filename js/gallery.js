// Галерея: три раздела (фото-охота, мистери фрокс, эксклюзив) вкладками. Данные — data/gallery.js.
// Вкладка выбирается по адресу: gallery.html#hunt, #mystery, #exclusive. Клик по фото открывает просмотр во весь экран.
(function () {
  var data = window.LARION_GALLERY;
  if (!data) return;
  var media = data.media || {};
  var PARTS = ['hunt', 'mystery', 'exclusive'];

  function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function empty(text) { return '<p class="gal-empty">' + text + '</p>'; }
  function preview(s) { return s ? s + '-preview.webp' : ''; }
  function dimensions(src) {
    var size = media[src];
    return size ? ' width="' + size[0] + '" height="' + size[1] + '" style="aspect-ratio:' + size[0] + '/' + size[1] + '"' : '';
  }
  function original(src) {
    var size = media[src];
    return (size && size[2]) || src;
  }

  // ---------- Фото-охота: колонки разной высоты, фото целиком
  var hunt = data.hunt || [];
  document.querySelector('[data-hunt]').innerHTML = hunt.length
    ? hunt.map(function (p, i) {
      return '<button class="gal-photo" type="button" data-zoom="hunt" data-i="' + i + '"><img src="' + esc(preview(p.src)) + '"' + dimensions(p.src) + ' alt="' + esc(p.alt) + '" loading="lazy" decoding="async"></button>';
    }).join('')
    : empty('Скоро здесь появятся жабки на природе.');

  // ---------- Мистери фрокс: коллекции с датой и фото
  var mystery = data.mystery || [];
  document.querySelector('[data-mystery]').innerHTML = mystery.length
    ? mystery.map(function (c, ci) {
      // фото — строка или { src, title } (у клоунов у каждой жабки своё имя)
      var photos = (c.photos || []).map(function (p) { return typeof p === 'string' ? { src: p } : p; });
      var shift = (c.cover ? 1 : 0) + (c.cover2 ? 1 : 0); // общие фото идут первыми при листании
      return '<article class="gal-col">' +
        '<header class="gal-col__head"><h2>' + esc(c.title) + '</h2>' + (c.date ? '<span class="gal-col__date">' + esc(c.date) + '</span>' : '') + '</header>' +
        (c.text ? '<p class="gal-col__text">' + esc(c.text) + '</p>' : '') +
        '<div class="gal-col__body">' +
        (c.cover ? '<button class="gal-photo gal-col__cover" type="button" data-zoom="mystery" data-c="' + ci + '" data-i="0"><img src="' + esc(preview(c.cover)) + '"' + dimensions(c.cover) + ' alt="Вся коллекция «' + esc(c.title) + '»" loading="lazy"></button>' : '') +
        (c.cover2 ? '<button class="gal-photo gal-col__cover2" type="button" data-zoom="mystery" data-c="' + ci + '" data-i="' + (c.cover ? 1 : 0) + '"><img src="' + esc(preview(c.cover2)) + '"' + dimensions(c.cover2) + ' alt="" loading="lazy"></button>' : '') +
        '<div class="gal-col__photos">' + photos.map(function (p, i) {
          var tile = '<button class="gal-photo gal-photo--sq" type="button" data-zoom="mystery" data-c="' + ci + '" data-i="' + (i + shift) + '"><img src="' + esc(preview(p.src)) + '" alt="' + esc(p.title || '') + '" loading="lazy" decoding="async"></button>';
          return p.title ? '<figure class="gal-named">' + tile + '<figcaption>' + esc(p.title) + '</figcaption></figure>' : tile;
        }).join('') +
        // секретные жабки — под спойлером: размыты, пока не нажмёшь; бывает и видео
        (c.secret || []).map(function (src, i) {
          var media = /\.mp4$/i.test(src)
            ? '<video data-src="' + esc(src) + '#t=0.5" muted loop playsinline preload="none"></video>'
            : '<img src="' + esc(preview(src)) + '" alt="" loading="lazy" decoding="async">';
          return '<button class="gal-photo gal-photo--sq gal-secret" type="button" data-secret data-c="' + ci + '" data-i="' + i + '" aria-label="Показать секретную жабку">' +
            media + '<span class="gal-secret__label">Секретная жабка<small>нажмите, чтобы увидеть</small></span></button>';
        }).join('') + '</div></div>' +
      '</article>';
    }).join('')
    : empty('Здесь будет архив коллекций мистери фрокс: названия, даты и все жабки из боксов.');

  // ---------- Эксклюзив: карточки аукционных жабок
  var exclusive = data.exclusive || [];
  document.querySelector('[data-exclusive]').innerHTML = exclusive.length
    ? exclusive.map(function (x, xi) {
      var photos = x.photos || [];
      // первым может быть видео: в карточке играет само без звука, по нажатию — во весь экран со звуком
      var isVid = function (s) { return /\.mp4$/i.test(s || ''); };
      var first = isVid(photos[0])
        ? '<button class="gal-photo gal-photo--card gal-video" type="button" data-zoom="exclusive" data-c="' + xi + '" data-i="0" aria-label="Смотреть видео"><video data-src="' + esc(photos[0]) + '" muted loop playsinline preload="none"></video>'
        : '<button class="gal-photo gal-photo--card" type="button" data-zoom="exclusive" data-c="' + xi + '" data-i="0"><img src="' + esc(preview(photos[0])) + '" alt="" loading="lazy" decoding="async">';
      var vids = photos.filter(isVid).length;
      var count = vids === photos.length ? vids + ' видео' : photos.length + ' фото';
      return '<article class="gal-ex">' + first +
          (photos.length > 1 ? '<span class="gal-ex__count">' + count + '</span>' : '') + '</button>' +
        (x.title ? '<h2>' + esc(x.title) + '</h2>' : '') +
        (x.date ? '<span class="gal-col__date">' + esc(x.date) + '</span>' : '') +
        (x.text ? '<p>' + esc(x.text) + '</p>' : '') +
      '</article>';
    }).join('')
    : empty('Здесь будут эксклюзивные жабки с аукционов.');

  // ---------- Обложки коллекций: слева, размер как раньше (~560 px, ряд фигурок ~760 px),
  // справа и ниже — квадратики. Сколько колонок и рядов сетки занимает обложка, считаем по размеру фото.
  var COVER_W = { 'gal-col__cover': 560, 'gal-col__cover2': 760 };
  function fitCovers() {
    Array.prototype.forEach.call(document.querySelectorAll('.gal-col__body'), function (body) {
      if (!body.offsetWidth) return; // вкладка скрыта — посчитаем при открытии
      // сначала обложки в одну колонку: иначе широкая обложка добавляет лишние колонки, и их считаешь за настоящие
      Array.prototype.forEach.call(body.querySelectorAll('.gal-col__cover, .gal-col__cover2'), function (c) { c.style.setProperty('--span', 1); });
      var cs = getComputedStyle(body);
      var cols = cs.gridTemplateColumns.split(' ');
      var colW = parseFloat(cols[0]), gap = parseFloat(cs.columnGap) || 0;
      var rowH = colW + (parseFloat(cs.rowGap) || 0);
      Array.prototype.forEach.call(body.querySelectorAll('.gal-col__cover, .gal-col__cover2'), function (c) {
        var img = c.querySelector('img');
        var want = COVER_W[c.classList.contains('gal-col__cover2') ? 'gal-col__cover2' : 'gal-col__cover'];
        var span = Math.max(1, Math.min(cols.length, Math.round((want + gap) / (colW + gap))));
        var w = span * colW + (span - 1) * gap;
        var width = Number(img.getAttribute('width'));
        var h = width ? w * Number(img.getAttribute('height')) / width : w;
        c.style.setProperty('--span', span);
        c.style.setProperty('--rows', Math.max(1, Math.ceil((h + gap) / rowH)));
      });
    });
  }
  var lastWidth = window.innerWidth;
  window.addEventListener('resize', function () {
    if (window.innerWidth === lastWidth) return;
    lastWidth = window.innerWidth;
    fitCovers();
  });

  function playPreview(video) {
    if (!video.hasAttribute('src')) {
      video.poster = video.dataset.src.replace(/\.mp4(?:#.*)?$/i, '-poster.webp');
      video.src = video.dataset.src;
    }
    video.play().catch(function () {});
  }
  var previews = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) playPreview(entry.target);
      else entry.target.pause();
    });
  });
  document.querySelectorAll('[data-exclusive] video[data-src]').forEach(function (video) {
    previews.observe(video);
  });

  // ---------- Просмотр во весь экран
  document.querySelector('main').addEventListener('click', function (e) {
    var gv = e.target.closest('[data-video]');
    if (gv) {
      var vv = gv.querySelector('video');
      if (vv.muted) { vv.muted = false; vv.play(); } else if (vv.paused) vv.play(); else vv.pause();
      gv.querySelector('.gal-video__sound').textContent = vv.muted ? '🔇' : (vv.paused ? '▶' : '🔊');
      return;
    }
    // первое нажатие снимает спойлер, следующее открывает фото
    var s = e.target.closest('[data-secret]');
    if (s) {
      var vid = s.querySelector('video');
      if (!s.classList.contains('is-open')) {
        s.classList.add('is-open');
        if (vid) {
          playPreview(vid);
          previews.observe(vid);
        }
        return;
      }
      // открытая секретка (фото или видео) открывается во весь экран, видео там играет со звуком
      if (window.LarionLightbox) window.LarionLightbox.open(mystery[Number(s.getAttribute('data-c'))].secret.map(original), Number(s.getAttribute('data-i')));
      return;
    }
    var b = e.target.closest('[data-zoom]');
    if (!b || !window.LarionLightbox) return;
    var kind = b.getAttribute('data-zoom'), i = Number(b.getAttribute('data-i')), c = Number(b.getAttribute('data-c'));
    var list;
    if (kind === 'hunt') list = hunt.map(function (p) { return p.src; });
    var caps = null;
    if (kind === 'mystery') {
      var mc = mystery[c];
      var ph = (mc.photos || []).map(function (p) { return typeof p === 'string' ? { src: p } : p; });
      var lead = [mc.cover, mc.cover2].filter(Boolean);
      list = lead.concat(ph.map(function (p) { return p.src; }));
      if (ph.some(function (p) { return p.title; })) caps = lead.map(function () { return 'Вся коллекция «' + mc.title + '»'; }).concat(ph.map(function (p) { return p.title || ''; }));
    }
    else if (kind === 'exclusive') list = exclusive[c].photos || [];
    window.LarionLightbox.open(list.map(original), i, { captions: caps });
  });

  // ---------- Вкладки
  var tabs = document.querySelector('[data-gal-tabs]');
  function show(part, scroll) {
    if (PARTS.indexOf(part) === -1) part = 'hunt';
    PARTS.forEach(function (p) {
      document.querySelector('[data-part="' + p + '"]').hidden = p !== part;
      var a = tabs.querySelector('[data-tab="' + p + '"]');
      a.classList.toggle('is-active', p === part);
      a.setAttribute('aria-current', p === part ? 'page' : 'false');
    });
    if (scroll) tabs.scrollIntoView({ block: 'start', behavior: 'instant' });
    fitCovers();
  }
  tabs.addEventListener('click', function (e) {
    var a = e.target.closest('[data-tab]');
    if (!a) return;
    e.preventDefault();
    var part = a.getAttribute('data-tab');
    // где начинаются вкладки (заголовок «Галерея» над ними) — считаем до переключения, пока страница длинная
    var head = document.querySelector('.gal-head');
    var start = head.getBoundingClientRect().bottom + window.pageYOffset;
    var tabsTop = parseFloat(getComputedStyle(tabs).top) || 0;
    var wasDown = window.pageYOffset > start - tabsTop;
    history.replaceState(null, '', '#' + part);
    show(part, false);
    // новый раздел открывается с начала, а не с того места, где листали прошлый (заметка Леры)
    if (wasDown) window.scrollTo({ top: start - tabsTop, behavior: 'instant' });
  });
  window.addEventListener('hashchange', function () { show(location.hash.slice(1), true); });
  var initial = location.hash.slice(1);
  show(initial, PARTS.indexOf(initial) !== -1);
})();
