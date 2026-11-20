(function () {
  var grid = document.querySelector('[data-catalog], .page:has([data-gal-tabs])');
  if (!grid) return;

  var selector = '.card__img > img, .gal-photo > img';
  var visible = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      var image = entry.target;
      if (!image.parentElement) return;
      image.parentElement.classList.toggle('is-waiting-for-photo', entry.isIntersecting && !image.complete);
    });
  });

  function observePhotos(node, observe) {
    if (node.nodeType !== 1) return;
    if (node.matches(selector)) visible[observe](node);
    node.querySelectorAll(selector).forEach(function (image) { visible[observe](image); });
  }

  function loaded(event) {
    if (event.target.matches(selector)) event.target.parentElement.classList.remove('is-waiting-for-photo');
  }

  grid.addEventListener('load', loaded, true);
  grid.addEventListener('error', loaded, true);
  new MutationObserver(function (records) {
    records.forEach(function (record) {
      record.removedNodes.forEach(function (node) { observePhotos(node, 'unobserve'); });
      record.addedNodes.forEach(function (node) { observePhotos(node, 'observe'); });
    });
  }).observe(grid, { childList: true, subtree: true });
  observePhotos(grid, 'observe');
})();
