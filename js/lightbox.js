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
    '<video class="lightbox__img lightbox__video" controls muted playsinline loop hidden></video>' +
    '<button class="lightbox__close" type="button" aria-label="Закрыть"></button>' +
    '<button class="arrow arrow--prev lightbox__prev" type="button" aria-label="Предыдущее фото"></button>' +
    '<button class="arrow lightbox__next" type="button" aria-label="Следующее фото"></button>' +
    '<p class="lightbox__status" role="status" hidden></p>' +
    '<div class="lightbox__count"></div>' +
    '<div class="lightbox__bar" hidden><span class="lightbox__caption"></span><button class="btn lightbox__pick" type="button"></button></div>';
  document.body.appendChild(box);

  var img = box.querySelector('img.lightbox__img');
  var video = box.querySelector('.lightbox__video'); // .mp4 в списке показывается как видео со звуком
  var prev = box.querySelector('.lightbox__prev');
  var next = box.querySelector('.lightbox__next');
  var count = box.querySelector('.lightbox__count');
  var status = box.querySelector('.lightbox__status');
  var closeBtn = box.querySelector('.lightbox__close');
  var bar = box.querySelector('.lightbox__bar');
  var caption = box.querySelector('.lightbox__caption');
  var pickBtn = box.querySelector('.lightbox__pick');
  var opts = {};
  var list = [];
  var index = 0;
  var requested = 0;
  var requestVersion = 0;
  var adjacent = {};
  var ownsHistory = false;
  var lastFocus = null;
  var touch = null;
  var pinchScale = 1;
  var suppressClickUntil = 0;
  var slide = null;

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

  function loadPhoto(i, priority) {
    var photo = adjacent[i] || new Image();
    photo.fetchPriority = priority;
    if (!photo.hasAttribute('src')) photo.src = list[i];
    return photo;
  }
  function preloadNeighbors() {
    adjacent = {};
    if (list.length < 2) return;
    [-1, 1].forEach(function (direction) {
      var i = (index + direction + list.length) % list.length;
      if (!/\.mp4$/i.test(list[i]) && !adjacent[i]) adjacent[i] = loadPhoto(i, 'low');
    });
  }
  function show(i, direction) {
    requested = (i + list.length) % list.length;
    var target = requested;
    var version = ++requestVersion;
    var source = list[target];
    var isVideo = /\.mp4$/i.test(source);
    if (isVideo) {
      renderFrame(target, null, direction);
      return;
    }
    var photo = loadPhoto(target, 'high');
    status.textContent = 'Загружается фото…';
    status.hidden = false;
    pickBtn.disabled = true;
    photo.decode().then(function () {
      if (version === requestVersion) renderFrame(target, photo, direction);
    }).catch(function () {
      if (version !== requestVersion) return;
      status.textContent = 'Не удалось загрузить фото. Можно перейти к следующему.';
    });
  }
  function renderFrame(i, photo, direction) {
    if (slide) slide.cancel();
    pinchScale = 1;
    img.style.transform = '';
    index = i;
    setZoom(false);
    status.hidden = true;
    pickBtn.disabled = false;
    if (!photo) {
      img.hidden = true;
      video.hidden = false;
      video.muted = true;
      video.poster = list[index].replace(/\.mp4$/i, '-poster.webp');
      video.src = list[index];
      var pl = video.play();
      if (pl && pl.catch) pl.catch(function () {});
    } else {
      video.pause();
      video.removeAttribute('src');
      video.hidden = true;
      photo.className = 'lightbox__img';
      photo.alt = opts.captions ? opts.captions[index] || '' : '';
      img.replaceWith(photo);
      img = photo;
    }
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
    preloadNeighbors();
    if (direction && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
      slide = (photo || video).animate(
        [{ transform: 'translateX(' + direction * 32 + 'px)', opacity: .68 }, { transform: 'translateX(0)', opacity: 1 }],
        { duration: 180, easing: 'ease-out' }
      );
    }
  }

  function turn(direction) {
    if (list.length < 2) return;
    show(requested + direction, direction);
  }

  function open(images, start, options) {
    if (!images.length) return;
    touch = null;
    suppressClickUntil = 0;
    adjacent = {};
    list = images;
    opts = options || {};
    // opts задаём до show(), чтобы счётчик и подпись сразу были правильные
    lastFocus = document.activeElement;
    img.hidden = true;
    video.hidden = true;
    bar.hidden = true;
    count.textContent = '';
    prev.hidden = next.hidden = list.length < 2;
    if (!history.state || !history.state.larionLightbox) {
      history.pushState(Object.assign({}, history.state, { larionLightbox: true }), '');
    }
    ownsHistory = true;
    box.hidden = false;
    document.body.classList.add('is-locked');
    show(start || 0);
    closeBtn.focus({ preventScroll: true });
  }

  function close(fromHistory) {
    var returnInHistory = ownsHistory && !fromHistory && history.state && history.state.larionLightbox;
    ownsHistory = false;
    requestVersion += 1;
    adjacent = {};
    box.hidden = true;
    setZoom(false);
    video.pause();
    video.removeAttribute('src');
    document.body.classList.remove('is-locked');
    if (lastFocus) lastFocus.focus({ preventScroll: true });
    if (returnInHistory) history.back();
  }
  window.addEventListener('popstate', function () {
    if (!box.hidden && (!history.state || !history.state.larionLightbox)) close(true);
  });

  box.addEventListener('click', function (e) {
    if (Date.now() < suppressClickUntil && (e.target === img || e.target === box)) return;
    if (e.target === pickBtn) { opts.pick.onPick(index); return close(); }
    if (e.target === bar || e.target === caption) return;
    if (e.target === prev) return turn(-1);
    if (e.target === next) return turn(1);
    if (e.target === video) return;
    if (e.target === img) {
      if (matchMedia('(pointer: coarse)').matches) return;
      return setZoom(!box.classList.contains('is-zoomed'), e);
    }
    close();
  });
  box.addEventListener('mousemove', function (e) {
    if (e.target === img && box.classList.contains('is-zoomed')) moveZoom(e);
  });
  document.addEventListener('keydown', function (e) {
    if (box.hidden) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') turn(-1);
    if (e.key === 'ArrowRight') turn(1);
  });
  function distance(touches) {
    return Math.hypot(touches[0].clientX - touches[1].clientX, touches[0].clientY - touches[1].clientY);
  }
  box.addEventListener('touchstart', function (e) {
    if (e.target.closest('button, .lightbox__bar')) return;
    if (e.target === video) {
      var r = video.getBoundingClientRect(), point = e.touches[0];
      var x = (point.clientX - r.left) / r.width;
      if ((x > .22 && x < .78) || point.clientY > r.bottom - 64) return;
    }
    if (e.touches.length === 2 && !img.hidden) {
      var first = e.touches[0], second = e.touches[1];
      if (pinchScale === 1) moveZoom({ clientX: (first.clientX + second.clientX) / 2, clientY: (first.clientY + second.clientY) / 2 });
      touch = { distance: distance(e.touches), scale: pinchScale };
    } else if (e.touches.length === 1) {
      touch = { x: e.touches[0].clientX, y: e.touches[0].clientY, backdrop: e.target === box };
    }
  }, { passive: true });
  box.addEventListener('touchmove', function (e) {
    if (!touch) return;
    if (!touch.distance && e.touches.length === 1) {
      var finger = e.touches[0];
      var movement = Math.hypot(finger.clientX - touch.x, finger.clientY - touch.y);
      if (e.cancelable && movement > 7) e.preventDefault();
      return;
    }
    if (!touch.distance || e.touches.length !== 2) return;
    if (e.cancelable) e.preventDefault();
    pinchScale = Math.max(1, Math.min(3, touch.scale * distance(e.touches) / touch.distance));
    img.style.transform = pinchScale === 1 ? '' : 'scale(' + pinchScale + ')';
  }, { passive: false });
  box.addEventListener('touchend', function (e) {
    if (!touch || e.touches.length) return;
    var start = touch;
    touch = null;
    suppressClickUntil = Date.now() + 350;
    if (start.distance) return;
    var finger = e.changedTouches[0], dx = finger.clientX - start.x, dy = finger.clientY - start.y;
    if (start.backdrop && Math.abs(dx) < 12 && Math.abs(dy) < 12) {
      if (e.cancelable) e.preventDefault();
      close();
      return;
    }
    if (pinchScale > 1) return;
    if (Math.abs(dx) > 42 && Math.abs(dx) > Math.abs(dy)) turn(dx < 0 ? 1 : -1);
    else if (Math.abs(dx) < 12 && Math.abs(dy) < 12 && list.length > 1) {
      var r = box.getBoundingClientRect();
      turn(finger.clientX < r.left + r.width / 2 ? -1 : 1);
    }
  }, { passive: false });
  box.addEventListener('touchcancel', function () { touch = null; });

  // Галерея «Фото-охота» на главной
  var photos = Array.prototype.slice.call(document.querySelectorAll('.mosaic img'));
  var sources = photos.map(function (p) { return p.dataset.photoSrc || p.getAttribute('src'); });
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
