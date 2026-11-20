// Кадрирование фото: держит главный объект в центре рамки при любом её размере.
// Точки фокуса лежат в data/photo-focus.js.
(function () {
  var map = window.LARION_FOCUS || {};

  function position(center, visible) {
    if (visible > 0.999) return 50;
    var p = (center / 100 - visible / 2) / (1 - visible);
    return Math.max(0, Math.min(1, p)) * 100;
  }

  function apply(img) {
    var focus = map[img.getAttribute('src')];
    var usable = focus && getComputedStyle(img).objectFit === 'cover';
    if (!usable) {
      // Сбрасываем только свой кадр: у фото главной он задан прямо в index.html.
      if (img.hasAttribute('data-focused')) {
        img.style.objectPosition = '';
        img.removeAttribute('data-focused');
      }
      return;
    }
    if (!img.naturalWidth || !img.clientWidth || !img.clientHeight) return;
    img.setAttribute('data-focused', '');
    var scale = Math.max(img.clientWidth / img.naturalWidth, img.clientHeight / img.naturalHeight);
    var x = position(focus[0], img.clientWidth / scale / img.naturalWidth);
    var y = position(focus[1], img.clientHeight / scale / img.naturalHeight);
    img.style.objectPosition = x + '% ' + y + '%';
  }

  function applyAll() { document.querySelectorAll('img').forEach(apply); }

  document.addEventListener('load', function (e) {
    if (e.target.tagName === 'IMG') apply(e.target);
  }, true);

  var timer;
  window.addEventListener('resize', function () {
    clearTimeout(timer);
    timer = setTimeout(applyAll, 100);
  });
  document.addEventListener('DOMContentLoaded', applyAll);
})();
