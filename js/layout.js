// Общие части всех страниц: шапка, мобильное меню, подвал, кнопка «наверх».
// Пункты меню и контакты правятся в этом файле один раз и меняются на всём сайте.
(function () {
  var data = window.LARION_DATA;

  // Если что-то нельзя сделать — всегда говорим почему (просьба Леры): короткое сообщение внизу экрана.
  // LarionSay('Больше нет в наличии') — из любого скрипта сайта.
  var sayBox = null, sayTimer = 0;
  window.LarionSay = function (text) {
    if (!sayBox) {
      sayBox = document.createElement('div');
      sayBox.className = 'say';
      sayBox.setAttribute('role', 'status');
      document.body.appendChild(sayBox);
    }
    sayBox.textContent = text;
    sayBox.classList.add('is-on');
    clearTimeout(sayTimer);
    sayTimer = setTimeout(function () { sayBox.classList.remove('is-on'); }, 3200);
  };

  // Выделяли текст в окошке и отпустили мышь за его краем — браузер шлёт «клик» по фону, и окошко закрывалось.
  // Такой клик (нажали на одном элементе, отпустили на его родителе) гасим для всех окошек сайта.
  var downOn = null;
  document.addEventListener('mousedown', function (e) { downOn = e.target; }, true);
  document.addEventListener('click', function (e) {
    var t = e.target, d = downOn;
    downOn = null;
    if (e.detail && d && t !== d && t.contains && t.contains(d) &&
      !t.closest('a, button, label, input, select, textarea, summary, [role="button"]')) { e.stopPropagation(); e.preventDefault(); }
  }, true);

  var CONTACTS = {
    email: 'demo@example.invalid',
    telegram: '#demo-contact',
    vk: '#demo-contact',
    // куда писать после заказа: личные сообщения группы ВК и телеграм
    vkChat: '#demo-contact',
    telegramChat: '#demo-contact'
  };
  window.LARION_CONTACTS = CONTACTS;

  // data-todo: на исходном сайте у этих пунктов нет адреса. Укажите href и уберите атрибут.
  var NAV = [
    { title: 'конструктор', href: 'constructor.html' },
    { title: 'предзаказ', href: 'preorder.html' },
    { title: 'обо мне и жабках', href: 'index.html#about' },
    { title: 'галерея', href: 'gallery.html' },
    { title: 'доставка и оплата', href: 'dostavka.html' },
    { title: 'контакты', href: 'index.html#contacts' }
  ];

  function catUrl(slug) { return 'catalog.html?cat=' + slug; }
  function navLink(item) {
    return '<a href="' + item.href + '"' + (item.todo ? ' data-todo' : '') + '>' + item.title + '</a>';
  }
  var navHtml = NAV.map(navLink).join('');

  var CART_ICON = '<svg viewBox="0 0 22 22" fill="none" aria-hidden="true"><path d="M3.5 7.5h15l1 12.5h-17l1-12.5Z" stroke="#2a2a2a" stroke-width="1.3" stroke-linejoin="round"/><path d="M7.5 9.5V5.5a3.5 3.5 0 0 1 7 0v4" stroke="#2a2a2a" stroke-width="1.3" stroke-linecap="round"/></svg>';

  var header = document.getElementById('site-header');
  header.innerHTML =
    '<header class="header">' +
      '<a class="header__logo" href="index.html" aria-label="Larion, на главную"><img src="assets/icons/logo.svg" alt="Larion"></a>' +
      '<nav class="header__nav" aria-label="Основное меню">' +
        '<a href="catalog.html" data-submenu-toggle>каталог</a>' +
        navHtml +
      '</nav>' +
      '<div class="header__actions">' +
        '<button class="cart-btn" type="button" data-cart-open aria-label="Корзина">' + CART_ICON +
          '<span class="cart-btn__count" data-cart-count aria-live="polite" hidden>0</span></button>' +
        '<button class="burger" type="button" data-drawer-open aria-label="Навигационное меню"><span></span><span></span><span></span></button>' +
      '</div>' +
    '<div class="submenu" data-submenu>' +
      data.categories.map(function (c) {
        return '<a href="' + catUrl(c.slug) + '"><img src="' + c.menuIcon + '" alt="">' + c.title + '</a>';
      }).join('') +
    '</div></header>' +
    '<div class="drawer" data-drawer>' +
      '<div class="drawer__shade" data-drawer-close></div>' +
      '<div class="drawer__panel" role="dialog" aria-labelledby="drawer-title">' +
        '<button class="drawer__close" type="button" data-drawer-close aria-label="Закрыть">Закрыть</button>' +
        '<h2 class="drawer__title" id="drawer-title">Меню</h2>' +
        '<nav class="drawer__nav">' +
          '<button class="nav-toggle" type="button" data-drawer-sub aria-expanded="false">каталог</button>' +
          '<div class="drawer__sub" data-drawer-subpanel>' +
            // с иконками разделов, как в подменю на компьютере (заметка Леры)
            '<a href="catalog.html"><span class="cats__all">' + data.categories.slice(0, 4).map(function (c) { return '<img src="' + (c.menuIcon || c.image) + '" alt="">'; }).join('') + '</span>все товары</a>' +
            data.categories.map(function (c) { return '<a href="' + catUrl(c.slug) + '"><img src="' + (c.menuIcon || c.image) + '" alt="">' + c.title.toLowerCase() + '</a>'; }).join('') +
          '</div>' +
          navHtml +
        '</nav>' +
        '<img class="drawer__sticker" src="assets/img/stickers/flower.png" alt="" loading="lazy">' +
      '</div>' +
    '</div>';

  var footer = document.getElementById('site-footer');
  footer.innerHTML =
    '<footer class="footer">' +
      '<div class="footer__cols">' +
        '<div class="footer__col"><h3>Навигация</h3><a href="catalog.html">каталог</a>' + navHtml + '</div>' +
        '<div class="footer__col"><h3>Каталог</h3>' +
          data.categories.map(function (c) { return '<a href="' + catUrl(c.slug) + '">' + c.title.toLowerCase() + '</a>'; }).join('') +
        '</div>' +
        '<div class="footer__col"><h3>Контакты</h3>' +
          '<a href="mailto:' + CONTACTS.email + '">' + CONTACTS.email + '</a>' +
          '<a href="' + CONTACTS.telegram + '" target="_blank" rel="noopener">телеграм</a>' +
          '<a href="' + CONTACTS.vk + '" target="_blank" rel="noopener">вконтакте</a>' +
        '</div>' +
      '</div>' +
      '<div class="footer__center">' +
        '<img class="logo" src="assets/icons/logo.svg" alt="Larion">' +
        '<div class="footer__copy"><img src="assets/icons/copyright.svg" alt="">larion 2026</div>' +
      '</div>' +
      '<div class="footer__legal">' +
        '<div>СЗ Илларионова Валерия Юрьевна</div>' +
        '<div>ИНН 000000000000</div>' +
        '<a href="privacy.html">Политика конфиденциальности</a>' +
        '<a href="soglasie.html">Согласие на обработку данных</a>' +
        '<a href="oferta.html">Публичная оферта</a>' +
        '<a href="#" data-todo>Разработка сайта</a>' +
      '</div>' +
    '</footer>' +
    '<button class="to-top" type="button" data-to-top aria-label="Наверх"></button>';

  // Ссылки без адреса никуда не ведут, как и на исходном сайте.
  document.addEventListener('click', function (e) {
    var todo = e.target.closest('[data-todo]');
    if (todo) e.preventDefault();
  });

  // Выпадающее меню каталога
  var toggle = header.querySelector('[data-submenu-toggle]');
  var submenu = header.querySelector('[data-submenu]');
  var closeTimer;
  function setSubmenu(open) {
    clearTimeout(closeTimer);
    submenu.classList.toggle('is-open', open);
    if (open) {
      var r = toggle.getBoundingClientRect();
      var w = submenu.offsetWidth;
      submenu.style.left = Math.max(12, Math.min(r.left - 40, window.innerWidth - w - 12)) + 'px';
    }
  }
  function closeSoon() { closeTimer = setTimeout(function () { setSubmenu(false); }, 180); }
  // Клик ведёт в каталог, а наведение показывает список категорий.
  toggle.addEventListener('mouseenter', function () { setSubmenu(true); });
  toggle.addEventListener('mouseleave', closeSoon);
  submenu.addEventListener('mouseenter', function () { clearTimeout(closeTimer); });
  submenu.addEventListener('mouseleave', closeSoon);

  // Мобильное меню
  var drawer = header.querySelector('[data-drawer]');
  function setDrawer(open) {
    drawer.classList.toggle('is-open', open);
    document.body.classList.toggle('is-locked', open);
  }
  header.querySelector('[data-drawer-open]').addEventListener('click', function () { setDrawer(true); });
  drawer.addEventListener('click', function (e) {
    if (e.target.closest('[data-drawer-close]')) setDrawer(false);
    var a = e.target.closest('a');
    if (a && !a.hasAttribute('data-todo')) setDrawer(false);
  });
  var subBtn = header.querySelector('[data-drawer-sub]');
  var subPanel = header.querySelector('[data-drawer-subpanel]');
  subBtn.addEventListener('click', function () {
    var open = subPanel.classList.toggle('is-open');
    subBtn.setAttribute('aria-expanded', String(open));
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { setSubmenu(false); setDrawer(false); }
  });

  // Кнопка «наверх»
  var toTop = footer.querySelector('[data-to-top]');
  function onScroll() { toTop.classList.toggle('is-visible', window.scrollY > 600); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  toTop.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });

  window.LARION_CONTACTS = CONTACTS;

  // Неразрывные пробелы по правилам вёрстки: ₽ и единицы не отрываются от числа, «1 600» не рвётся,
  // короткие слова (в, и, с, на…) не остаются в конце строки, тире не переносится в начало строки.
  // Работает на всём, что есть на странице, и на всём, что появляется потом (корзина, карточки, попапы).
  var NB = ' ';
  var SHORT = /(^|[\s(«"„ ])(в|во|и|а|с|со|к|ко|у|о|об|от|до|на|по|за|из|не|ни|но|для|без|под|над|при|про|я|мы|вы|он|она|оно|они|это|как|что|или|же|ли|бы|её|ее|их|мой|моя|мне|все|всё|так|уже|еще|ещё) /gi;
  function typo(s) {
    var t = s
      .replace(/(\d) (?=\d{3}(\D|$))/g, '$1' + NB)
      .replace(/(\d) (₽|руб|см|мм|мл|гр|г|кг|шт|%|°)/g, '$1' + NB + '$2')
      .replace(/ (—|–) /g, NB + '$1 ');
    var prev;
    do { prev = t; t = t.replace(SHORT, '$1$2' + NB); } while (t !== prev);
    return t;
  }
  var SKIP = /^(SCRIPT|STYLE|TEXTAREA|INPUT|SELECT|OPTION|CODE|PRE)$/;
  function typoNode(root) {
    if (!root) return;
    if (root.nodeType === 3) {
      var p = root.parentNode;
      if (p && !SKIP.test(p.nodeName) && !p.isContentEditable) {
        var v = typo(root.nodeValue);
        if (v !== root.nodeValue) root.nodeValue = v;
      }
      return;
    }
    if (root.nodeType !== 1 || SKIP.test(root.nodeName)) return;
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null, false), n, list = [];
    while ((n = walker.nextNode())) list.push(n);
    list.forEach(typoNode);
  }
  typoNode(document.body);
  if (window.MutationObserver) {
    new MutationObserver(function (records) {
      records.forEach(function (r) {
        if (r.type === 'characterData') typoNode(r.target);
        else [].forEach.call(r.addedNodes, typoNode);
      });
    }).observe(document.body, { childList: true, subtree: true, characterData: true });
  }

})();
