// Предзаказ: галерея настоящих фото. Покупатель выбирает позу, мордочку и окрас, а Лера лепит жабку по этим фото.
// Ничего не вырезается и не склеивается — все картинки это обычные фото (фон оставлен).
// Картинки лежат в assets/img/preorder/.
//
// ПОЗЫ (poses) открываются карточкой, как товар в каталоге. text — описание (HTML, как в каталоге); more — ещё фото (например, со спины) и видео .mp4: more: ['assets/img/preorder/pose-sit-back.webp'];
//   option — свой выбор к позе, отдельным шагом в галерее (клеточки пледа, что в лапке у кокетки, экран квакбука).
//   face: [x, y, увеличение] — где на фото позы мордочка (в процентах), для плитки «Как на фото позы» в «Мордочке».
//   lookSwitch — переключатель «Взгляд в экран» у квакбука.
// photo — фото жабки в позе, кадр 3:4 для плитки; full — всё фото целиком (открывается во весь экран, если нет — открывается photo); price — цена в рублях; noGochi: true — жабагочи для этой позы не делается.
// МОРДОЧКИ (faces): photo — фото мордочки крупно (кадр с глазами и ротиком), full — всё фото целиком (открывается по лупе).
// ОКРАСЫ (colors): swatch — кусочек глазури для кнопки, photo — фото жабки в этом окрасе целиком (открывается по лупе).
// В «Мордочке» и «Окрасе» первым вариантом всегда идёт «Как на фото» — как у выбранной позы.
//
// Чтобы добавить новое: положите фото в assets/img/preorder/ и допишите строку в нужный список.
window.LARION_PREORDER = {
  email: 'demo@example.invalid',
  gochiExtra: 700, // доплата за жабагочи (дырочка под шляпку)
  poses: [
    { id: 'sit', title: 'Сидит', price: 1600, face: [50, 42, 1.5], photo: 'assets/img/preorder/pose-sit.webp', full: 'assets/img/preorder/pose-sit-full.webp', more: ['assets/img/preorder/pose-sit-back.webp'],
      text: 'Самая классическая жабка<br /><br /><span class=\"small\">Материал фигурки: керамическая масса, высокотемпературные глазури.</span><br /><span class=\"small\">Размер фигурки: 2х3см.</span><br /><span class=\"small\">Вес фигурки: 30гр.</span><br /><span class=\"small\">Товар 14+</span>'
    },
    { id: 'witch', title: 'Ведьма для колечек', price: 2500, face: [50, 62, 1.8], noGochi: true, photo: 'assets/img/preorder/pose-witch.webp', full: 'assets/img/preorder/pose-witch-full.webp', more: ['assets/img/preorder/pose-witch-back.webp'],
      text: 'Жабка с&nbsp;длиииииииииннной шляпой&nbsp;— подставка под&nbsp;колечки! Будет хранить ваши украшения от&nbsp;кражи домовым и&nbsp;от&nbsp;сглаза<br />Шляпа не&nbsp;снимается.<br /><br /><span class=\"small\">Материал фигурки: керамическая масса, высокотемпературные глазури.</span><br /><span class=\"small\">Размер фигурки: 2х3см.</span><br /><span class=\"small\">Вес фигурки: 30гр.</span><br /><span class=\"small\">Товар 14+</span>'
    },
    { id: 'stand', title: 'Стоит', price: 1600, face: [50, 43, 1.6], photo: 'assets/img/preorder/pose-stand.webp', full: 'assets/img/preorder/pose-stand-2.webp', more: ['assets/img/preorder/pose-stand-3.webp'],
      text: 'Жабёнок уверенно стоит на&nbsp;четырёх лапках<br /><br /><span class=\"small\">Материал фигурки: керамическая масса, высокотемпературные глазури.</span><br /><span class=\"small\">Размер фигурки: 2х3см.</span><br /><span class=\"small\">Вес фигурки: 30гр.</span><br /><span class=\"small\">Товар 14+</span>'
    },
    { id: 'antistress', title: 'Антистресс', price: 1700, face: [51, 58, 1.8], noGochi: true, photo: 'assets/img/preorder/pose-antistress.webp', full: 'assets/img/preorder/pose-antistress-full.webp', more: ['assets/img/preorder/pose-antistress-back.webp'],
      text: 'Жабка на&nbsp;брелочке, можно гладить её по&nbsp;пупыркам большим пальцем<br /><br /><span class=\"small\">Материал фигурки: керамическая масса, высокотемпературные глазури.</span><br /><span class=\"small\">Размер фигурки: 2х3см.</span><br /><span class=\"small\">Вес фигурки: 30гр.</span><br /><span class=\"small\">Товар 14+</span>',
      // приписка под окрасом, если выбран один из этих окрасов
      colorNotes: [
        { colors: ['mint', 'apple', 'baked', 'blueberry', 'chupik'], text: 'Этот окрас может быть не очень приятным на ощупь из-за крапинок, но вы хозяин-барин' },
        { colors: ['cucumber'], text: 'Блииин, самый приятный на ощупь окрас! Он как будто бархатный' }
      ]
    },
    { id: 'sleep', title: 'Спит', price: 1600, face: [35, 56, 2], noGochi: true, photo: 'assets/img/preorder/pose-sleep.webp', full: 'assets/img/preorder/pose-sleep-full.webp', more: ['assets/img/preorder/pose-sleep-back.webp'],
      text: 'Жабёнок уснул. Свернулся в&nbsp;клубочек и&nbsp;подложил лапку под&nbsp;голову 🤫<br />Станет отличным чайным другом!<br />Мне нравится класть его в&nbsp;разные уютные места, можно даже на&nbsp;даче спрятать)<br /><br /><span class=\"small\">Материал фигурки: керамическая масса, высокотемпературные глазури.</span><br /><span class=\"small\">Размер фигурки: 2х3см.</span><br /><span class=\"small\">Вес фигурки: 30гр.</span><br /><span class=\"small\">Товар 14+</span>'
    },
    { id: 'plaid', title: 'В пледе с кофе', price: 1800, face: [52, 40, 2], photo: 'assets/img/preorder/pose-plaid.webp', more: ['assets/img/preorder/pose-plaid-back.webp'],
      text: 'Жабка в&nbsp;тёплом пледике попивает кофеёк (или чай)<br /><br /><span class=\"small\">Материал фигурки: керамическая масса, высокотемпературные глазури.</span><br /><span class=\"small\">Размер фигурки: 2х3см.</span><br /><span class=\"small\">Вес фигурки: 30гр.</span><br /><span class=\"small\">Товар 14+</span>',
      // узор пледа: фото готовых пледов (первый — как на фото позы); full — фото целиком по лупе
      option: { title: 'Узор пледа', items: [
        { id: 'photo', title: 'Как на фото', image: 'assets/img/preorder/plaid-photo.webp', full: 'assets/img/preorder/pose-plaid-back.webp' },
        { id: 'hearts', title: 'Сердечки', image: 'assets/img/preorder/plaid-hearts.webp', full: 'assets/img/preorder/plaid-hearts-full.webp' },
        { id: 'red', title: 'Красные', image: 'assets/img/preorder/plaid-red.webp', full: 'assets/img/preorder/plaid-red-full.webp' },
        { id: 'orange', title: 'Оранжевые', image: 'assets/img/preorder/plaid-orange.webp', full: 'assets/img/preorder/plaid-orange-full.webp' },
        { id: 'yellow', title: 'Жёлтые', image: 'assets/img/preorder/plaid-yellow.webp', full: 'assets/img/preorder/plaid-yellow-full.webp' },
        { id: 'green', title: 'Зелёные', image: 'assets/img/preorder/plaid-green.webp', full: 'assets/img/preorder/plaid-green-full.webp' },
        { id: 'blue', title: 'Голубые', image: 'assets/img/preorder/plaid-blue.webp', full: 'assets/img/preorder/plaid-blue-full.webp' },
        { id: 'lilac', title: 'Сиреневые', image: 'assets/img/preorder/plaid-lilac.webp', full: 'assets/img/preorder/plaid-lilac-full.webp' }
      ] }
    },
    { id: 'kvakbuk', title: 'За квакбуком', price: 2200, face: [45, 28, 1.6], photo: 'assets/img/preorder/pose-kvakbuk.webp', full: 'assets/img/preorder/pose-kvakbuk-full.webp', more: ['assets/img/preorder/pose-kvakbuk-mac.webp', 'assets/img/preorder/pose-kvakbuk-win.webp', 'assets/img/preorder/pose-kvakbuk-wb.webp', 'assets/img/preorder/pose-kvakbuk-table.webp', 'assets/img/preorder/pose-kvakbuk-sims.webp', 'assets/img/preorder/pose-kvakbuk-netflix.webp'],
      text: 'Жабка за&nbsp;квакбуком. Экран квакбука можно выбрать<br /><br /><span class=\"small\">Материал фигурки: керамическая масса, высокотемпературные глазури, деколи.</span><br /><span class=\"small\">Размер фигурки: 2х3см.</span><br /><span class=\"small\">Вес фигурки: 30гр.</span><br /><span class=\"small\">Товар 14+</span>',
      // переключатель справа: жабка смотрит в экран, а не на вас
      lookSwitch: { title: 'Взгляд в экран', note: 'жабка смотрит в квакбук, а не на вас' },
      // что на экране квакбука (первый — по умолчанию)
      option: { title: 'Экран квакбука', items: [
        { id: 'mac', title: 'Мак', extra: 100, image: 'assets/img/preorder/screen-mac.webp' },
        { id: 'win', title: 'Винда', extra: 100, image: 'assets/img/preorder/screen-win.webp' },
        { id: 'wb', title: 'ВБ', extra: 100, image: 'assets/img/preorder/screen-wb.webp' },
        { id: 'table', title: 'Таблица', extra: 100, image: 'assets/img/preorder/screen-table.webp' },
        { id: 'sims', title: 'Симс', extra: 100, image: 'assets/img/preorder/screen-sims.webp' },
        { id: 'netflix', title: 'Нетфликс', extra: 100, image: 'assets/img/preorder/screen-netflix.webp' },
        { id: 'black', title: 'Чёрный', color: '#1d1d1d' },
        { id: 'white', title: 'Белый', color: '#fff' }
      ] }
    },
    { id: 'book', title: 'С книгой', price: 2300, face: [44, 37, 1.6], photo: 'assets/img/preorder/pose-book.webp', full: 'assets/img/preorder/pose-book-full.webp', more: ['assets/img/preorder/pose-book-2.webp', 'assets/img/preorder/pose-book-3.webp', 'assets/img/preorder/pose-book-4.webp'],
      text: '<span class=\"small\">Материал фигурки: керамическая масса, высокотемпературные глазури.</span><br /><span class=\"small\">Размер фигурки: 2х3см.</span><br /><span class=\"small\">Вес фигурки: 30гр.</span><br /><span class=\"small\">Товар 14+</span>',
      // переключатель справа: жабка смотрит в книгу, а не на вас
      lookSwitch: { title: 'Взгляд в книгу', note: 'жабка смотрит в книгу, а не на вас' },
      // цвет книги: кусочки клеточек с фото пледов
      option: { title: 'Цвет книги', items: [
        { id: 'photo', title: 'Как на фото', image: 'assets/img/preorder/pose-book.webp' },
        { id: 'pink', title: 'Розовая', image: 'assets/img/preorder/book-photo.webp' },
        { id: 'red', title: 'Красная', image: 'assets/img/preorder/book-red.webp' },
        { id: 'orange', title: 'Оранжевая', image: 'assets/img/preorder/book-orange.webp' },
        { id: 'yellow', title: 'Жёлтая', image: 'assets/img/preorder/book-yellow.webp' },
        { id: 'green', title: 'Зелёная', image: 'assets/img/preorder/book-green.webp' },
        { id: 'blue', title: 'Голубая', image: 'assets/img/preorder/book-blue.webp' },
        { id: 'lilac', title: 'Сиреневая', image: 'assets/img/preorder/book-lilac.webp' }
      ] }
    },
    { id: 'zhapuzik', title: 'Жапузик', price: 1600, face: [55, 40, 2], noGochi: true, photo: 'assets/img/preorder/pose-zhapuzik.webp', full: 'assets/img/preorder/pose-zhapuzik-full.webp', more: ['assets/img/preorder/pose-zhapuzik-back.webp'],
      text: 'Жабка для любителей глянцевых гладких поверхностей! Гладить большим пальцем по&nbsp;пузику! Удобно лежит в&nbsp;руке, и&nbsp;нет никаких лишних деталей.<br />Немного шершавые лапки (потому что стояла на&nbsp;них, она буквально держала планку в&nbsp;печи 22 часа. Это мировой рекорд среди жаб в&nbsp;суровых условиях при температуре 1200 градусов!)<br /><br /><span class=\"small\">Материал фигурки: керамическая масса, высокотемпературные глазури.</span><br /><span class=\"small\">Размер фигурки: 2х3см.</span><br /><span class=\"small\">Вес фигурки: 30гр.</span><br /><span class=\"small\">Товар 14+</span>'
    },
    { id: 'fart', title: 'Жабка-пердушка', price: 2000, face: [51, 62, 2.4], noGochi: true, photo: 'assets/img/preorder/pose-fart.webp', full: 'assets/img/preorder/pose-fart-full.webp', more: ['assets/img/preorder/pose-fart.mp4', 'assets/img/preorder/pose-fart-2.webp', 'assets/img/preorder/pose-fart-3.webp', 'assets/img/preorder/pose-fart-4.webp'],
      text: 'Опускаете аккуратно жабку на&nbsp;дно кружки и&nbsp;заливаете КИПЯТКОМ. Это не&nbsp;живодерство, не&nbsp;беспокойтесь. Она будет пускать пузырики))<br />Можно залить и&nbsp;супер горячим чаем. Чем горячее вода&nbsp;— тем больше пузырьков.<br />Напердит вам в&nbsp;чай. Дорого. 😂<br />Может стать отличным чайным другом!<br /><br /><span class=\"small\">Материал фигурки: керамическая масса, высокотемпературные глазури.</span><br /><span class=\"small\">Размер фигурки: 2х3см.</span><br /><span class=\"small\">Вес фигурки: 30гр.</span><br /><span class=\"small\">Товар 14+</span>'
    },
    { id: 'pebble', title: 'Камушек', price: 1600, face: [50, 52, 1.6], photo: 'assets/img/preorder/pose-pebble.webp', full: 'assets/img/preorder/pose-pebble-full.webp', more: ['assets/img/preorder/pose-pebble-back.webp'],
      text: 'Оч удобная жабка для ношения в&nbsp;кармане и&nbsp;держания постоянно в&nbsp;руках<br /><br /><span class=\"small\">Материал фигурки: керамическая масса, высокотемпературные глазури.</span><br /><span class=\"small\">Размер фигурки: 2х3см.</span><br /><span class=\"small\">Вес фигурки: 30гр.</span><br /><span class=\"small\">Товар 14+</span>'
    },
    { id: 'boss', title: 'Босс', price: 1800, face: [50, 44, 1.6], photo: 'assets/img/preorder/pose-boss.webp', full: 'assets/img/preorder/pose-boss-full.webp',
      text: 'Важная персона в&nbsp;чёрном галстуке, вы&nbsp;посмотрите!<br /><br /><span class=\"small\">Материал фигурки: керамическая масса, высокотемпературные глазури.</span><br /><span class=\"small\">Размер фигурки: 2х3см.</span><br /><span class=\"small\">Вес фигурки: 30гр.</span><br /><span class=\"small\">Товар 14+</span>'
    },
    { id: 'koketka', title: 'Кокетка', price: 3000, face: [38, 52, 2], noGochi: true, photo: 'assets/img/preorder/pose-koketka.webp', full: 'assets/img/preorder/pose-koketka-full.webp', more: ['assets/img/preorder/pose-koketka-back.webp'],
      text: 'Жабка кокетка 😉<br />Машет вам лапкой, в&nbsp;которой цветочек (он идёт в&nbsp;комплекте). Можно выбрать и&nbsp;другую «шляпку», например звёздочку 🌟<br />Победила в&nbsp;конкурсе «самая лучшая жабья попа 2026»<br /><br /><span class=\"small\">Материал фигурки: керамическая масса, высокотемпературные глазури.</span><br /><span class=\"small\">Размер фигурки: 2х3см.</span><br /><span class=\"small\">Вес фигурки: 30гр.</span><br /><span class=\"small\">Товар 14+</span>',
      // что в лапке: картинки вырезаны из цветочков куста и шляпы-луны; у сердечка пока значок, фото Лера пришлёт
      option: { title: 'В лапке', items: [
        { id: 'flower', title: 'Цветочек', image: 'assets/img/preorder/koketka-flower.png' },
        { id: 'star', title: 'Звёздочка', image: 'assets/img/preorder/koketka-star.png' },
        { id: 'heart', title: 'Сердечко', image: 'assets/img/preorder/koketka-heart.png' },
        { id: 'moon', title: 'Луна', image: 'assets/img/preorder/koketka-moon.png' }
      ] }
    }
  ],
  faces: [
    { id: 'smile', title: 'Улыбка', photo: 'assets/img/preorder/face-smile.webp', full: 'assets/img/preorder/face-smile-full.webp' },
    { id: 'angry', title: 'Злая', photo: 'assets/img/preorder/face-angry.webp', full: 'assets/img/preorder/face-angry-full.webp' },
    { id: 'nyashka', title: 'Няшка', photo: 'assets/img/preorder/face-nyashka.webp', full: 'assets/img/preorder/face-nyashka-full.webp' },
    { id: 'grumpy', title: 'Хмурая', photo: 'assets/img/preorder/face-grumpy.webp', full: 'assets/img/preorder/face-grumpy-full.webp' },
    { id: 'displeased', title: 'Недовольная', photo: 'assets/img/preorder/face-displeased.webp', full: 'assets/img/preorder/face-displeased-full.webp' },
    { id: 'happy', title: 'Счастливая', photo: 'assets/img/preorder/face-happy.webp', full: 'assets/img/preorder/face-happy-full.webp' },
    { id: 'silly', title: 'Глупая с щёчками', photo: 'assets/img/preorder/face-silly.webp', full: 'assets/img/preorder/face-silly-full.webp' },
    { id: 'tongue', title: 'Язычок', photo: 'assets/img/preorder/face-tongue.webp', full: 'assets/img/preorder/face-tongue-full.webp' },
    { id: 'wow', title: 'Удивлённая', photo: 'assets/img/preorder/face-wow.webp', full: 'assets/img/preorder/face-wow-full.webp' },
    { id: 'sleep', title: 'Закрытые глазки', photo: 'assets/img/preorder/face-sleep.webp', full: 'assets/img/preorder/pose-sleep-full.webp' }
  ],
  colors: [
    { id: 'classic', title: 'Классика', swatch: 'assets/img/preorder/glaze-classic.webp', photo: 'assets/img/preorder/glaze-classic-full.webp' },
    { id: 'baked', title: 'Печёная классика', swatch: 'assets/img/preorder/glaze-baked.webp', photo: 'assets/img/preorder/glaze-baked-full.webp' },
    { id: 'blueberry', title: 'Черничный йогурт', swatch: 'assets/img/preorder/glaze-blueberry.webp', photo: 'assets/img/preorder/glaze-blueberry-full.webp' },
    { id: 'trocadero', title: 'Трокадеро', swatch: 'assets/img/preorder/glaze-trocadero.webp', photo: 'assets/img/preorder/glaze-trocadero-full.webp' },
    { id: 'lemon', title: 'Лимон', swatch: 'assets/img/preorder/glaze-lemon.webp', photo: 'assets/img/preorder/glaze-lemon-full.webp' },
    { id: 'mint', title: 'Ментол', swatch: 'assets/img/preorder/glaze-mint.webp', photo: 'assets/img/preorder/glaze-mint-full.webp' },
    { id: 'dragon', title: 'Драгон фрут', swatch: 'assets/img/preorder/glaze-dragon.webp', photo: 'assets/img/preorder/glaze-dragon-full.webp' },
    { id: 'apple', title: 'Яблоко', swatch: 'assets/img/preorder/glaze-apple.webp', photo: 'assets/img/preorder/glaze-apple-full.webp' },
    { id: 'ice', title: 'Лёд', swatch: 'assets/img/preorder/glaze-ice.webp', photo: 'assets/img/preorder/glaze-ice-full.webp' },
    { id: 'nebula', title: 'Туманность', swatch: 'assets/img/preorder/glaze-nebula.webp', photo: 'assets/img/preorder/glaze-nebula-full.webp' },
    { id: 'chupik', title: 'Чупик', swatch: 'assets/img/preorder/glaze-chupik.webp', photo: 'assets/img/preorder/glaze-chupik-full.webp' },
    { id: 'snow', title: 'Снег', swatch: 'assets/img/preorder/glaze-snow.webp', photo: 'assets/img/preorder/glaze-snow-full.webp' },
    { id: 'cucumber', title: 'Огурец', swatch: 'assets/img/preorder/glaze-cucumber.webp', photo: 'assets/img/preorder/glaze-cucumber-full.webp' },
    { id: 'forest', title: 'Лесная тропинка', swatch: 'assets/img/preorder/glaze-forest.webp', photo: 'assets/img/preorder/glaze-forest-full.webp' }
  ]
};
