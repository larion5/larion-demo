// Корзина и форма заказа.
// Состав корзины хранится в браузере покупателя (localStorage).
//
// Цены и наличие сервер проверяет сам. Если сервера с PHP нет (сайт открыт как простые файлы),
(function () {
  var KEY = 'larion_demo_cart';

  var products = window.LARION_DATA.products;
  function find(id) { return products.filter(function (p) { return p.id === id; })[0]; }
  // «Свои» товары (например жабка с предзаказа) хранят название, цену и картинку прямо в корзине.
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function productOf(i) {
    if (!i.custom) return find(i.id);
    return { id: i.id, title: esc(i.custom.title), price: i.custom.price, images: [i.custom.image], stock: i.custom.max != null ? i.custom.max : 10, category: i.custom.category };
  }
  // ---------- Наборы (подарочный набор): у товара поле bundle — из чего собирается. Сколько наборов есть,
  // считается по составляющим: жабагочи в наличии, коврик, цветочки (по 3 на набор), шляпы до N ₽.
  // Тот же расчёт на сервере (api/order.php) — там же проверяется, что всё выбранное ещё есть.
  var Bundle = {
    frogs: function (b) {
      return products.filter(function (x) { return x.category === b.frogCategory && !x.bundle && !x.hidden && x.stock !== 0; });
    },
    hats: function (b) {
      return products.filter(function (x) { return x.category === b.hatCategory && !x.bundle && !x.hidden && x.stock !== 0 && x.price <= b.hatMaxPrice; });
    },
    flower: function (b) { return find(b.flowers.product); },
    mat: function (b) { return find(b.mat); },
    stock: function (p) {
      var b = p.bundle, n = function (x) { return x.stock === null ? 99 : x.stock; };
      var sum = function (list) { return list.reduce(function (s, x) { return s + n(x); }, 0); };
      var fl = Bundle.flower(b), mat = Bundle.mat(b);
      if (!fl || !mat || mat.hidden || fl.hidden) return 0;
      return Math.max(0, Math.min(sum(Bundle.frogs(b)), sum(Bundle.hats(b)), n(mat), Math.floor(n(fl) / b.flowers.count)));
    }
  };
  products.forEach(function (p) { if (p.bundle) p.stock = Bundle.stock(p); });
  window.LarionBundle = Bundle;

  function rowById(id) { return read().filter(function (i) { return i.id === id; })[0]; }
  function money(n) { return n.toLocaleString('ru-RU').replace(/\s/g, ' ') + ' ₽'; }

  function read() {
    try {
      var items = JSON.parse(localStorage.getItem(KEY)) || [];
      return items.filter(function (i) {
        var p = productOf(i);
        if (!p) return false;
        i.qty = Math.min(i.qty, maxQty(p));
        return i.qty > 0;
      });
    } catch (e) { return []; }
  }
  function write(items) {
    try { localStorage.setItem(KEY, JSON.stringify(items)); } catch (e) { /* приватный режим */ }
    render();
  }

  function maxQty(p) { return !p ? 0 : p.stock === null ? 99 : p.stock; }

  // custom — для «своих» товаров: { title, price, image }.
  function add(id, qty, custom) {
    var items = read();
    var row = items.filter(function (i) { return i.id === id; })[0];
    var p = row ? productOf(row) : custom ? productOf({ id: id, custom: custom }) : find(id);
    if (maxQty(p) < 1) return;
    if (row) row.qty = Math.min(row.qty + (qty || 1), maxQty(p));
    else items.push(custom ? { id: id, qty: Math.min(qty || 1, maxQty(p)), custom: custom } : { id: id, qty: Math.min(qty || 1, maxQty(p)) });
    write(items);
  }
  function canAdd(id) {
    var row = rowById(id);
    return (row ? row.qty : 0) < maxQty(row ? productOf(row) : find(id));
  }
  function setQty(id, qty) {
    var items = read().map(function (i) { if (i.id === id) i.qty = qty; return i; })
      .filter(function (i) { return i.qty > 0; });
    write(items);
  }

  var root = document.createElement('div');
  root.className = 'cart';
  root.setAttribute('role', 'dialog');
  root.setAttribute('aria-modal', 'true');
  root.setAttribute('aria-label', 'Корзина');
  root.innerHTML =
    '<button class="cart__close" type="button" data-cart-close aria-label="Закрыть">Закрыть</button>' +
    '<div class="cart__box">' +
      '<h2 data-cart-title>Ваш заказ:</h2>' +
      '<div data-cart-items></div>' +
      '<div class="cart__warn" data-cart-warn hidden>' +
        '<p><b>Шляпку можно надеть только на жабагочи</b> (жабку с дырочкой на голове), а её в корзине нет. Добавим?</p>' +
        '<div class="cart__warn-btns">' +
          '<a class="cart__warn-yes" href="catalog.html?cat=zhabagochi">Да, выбрать жабагочи</a>' +
          '<button type="button" data-warn-ok>Нет, я осознаю свой выбор</button>' +
        '</div>' +
      '</div>' +
      // мягкая подсказка (не мешает заказу): к жабагочи — шляпку, к обычной жабке — коврик
      '<div class="cart__tip" data-cart-tip hidden><p data-tip-text></p><div class="cart__warn-btns"><a class="cart__warn-yes" data-tip-link></a><button type="button" data-tip-no>Нет, спасибо</button></div></div>' +
      '<div data-cart-empty class="cart__empty" hidden>Жаб тут пока нетю, они ждут, когда их заберут домой</div>' +
      '<form data-cart-form novalidate>' +
        '<div class="cart__sum" data-cart-sum></div>' +
        // Порядок по просьбе Леры: почта (чек и вся информация), получатель для пункта выдачи, комментарий.
        // Где удобнее связаться (Телеграм / ВК) покупатель выбирает уже после заказа — кнопками в сообщении «Спасибо».
        '<label class="field"><span>Ваша почта (email)</span><input name="email" type="email" autocomplete="email" inputmode="email" required><small class="field__hint">Демо: письма не отправляются; используйте вымышленные данные</small><small class="field__error">Укажите почту, например name@mail.ru</small></label>' +
        // Доставка — отдельной рамкой (просьба Леры). Два варианта: пункт выдачи СДЭК (договор Леры, цена сразу) или
        // «Другой способ — договоримся» (оплачиваются только товары, доставку Лера считает сама). СДЭК — первым и по умолчанию.
        // Предзаказ выбирает пункт так же: у СДЭК нет срока на отправку, заказ в СДЭК создаётся, когда жабка готова.
        // в корзине одни сертификаты — рамки доставки нет совсем, только эта плашка (просьба Леры)
        '<p class="ship__info" data-ship-gift hidden>Сертификат придёт на почту картинкой — доставка не нужна.</p>' +
        '<fieldset class="ship" data-ship><legend>Доставка</legend>' +
          '<p class="ship__info" data-ship-later hidden>Жабку с предзаказа я слеплю за 1–3 недели и отправлю, когда всё будет готово.</p>' +
          '<div class="ship__ways" data-ship-ways>' +
            '<label class="ship__way"><input type="radio" name="shipWay" value="cdek" checked><span><b>В пункт выдачи СДЭК</b><small>Стоимость посчитается сразу</small></span></label>' +
            // Пункт выдачи СДЭК — сразу под своим вариантом (заметка Леры): город → пункт на карте или в списке, потом адрес и цена
            '<div class="field delivery" data-delivery>' +
              '<div class="delivery__picked" data-delivery-picked hidden></div>' +
              '<button type="button" class="delivery__btn" data-delivery-open>Выбрать пункт выдачи</button>' +
              '<small class="field__error">Выберите пункт выдачи СДЭК</small></div>' +
            '<label class="ship__way"><input type="radio" name="shipWay" value="other"><span><b>Другой способ</b><small>Оплатите только товары, доставку обсудим в переписке</small></span></label>' +
          '</div>' +
          '<label class="field"><span>ФИО получателя</span><input name="name" type="text" autocomplete="name" placeholder="Иванова Мария Петровна" required><small class="field__error">Укажите фамилию, имя и отчество</small></label>' +
          '<label class="field field--phone"><span>Телефон получателя</span><span class="phone"><span class="phone__cc"><i class="flag" data-phone-flag aria-hidden="true"></i><b data-phone-code>+7</b><i class="phone__arrow" aria-hidden="true"></i>' +
            '<select name="phoneCc" aria-label="Страна телефона"><option value="ru">Россия +7</option><option value="by">Беларусь +375</option><option value="kz">Казахстан +7</option></select></span>' +
            '<input name="phone" type="tel" inputmode="tel" autocomplete="tel-national" placeholder="(000) 000-00-00" required></span><small class="field__hint" data-phone-hint>СДЭК пришлёт СМС с кодом, когда посылка приедет</small><small class="field__error" data-phone-error>Укажите номер из 10 цифр</small></label>' +
        '</fieldset>' +
        '<label class="field"><span>Комментарий к заказу</span><textarea name="comment" rows="2" maxlength="1000" placeholder="Например: это подарок, оберните заказ ленточкой"></textarea></label>' +
        '<div class="consent"><input name="consent" type="checkbox" required aria-labelledby="consent-text"><span id="consent-text">Я даю <a href="soglasie.html" target="_blank" rel="noopener">согласие на обработку персональных данных</a> по <a href="privacy.html" target="_blank" rel="noopener">политике</a>' +
          // согласие на ПДн — отдельной галочкой и отдельным документом (152-ФЗ с 01.09.2025), оферта принимается оформлением заказа (строка под галочкой)
          '<span class="consent__offer">Оформляя заказ, вы принимаете условия <a href="oferta.html" target="_blank" rel="noopener">публичной оферты</a>.</span></span></div>' +
        // Оплата подарочным сертификатом: номер → проверка на сервере → скидка до остатка на сертификате
        '<div class="cert-pay" data-cert>' +
          '<button type="button" class="cert-pay__open" data-cert-open>Есть подарочный сертификат?</button>' +
          '<div class="cert-pay__form" data-cert-form hidden><input type="text" placeholder="DEMO500" autocomplete="off" spellcheck="false" data-cert-input aria-label="Номер сертификата"><button type="button" class="btn" data-cert-apply>Применить</button></div>' +
          '<div class="cert-pay__on" data-cert-on hidden></div>' +
        '</div>' +
        // суммы — в своей рамке, чтобы не сливались с текстом выше (просьба Леры)
        '<div class="cart__sums"><div class="cart__lines" data-cart-lines></div>' +
        '<div class="cart__total"><span>Итого</span><span data-cart-total></span></div></div>' +
        '<p class="cart__note" data-cart-note role="status" hidden></p>' +
        '<button class="cart__demo-example" type="button" data-demo-checkout>Заполнить пример заказа</button>' +
        '<button class="btn" type="submit">Проверить оформление — демо</button>' +
      '</form>' +
      '<div class="cart__note" data-demo-confirmation hidden>' +
        '<b class="cart__thanks" tabindex="-1"></b>' +
        '<span data-demo-order-amount></span><br>' +
        '<span>Демо · чек и письма не отправляются.</span>' +
        '<span class="cart__chat-text"><b>Где вам удобнее связаться?</b> В демо можно проверить выбор способа связи.</span>' +
        '<span class="cart__chats">' +
          '<button type="button" class="cart__chat" data-demo-way="Телеграм">Написать в Телеграм</button>' +
          '<button type="button" class="cart__chat" data-demo-way="ВКонтакте">Написать во ВКонтакте</button>' +
          '<button type="button" class="cart__chat" data-demo-way="По почте">По почте</button>' +
        '</span><span class="cart__chat-copied" role="status" hidden></span>' +
      '</div>' +
    '</div>';
  document.body.appendChild(root);

  // Отмена: 5 секунд после удаления товара (крестиком или минусом до нуля) его можно вернуть.
  // Предупреждение стоит на месте товара, у каждого товара свой таймер.
  var UNDO_SECONDS = 5;
  var undos = {}; // id товара -> { qty, index, left, timer }

  function clearUndo(id) {
    if (!undos[id]) return;
    clearInterval(undos[id].timer);
    delete undos[id];
  }
  function clearAllUndo() { Object.keys(undos).forEach(clearUndo); }

  function startUndo(id, qty, index) {
    var old = rowById(id);
    var entry = { qty: qty, index: index, left: UNDO_SECONDS, custom: old && old.custom };
    undos[id] = entry;
    entry.timer = setInterval(function () {
      entry.left -= 1;
      if (entry.left <= 0) {
        clearUndo(id);
        render();
        return;
      }
      var label = root.querySelector('[data-undo-time="' + id + '"]');
      if (label) label.textContent = entry.left;
    }, 1000);
  }

  function restoreUndo(id) {
    var entry = undos[id];
    if (!entry) return;
    clearUndo(id);
    var items = read();
    var row = items.filter(function (i) { return i.id === id; })[0];
    if (row) row.qty = entry.qty;
    else items.splice(Math.min(entry.index, items.length), 0, entry.custom ? { id: id, qty: entry.qty, custom: entry.custom } : { id: id, qty: entry.qty });
    write(items);
  }

  function undoHtml(id) {
    return '<div class="cart__undo" role="status">' +
      '<span>Удалили случайно?</span>' +
      '<button type="button" data-undo="' + id + '">Вернуть</button>' +
      '<b data-undo-time="' + id + '">' + undos[id].left + '</b>' +
    '</div>';
  }
  var elItems = root.querySelector('[data-cart-items]');
  var elEmpty = root.querySelector('[data-cart-empty]');
  var form = root.querySelector('[data-cart-form]');
  var note = root.querySelector('[data-cart-note]');
  var confirmation = root.querySelector('[data-demo-confirmation]');
  var doneKey = 'larion_demo_last_order';
  var checkoutTotal = 0;
  var checkoutCertOff = 0;
  var warn = root.querySelector('[data-cart-warn]');
  var HAT_OK_KEY = 'larion_demo_hat_ok';
  function storeGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function storeSet(k, v) { try { if (v) localStorage.setItem(k, v); else localStorage.removeItem(k); } catch (e) {} }
  warn.addEventListener('click', function (e) {
    if (e.target.closest('[data-warn-ok]')) { storeSet(HAT_OK_KEY, '1'); render(); }
  });
  var tip = root.querySelector('[data-cart-tip]');
  tip.addEventListener('click', function (e) {
    if (!e.target.closest('[data-tip-no]')) return;
    try { sessionStorage.setItem('larion_demo_tip_' + tip.getAttribute('data-kind'), '1'); } catch (err) {}
    tip.hidden = true;
  });

  // первая строка названия — жирная, остальные (выбор предзаказа) — обычным мелким списком
  // из корзины — на карточку товара (заметка Леры): вариант и набор — на свой товар, предзаказ — на страницу предзаказа
  function itemUrl(id) {
    if (/^pre:/.test(id)) return 'preorder.html';
    if (/^gift:/.test(id)) { var gp = products.filter(function (x) { return x.giftcard; })[0]; return gp ? 'product.html?id=' + gp.id : 'catalog.html'; }
    return 'product.html?id=' + encodeURIComponent(/^set:/.test(id) ? id.split(':')[1] : id.split(':')[0]);
  }
  function titleHtml(t, url) {
    var lines = String(t).split('\n');
    return (url ? '<a class="cart__item-link" href="' + url + '">' + lines[0] + '</a>' : lines[0]) +(lines.length > 1 ? '<span class="cart__item-sub">' + lines.slice(1).join('<br>') + '</span>' : '');
  }
  function render() {
    var items = read();
    var count = items.reduce(function (s, i) { return s + i.qty; }, 0);
    var total = items.reduce(function (s, i) { return s + i.qty * productOf(i).price; }, 0);

    document.querySelectorAll('[data-cart-count]').forEach(function (el) {
      el.textContent = count;
      el.hidden = count === 0;
    });

    var rows = items.map(function (i) {
      var p = productOf(i);
      return { html: '<div class="cart__item" data-id="' + p.id + '">' +
        '<a class="cart__item-pic" href="' + itemUrl(i.id) + '" aria-label="Открыть товар"><img src="' + p.images[0] + '" alt=""></a>' +
        '<div class="cart__item-title">' + titleHtml(p.title, itemUrl(i.id)) + '</div>' +
        '<div class="cart__qty">' +
          '<button class="round-btn" type="button" data-dec aria-label="Меньше"><i class="ico ico--minus"></i></button>' +
          '<span>' + i.qty + '</span>' +
          '<button class="round-btn' + (i.qty >= maxQty(p) ? ' is-max' : '') + '" type="button" data-inc aria-label="Больше"><i class="ico ico--plus"></i></button>' +
        '</div>' +
        '<div class="cart__item-price">' + money(p.price * i.qty) + '</div>' +
        '<button class="round-btn round-btn--del" type="button" data-del aria-label="Удалить"><i class="ico ico--del"></i></button>' +
      '</div>' };
    });
    // Удалённые товары: предупреждение встаёт на прежнее место строки.
    Object.keys(undos).filter(function (id) {
      return !items.some(function (i) { return i.id === id; });
    }).sort(function (a, b) { return undos[a].index - undos[b].index; }).forEach(function (id) {
      rows.splice(Math.min(undos[id].index, rows.length), 0, { html: undoHtml(id) });
    });
    elItems.innerHTML = rows.map(function (r) { return r.html; }).join('');

    // Шляпы есть, а жабагочи (в том числе предзаказа с дырочкой под шляпку) нет — спрашиваем.
    var hasHat = items.some(function (i) { return productOf(i).category === 'shlyapi' || /^set:/.test(i.id); }); // в наборе шляпа уже есть
    var hasGochi = items.some(function (i) { return productOf(i).category === 'zhabagochi' || /^pre:.*:gochi:/.test(i.id); });
    if (!hasHat) storeSet(HAT_OK_KEY, '');
    warn.hidden = !hasHat || hasGochi || storeGet(HAT_OK_KEY) === '1';

    // «Может, шляпку?» к жабагочи без шляпы, «Может, коврик?» к жабке без коврика. «Нет, спасибо» — до конца визита.
    var hasMat = items.some(function (i) { return productOf(i).category === 'kovriki'; });
    var hasFrog = items.some(function (i) { var c = productOf(i).category; return c === 'zhabi' || (/^pre:/.test(i.id) && !/:gochi:/.test(i.id)); });
    var onlyMats = items.length > 0 && items.every(function (i) { return productOf(i).category === 'kovriki'; });
    var tipKind = onlyMats ? 'frog' : hasGochi && !hasHat ? 'hat' : hasFrog && !hasMat && !hasGochi ? 'mat' : '';
    var tipOff = false;
    try { tipOff = sessionStorage.getItem('larion_demo_tip_' + tipKind) === '1'; } catch (e) {}
    tip.hidden = !tipKind || tipOff;
    if (tipKind) {
      tip.setAttribute('data-kind', tipKind);
      tip.querySelector('[data-tip-text]').innerHTML = tipKind === 'frog'
        ? '<b>У вас тут только коврики, может добавим жабок?</b>'
        : tipKind === 'hat'
        ? '<b>Может, шляпку? 🎩</b> В подарок к жабагочи идёт случайная шляпка до 250 ₽, но можете выбрать и сами!'
        : '<b>Может, коврик?</b> Чтобы жопка жабки не мёрзла 🐸';
      var link = tip.querySelector('[data-tip-link]');
      link.href = 'catalog.html?cat=' + ({ frog: 'zhabi', hat: 'shlyapi', mat: 'kovriki' })[tipKind];
      link.textContent = ({ frog: 'Да, добавим жабок', hat: 'Выбрать шляпку', mat: 'Выбрать коврик' })[tipKind];
      tip.querySelector('[data-tip-no]').textContent = tipKind === 'frog' ? 'Нет, мне нужны только коврики' : 'Нет, спасибо';
    }

    elEmpty.hidden = rows.length > 0;
    // пустая корзина — заголовок «Корзина», с товарами — «Ваш заказ:» (заметка Леры: пустая была совсем без заголовка)
    root.querySelector('[data-cart-title]').textContent = rows.length ? 'Ваш заказ:' : 'Корзина';
    form.hidden = items.length === 0;
    root.querySelector('[data-cart-sum]').textContent = 'Сумма: ' + money(total);
    // итог: товары + доставка (когда выбран пункт выдачи и цена посчитана)
    // с предзаказом — приписка, что отправка после изготовления; «Другой способ» — доставку считают потом
    var other = shipWay() === 'other';
    // в корзине только сертификаты — доставки нет, они приходят на почту
    var noShip = onlyGifts(items);
    root.querySelector('[data-ship-later]').hidden = !hasPreorder(items);
    root.querySelector('[data-ship-gift]').hidden = !noShip;
    root.querySelector('[data-ship]').hidden = noShip;
    root.querySelector('[data-delivery]').hidden = other || noShip;
    root.querySelector('[data-phone-hint]').hidden = other || noShip;
    var dPrice = !other && !noShip && delivery && delivery.price != null ? delivery.price : null;
    // сертификатом оплачиваются товары (кроме самих сертификатов) и доставка
    var giftSum = items.reduce(function (s, i) { return s + (/^gift:/.test(i.id) ? i.qty * productOf(i).price : 0); }, 0);
    var certOff = cert ? Math.min(cert.balance, total - giftSum + (dPrice || 0)) : 0;
    checkoutCertOff = certOff;
    checkoutTotal = total + (dPrice || 0) - certOff;
    drawCert(certOff);
    root.querySelector('[data-cart-lines]').innerHTML =
      '<div><span>Товары</span><span>' + money(total) + '</span></div>' +
      (noShip ? '' : '<div><span>Доставка</span><span>' + (other ? 'обсудим в переписке' : dPrice != null ? money(dPrice) : 'выберите пункт') + '</span></div>') +
      (certOff ? '<div class="cart__line-cert"><span>Сертификат</span><span>−' + money(certOff) + '</span></div>' : '');
    root.querySelector('[data-cart-total]').textContent = money(checkoutTotal);
    lastGoods = items.map(function (i) { return { id: i.id, qty: i.qty }; });

    showLastDemoOrder(items);
    // Кнопки покупки: когда в корзине весь остаток, добавить ещё нельзя.
    document.querySelectorAll('[data-add]').forEach(function (btn) {
      if (btn.getAttribute('data-flash')) return;
      if (!btn.getAttribute('data-label')) btn.setAttribute('data-label', btn.textContent);
      var id = btn.getAttribute('data-add');
      var row = items.filter(function (i) { return i.id === id; })[0];
      var full = !!row && row.qty >= maxQty(productOf(row));
      btn.classList.toggle('is-full', full);
      btn.textContent = full ? 'Уже в корзине' : btn.getAttribute('data-label');
    });
    window.dispatchEvent(new Event('larion-cart-change'));
  }

  function showLastDemoOrder(items) {
    confirmation.hidden = true;
    if (items.length) return;
    var order;
    try { order = JSON.parse(storeGet(doneKey)); } catch (err) { return; }
    if (!order || Date.now() - order.at > 24 * 3600 * 1000) return;
    confirmation.querySelector('.cart__thanks').textContent = 'Спасибо! Заказ № ' + order.number + ' принят.';
    confirmation.querySelector('[data-demo-order-amount]').textContent = order.amount;
    confirmation.hidden = false;
    elEmpty.hidden = true;
  }

  confirmation.addEventListener('click', function (e) {
    var button = e.target.closest('[data-demo-way]');
    if (!button) return;
    confirmation.querySelectorAll('[data-demo-way]').forEach(function (el) {
      el.classList.toggle('is-picked', el === button);
    });
    var status = confirmation.querySelector('[role="status"]');
    status.textContent = button.dataset.demoWay + ' · сообщения в демо не отправляются.';
    status.hidden = false;
  });

  var lastFocus;
  function open() {
    lastFocus = document.activeElement;
    note.hidden = true;
    render();
    root.classList.add('is-open');
    document.body.classList.add('is-locked');
    root.querySelector('[data-cart-close]').focus();
  }
  function close() {
    clearAllUndo();
    root.classList.remove('is-open');
    document.body.classList.remove('is-locked');
    if (lastFocus) lastFocus.focus({ preventScroll: true });
  }

  root.addEventListener('click', function (e) {
    if (e.target === root || e.target.closest('[data-cart-close]')) return close();
    var undoBtn = e.target.closest('[data-undo]');
    if (undoBtn) return restoreUndo(undoBtn.getAttribute('data-undo'));
    var row = e.target.closest('.cart__item');
    if (!row) return;
    var id = row.getAttribute('data-id');
    var before = read();
    var index = before.map(function (i) { return i.id; }).indexOf(id);
    var item = before[index];
    if (e.target.closest('[data-inc]')) {
      var mx = maxQty(productOf(item));
      if (item.qty >= mx) return window.LarionSay(mx === 1 ? 'Это единственная — больше нет' : 'Больше нет: в наличии всего ' + mx + ' шт');
      setQty(id, item.qty + 1);
    }
    if (e.target.closest('[data-dec]')) {
      if (item.qty === 1) startUndo(id, 1, index);
      setQty(id, item.qty - 1);
    }
    if (e.target.closest('[data-del]')) {
      startUndo(id, item.qty, index);
      setQty(id, 0);
    }
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && root.classList.contains('is-open')) close();
  });
  document.addEventListener('click', function (e) {
    if (e.target.closest('[data-cart-open]')) open();
    var addBtn = e.target.closest('[data-add]');
    if (addBtn && addBtn.classList.contains('is-full')) {
      var fp = find(addBtn.getAttribute('data-add'));
      window.LarionSay(fp && fp.stock === 1 ? 'Она одна, и уже в вашей корзине' : 'В корзине уже всё, что есть в наличии');
      return;
    }
    if (addBtn) {
      addBtn.setAttribute('data-flash', '1');
      add(addBtn.getAttribute('data-add'));
      addBtn.textContent = 'Добавлено';
      setTimeout(function () {
        addBtn.removeAttribute('data-flash');
        render();
      }, 1100);
    }
  });

  // Телефон: страна (Россия / Беларусь / Казахстан) и маска, как на других сайтах: цифры встают в шаблон,
  // курсор остаётся там, где печатают, Backspace перед скобкой или дефисом стирает цифру, а не знак;
  // вставка «+7 912…», «8 912…», «+375 29…» понимается сама. Страна выставляется сама по выбранному пункту СДЭК.
  var phone = form.elements.phone, phoneCc = form.elements.phoneCc;
  var COUNTRIES = {
    ru: { code: '+7', len: 10, mask: '(###) ###-##-##', flag: 'ru' },
    by: { code: '+375', len: 9, mask: '(##) ###-##-##', flag: 'by' },
    kz: { code: '+7', len: 10, mask: '(###) ###-##-##', flag: 'kz' }
  };
  function phoneCountry() { return COUNTRIES[phoneCc.value] || COUNTRIES.ru; }
  function digits(v) {
    var d = v.replace(/\D/g, ''), c = phoneCountry();
    if (c.len === 10 && d.length === 11 && (d[0] === '7' || d[0] === '8')) d = d.slice(1);
    if (c.len === 9 && d.length === 12 && d.indexOf('375') === 0) d = d.slice(3);
    if (c.len === 9 && d.length === 11 && d.indexOf('80') === 0) d = d.slice(2);
    return d.slice(0, c.len);
  }
  function formatPhone(d) {
    var out = '', i = 0, m = phoneCountry().mask;
    for (var k = 0; k < m.length && i < d.length; k++) out += m[k] === '#' ? d[i++] : m[k];
    return out;
  }
  function drawCountry() {
    var c = phoneCountry();
    root.querySelector('[data-phone-code]').textContent = c.code;
    root.querySelector('[data-phone-flag]').className = 'flag flag--' + c.flag;
    phone.placeholder = c.mask.replace(/#/g, '0');
    root.querySelector('[data-phone-error]').textContent = 'Укажите номер из ' + c.len + ' цифр';
  }
  function setCountry(cc) {
    if (!COUNTRIES[cc] || phoneCc.value === cc) return;
    phoneCc.value = cc;
    drawCountry();
    phone.value = formatPhone(digits(phone.value));
  }
  phoneCc.addEventListener('change', function () { drawCountry(); phone.value = formatPhone(digits(phone.value)); phone.focus(); });
  phone.addEventListener('paste', function (e) {
    var t = (e.clipboardData || window.clipboardData).getData('text'), d = t.replace(/\D/g, '');
    if (/^\+?375/.test(t.trim()) || (d.length === 12 && d.indexOf('375') === 0)) setCountry('by');
  });
  phone.addEventListener('keydown', function (e) {
    var v = phone.value, a = phone.selectionStart, b = phone.selectionEnd;
    if (a !== b || a == null) return;
    // Backspace/Delete рядом со скобкой или дефисом — перескакиваем знак, стираем цифру
    if (e.key === 'Backspace') { var p = a; while (p > 0 && /\D/.test(v[p - 1])) p--; if (p !== a) phone.setSelectionRange(p, p); }
    if (e.key === 'Delete') { var r = a; while (r < v.length && /\D/.test(v[r])) r++; if (r !== a) phone.setSelectionRange(r, r); }
  });
  phone.addEventListener('input', function () {
    // курсор остаётся там, где печатали (заменили выделенные цифры в середине — дальше пишется там же, а не в конце)
    var raw = phone.value, caret = phone.selectionStart == null ? raw.length : phone.selectionStart;
    var all = raw.replace(/\D/g, ''), d = digits(raw);
    var before = Math.max(0, raw.slice(0, caret).replace(/\D/g, '').length - (all.length - d.length));
    var out = formatPhone(d);
    phone.value = out;
    var pos = 0, seen = 0;
    while (pos < out.length && seen < before) { if (/\d/.test(out[pos])) seen++; pos++; }
    if (document.activeElement === phone) try { phone.setSelectionRange(pos, pos); } catch (e) {}
  });

  function mark(input, ok) {
    var box = input.closest('.field') || input.closest('.consent');
    box.classList.toggle('is-invalid', !ok);
    return ok;
  }

  // Что человек уже ввёл, хранится в браузере: ушёл читать политику или в каталог, вернулся — всё на месте.
  // После успешного заказа стираем.
  var FORM_KEY = 'larion_demo_cart_form';
  var FORM_FIELDS = ['email', 'name', 'phoneCc', 'phone', 'comment'];
  try {
    var saved = JSON.parse(window.LarionDemo.memory.getItem(FORM_KEY)) || {};
    FORM_FIELDS.forEach(function (n) { if (saved[n]) form.elements[n].value = saved[n]; });
  } catch (e) {}
  drawCountry();
  form.addEventListener('input', function (e) {
    if (FORM_FIELDS.indexOf(e.target.name) === -1) return;
    var data = {};
    FORM_FIELDS.forEach(function (n) { data[n] = form.elements[n].value; });
    try { window.LarionDemo.memory.setItem(FORM_KEY, JSON.stringify(data)); } catch (err) {}
    // ошибку у поля убираем, как только его начали исправлять
    var box = e.target.closest('.field');
    if (box) box.classList.remove('is-invalid');
  });
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!window.LarionDemo.finish(form, root)) return;
    var amount = checkoutCertOff
      ? 'Сертификатом оплачено ' + money(checkoutCertOff) +
        (checkoutTotal ? ', осталось доплатить ' + money(checkoutTotal) : ' — доплачивать ничего не нужно') +
        (cert.balance > checkoutCertOff ? '. На сертификате осталось ' + money(cert.balance - checkoutCertOff) : '') + '.'
      : 'Сумма заказа ' + money(checkoutTotal) + '.';
    var at = Date.now();
    storeSet(doneKey, JSON.stringify({ number: 'DEMO-' + String(at).slice(-6), amount: amount, at: at }));
    storeSet(KEY, null);
    storeSet(CERT_KEY, null);
    window.LarionDemo.memory.removeItem(FORM_KEY);
    cert = null;
    form.reset();
    drawCountry();
    clearAllUndo();
    confirmation.querySelectorAll('[data-demo-way]').forEach(function (el) { el.classList.remove('is-picked'); });
    confirmation.querySelector('[role="status"]').hidden = true;
    render();
    confirmation.querySelector('.cart__thanks').focus();
  });

  // ---------- Доставка: пункт выдачи СДЭК (город → список пунктов; без карты, чтобы не грузить чужие скрипты)
  // Города, пункты и тарифы в демо вымышленные. Выбранный пункт хранится в браузере
  // (larion_demo_cdek). Тариф показывает демо.
  var DELIVERY_KEY = 'larion_demo_cdek';
  try { localStorage.removeItem('larion_demo_delivery'); } catch (e) {} // старый выбор пункта Яндекса
  var delivery = null, lastGoods = [];
  try { delivery = JSON.parse(localStorage.getItem(DELIVERY_KEY)) || null; } catch (e) {}
  if (delivery && (!delivery.point || !delivery.city)) delivery = null;
  var dBox = root.querySelector('[data-delivery]');
  var dPicked = root.querySelector('[data-delivery-picked]');
  var dBtn = root.querySelector('[data-delivery-open]');
  function drawDelivery() {
    dPicked.hidden = !delivery;
    if (delivery) {
      dPicked.innerHTML = '<b>' + esc(delivery.address) + '</b>' +
        (delivery.price != null ? '<span>Доставка ' + money(delivery.price) + (delivery.days ? ', до ' + delivery.days + ' дн. в пути' : '') + '</span>' : '<span>Считаю стоимость…</span>');
      dBox.classList.remove('is-invalid');
    }
    dBtn.textContent = delivery ? 'Изменить пункт' : 'Выбрать пункт выдачи';
  }
  function priceDelivery() {
    if (!delivery) return;
    delivery.price = null;
    drawDelivery();
    window.LarionDemo.request('api/delivery.php', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ city: delivery.city, items: lastGoods }) })
      .then(function (r) { return r.json(); })
      .then(function (d) { if (d && d.ok) { delivery.price = d.price; delivery.days = d.days; } })
      .catch(function () {})
      .then(function () {
        try { localStorage.setItem(DELIVERY_KEY, JSON.stringify(delivery)); } catch (e) {}
        drawDelivery();
        if (delivery && delivery.price == null) dPicked.querySelector('span').textContent = 'Не получилось посчитать доставку — попробуйте ещё раз чуть позже';
        render();
      });
  }

  var picker = null;
  // Ключ Яндекс Карт — из настроек кабинета (api/delivery.php?a=config). Скрипт карты грузится только при открытии выбора пункта.
  var mapKey = '', ymapsLoading = null;
  function loadYmaps() {
    if (!ymapsLoading) ymapsLoading = new Promise(function (ok, fail) {
      var s = document.createElement('script');
      s.src = 'https://api-maps.yandex.ru/2.1/?lang=ru_RU&apikey=' + encodeURIComponent(mapKey);
      s.onload = function () { window.ymaps.ready(function () { ok(window.ymaps); }); };
      s.onerror = fail;
      document.head.appendChild(s);
    });
    return ymapsLoading;
  }
  function api(q) {
    return window.LarionDemo.request('api/delivery.php?' + q).then(function (r) { return r.json(); }).then(function (d) {
      if (!d || !d.ok) throw new Error(d && d.error || 'Не получилось загрузить');
      return d;
    });
  }
  function openPicker() {
    if (!picker) {
      picker = document.createElement('div');
      picker.className = 'pvz';
      picker.innerHTML = '<div class="pvz__box" role="dialog" aria-label="Пункт выдачи СДЭК">' +
        '<div class="pvz__head"><b>Где удобно забрать посылку?</b><button type="button" class="pvz__close" aria-label="Закрыть">✕</button></div>' +
        '<div class="pvz__body">' +
          '<label class="field"><span>Город</span><input type="text" data-pvz-city autocomplete="off" placeholder="Начните писать: Казань"></label>' +
          '<div class="pvz__cities" data-pvz-cities></div>' +
          '<div data-pvz-step2 hidden>' +
            // карта Яндекса (если в настройках есть ключ карты), без ключа — только список
            '<div class="pvz__ymap" data-pvz-map hidden></div>' +
            '<div class="pvz__tools"><input type="search" data-pvz-filter placeholder="Улица, район или метро" aria-label="Поиск пункта">' +
            '<button type="button" class="pvz__near" data-pvz-near>Ближайшие ко мне</button></div>' +
            '<div class="pvz__list" data-pvz-list></div>' +
          '</div>' +
          '<p class="pvz__msg" data-pvz-msg hidden></p>' +
        '</div></div>';
      document.body.appendChild(picker);
      var q = function (s) { return picker.querySelector(s); };
      var cityInput = q('[data-pvz-city]'), citiesBox = q('[data-pvz-cities]'), step2 = q('[data-pvz-step2]');
      var filter = q('[data-pvz-filter]'), list = q('[data-pvz-list]'), msg = q('[data-pvz-msg]');
      var city = null, points = [], here = null, timer = 0, seq = 0;
      var mapEl = q('[data-pvz-map]'), ymap = null, om = null, shownCodes = {};
      var say = function (t) { msg.hidden = !t; msg.textContent = t || ''; };
      var dist = function (p) {
        if (!here || p.lat == null) return 0;
        var dx = (p.lon - here.lon) * Math.cos(here.lat * Math.PI / 180), dy = p.lat - here.lat;
        return Math.sqrt(dx * dx + dy * dy) * 111;
      };
      var drawPoints = function () {
        var words = filter.value.toLowerCase().split(/\s+/).filter(Boolean);
        var shown = points.filter(function (p) {
          var hay = (p.address + ' ' + p.note).toLowerCase();
          return words.every(function (w) { return hay.indexOf(w) >= 0; });
        });
        if (here) shown.sort(function (a, b) { return dist(a) - dist(b); });
        shownCodes = {};
        shown.forEach(function (p) { shownCodes[p.code] = 1; });
        if (om) om.setFilter(function (o) { return !!shownCodes[o.id]; });
        list.innerHTML = shown.slice(0, 80).map(function (p) {
          var km = here && p.lat != null ? dist(p) : null;
          return '<button type="button" class="pvz__point' + (delivery && delivery.point === p.code ? ' is-active' : '') + '" data-code="' + esc(p.code) + '">' +
            '<b>' + esc(p.address) + '</b>' + (km != null ? '<i>' + (km < 1 ? Math.round(km * 1000) + ' м' : km.toFixed(1).replace('.', ',') + ' км') + '</i>' : '') +
            (p.note ? '<span>' + esc(p.note) + '</span>' : '') + (p.time ? '<span>' + esc(p.time) + '</span>' : '') + '</button>';
        }).join('') || '<p class="pvz__msg">Ничего не нашлось — попробуйте другое слово.</p>';
      };
      var pickCity = function (c) {
        city = c; here = null;
        cityInput.value = c.name.split(',')[0];
        citiesBox.innerHTML = '';
        step2.hidden = true;
        say('Загружаю пункты выдачи…');
        api('a=points&city=' + c.code).then(function (d) {
          points = d.points;
          if (!points.length) { say('В этом городе нет пунктов СДЭК. Напишите мне — подберём, как отправить.'); return; }
          say('');
          filter.value = '';
          step2.hidden = false;
          drawMap();
          drawPoints();
        }, function (e) { say(e.message); });
      };
      cityInput.addEventListener('input', function () {
        clearTimeout(timer);
        var text = cityInput.value.trim();
        step2.hidden = true;
        if (text.length < 2) { citiesBox.innerHTML = ''; return; }
        timer = setTimeout(function () {
          var my = ++seq;
          api('a=cities&q=' + encodeURIComponent(text)).then(function (d) {
            if (my !== seq) return;
            citiesBox.innerHTML = d.cities.map(function (c, i) {
              // «Казань, городской округ Казань, Татарстан, Россия» → «Казань, Татарстан»
              var parts = c.name.replace(/, Россия$/, '').replace(/Белоруссия \(Беларусь\)/, 'Беларусь').split(', ');
              return '<button type="button" data-i="' + i + '">' + esc(parts[0] + (parts.length > 1 ? ', ' + parts[parts.length - 1] : '')) + '</button>';
            }).join('') || '<p class="pvz__msg">Такого города не нашлось</p>';
            citiesBox._cities = d.cities;
          }, function (e) { say(e.message); });
        }, 300);
      });
      citiesBox.addEventListener('click', function (e) {
        var b = e.target.closest('button[data-i]');
        if (b) pickCity(citiesBox._cities[+b.getAttribute('data-i')]);
      });
      filter.addEventListener('input', drawPoints);
      q('[data-pvz-near]').addEventListener('click', function () {
        if (!navigator.geolocation) return;
        return window.LarionSay('Демо: геолокация отключена. Выберите вымышленный пункт.');
        navigator.geolocation.getCurrentPosition(function (pos) {
          here = { lat: pos.coords.latitude, lon: pos.coords.longitude };
          if (ymap) ymap.setCenter([here.lat, here.lon], 14, { duration: 300 });
          drawPoints();
          list.scrollTop = 0;
        }, function () { say('Не получилось узнать, где вы. Найдите пункт по улице.'); }, { timeout: 10000 });
      });
      // Карта: метки пунктов (рядом стоящие собираются в кружок с числом), нажатие на метку — адрес и «Забрать здесь»
      var drawMap = function () {
        if (!mapKey) return;
        loadYmaps().then(function (ym) {
          mapEl.hidden = false;
          var withCoords = points.filter(function (p) { return p.lat != null; });
          if (!ymap) {
            ymap = new ym.Map(mapEl, { center: [withCoords[0].lat, withCoords[0].lon], zoom: 11, controls: ['zoomControl'] }); // кнопку «Открыть в Картах» не прятать — условие бесплатной карты
            om = new ym.ObjectManager({ clusterize: true, gridSize: 48 });
            om.objects.options.set({ preset: 'islands#greenDotIcon' });
            om.clusters.options.set({ preset: 'islands#darkGreenClusterIcons' });
            ymap.geoObjects.add(om);
          }
          om.removeAll();
          om.add({ type: 'FeatureCollection', features: withCoords.map(function (p) {
            return { type: 'Feature', id: p.code, geometry: { type: 'Point', coordinates: [p.lat, p.lon] },
              properties: { balloonContentBody: '<div class="pvz__balloon"><b>' + esc(p.address) + '</b>' + (p.time ? '<span>' + esc(p.time) + '</span>' : '') +
                '<button type="button" data-pvz-pick="' + esc(p.code) + '">Забрать здесь</button></div>', hintContent: esc(p.address) } };
          }) });
          om.setFilter(function (o) { return !!shownCodes[o.id] || !Object.keys(shownCodes).length; });
          if (withCoords.length > 1) ymap.setBounds(om.getBounds(), { checkZoomRange: true, zoomMargin: 30 });
          else if (withCoords.length) ymap.setCenter([withCoords[0].lat, withCoords[0].lon], 14);
          ymap.container.fitToViewport();
        }, function () { mapEl.hidden = true; });
      };
      var choose = function (code) {
        var p = points.filter(function (x) { return x.code === code; })[0];
        if (!p) return;
        delivery = { point: p.code, city: p.cityCode || city.code, cityName: city.name, address: p.city + ', ' + p.address, price: null };
        // пункт в Беларуси / Казахстане — и телефон той же страны (если номер ещё не вводили)
        if (!digits(phone.value).length && p.country) setCountry({ BY: 'by', KZ: 'kz' }[p.country] || 'ru');
        picker.hidden = true;
        if (ymap) ymap.balloon.close();
        priceDelivery();
      };
      list.addEventListener('click', function (e) {
        var b = e.target.closest('.pvz__point');
        if (b) choose(b.getAttribute('data-code'));
      });
      picker.addEventListener('click', function (e) {
        var b = e.target.closest('[data-pvz-pick]');
        if (b) choose(b.getAttribute('data-pvz-pick'));
      });
      picker.addEventListener('click', function (e) { if (e.target === picker || e.target.closest('.pvz__close')) picker.hidden = true; });
      document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && picker && !picker.hidden) picker.hidden = true; });
      // уже выбирали — сразу открываем пункты того же города (после того как узнали, есть ли ключ карты)
      api('a=config').then(function (d) { mapKey = d.mapKey || ''; }, function () {}).then(function () {
        if (delivery && delivery.cityName) pickCity({ code: delivery.city, name: delivery.cityName });
      });
      picker._focus = function () { if (!city) cityInput.focus(); };
    }
    picker.hidden = false;
    picker._focus();
  }
  dBtn.addEventListener('click', openPicker);
  drawDelivery();

  // В корзине есть предзаказ (id начинается с «pre:») — доставку оформляем потом, когда жабка будет готова
  function hasPreorder(items) { return items.some(function (i) { return /^pre:/.test(i.id); }); }
  function onlyGifts(items) { return items.length > 0 && items.every(function (i) { return /^gift:/.test(i.id); }); }

  // ---------- Оплата подарочным сертификатом. Номер проверяет сервер (api/cert.php), в браузере помним номер и остаток.
  var CERT_KEY = 'larion_demo_cert';
  var cert = null;
  try { cert = JSON.parse(localStorage.getItem(CERT_KEY)) || null; } catch (e) {}
  function drawCert(off) {
    var on = root.querySelector('[data-cert-on]');
    root.querySelector('[data-cert-open]').hidden = !!cert || !root.querySelector('[data-cert-form]').hidden;
    if (cert) root.querySelector('[data-cert-form]').hidden = true;
    on.hidden = !cert;
    if (cert) on.innerHTML = '<div><b>Сертификат ' + esc(cert.code) + '</b><span>' + (off ? 'Демо-вычет ' + money(off) + ', на нём останется ' + money(cert.balance - off) : 'На нём ' + money(cert.balance)) + '</span></div>' +
      '<button type="button" class="round-btn" data-cert-off aria-label="Убрать сертификат"><i class="ico ico--del"></i></button>';
  }
  root.addEventListener('click', function (e) {
    if (e.target.closest('[data-cert-open]')) {
      root.querySelector('[data-cert-form]').hidden = false;
      root.querySelector('[data-cert-open]').hidden = true;
      root.querySelector('[data-cert-input]').focus();
    }
    if (e.target.closest('[data-cert-off]')) { cert = null; try { localStorage.removeItem(CERT_KEY); } catch (err) {} render(); }
    var ap = e.target.closest('[data-cert-apply]');
    if (ap) {
      var code = root.querySelector('[data-cert-input]').value.trim();
      if (!code) return window.LarionSay('Введите номер сертификата — он на картинке, например LAR-7K4P-92XM');
      ap.disabled = true;
      window.LarionDemo.request('api/cert.php?code=' + encodeURIComponent(code)).then(function (r) { return r.json(); }).then(function (d) {
        if (!d.ok) return window.LarionSay(d.error || 'Не получилось проверить сертификат');
        cert = { code: d.code, balance: d.balance };
        try { localStorage.setItem(CERT_KEY, JSON.stringify(cert)); } catch (err) {}
        render();
      }, function () { window.LarionSay('Не получилось проверить сертификат — попробуйте ещё раз'); }).then(function () { ap.disabled = false; });
    }
  });
  root.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && e.target.closest('[data-cert-input]')) { e.preventDefault(); root.querySelector('[data-cert-apply]').click(); }
  });
  // Способ доставки: СДЭК (по умолчанию) или «Другой способ — договоримся». Помним выбор в браузере.
  var WAY_KEY = 'larion_demo_ship_way';
  function shipWay() { var r = form.querySelector('input[name=shipWay]:checked'); return r ? r.value : 'cdek'; }
  try { if (localStorage.getItem(WAY_KEY) === 'other') form.querySelector('input[name=shipWay][value=other]').checked = true; } catch (e) {}
  form.addEventListener('change', function (e) {
    if (e.target.name !== 'shipWay') return;
    try { localStorage.setItem(WAY_KEY, shipWay()); } catch (err) {}
    dBox.classList.remove('is-invalid');
    render();
  });
  // старый выбор службы доставки из корзины больше не нужен
  try { localStorage.removeItem('larion_demo_ship'); } catch (e) {}
  // состав корзины поменялся — вес посылки другой, пересчитываем доставку
  var lastGoodsKey = '';
  window.addEventListener('larion-cart-change', function () {
    var key = JSON.stringify(lastGoods);
    if (key !== lastGoodsKey) { lastGoodsKey = key; if (delivery && lastGoods.length) priceDelivery(); }
  });

  render();
  // Сколько штук товара уже в корзине (0 — нет).
  function qtyOf(id) { var row = rowById(id); return row ? row.qty : 0; }
  window.LarionCart = { add: add, canAdd: canAdd, qtyOf: qtyOf, open: open, money: money, refresh: render };
})();
