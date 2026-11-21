// Каталог сайта: категории и товары. Правьте в кабинете мастера (admin/) или здесь.
// stock: null - без ограничения, число - сколько штук можно купить. hidden: true - товар скрыт с сайта.
// У категорий descr — описание раздела, оно показывается в каталоге над карточками.
window.LARION_DATA = {
    "preorderOpen": true,
    "categories": [
        {
            "slug": "zhabagochi",
            "descr": "Жабагочи — это как тамагочи: им можно менять шляпки, ухаживать за ними, садить на разные коврики, втыкать цветочки сверху и ваще что угодно",
            "title": "Жабагочи",
            "image": "assets/img/categories/zhabagochi.webp",
            "menuIcon": "assets/img/menu/1.png"
        },
        {
            "slug": "shlyapi",
            "descr": "Тут у нас шляпки для жабагочи, обычным жабам не налезут",
            "title": "Шляпы",
            "image": "assets/img/categories/shlyapi.jpg",
            "menuIcon": "assets/img/menu/4.png"
        },
        {
            "slug": "zhabi",
            "descr": "Жабы не обладают способностью носить шляпы, но такие же милые!",
            "title": "Жабы",
            "image": "assets/img/categories/zhabi.webp",
            "menuIcon": "assets/img/menu/2.png"
        },
        {
            "slug": "kovriki",
            "descr": "Коврики для жабкиных попок! Чтобы не мёрзли",
            "title": "Коврики",
            "image": "assets/img/categories/kovriki.webp",
            "menuIcon": "assets/img/menu/3.png"
        },
        {
            "slug": "antistress",
            "descr": "Чиловые чувачки для наглаживания большим пальцем",
            "title": "Антистресс",
            "image": "assets/img/categories/antistress.webp",
            "menuIcon": "assets/img/menu/5.png"
        },
        {
            "slug": "figurki",
            "descr": "Фигурки — это всякое разное и не жабы. Вдруг захочется чего-то новенького",
            "title": "Фигурки",
            "image": "assets/img/categories/figurki.webp",
            "menuIcon": "assets/img/menu/6.png"
        },
        {
            "slug": "pialochki",
            "descr": "Маленькие и миленькие пиалочки для самых тёплых чаепитий",
            "title": "Пиалочки",
            "image": "assets/img/categories/pialochki.webp",
            "menuIcon": "assets/img/menu/7.png"
        },
        {
            "slug": "merch",
            "descr": "Печатная продукция: открытки, наклейки, вот это всё",
            "title": "Мерч",
            "image": "assets/img/categories/merch.webp",
            "menuIcon": "assets/img/menu/8.png"
        },
        {
            "slug": "ukrasheniya",
            "descr": "Колечечки, серёжечки, подвесочки ихихи",
            "title": "Украшения",
            "image": "assets/img/categories/ukrasheniya.webp",
            "menuIcon": "assets/img/menu/9.png"
        }
    ],
    "products": [
        {
            "id": "770952406710",
            "slug": "podarochnyj-nabor",
            "title": "Подарочный набор",
            "price": 3900,
            "oldPrice": 4500,
            "stock": null,
            "category": "zhabagochi",
            "descr": "Жабагочи, три цветочка, шляпка и&nbsp;мягкий коврик&nbsp;— соберите сами",
            "text": "Подарочный набор включает в&nbsp;себя:<br />• Жабагочи на&nbsp;выбор<br />• Три цветочка шляпки на&nbsp;выбор<br />• Одна шляпка до&nbsp;300&nbsp;₽<br />• Мягкий коврик ручной работы<br /><br /><span class=\"small\">Материал жабагочи, шляпки и&nbsp;цветочков: керамическая масса, высокотемпературные глазури, фехралевая проволока.</span><br /><span class=\"small\">Материал коврика: пряжа акриловая.</span><br /><span class=\"small\">Размер жабагочи: 2×3&nbsp;см.</span><br /><span class=\"small\">Размер шляпки и&nbsp;цветочков: 1&nbsp;см или меньше.</span><br /><span class=\"small\">Диаметр коврика: 5–6&nbsp;см.</span><br /><span class=\"small\">Товар 14+</span>",
            "images": [
                "assets/img/products/770952406710-cover.webp",
                "assets/img/products/672138673013-2.jpg",
                "assets/img/products/672138673013-3.jpg"
            ],
            "bundle": {
                "frogCategory": "zhabagochi",
                "flowers": {
                    "product": "559100002902",
                    "count": 3
                },
                "hatCategory": "shlyapi",
                "hatMaxPrice": 300,
                "mat": "672138673013"
            }
        },
        {
            "id": "880918449864",
            "slug": "podarochnyj-sertifikat",
            "title": "Подарочный сертификат",
            "price": 500,
            "stock": null,
            "category": "merch",
            "descr": "На&nbsp;любую сумму от&nbsp;500&nbsp;₽&nbsp;— пусть выберут жабку сами",
            "text": "Подарочный сертификат на&nbsp;любую сумму&nbsp;— для тех, кто хочет подарить жабку, но&nbsp;не&nbsp;знает, какую.<br /><br />После оплаты на&nbsp;почту придёт картинка сертификата с&nbsp;номером&nbsp;— её можно переслать или распечатать.<br />Номер вводят в&nbsp;корзине при оформлении заказа. Если заказ дороже&nbsp;— доплачивают разницу, если дешевле&nbsp;— остаток сохраняется на&nbsp;сертификате.<br /><br /><span class=\"small\">Сумма: от 500 ₽, шаг 100 ₽.</span><br /><span class=\"small\">Срок действия: 1 год.</span><br /><span class=\"small\">Можно оплатить любые товары, предзаказ и доставку.</span>",
            "images": [
                "assets/img/products/880918449864-demo.webp"
            ],
            "giftcard": {
                "min": 500,
                "step": 100,
                "max": 50000,
                "presets": [
                    1000,
                    2000,
                    3000,
                    5000
                ]
            }
        },
        {
            "id": "334602076636",
            "slug": "zhabagochi-rabotnichek",
            "title": "Жабагочи работничек",
            "price": 2200,
            "stock": 1,
            "category": "zhabagochi",
            "descr": "Жабка, которой можно менять шляпки!",
            "text": "Жабагочи — это как тамагочи, им можно менять шляпки, ухаживать за ними, садить на разные коврики, втыкать цветочки сверху и ваще что угодно!<br />В подарок идет одна случайная шляпка до 250 руб.<br /><br /><span class=\"small\">Материал фигурки: керамическая масса, высокотемпературные глазури.</span><br /><span class=\"small\">Размер фигурки: 2×3см.</span><br /><span class=\"small\">Вес фигурки: 30гр.</span><br /><span class=\"small\">Товар 14+</span><br /><br />Посмотрите, как она будет смотреться со шляпкой и ковриком <a href=\"constructor.html\">в конструкторе</a><br /><br />Смотри, что ещё есть 👇🏻",
            "images": [
                "assets/img/products/new-261112-abb4ea.webp"
            ]
        },
        {
            "id": "146011476013",
            "slug": "zhabagochi-schastlivaya",
            "title": "Жабагочи счастливая",
            "price": 2200,
            "stock": 1,
            "category": "zhabagochi",
            "descr": "Жабка, которой можно менять шляпки!",
            "text": "Жабагочи&nbsp;— это как тамагочи, им&nbsp;можно менять шляпки, ухаживать за&nbsp;ними, садить на&nbsp;разные коврики, втыкать цветочки сверху и&nbsp;ваще что угодно!<br />В&nbsp;подарок идет одна случайная шляпка до&nbsp;250&nbsp;руб. бесплатно!<br /><br /><span class=\"small\">Материал фигурки: керамическая масса, высокотемпературные глазури.</span><br /><span class=\"small\">Размер фигурки: 2×3см.</span><br /><span class=\"small\">Вес фигурки: 30гр.</span><br /><span class=\"small\">Товар 14+</span><br /><br />Посмотрите, как она будет смотреться со&nbsp;шляпкой и&nbsp;ковриком <a href=\"constructor.html\">в&nbsp;конструкторе</a><br /><br />Смотри, что ещё есть 👇🏻",
            "images": [
                "assets/img/products/146011476013-1.webp",
                "assets/img/products/146011476013-2.jpg"
            ]
        },
        {
            "id": "235460268133",
            "slug": "zhabagochi-lavanda",
            "title": "Жабагочи лаванда",
            "price": 2200,
            "stock": 1,
            "category": "zhabagochi",
            "descr": "Жабка, которой можно менять шляпки!",
            "text": "Жабка, которой можно менять шляпки!<br />Также является подставкой под благовония, веточки сухоцветов, записочки и&nbsp;всё, что&nbsp;только придумаете)))<br />В&nbsp;подарок идет одна случайная шляпка до&nbsp;250&nbsp;руб. бесплатно!<br /><br /><span class=\"small\">Материал фигурки: керамическая масса, высокотемпературные глазури.</span><br /><span class=\"small\">Размер фигурки: 2×3см.</span><br /><span class=\"small\">Вес фигурки: 30гр.</span><br /><span class=\"small\">Товар 14+</span><br /><br />Посмотрите, как она будет смотреться со&nbsp;шляпкой и&nbsp;ковриком <a href=\"constructor.html\">в&nbsp;конструкторе</a><br /><br />Смотри, что ещё есть 👇🏻",
            "images": [
                "assets/img/products/235460268133-1.webp",
                "assets/img/products/235460268133-2.jpg"
            ]
        },
        {
            "id": "749964285913",
            "slug": "zhabagochi-za-kvakbukom",
            "title": "Жабагочи за квакбуком",
            "price": 2900,
            "stock": 1,
            "category": "zhabagochi",
            "descr": "Жабка, которой можно менять шляпки!",
            "text": "Жабка, которой можно менять шляпки!<br />Также является подставкой под благовония, веточки сухоцветов, записочки и&nbsp;всё, что&nbsp;только придумаете)))<br />В&nbsp;подарок идет одна случайная шляпка до&nbsp;250&nbsp;руб. бесплатно!<br /><br /><span class=\"small\">Материал фигурки: керамическая масса, высокотемпературные глазури.</span><br /><span class=\"small\">Размер фигурки: 2×3см.</span><br /><span class=\"small\">Вес фигурки: 30гр.</span><br /><span class=\"small\">Товар 14+</span><br /><br />Посмотрите, как она будет смотреться со&nbsp;шляпкой и&nbsp;ковриком <a href=\"constructor.html\">в&nbsp;конструкторе</a><br /><br />Смотри, что ещё есть 👇🏻",
            "images": [
                "assets/img/products/749964285913-1.jpg",
                "assets/img/products/749964285913-2.jpg",
                "assets/img/products/749964285913-3.jpg"
            ]
        },
        {
            "id": "940940779973",
            "slug": "zhabka-v-plede",
            "title": "Жабка в пледе",
            "price": 1800,
            "stock": 1,
            "category": "zhabi",
            "descr": "Жабка сидит в&nbsp;тёплом пледике и&nbsp;наслаждается жизнью",
            "text": "Жабка сидит в&nbsp;тёплом пледике и&nbsp;наслаждается жизнью<br /><br /><span class=\"small\">Материал фигурки: керамическая масса, высокотемпературные глазури.</span><br /><span class=\"small\">Размер фигурки: 2х3см.</span><br /><span class=\"small\">Вес фигурки: 30гр.</span><br /><span class=\"small\">Товар 14+</span><br /><br />Чтобы жопка жабки не&nbsp;мёрзла, можно подстелить <a href=\"catalog.html?cat=kovriki\">коврик</a><br /><br />Смотри, что ещё есть 👇🏻",
            "images": [
                "assets/img/products/940940779973-1.webp",
                "assets/img/products/940940779973-2.webp"
            ]
        },
        {
            "id": "312638505133",
            "slug": "zhabka-sonya-zasonya",
            "title": "Жабка соня-засоня",
            "price": 1700,
            "stock": 1,
            "category": "zhabi",
            "descr": "Жабёнок уснул. Свернулся в&nbsp;клубочек и&nbsp;подложил лапку под&nbsp;голову",
            "text": "Жабёнок уснул. Свернулся в&nbsp;клубочек и&nbsp;подложил лапку под&nbsp;голову 🤫<br />Станет отличным чайным другом!<br />Мне нравится класть его в&nbsp;разные уютные места, можно даже на&nbsp;даче спрятать)<br /><br /><span class=\"small\">Материал фигурки: керамическая масса, высокотемпературные глазури.</span><br /><span class=\"small\">Размер фигурки: 2х3см.</span><br /><span class=\"small\">Вес фигурки: 30гр.</span><br /><span class=\"small\">Товар 14+</span><br /><br />Чтобы жопка жабки не&nbsp;мёрзла, можно подстелить <a href=\"catalog.html?cat=kovriki\">коврик</a><br /><br />Смотри, что ещё есть 👇🏻",
            "images": [
                "assets/img/products/312638505133-1.webp",
                "assets/img/products/312638505133-2.webp"
            ]
        },
        {
            "id": "480592630013",
            "slug": "zhabka-vedma-dlya-kolechek",
            "title": "Жабка ведьма для колечек",
            "price": 2500,
            "stock": 1,
            "category": "zhabi",
            "descr": "Жабка с&nbsp;длиииииииииннной шляпой&nbsp;— подставка под&nbsp;колечки!",
            "text": "Жабка с&nbsp;длиииииииииннной шляпой&nbsp;— подставка под&nbsp;колечки! Будет хранить ваши украшения от&nbsp;кражи домовым и&nbsp;от&nbsp;сглаза<br />Шляпа не&nbsp;снимается.<br /><br /><span class=\"small\">Материал фигурки: керамическая масса, высокотемпературные глазури.</span><br /><span class=\"small\">Размер фигурки: 2х4см.</span><br /><span class=\"small\">Вес фигурки: 40гр.</span><br /><span class=\"small\">Товар 14+</span><br /><br />Чтобы жопка жабки не&nbsp;мёрзла, можно подстелить <a href=\"catalog.html?cat=kovriki\">коврик</a><br /><br />Смотри, что ещё есть 👇🏻",
            "images": [
                "assets/img/products/480592630013-1.jpg",
                "assets/img/products/480592630013-2.jpg"
            ]
        },
        {
            "id": "798615472313",
            "slug": "kovrik-kuvshinka",
            "title": "Коврик кувшинка",
            "price": 100,
            "stock": 10,
            "category": "kovriki",
            "descr": "Кувшинка из&nbsp;фетра под жопку жабке, чтоб не&nbsp;мёрзла!",
            "text": "Кувшинка из&nbsp;фетра под жопку жабке, чтоб не&nbsp;мёрзла!<br /><br /><span class=\"small\">Материал: фетр.</span><br /><span class=\"small\">Диаметр: 4&nbsp;см.</span><br /><span class=\"small\">Товар 14+</span><br /><br />Смотри, что ещё есть 👇🏻",
            "images": [
                "assets/img/products/798615472313-1.jpg",
                "assets/img/products/798615472313-2.jpg"
            ]
        },
        {
            "id": "672138673013",
            "slug": "kovrik-polyanka",
            "title": "Коврик полянка",
            "price": 800,
            "stock": 15,
            "category": "kovriki",
            "descr": "Мягонькая полянка в&nbsp;виде коврика",
            "text": "Мягонькая полянка в&nbsp;виде коврика выполнена в&nbsp;технике ковровой вышивки вручную! Будет согревать жопку жабке<br /><br /><span class=\"small\">Материал: пряжа акриловая.</span><br /><span class=\"small\">Диаметр: 5–6&nbsp;см.</span><br /><span class=\"small\">Товар 14+</span><br /><br />Смотри, что ещё есть 👇🏻",
            "images": [
                "assets/img/products/672138673013-1.jpg",
                "assets/img/products/672138673013-2.jpg",
                "assets/img/products/672138673013-3.jpg"
            ]
        },
        {
            "id": "330055288513",
            "slug": "kovrik-tsvetochki",
            "title": "Коврик цветочки",
            "price": 150,
            "stock": 10,
            "category": "kovriki",
            "descr": "Коврик для жабкиной жопки! Чтоб не&nbsp;мёрзла",
            "text": "Коврик для жабкиной жопки! Чтоб не&nbsp;мёрзла<br /><br /><span class=\"small\">Материал: полиэстер.</span><br /><span class=\"small\">Размер: около 7,5×7,5&nbsp;см.</span><br /><span class=\"small\">Товар 14+</span><br /><br />Смотри, что ещё есть 👇🏻",
            "images": [
                "assets/img/products/330055288513-1.jpg",
                "assets/img/products/330055288513-2.jpg"
            ]
        },
        {
            "id": "592423008803",
            "slug": "kovrik-kapuchino",
            "title": "Коврик капучино",
            "price": 100,
            "stock": 10,
            "category": "kovriki",
            "descr": "Коврик для жабкиной жопки! Чтоб не&nbsp;мёрзла",
            "text": "Коврик для жабкиной жопки! Чтоб не&nbsp;мёрзла<br /><br /><span class=\"small\">Материал: полиэстер.</span><br /><span class=\"small\">Размер: около 5×5&nbsp;см.</span><br /><span class=\"small\">Товар 14+</span><br /><br />Смотри, что ещё есть 👇🏻",
            "images": [
                "assets/img/products/592423008803-1.jpg",
                "assets/img/products/592423008803-2.jpg"
            ]
        },
        {
            "id": "559100000146",
            "slug": "kovrik-morskoy",
            "title": "Коврик морской",
            "price": 150,
            "stock": 10,
            "category": "kovriki",
            "descr": "Коврик для жабкиной жопки! Чтоб не&nbsp;мёрзла",
            "text": "Коврик для жабкиной жопки! Чтоб не&nbsp;мёрзла<br /><br /><span class=\"small\">Материал: полиэстер.</span><br /><span class=\"small\">Размер: около 7×7&nbsp;см.</span><br /><span class=\"small\">Товар 14+</span>",
            "images": [
                "assets/img/products/559100000146-1.webp"
            ]
        },
        {
            "id": "559100000350",
            "slug": "kovrik-rozoviy-cvetok",
            "title": "Коврик розовый цветок",
            "price": 150,
            "stock": 10,
            "category": "kovriki",
            "descr": "Коврик для жабкиной жопки! Чтоб не&nbsp;мёрзла",
            "text": "Коврик для жабкиной жопки! Чтоб не&nbsp;мёрзла<br /><br /><span class=\"small\">Материал: полиэстер.</span><br /><span class=\"small\">Размер: около 7×7&nbsp;см.</span><br /><span class=\"small\">Товар 14+</span>",
            "images": [
                "assets/img/products/559100000350-1.webp"
            ]
        },
        {
            "id": "559100000433",
            "slug": "kovrik-osenniy",
            "title": "Коврик осенний",
            "price": 100,
            "stock": 10,
            "category": "kovriki",
            "descr": "Коврик для жабкиной жопки! Чтоб не&nbsp;мёрзла",
            "text": "Коврик для жабкиной жопки! Чтоб не&nbsp;мёрзла<br /><br /><span class=\"small\">Материал: полиэстер.</span><br /><span class=\"small\">Размер: около 5×5&nbsp;см.</span><br /><span class=\"small\">Товар 14+</span>",
            "images": [
                "assets/img/products/559100000433-1.webp"
            ]
        },
        {
            "id": "269627402289",
            "slug": "shlyapa-sliznyak",
            "title": "Шляпа жук",
            "price": 350,
            "stock": 2,
            "category": "shlyapi",
            "descr": "Это шляпка, она продаётся отдельно от жабки",
            "text": "Это шляпка, она продаётся ОТДЕЛЬНО ОТ ЖАБКИ<br />Жабагочи (жабки с дырочкой на голове) ищите <a href=\"/zhabagochi\">в соответствующем разделе</a><br />У шляпки есть штырёк и она вставляется в дырочку к жабке сверху<br /><br /><span class=\"small\">Материал: керамическая масса, высокотемпературные глазури, фехралевая проволока.</span><br /><span class=\"small\">Размер: 1 см или меньше.</span><br /><span class=\"small\">Товар 14+</span><br /><br />Смотри, что ещё есть 👇🏻",
            "images": [
                "assets/img/products/new-261115-585ed7.jpg",
                "assets/img/products/new-261115-354a63.jpg"
            ],
            "hidden": true
        },
        {
            "id": "559100002902",
            "slug": "shlyapa-cvetochek",
            "title": "Шляпа цветочек",
            "price": 200,
            "stock": 29,
            "category": "shlyapi",
            "descr": "Это шляпка, она продаётся отдельно от&nbsp;жабки",
            "text": "Это шляпка, она продаётся ОТДЕЛЬНО ОТ&nbsp;ЖАБКИ<br />Жабагочи (жабки с&nbsp;дырочкой на&nbsp;голове) ищите <a href=\"/zhabagochi\" style=\"color: rgb(42, 42, 42);\">в&nbsp;соответствующем разделе</a><br />У&nbsp;шляпки есть штырёк и&nbsp;она вставляется в&nbsp;дырочку к&nbsp;жабке сверху<br /><br /><span class=\"small\">Материал: керамическая масса, высокотемпературные глазури, фехралевая проволока.</span><br /><span class=\"small\">Размер: 1&nbsp;см или меньше.</span><br /><span class=\"small\">Товар 14+</span><br /><br />Смотри, что ещё есть 👇🏻",
            "optionTitle": "Цветочек",
            "options": [
                {
                    "id": "f4",
                    "title": "Ромашка",
                    "image": "assets/img/swamp/flower-4-pick.png",
                    "stock": 10
                },
                {
                    "id": "f1",
                    "title": "Клевер",
                    "image": "assets/img/swamp/flower-1-pick.png",
                    "stock": 7
                },
                {
                    "id": "f2",
                    "title": "Оранжевый",
                    "image": "assets/img/swamp/flower-2-pick.png",
                    "stock": 3
                },
                {
                    "id": "f3",
                    "title": "Красный",
                    "image": "assets/img/swamp/flower-3-pick.png",
                    "stock": 3
                },
                {
                    "id": "f5",
                    "title": "Розовый",
                    "image": "assets/img/swamp/flower-5-pick.png",
                    "stock": 2
                },
                {
                    "id": "f6",
                    "title": "Сакура",
                    "image": "assets/img/swamp/flower-6-pick.png",
                    "stock": 2
                },
                {
                    "id": "f7",
                    "title": "Сиреневый",
                    "image": "assets/img/swamp/flower-7-pick.png",
                    "stock": 2
                }
            ],
            "images": [
                "assets/img/products/559100002902-1.webp"
            ]
        },
        {
            "id": "142358658773",
            "slug": "shlyapa-muhomor",
            "title": "Шляпа мухомор",
            "price": 350,
            "stock": 5,
            "category": "shlyapi",
            "descr": "Это шляпка, она продаётся отдельно от&nbsp;жабки",
            "text": "Это шляпка, она продаётся ОТДЕЛЬНО ОТ&nbsp;ЖАБКИ<br />Жабагочи (жабки с&nbsp;дырочкой на&nbsp;голове) ищите <a href=\"/zhabagochi\" style=\"color: rgb(42, 42, 42); box-shadow: none; text-decoration: none; border-bottom: 1px solid rgb(42, 42, 42);\">в&nbsp;соответствующем разделе</a><br />У&nbsp;шляпки есть штырёк и&nbsp;она вставляется в&nbsp;дырочку к&nbsp;жабке сверху<br /><br /><span class=\"small\">Материал: керамическая масса, высокотемпературные глазури, фехралевая проволока.</span><br /><span class=\"small\">Размер: 1&nbsp;см или меньше.</span><br /><span class=\"small\">Товар 14+</span><br /><br />Смотри, что ещё есть 👇🏻",
            "images": [
                "assets/img/products/142358658773-1.webp"
            ]
        },
        {
            "id": "322615804733",
            "slug": "shlyapa-zhabka",
            "title": "Шляпа жабка",
            "price": 500,
            "stock": 5,
            "category": "shlyapi",
            "descr": "Это шляпка, она продаётся отдельно от&nbsp;жабки",
            "text": "Это шляпка, она продаётся ОТДЕЛЬНО ОТ&nbsp;ЖАБКИ<br />Жабагочи (жабки с&nbsp;дырочкой на&nbsp;голове) ищите <a href=\"/zhabagochi\" style=\"color: rgb(42, 42, 42);\">в&nbsp;соответствующем разделе</a><br />У&nbsp;шляпки есть штырёк и&nbsp;она вставляется в&nbsp;дырочку к&nbsp;жабке сверху<br /><br /><span class=\"small\">Материал: керамическая масса, высокотемпературные глазури, фехралевая проволока.</span><br /><span class=\"small\">Размер: 1&nbsp;см или меньше.</span><br /><span class=\"small\">Товар 14+</span><br /><br />Смотри, что ещё есть 👇🏻",
            "images": [
                "assets/img/products/322615804733-1.webp"
            ]
        },
        {
            "id": "853321795823",
            "slug": "shlyapa-sliznyak",
            "title": "Шляпа слизняк",
            "price": 300,
            "stock": 5,
            "category": "shlyapi",
            "descr": "Это шляпка, она продаётся отдельно от&nbsp;жабки",
            "text": "Это шляпка, она продаётся ОТДЕЛЬНО ОТ&nbsp;ЖАБКИ<br />Жабагочи (жабки с&nbsp;дырочкой на&nbsp;голове) ищите <a href=\"/zhabagochi\" style=\"color: rgb(42, 42, 42);\">в&nbsp;соответствующем разделе</a><br />У&nbsp;шляпки есть штырёк и&nbsp;она вставляется в&nbsp;дырочку к&nbsp;жабке сверху<br /><br /><span class=\"small\">Материал: керамическая масса, высокотемпературные глазури, фехралевая проволока.</span><br /><span class=\"small\">Размер: 1&nbsp;см или меньше.</span><br /><span class=\"small\">Товар 14+</span><br /><br />Смотри, что ещё есть 👇🏻",
            "images": [
                "assets/img/products/853321795823-1.webp"
            ]
        },
        {
            "id": "979047627703",
            "slug": "shlyapa-konus",
            "title": "Шляпа конус",
            "price": 400,
            "stock": 5,
            "category": "shlyapi",
            "descr": "Это шляпка, она продаётся отдельно от&nbsp;жабки",
            "text": "Это шляпка, она продаётся ОТДЕЛЬНО ОТ&nbsp;ЖАБКИ<br />Жабагочи (жабки с&nbsp;дырочкой на&nbsp;голове) ищите <a href=\"/zhabagochi\" style=\"color: rgb(42, 42, 42);\">в&nbsp;соответствующем разделе</a><br />У&nbsp;шляпки есть штырёк и&nbsp;она вставляется в&nbsp;дырочку к&nbsp;жабке сверху<br /><br /><span class=\"small\">Материал: керамическая масса, высокотемпературные глазури, фехралевая проволока.</span><br /><span class=\"small\">Размер: 1&nbsp;см или меньше.</span><br /><span class=\"small\">Товар 14+</span><br /><br />Смотри, что ещё есть 👇🏻",
            "images": [
                "assets/img/products/979047627703-1.webp"
            ]
        },
        {
            "id": "559100000599",
            "slug": "shlyapa-zvezdochka",
            "title": "Шляпа звёздочка",
            "price": 200,
            "stock": 5,
            "category": "shlyapi",
            "descr": "Это шляпка, она продаётся отдельно от&nbsp;жабки",
            "text": "Это шляпка, она продаётся ОТДЕЛЬНО ОТ&nbsp;ЖАБКИ<br />Жабагочи (жабки с&nbsp;дырочкой на&nbsp;голове) ищите <a href=\"/zhabagochi\" style=\"color: rgb(42, 42, 42);\">в&nbsp;соответствующем разделе</a><br />У&nbsp;шляпки есть штырёк и&nbsp;она вставляется в&nbsp;дырочку к&nbsp;жабке сверху<br /><br /><span class=\"small\">Материал: керамическая масса, высокотемпературные глазури, фехралевая проволока.</span><br /><span class=\"small\">Размер: 1&nbsp;см или меньше.</span><br /><span class=\"small\">Товар 14+</span><br /><br />Смотри, что ещё есть 👇🏻",
            "images": [
                "assets/img/products/559100000599-1.webp"
            ]
        },
        {
            "id": "559100000744",
            "slug": "shlyapa-chervyak",
            "title": "Шляпа червяк",
            "price": 350,
            "stock": 5,
            "category": "shlyapi",
            "descr": "Это шляпка, она продаётся отдельно от&nbsp;жабки",
            "text": "Это шляпка, она продаётся ОТДЕЛЬНО ОТ&nbsp;ЖАБКИ<br />Жабагочи (жабки с&nbsp;дырочкой на&nbsp;голове) ищите <a href=\"/zhabagochi\" style=\"color: rgb(42, 42, 42);\">в&nbsp;соответствующем разделе</a><br />У&nbsp;шляпки есть штырёк и&nbsp;она вставляется в&nbsp;дырочку к&nbsp;жабке сверху<br /><br /><span class=\"small\">Материал: керамическая масса, высокотемпературные глазури, фехралевая проволока.</span><br /><span class=\"small\">Размер: 1&nbsp;см или меньше.</span><br /><span class=\"small\">Товар 14+</span><br /><br />Смотри, что ещё есть 👇🏻",
            "images": [
                "assets/img/products/559100000744-1.webp"
            ]
        },
        {
            "id": "559100000889",
            "slug": "shlyapa-sliznyak-zheltiy",
            "title": "Шляпа слизняк жёлтый",
            "price": 300,
            "stock": 5,
            "category": "shlyapi",
            "descr": "Это шляпка, она продаётся отдельно от&nbsp;жабки",
            "text": "Это шляпка, она продаётся ОТДЕЛЬНО ОТ&nbsp;ЖАБКИ<br />Жабагочи (жабки с&nbsp;дырочкой на&nbsp;голове) ищите <a href=\"/zhabagochi\" style=\"color: rgb(42, 42, 42);\">в&nbsp;соответствующем разделе</a><br />У&nbsp;шляпки есть штырёк и&nbsp;она вставляется в&nbsp;дырочку к&nbsp;жабке сверху<br /><br /><span class=\"small\">Материал: керамическая масса, высокотемпературные глазури, фехралевая проволока.</span><br /><span class=\"small\">Размер: 1&nbsp;см или меньше.</span><br /><span class=\"small\">Товар 14+</span><br /><br />Смотри, что ещё есть 👇🏻",
            "images": [
                "assets/img/products/559100000889-1.webp"
            ]
        },
        {
            "id": "559100000971",
            "slug": "shlyapa-ulitka",
            "title": "Шляпа улитка",
            "price": 350,
            "stock": 5,
            "category": "shlyapi",
            "descr": "Это шляпка, она продаётся отдельно от&nbsp;жабки",
            "text": "Это шляпка, она продаётся ОТДЕЛЬНО ОТ&nbsp;ЖАБКИ<br />Жабагочи (жабки с&nbsp;дырочкой на&nbsp;голове) ищите <a href=\"/zhabagochi\" style=\"color: rgb(42, 42, 42);\">в&nbsp;соответствующем разделе</a><br />У&nbsp;шляпки есть штырёк и&nbsp;она вставляется в&nbsp;дырочку к&nbsp;жабке сверху<br /><br /><span class=\"small\">Материал: керамическая масса, высокотемпературные глазури, фехралевая проволока.</span><br /><span class=\"small\">Размер: 1&nbsp;см или меньше.</span><br /><span class=\"small\">Товар 14+</span><br /><br />Смотри, что ещё есть 👇🏻",
            "images": [
                "assets/img/products/559100000971-1.webp",
                "assets/img/products/559100000971-2.webp"
            ]
        },
        {
            "id": "559100001183",
            "slug": "shlyapa-dlya-zapisok",
            "title": "Шляпа для записок",
            "price": 100,
            "stock": 5,
            "category": "shlyapi",
            "descr": "Это шляпка, она продаётся отдельно от&nbsp;жабки",
            "text": "Это шляпка, она продаётся ОТДЕЛЬНО ОТ&nbsp;ЖАБКИ<br />Жабагочи (жабки с&nbsp;дырочкой на&nbsp;голове) ищите <a href=\"/zhabagochi\" style=\"color: rgb(42, 42, 42);\">в&nbsp;соответствующем разделе</a><br />У&nbsp;шляпки есть штырёк и&nbsp;она вставляется в&nbsp;дырочку к&nbsp;жабке сверху<br /><br /><span class=\"small\">Материал: металл.</span><br /><span class=\"small\">Размер: 4&nbsp;см.</span><br /><span class=\"small\">Товар 14+</span><br /><br />Смотри, что ещё есть 👇🏻",
            "images": [
                "assets/img/products/559100001183-1.webp"
            ]
        },
        {
            "id": "559100001276",
            "slug": "shlyapa-bozhya-korovka",
            "title": "Шляпа божья коровка",
            "price": 350,
            "stock": 5,
            "category": "shlyapi",
            "descr": "Это шляпка, она продаётся отдельно от&nbsp;жабки",
            "text": "Это шляпка, она продаётся ОТДЕЛЬНО ОТ&nbsp;ЖАБКИ<br />Жабагочи (жабки с&nbsp;дырочкой на&nbsp;голове) ищите <a href=\"/zhabagochi\" style=\"color: rgb(42, 42, 42);\">в&nbsp;соответствующем разделе</a><br />У&nbsp;шляпки есть штырёк и&nbsp;она вставляется в&nbsp;дырочку к&nbsp;жабке сверху<br /><br /><span class=\"small\">Материал: керамическая масса, высокотемпературные глазури, фехралевая проволока.</span><br /><span class=\"small\">Размер: 1&nbsp;см или меньше.</span><br /><span class=\"small\">Товар 14+</span><br /><br />Смотри, что ещё есть 👇🏻",
            "images": [
                "assets/img/products/559100001276-1.webp",
                "assets/img/products/559100001276-2.webp"
            ]
        },
        {
            "id": "559100001430",
            "slug": "shlyapa-pchela",
            "title": "Шляпа пчела",
            "price": 400,
            "stock": 5,
            "category": "shlyapi",
            "descr": "Это шляпка, она продаётся отдельно от&nbsp;жабки",
            "text": "Это шляпка, она продаётся ОТДЕЛЬНО ОТ&nbsp;ЖАБКИ<br />Жабагочи (жабки с&nbsp;дырочкой на&nbsp;голове) ищите <a href=\"/zhabagochi\" style=\"color: rgb(42, 42, 42);\">в&nbsp;соответствующем разделе</a><br />У&nbsp;шляпки есть штырёк и&nbsp;она вставляется в&nbsp;дырочку к&nbsp;жабке сверху<br /><br /><span class=\"small\">Материал: керамическая масса, высокотемпературные глазури, фехралевая проволока.</span><br /><span class=\"small\">Размер: 1&nbsp;см или меньше.</span><br /><span class=\"small\">Товар 14+</span><br /><br />Смотри, что ещё есть 👇🏻",
            "images": [
                "assets/img/products/559100001430-1.webp",
                "assets/img/products/559100001430-2.webp"
            ]
        },
        {
            "id": "559100001540",
            "slug": "shlyapa-kruzhka",
            "title": "Шляпа кружка",
            "price": 400,
            "stock": 5,
            "category": "shlyapi",
            "descr": "Это шляпка, она продаётся отдельно от&nbsp;жабки",
            "text": "Это шляпка, она продаётся ОТДЕЛЬНО ОТ&nbsp;ЖАБКИ<br />Жабагочи (жабки с&nbsp;дырочкой на&nbsp;голове) ищите <a href=\"/zhabagochi\" style=\"color: rgb(42, 42, 42);\">в&nbsp;соответствующем разделе</a><br />У&nbsp;шляпки есть штырёк и&nbsp;она вставляется в&nbsp;дырочку к&nbsp;жабке сверху<br /><br /><span class=\"small\">Материал: керамическая масса, высокотемпературные глазури, фехралевая проволока.</span><br /><span class=\"small\">Размер: 1&nbsp;см или меньше.</span><br /><span class=\"small\">Товар 14+</span><br /><br />Смотри, что ещё есть 👇🏻",
            "images": [
                "assets/img/products/559100001540-1.webp"
            ]
        },
        {
            "id": "559100001678",
            "slug": "shlyapa-beliy-gribok",
            "title": "Шляпа белый грибок",
            "price": 250,
            "stock": 5,
            "category": "shlyapi",
            "descr": "Это шляпка, она продаётся отдельно от&nbsp;жабки",
            "text": "Это шляпка, она продаётся ОТДЕЛЬНО ОТ&nbsp;ЖАБКИ<br />Жабагочи (жабки с&nbsp;дырочкой на&nbsp;голове) ищите <a href=\"/zhabagochi\" style=\"color: rgb(42, 42, 42);\">в&nbsp;соответствующем разделе</a><br />У&nbsp;шляпки есть штырёк и&nbsp;она вставляется в&nbsp;дырочку к&nbsp;жабке сверху<br /><br /><span class=\"small\">Материал: керамическая масса, высокотемпературные глазури, фехралевая проволока.</span><br /><span class=\"small\">Размер: 1&nbsp;см или меньше.</span><br /><span class=\"small\">Товар 14+</span><br /><br />Смотри, что ещё есть 👇🏻",
            "images": [
                "assets/img/products/559100001678-1.webp"
            ]
        },
        {
            "id": "559100001802",
            "slug": "shlyapa-ezhik",
            "title": "Шляпа ёжик",
            "price": 400,
            "stock": 5,
            "category": "shlyapi",
            "descr": "Это шляпка, она продаётся отдельно от&nbsp;жабки",
            "text": "Это шляпка, она продаётся ОТДЕЛЬНО ОТ&nbsp;ЖАБКИ<br />Жабагочи (жабки с&nbsp;дырочкой на&nbsp;голове) ищите <a href=\"/zhabagochi\" style=\"color: rgb(42, 42, 42);\">в&nbsp;соответствующем разделе</a><br />У&nbsp;шляпки есть штырёк и&nbsp;она вставляется в&nbsp;дырочку к&nbsp;жабке сверху<br /><br /><span class=\"small\">Материал: керамическая масса, высокотемпературные глазури, фехралевая проволока.</span><br /><span class=\"small\">Размер: 1&nbsp;см или меньше.</span><br /><span class=\"small\">Товар 14+</span><br /><br />Смотри, что ещё есть 👇🏻",
            "images": [
                "assets/img/products/559100001802-1.webp",
                "assets/img/products/559100001802-2.webp"
            ]
        },
        {
            "id": "559100001946",
            "slug": "shlyapa-mukha",
            "title": "Шляпа муха",
            "price": 400,
            "stock": 5,
            "category": "shlyapi",
            "descr": "Это шляпка, она продаётся отдельно от&nbsp;жабки",
            "text": "Это шляпка, она продаётся ОТДЕЛЬНО ОТ&nbsp;ЖАБКИ<br />Жабагочи (жабки с&nbsp;дырочкой на&nbsp;голове) ищите <a href=\"/zhabagochi\" style=\"color: rgb(42, 42, 42);\">в&nbsp;соответствующем разделе</a><br />У&nbsp;шляпки есть штырёк и&nbsp;она вставляется в&nbsp;дырочку к&nbsp;жабке сверху<br /><br /><span class=\"small\">Материал: керамическая масса, высокотемпературные глазури, фехралевая проволока.</span><br /><span class=\"small\">Размер: 1&nbsp;см или меньше.</span><br /><span class=\"small\">Товар 14+</span><br /><br />Смотри, что ещё есть 👇🏻",
            "images": [
                "assets/img/products/559100001946-1.webp",
                "assets/img/products/559100001946-2.webp"
            ]
        },
        {
            "id": "559100002101",
            "slug": "shlyapa-baton",
            "title": "Шляпа батон",
            "price": 300,
            "stock": 5,
            "category": "shlyapi",
            "descr": "Это шляпка, она продаётся отдельно от&nbsp;жабки",
            "text": "Это шляпка, она продаётся ОТДЕЛЬНО ОТ&nbsp;ЖАБКИ<br />Жабагочи (жабки с&nbsp;дырочкой на&nbsp;голове) ищите <a href=\"/zhabagochi\" style=\"color: rgb(42, 42, 42);\">в&nbsp;соответствующем разделе</a><br />У&nbsp;шляпки есть штырёк и&nbsp;она вставляется в&nbsp;дырочку к&nbsp;жабке сверху<br /><br /><span class=\"small\">Материал: керамическая масса, высокотемпературные глазури, фехралевая проволока.</span><br /><span class=\"small\">Размер: 1&nbsp;см или меньше.</span><br /><span class=\"small\">Товар 14+</span><br /><br />Смотри, что ещё есть 👇🏻",
            "images": [
                "assets/img/products/559100002101-1.webp"
            ]
        },
        {
            "id": "559100002237",
            "slug": "shlyapa-kolpak",
            "title": "Шляпа колпак",
            "price": 200,
            "stock": 2,
            "category": "shlyapi",
            "descr": "Это шляпка, она продаётся отдельно от&nbsp;жабки",
            "text": "Это шляпка, она продаётся ОТДЕЛЬНО ОТ&nbsp;ЖАБКИ<br />Жабагочи (жабки с&nbsp;дырочкой на&nbsp;голове) ищите <a href=\"/zhabagochi\" style=\"color: rgb(42, 42, 42);\">в&nbsp;соответствующем разделе</a><br />У&nbsp;шляпки есть штырёк и&nbsp;она вставляется в&nbsp;дырочку к&nbsp;жабке сверху<br /><br /><span class=\"small\">Материал: керамическая масса, высокотемпературные глазури, фехралевая проволока.</span><br /><span class=\"small\">Размер: 1&nbsp;см или меньше.</span><br /><span class=\"small\">Товар 14+</span><br /><br />Смотри, что ещё есть 👇🏻",
            "images": [
                "assets/img/products/559100002237-1.webp"
            ]
        },
        {
            "id": "559100002379",
            "slug": "shlyapa-yagodka",
            "title": "Шляпа ягодка",
            "price": 350,
            "stock": 1,
            "category": "shlyapi",
            "descr": "Это шляпка, она продаётся отдельно от&nbsp;жабки",
            "text": "Это шляпка, она продаётся ОТДЕЛЬНО ОТ&nbsp;ЖАБКИ<br />Жабагочи (жабки с&nbsp;дырочкой на&nbsp;голове) ищите <a href=\"/zhabagochi\" style=\"color: rgb(42, 42, 42);\">в&nbsp;соответствующем разделе</a><br />У&nbsp;шляпки есть штырёк и&nbsp;она вставляется в&nbsp;дырочку к&nbsp;жабке сверху<br /><br /><span class=\"small\">Материал: керамическая масса, высокотемпературные глазури, фехралевая проволока.</span><br /><span class=\"small\">Размер: 1&nbsp;см или меньше.</span><br /><span class=\"small\">Товар 14+</span><br /><br />Смотри, что ещё есть 👇🏻",
            "images": [
                "assets/img/products/559100002379-1.webp"
            ]
        },
        {
            "id": "559100002413",
            "slug": "shlyapa-luna",
            "title": "Шляпа луна",
            "price": 200,
            "stock": 5,
            "category": "shlyapi",
            "descr": "Это шляпка, она продаётся отдельно от жабки",
            "text": "Это шляпка, она продаётся ОТДЕЛЬНО ОТ&nbsp;ЖАБКИ<br />Жабагочи (жабки с&nbsp;дырочкой на&nbsp;голове) ищите <a href=\"/zhabagochi\" style=\"color: rgb(42, 42, 42);\">в&nbsp;соответствующем разделе</a><br />У&nbsp;шляпки есть штырёк и&nbsp;она вставляется в&nbsp;дырочку к&nbsp;жабке сверху<br /><br /><span class=\"small\">Материал: керамическая масса, высокотемпературные глазури, фехралевая проволока.</span><br /><span class=\"small\">Размер: 1&nbsp;см или меньше.</span><br /><span class=\"small\">Товар 14+</span><br /><br />Смотри, что ещё есть 👇🏻",
            "images": [
                "assets/img/products/559100002413-1.webp"
            ]
        },
        {
            "id": "559100002586",
            "slug": "shlyapa-picca",
            "title": "Шляпа пицца",
            "price": 400,
            "stock": 2,
            "category": "shlyapi",
            "descr": "Это шляпка, она продаётся отдельно от&nbsp;жабки",
            "text": "Это шляпка, она продаётся ОТДЕЛЬНО ОТ&nbsp;ЖАБКИ<br />Жабагочи (жабки с&nbsp;дырочкой на&nbsp;голове) ищите <a href=\"/zhabagochi\" style=\"color: rgb(42, 42, 42);\">в&nbsp;соответствующем разделе</a><br />У&nbsp;шляпки есть штырёк и&nbsp;она вставляется в&nbsp;дырочку к&nbsp;жабке сверху<br /><br /><span class=\"small\">Материал: керамическая масса, высокотемпературные глазури, фехралевая проволока.</span><br /><span class=\"small\">Размер: 1&nbsp;см или меньше.</span><br /><span class=\"small\">Товар 14+</span><br /><br />Смотри, что ещё есть 👇🏻",
            "images": [
                "assets/img/products/559100002586-1.webp",
                "assets/img/products/559100002586-2.webp"
            ]
        },
        {
            "id": "559100002801",
            "slug": "shlyapa-serdechko",
            "title": "Шляпа сердечко",
            "price": 200,
            "stock": 11,
            "category": "shlyapi",
            "descr": "Это шляпка, она продаётся отдельно от&nbsp;жабки",
            "text": "Это шляпка, она продаётся ОТДЕЛЬНО ОТ&nbsp;ЖАБКИ<br />Жабагочи (жабки с&nbsp;дырочкой на&nbsp;голове) ищите <a href=\"/zhabagochi\" style=\"color: rgb(42, 42, 42);\">в&nbsp;соответствующем разделе</a><br />У&nbsp;шляпки есть штырёк и&nbsp;она вставляется в&nbsp;дырочку к&nbsp;жабке сверху<br /><br /><span class=\"small\">Материал: керамическая масса, высокотемпературные глазури, фехралевая проволока.</span><br /><span class=\"small\">Размер: 1&nbsp;см или меньше.</span><br /><span class=\"small\">Товар 14+</span><br /><br />Смотри, что ещё есть 👇🏻",
            "optionTitle": "Цвет",
            "options": [
                {
                    "id": "pink",
                    "title": "Розовое",
                    "image": "assets/img/products/559100002801-1.webp",
                    "stock": 5
                },
                {
                    "id": "red",
                    "title": "Красное",
                    "image": "assets/img/products/559100002801-2.webp",
                    "stock": 4
                },
                {
                    "id": "light",
                    "title": "Светло-розовое",
                    "image": "assets/img/products/559100002801-3.webp",
                    "stock": 1
                },
                {
                    "id": "dark",
                    "title": "Тёмное",
                    "image": "assets/img/products/559100002801-4.webp",
                    "stock": 1
                }
            ],
            "images": [
                "assets/img/products/559100002801-1.webp",
                "assets/img/products/559100002801-2.webp",
                "assets/img/products/559100002801-3.webp",
                "assets/img/products/559100002801-4.webp"
            ]
        },
        {
            "id": "501426640273",
            "slug": "morskoi-sliznyak-antistress",
            "title": "Морской слизняк антистресс",
            "price": 1500,
            "stock": 1,
            "category": "antistress",
            "descr": "Фигурка для&nbsp;успокоения и&nbsp;медитации",
            "text": "Кладите между указательным и&nbsp;средним пальцем правой руки, а&nbsp;наглаживайте большим для успокоения и&nbsp;медитации на&nbsp;огромные денжыщи!<br />Можно носить как брелок с&nbsp;мягонькими поверхностями, например, на&nbsp;сумке или одежде (не&nbsp;надо на&nbsp;телефон или ключи).<br /><br /><span class=\"small\">Материал фигурки: керамическая масса, высокотемпературные глазури.</span><br /><span class=\"small\">Товар 14+</span><br /><br />Смотри, что ещё есть 👇🏻",
            "images": [
                "assets/img/products/501426640273-1.webp",
                "assets/img/products/501426640273-2.jpg",
                "assets/img/products/501426640273-3.jpg",
                "assets/img/products/501426640273-4.jpg"
            ]
        },
        {
            "id": "846538755123",
            "slug": "morskoi-sliznyak-antistress",
            "title": "Морской слизняк антистресс",
            "price": 1500,
            "stock": 1,
            "category": "antistress",
            "descr": "Фигурка для&nbsp;успокоения и&nbsp;медитации",
            "text": "Кладите между указательным и&nbsp;средним пальцем правой руки, а&nbsp;наглаживайте большим для успокоения и&nbsp;медитации на&nbsp;огромные денжыщи!<br />Можно носить как брелок с&nbsp;мягонькими поверхностями, например, на&nbsp;сумке или одежде (не&nbsp;надо на&nbsp;телефон или ключи).<br /><br /><span class=\"small\">Материал фигурки: керамическая масса, высокотемпературные глазури.</span><br /><span class=\"small\">Товар 14+</span><br /><br />Смотри, что ещё есть 👇🏻",
            "images": [
                "assets/img/products/846538755123-1.webp",
                "assets/img/products/846538755123-2.jpg"
            ]
        },
        {
            "id": "406302944543",
            "slug": "skotik-antistress",
            "title": "Скотик антистресс",
            "price": 1600,
            "stock": 1,
            "category": "antistress",
            "descr": "Фигурка для&nbsp;успокоения и&nbsp;медитации",
            "text": "Скат+котик=скотик 😄<br />Это фигурка-антистресс, которую нужно положить на&nbsp;указательный и&nbsp;средний пальцы правой руки и&nbsp;гладить большим пальцем по&nbsp;пупыркам!<br />Без брелка<br /><br /><span class=\"small\">Материал фигурки: керамическая масса, высокотемпературные глазури.</span><br /><span class=\"small\">Товар 14+</span><br /><br />Смотри, что ещё есть 👇🏻",
            "images": [
                "assets/img/products/406302944543-1.jpg",
                "assets/img/products/406302944543-2.webp",
                "assets/img/products/406302944543-3.jpg",
                "assets/img/products/406302944543-4.jpg"
            ]
        },
        {
            "id": "959892764723",
            "slug": "gnoms-nedovolnii",
            "title": "Гномс недовольный",
            "price": 1800,
            "stock": 1,
            "category": "figurki",
            "descr": "Гномик с&nbsp;острой шляпкой",
            "text": "Гномик с&nbsp;острой шляпкой будет хранить ваши драгоценности и&nbsp;заряжать их&nbsp;волшебством на&nbsp;новый день ✨ (На&nbsp;фото кольцо 18,5 размера)<br />Можно поставить его в&nbsp;горшок с&nbsp;цветком и&nbsp;он&nbsp;будет позитивно влиять на&nbsp;растения: ночью оживая и&nbsp;ухаживая за&nbsp;листьями и&nbsp;корнями 😄<br />Можно его отвезти на&nbsp;дачу, где он&nbsp;будет выполнять те&nbsp;же&nbsp;функции, но&nbsp;свободы погулять у&nbsp;него будет больше! Необходимо переставлять гномика из&nbsp;места в&nbsp;место, чтобы домочадцы думали, что он&nbsp;живой и&nbsp;сам гуляет по&nbsp;саду 🍓<br /><br /><span class=\"small\">Материал фигурки: керамическая масса, высокотемпературные глазури.</span><br /><span class=\"small\">Товар 14+</span><br /><br />Смотри, что ещё есть 👇🏻",
            "images": [
                "assets/img/products/959892764723-1.webp",
                "assets/img/products/959892764723-2.jpg"
            ]
        },
        {
            "id": "617711925963",
            "slug": "ribka-zvezdochyot-s-zolotom",
            "title": "Рыбка звездочёт с золотом",
            "price": 3750,
            "stock": 1,
            "category": "figurki",
            "descr": "Расписана мной золотом вручную",
            "text": "✨Рыбка-звездочёт ✨<br />made by&nbsp;dyadya Serjay<br /><br />Расписана мной золотом вручную<br />Заряжена на&nbsp;богатство: чтобы загадать желание, нужно посмотреть ей&nbsp;в&nbsp;глаза сверху ✨<br /><br /><span class=\"small\">Материал фигурки: керамическая масса, подглазурные краски, золото.</span><br />Размер: 4×3см.<br /><span class=\"small\">Товар 14+</span><br /><br />Смотри, что ещё есть 👇🏻",
            "images": [
                "assets/img/products/617711925963-1.webp",
                "assets/img/products/617711925963-2.jpg",
                "assets/img/products/617711925963-3.jpg",
                "assets/img/products/617711925963-4.webp"
            ]
        },
        {
            "id": "461789493363",
            "slug": "figurka-balans",
            "title": "Фигурка «баланс»",
            "price": 1500,
            "stock": 1,
            "category": "figurki",
            "descr": "Керамические камушки",
            "text": "Керамические камушки встали идеально, чтобы красоваться у&nbsp;вас на&nbsp;полочке, в&nbsp;флорариуме или на&nbsp;чайной доске 🪨<br /><br /><span class=\"small\">Материал фигурки: керамическая масса.</span><br /><span class=\"small\">Размер: 5&nbsp;см.</span><br /><span class=\"small\">Товар 14+</span><br /><br />Смотри, что ещё есть 👇🏻",
            "images": [
                "assets/img/products/461789493363-1.webp"
            ]
        },
        {
            "id": "481047126343",
            "slug": "pialochka-kamushek",
            "title": "Пиалочка камушек",
            "price": 1000,
            "oldPrice": 1500,
            "stock": 1,
            "category": "pialochki",
            "descr": "Пиала из&nbsp;высокотемпературной глины в&nbsp;виде камушка",
            "text": "Пиала из высокотемпературной глины в виде камушка. Приятно держать в руках, как будто пьешь из шершавенького камня 🪨<br />С толстыми стенками, чтобы чайок не остывал и грел вам ручки ♨️<br />Природные мотивы и единый тон впишутся на любую чайную доску 🍵<br />Внутри и на кромке прозрачная глазурь, чтобы напитки не вьедались в керамику 🪬<br /><br /><span class=\"small\">Материал: керамическая масса, высокотемпературные глазури.</span><br /><span class=\"small\">Пиала 26мл</span><br /><span class=\"small\">Товар 14+</span><br /><br />Смотри, что ещё есть 👇🏻",
            "images": [
                "assets/img/products/481047126343-1.webp",
                "assets/img/products/481047126343-2.jpg",
                "assets/img/products/481047126343-3.jpg"
            ]
        },
        {
            "id": "595858644513",
            "slug": "shkatulka-farforovaya",
            "title": "Шкатулка фарфоровая",
            "price": 2500,
            "stock": 1,
            "category": "pialochki",
            "descr": "Тоненькая и&nbsp;изящная",
            "text": "Вот такая фарфоровая шкатулочка вышла из&nbsp;печки 😚<br />Как обычно тоненькая и&nbsp;изящная 🤍<br /><br />Можно использовать как:<br />-&nbsp;подсвечник (света свечи будет достаточно для&nbsp;лицезрения прозрачности оттисков)<br />-&nbsp;баночку для&nbsp;крема или&nbsp;мази<br />-&nbsp;маленький стаканчик или&nbsp;рюмку<br />-&nbsp;хранилище драгоценностей<br />-&nbsp;солонку/сахарёнку 😆<br />-&nbsp;емкость для монпансье<br />-&nbsp;таблетницу<br /><br /><span class=\"small\">Материал: английский фарфор, прозрачная глазурь.</span><br /><span class=\"small\">Размер: диаметр 4,5&nbsp;см, высота 5&nbsp;см.</span><br /><span class=\"small\">Товар 14+</span><br /><br />Смотри, что ещё есть 👇🏻",
            "images": [
                "assets/img/products/595858644513-1.webp",
                "assets/img/products/595858644513-2.webp",
                "assets/img/products/595858644513-3.jpg",
                "assets/img/products/595858644513-4.jpg"
            ]
        },
        {
            "id": "978213704923",
            "slug": "pialoshka",
            "title": "Пиалошка",
            "price": 700,
            "stock": 1,
            "category": "pialochki",
            "descr": "Тоненькая, просвечивает, лёгкая!",
            "text": "Тоненькая, просвечивает, легкая!<br />Без рисунка<br /><br /><span class=\"small\">Материал: английский фарфор, прозрачная пищевая глазурь.</span><br /><span class=\"small\">Размер: диаметр 5&nbsp;см, высота 3&nbsp;см.</span><br /><span class=\"small\">Товар 14+</span><br /><br />Смотри, что ещё есть 👇🏻",
            "images": [
                "assets/img/products/978213704923-1.webp",
                "assets/img/products/978213704923-2.jpg",
                "assets/img/products/978213704923-3.jpg"
            ]
        },
        {
            "id": "929047650023",
            "slug": "otkritka-zhabka-zemlyanichka",
            "title": "Открытка «Жабка земляничка»",
            "price": 100,
            "stock": 5,
            "category": "merch",
            "descr": "Матовая, плотненькая",
            "text": "Можно повесить на&nbsp;стену, вклеить в&nbsp;скетчбук, подарить другу, использовать как закладку в&nbsp;книге, отправить по&nbsp;почте, разжечь костер…<br />Матовая, плотненькая<br /><br /><span class=\"small\">Размер: 8×8см.</span><br /><span class=\"small\">Товар 14+</span><br /><br />Смотри, что ещё есть 👇🏻",
            "images": [
                "assets/img/products/929047650023-1.webp"
            ]
        },
        {
            "id": "234351467033",
            "slug": "otkritka-klouni",
            "title": "Открытка «Клоуны»",
            "price": 100,
            "stock": 5,
            "category": "merch",
            "descr": "Матовая, плотненькая",
            "text": "Можно повесить на&nbsp;стену, вклеить в&nbsp;скетчбук, подарить другу, использовать как закладку в&nbsp;книге, отправить по&nbsp;почте, разжечь костер…<br />Матовая, плотненькая<br /><br /><span class=\"small\">Размер: 8×8см.</span><br /><span class=\"small\">Товар 14+</span><br /><br />Смотри, что ещё есть 👇🏻",
            "images": [
                "assets/img/products/234351467033-1.webp"
            ]
        },
        {
            "id": "720615687363",
            "slug": "otkritka-zhabka-puteshestvennitsa",
            "title": "Открытка «Жабка путешественница»",
            "price": 100,
            "stock": 5,
            "category": "merch",
            "descr": "Матовая, плотненькая",
            "text": "Можно повесить на&nbsp;стену, вклеить в&nbsp;скетчбук, подарить другу, использовать как закладку в&nbsp;книге, отправить по&nbsp;почте, разжечь костер…<br />Матовая, плотненькая<br /><br /><span class=\"small\">Размер: 8×8см.</span><br /><span class=\"small\">Товар 14+</span><br /><br />Смотри, что ещё есть 👇🏻",
            "images": [
                "assets/img/products/720615687363-1.webp"
            ]
        },
        {
            "id": "528594720463",
            "slug": "stikerpak-zhabki",
            "title": "Стикерпак «Жабки»",
            "price": 200,
            "stock": 10,
            "category": "merch",
            "descr": "Стикерпак со смешными жабками эмодзи",
            "text": "Стикерпак со&nbsp;смешными жабками эмодзи<br />Формат а6<br />Не&nbsp;боится воды<br /><br /><span class=\"small\">Товар 14+</span><br /><br />Смотри, что ещё есть 👇🏻",
            "images": [
                "assets/img/products/528594720463-1.webp",
                "assets/img/products/528594720463-2.webp",
                "assets/img/products/528594720463-3.webp"
            ]
        },
        {
            "id": "121266855943",
            "slug": "stikerpak-horoshiki",
            "title": "Стикерпак «Хорошики»",
            "price": 150,
            "stock": 10,
            "category": "merch",
            "descr": "Стикерпак со&nbsp;смешными жабками и&nbsp;котиками",
            "text": "Стикерпак со&nbsp;смешными жабками и&nbsp;котиками<br />Формат а6<br />Не&nbsp;боится воды<br /><br /><span class=\"small\">Товар 14+</span><br /><br />Смотри, что ещё есть 👇🏻",
            "images": [
                "assets/img/products/121266855943-1.jpg",
                "assets/img/products/121266855943-2.webp"
            ]
        },
        {
            "id": "834511395383",
            "slug": "kolechko-s-zolotom",
            "title": "Колечко с золотом",
            "price": 1500,
            "stock": 1,
            "category": "ukrasheniya",
            "descr": "Размер 14, подойдет на&nbsp;фалангу",
            "text": "Лёгкое колечко, расписано вручную настоящим золотом!<br />Размер&nbsp;— 14, подойдет на&nbsp;фалангу<br /><br /><span class=\"small\">Материал: английский фарфор, прозрачная глазурь, золото</span><br /><span class=\"small\">Размер: 14 российский</span><br /><span class=\"small\">Товар 14+</span><br /><br />Смотри, что ещё есть 👇🏻",
            "images": [
                "assets/img/products/834511395383-1.jpg",
                "assets/img/products/834511395383-2.jpg"
            ]
        },
        {
            "id": "284295386763",
            "slug": "seryozhki-chyornie-koshki",
            "title": "Серёжки чёрные кошки",
            "price": 900,
            "stock": 1,
            "category": "ukrasheniya",
            "descr": "Лёгкие серёжки из&nbsp;фарфора",
            "text": "Лёгкие серёжки из&nbsp;фарфора<br /><br /><span style=\"line-height: 16px;\">Материал изделия: английский фарфор, прозрачная глазурь, подглазурные краски. </span><br /><span style=\"line-height: 16px;\">Материал фурнитуры: медицинская нержавеющая сталь.</span><br /><span style=\"line-height: 16px;\">Размер: 1&nbsp;см</span><br /><span class=\"small\">Товар 14+</span><br /><br />Смотри, что ещё есть 👇🏻",
            "images": [
                "assets/img/products/284295386763-1.webp",
                "assets/img/products/284295386763-2.jpg"
            ]
        },
        {
            "id": "141052642413",
            "slug": "kolechki-so-svinkami",
            "title": "Колечки со свинками",
            "price": 1500,
            "stock": 1,
            "category": "ukrasheniya",
            "descr": "Цена за&nbsp;штуку",
            "text": "Колечко из&nbsp;английского фарфора<br />Очень лёгкое и&nbsp;приятное на&nbsp;ощупь<br />На&nbsp;среднем пальце&nbsp;— 13,5 размер<br />На&nbsp;безымянном&nbsp;— 15 размер<br />Цена за&nbsp;штуку<br /><br /><br /><span style=\"line-height: 16px;\">Материал: английский фарфор, прозрачная глазурь, подглазурные краски</span><br /><span style=\"line-height: 16px;\">Размер: 13,5 и&nbsp;15 российский</span><br /><span class=\"small\">Товар 14+</span><br /><br />Смотри, что ещё есть 👇🏻",
            "images": [
                "assets/img/products/141052642413-1.webp"
            ]
        }
    ]
};
// скрытые в кабинете товары на сайте не показываются
window.LARION_DATA.products = window.LARION_DATA.products.filter(function (p) { return !p.hidden; });
