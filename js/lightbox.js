// Просмотр фото на весь экран: галерея «Фото-охота» и фото на странице товара.
// Закрытие — крестик, клик мимо фото или Esc. Листание — стрелки, клавиатура, свайп.
// Клик по фото приближает его, движение мыши двигает увеличенный кадр.
// open(images, start, opts): opts.captions — подписи к фото; opts.pick — кнопка выбора внизу:
//   { label: 'Выбрать', pickedLabel: 'Выбрано', isPicked(i), onPick(i) } (используется в предзаказе).
(function () {
  var box = document.createElement('div');
  box.className = 'lightbox';
  box.setAttribute('role', 'dialog');
  box.setAttribute('aria-modal', 'true');
  box.setAttribute('aria-label', 'Просмотр фото');
  box.hidden = true;
  box.innerHTML =
    '<img class="lightbox__img" alt="">' +
    '<video class="lightbox__img lightbox__video" controls playsinline loop hidden></video>' +
    '<button class="lightbox__close" type="button" aria-label="Закрыть"></button>' +
    '<button class="arrow arrow--prev lightbox__prev" type="button" aria-label="Предыдущее фото"></button>' +
    '<button class="arrow lightbox__next" type="button" aria-label="Следующее фото"></button>' +
    '<div class="lightbox__count"></div>' +
    '<div class="lightbox__bar" hidden><span class="lightbox__caption"></span><button class="btn lightbox__pick" type="button"></button></div>';
  document.body.appendChild(box);

  var img = box.querySelector('img.lightbox__img');
  var video = box.querySelector('.lightbox__video'); // .mp4 в списке показывается как видео со звуком
  var prev = box.querySelector('.lightbox__prev');
  var next = box.querySelector('.lightbox__next');
  var count = box.querySelector('.lightbox__count');
  var closeBtn = box.querySelector('.lightbox__close');
  var bar = box.querySelector('.lightbox__bar');
  var caption = box.querySelector('.lightbox__caption');
  var pickBtn = box.querySelector('.lightbox__pick');
  var opts = {};
  var list = [];
  var index = 0;
  var lastFocus = null;
  var touchX = null;

  function setZoom(on, e) {
    box.classList.toggle('is-zoomed', on);
    if (on && e) moveZoom(e);
    if (!on) img.style.transformOrigin = '';
  }
  function moveZoom(e) {
    var r = img.getBoundingClientRect();
    var x = Math.max(0, Math.min(100, (e.clientX - r.left) / r.width * 100));
    var y = Math.max(0, Math.min(100, (e.clientY - r.top) / r.height * 100));
    img.style.transformOrigin = x + '% ' + y + '%';
  }

  function show(i) {
    index = (i + list.length) % list.length;
    setZoom(false);
    var isVideo = /\.mp4$/i.test(list[index]);
    img.hidden = isVideo;
    video.hidden = !isVideo;
    if (isVideo) { video.src = list[index]; var pl = video.play(); if (pl && pl.catch) pl.catch(function () {}); }
    else { video.pause(); video.removeAttribute('src'); img.src = list[index]; }
    count.textContent = list.length > 1 && !opts.noCount ? (index + 1) + ' / ' + list.length : ''; // в предзаказе счётчик не нужен
    prev.hidden = next.hidden = list.length < 2;
    var cap = opts.captions ? opts.captions[index] : '';
    bar.hidden = !cap && !opts.pick;
    caption.textContent = cap || '';
    pickBtn.hidden = !opts.pick;
    bar.classList.toggle('is-caption', !opts.pick);
    if (opts.pick) {
      var picked = opts.pick.isPicked && opts.pick.isPicked(index);
      pickBtn.textContent = picked ? (opts.pick.pickedLabel || 'Выбрано') : (opts.pick.label || 'Выбрать');
      pickBtn.classList.toggle('is-picked', !!picked);
    }
  }

  function open(images, start, options) {
    list = images;
    opts = options || {};
    // opts задаём до show(), чтобы счётчик и подпись сразу были правильные
    lastFocus = document.activeElement;
    show(start || 0);
    box.hidden = false;
    document.body.classList.add('is-locked');
    closeBtn.focus();
  }

  function close() {
    box.hidden = true;
    setZoom(false);
    video.pause();
    video.removeAttribute('src');
    document.body.classList.remove('is-locked');
    if (lastFocus) lastFocus.focus();
  }

  box.addEventListener('click', function (e) {
    if (e.target === pickBtn) { opts.pick.onPick(index); return close(); }
    if (e.target === bar || e.target === caption) return;
    if (e.target === prev) return show(index - 1);
    if (e.target === next) return show(index + 1);
    if (e.target === video) return;
    if (e.target === img) return setZoom(!box.classList.contains('is-zoomed'), e);
    close();
  });
  img.addEventListener('mousemove', function (e) {
    if (box.classList.contains('is-zoomed')) moveZoom(e);
  });
  document.addEventListener('keydown', function (e) {
    if (box.hidden) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') show(index - 1);
    if (e.key === 'ArrowRight') show(index + 1);
  });
  box.addEventListener('touchstart', function (e) {
    touchX = e.touches.length === 1 ? e.touches[0].clientX : null;
  }, { passive: true });
  box.addEventListener('touchend', function (e) {
    if (touchX === null || list.length < 2) return;
    var dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 50) show(index + (dx < 0 ? 1 : -1));
    touchX = null;
  });

  // Галерея «Фото-охота» на главной
  var photos = Array.prototype.slice.call(document.querySelectorAll('.mosaic img'));
  var sources = photos.map(function (p) { return p.getAttribute('src'); });
  photos.forEach(function (p, i) {
    p.tabIndex = 0;
    p.setAttribute('role', 'button');
    p.setAttribute('aria-label', 'Открыть фото ' + (i + 1));
    p.addEventListener('click', function () { open(sources, i); });
    p.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(sources, i); }
    });
  });

  window.LarionLightbox = { open: open };
})();
