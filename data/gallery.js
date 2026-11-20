// Галерея (gallery.html): три раздела. Картинки кладите в assets/img/gallery/ (или берите уже лежащие на сайте).
//
// ФОТО-ОХОТА (hunt): жабки на природе. Просто список фото: { src: 'путь к фото', alt: 'подпись, можно пусто' }.
//   Новые фото добавляйте в начало списка — они будут первыми.
//
// МИСТЕРИ ФРОКС (mystery): коллекции сюрприз-боксов, новые сверху.
//   { title: 'Название коллекции', date: 'Октябрь 2026', text: 'пара слов о коллекции',
//     photos: ['фото 1', 'фото 2', …], secret: ['фото или видео .mp4'] }  — cover: общее фото крупно сверху (необязательно); secret показывается под спойлером
//
// ЭКСКЛЮЗИВ (exclusive): аукционные жабки, новые сверху.
//   { title: 'Имя жабки', date: 'Май 2026', text: 'пара слов', photos: ['фото 1', 'фото 2', …] }  — первым может быть видео .mp4
window.LARION_GALLERY = {
  hunt: [
    { src: 'assets/img/gallery/hunt-01.webp', alt: '' },
    { src: 'assets/img/gallery/hunt-02.webp', alt: '' },
    { src: 'assets/img/gallery/hunt-03.webp', alt: '' },
    { src: 'assets/img/gallery/hunt-04.webp', alt: '' },
    { src: 'assets/img/gallery/hunt-05.webp', alt: '' },
    { src: 'assets/img/gallery/hunt-06.webp', alt: '' },
    { src: 'assets/img/gallery/hunt-07.webp', alt: '' },
    { src: 'assets/img/gallery/hunt-08.webp', alt: '' },
    { src: 'assets/img/gallery/hunt-09.webp', alt: '' },
    { src: 'assets/img/gallery/hunt-10.webp', alt: '' },
    { src: 'assets/img/gallery/hunt-11.webp', alt: '' },
    { src: 'assets/img/gallery/hunt-12.webp', alt: '' },
    { src: 'assets/img/gallery/hunt-13.webp', alt: '' },
    { src: 'assets/img/gallery/hunt-14.webp', alt: '' },
    { src: 'assets/img/gallery/hunt-15.webp', alt: '' },
    { src: 'assets/img/gallery/hunt-16.webp', alt: '' },
    { src: 'assets/img/gallery/hunt-17.webp', alt: '' },
    { src: 'assets/img/gallery/hunt-18.webp', alt: '' },
    { src: 'assets/img/gallery/hunt-19.webp', alt: '' },
    { src: 'assets/img/gallery/hunt-20.webp', alt: '' },
    { src: 'assets/img/gallery/hunt-21.webp', alt: '' },
    { src: 'assets/img/gallery/hunt-22.webp', alt: '' },
    { src: 'assets/img/gallery/hunt-23.webp', alt: '' },
    { src: 'assets/img/gallery/hunt-24.webp', alt: '' },
    { src: 'assets/img/gallery/hunt-25.webp', alt: '' },
    { src: 'assets/img/gallery/hunt-26.webp', alt: '' },
    { src: 'assets/img/gallery/hunt-27.webp', alt: '' },
    { src: 'assets/img/gallery/hunt-28.webp', alt: '' },
    { src: 'assets/img/gallery/hunt-29.webp', alt: '' },
    { src: 'assets/img/gallery/hunt-30.webp', alt: '' },
    { src: 'assets/img/gallery/hunt-31.webp', alt: '' },
    { src: 'assets/img/gallery/hunt-32.webp', alt: '' },
    { src: 'assets/img/gallery/hunt-33.webp', alt: '' },
    { src: 'assets/img/gallery/hunt-34.webp', alt: '' },
    { src: 'assets/img/gallery/hunt-35.webp', alt: '' },
    { src: 'assets/img/home/gallery-1.webp', alt: '' },
    { src: 'assets/img/home/gallery-2.jpeg', alt: '' },
    { src: 'assets/img/home/gallery-4.jpeg', alt: '' },
    { src: 'assets/img/home/gallery-3.jpeg', alt: '' },
    { src: 'assets/img/home/gallery-5.webp', alt: '' },
    { src: 'assets/img/home/gallery-7.jpeg', alt: '' },
    { src: 'assets/img/home/gallery-8.jpeg', alt: '' },
    { src: 'assets/img/home/gallery-6.webp', alt: '' },
    { src: 'assets/img/home/gallery-9.jpeg', alt: '' }
  ],
  mystery: [
    {
      title: 'КваКва-фония',
      date: '2026',
      text: 'Клоунская коллекция к 1 апреля. У каждого клоуна есть своё имя и род деятельности, а презентация фигурок в телеграме была как цирковое представление с антрактом!',
      cover: 'assets/img/gallery/mystery-clowns-cover.webp',
      cover2: 'assets/img/gallery/mystery-clowns-lineup.png',
      photos: [
        { src: 'assets/img/gallery/mystery-clowns-1.png', title: 'Ведущий' },
        { src: 'assets/img/gallery/mystery-clowns-2.webp', title: 'Петрушка' },
        { src: 'assets/img/gallery/mystery-clowns-3.webp', title: 'Жабглер' },
        { src: 'assets/img/gallery/mystery-clowns-4.webp', title: 'Жадам' },
        { src: 'assets/img/gallery/mystery-clowns-5.webp', title: 'Жабоба' },
        { src: 'assets/img/gallery/mystery-clowns-6.webp', title: 'Мим' },
        { src: 'assets/img/gallery/mystery-clowns-7.webp', title: 'Мистикс' },
        { src: 'assets/img/gallery/mystery-clowns-8.webp', title: 'Арлекино' },
        { src: 'assets/img/gallery/mystery-clowns-9.webp', title: 'Чупик' }
      ],
      secret: ['assets/img/gallery/mystery-clowns-secret.webp']
    },
    {
      title: 'Новогодняя',
      date: '2025',
      text: 'Жабки встречают Новый год: кто наряжает ёлку, кто купается в оливье, а кто лезет в трубу с подарками',
      photos: ['assets/img/gallery/mystery-newyear25-1.webp', 'assets/img/gallery/mystery-newyear25-2.webp', 'assets/img/gallery/mystery-newyear25-3.webp', 'assets/img/gallery/mystery-newyear25-4.webp', 'assets/img/gallery/mystery-newyear25-5.webp', 'assets/img/gallery/mystery-newyear25-6.webp', 'assets/img/gallery/mystery-newyear25-7.webp', 'assets/img/gallery/mystery-newyear25-8.webp', 'assets/img/gallery/mystery-newyear25-9.webp'],
      secret: ['assets/img/gallery/mystery-newyear25-secret.webp']
    },
    {
      title: 'Хеллоуин',
      date: '2025',
      text: 'Бу! Жабки разбрелись по самым жутким местам: кто варит зелья, кто дремлет в гробу, а кто светится в ночном лесу',
      cover: 'assets/img/gallery/mystery-halloween25-cover.webp',
      photos: ['assets/img/gallery/mystery-halloween25-1.webp', 'assets/img/gallery/mystery-halloween25-2.webp', 'assets/img/gallery/mystery-halloween25-3.webp', 'assets/img/gallery/mystery-halloween25-4.webp', 'assets/img/gallery/mystery-halloween25-5.webp', 'assets/img/gallery/mystery-halloween25-6.webp', 'assets/img/gallery/mystery-halloween25-7.webp', 'assets/img/gallery/mystery-halloween25-8.webp', 'assets/img/gallery/mystery-halloween25-9.webp'],
      secret: ['assets/img/gallery/mystery-halloween25-secret.webp']
    },
    {
      title: 'Летняя',
      date: '2025',
      text: 'Тропические танцы, загадочные русалки, пляжные развлечения и неожиданный перебор с солнцем.',
      cover: 'assets/img/gallery/mystery-summer-cover.webp',
      photos: ['assets/img/gallery/mystery-summer-1.webp', 'assets/img/gallery/mystery-summer-2.webp', 'assets/img/gallery/mystery-summer-3.webp', 'assets/img/gallery/mystery-summer-4.webp', 'assets/img/gallery/mystery-summer-5.webp', 'assets/img/gallery/mystery-summer-6.webp', 'assets/img/gallery/mystery-summer-7.webp', 'assets/img/gallery/mystery-summer-8.webp', 'assets/img/gallery/mystery-summer-9.webp'],
      secret: ['assets/img/gallery/mystery-summer-secret.mp4']
    },
    {
      title: '8 Марта',
      date: '2025',
      text: 'Девушки как цветы: все разные, но одинаково прекрасны.',
      cover: 'assets/img/gallery/mystery-march8-cover.webp',
      photos: ['assets/img/gallery/mystery-march8-1.webp', 'assets/img/gallery/mystery-march8-2.webp', 'assets/img/gallery/mystery-march8-3.webp', 'assets/img/gallery/mystery-march8-4.webp', 'assets/img/gallery/mystery-march8-5.webp', 'assets/img/gallery/mystery-march8-6.webp', 'assets/img/gallery/mystery-march8-7.webp', 'assets/img/gallery/mystery-march8-8.webp'],
      secret: ['assets/img/gallery/mystery-march8-secret.webp']
    },
    {
      title: 'День всех влюблённых',
      date: '2025',
      text: 'Жабки проводят время вдвоём: кто смотрит фильм, кто целуется, а многие просто наслаждаются компанией.',
      photos: ['assets/img/gallery/mystery-valentine-1.webp', 'assets/img/gallery/mystery-valentine-2.webp', 'assets/img/gallery/mystery-valentine-3.webp', 'assets/img/gallery/mystery-valentine-4.webp', 'assets/img/gallery/mystery-valentine-5.webp', 'assets/img/gallery/mystery-valentine-6.webp', 'assets/img/gallery/mystery-valentine-7.webp', 'assets/img/gallery/mystery-valentine-8.webp', 'assets/img/gallery/mystery-valentine-9.webp', 'assets/img/gallery/mystery-valentine-10.webp'],
      secret: ['assets/img/gallery/mystery-valentine-secret.webp']
    },
    {
      title: 'Новогодняя',
      date: '2024',
      text: 'Хоу-хоу-хоу! С новым 2025 годом змеи! Здесь жабки забрались в носок, катались на ватрушках, маскировались под подарочек и даже превращались в снеговика!',
      cover: 'assets/img/gallery/mystery-newyear-cover.webp',
      photos: ['assets/img/gallery/mystery-newyear-1.webp', 'assets/img/gallery/mystery-newyear-2.webp', 'assets/img/gallery/mystery-newyear-3.webp', 'assets/img/gallery/mystery-newyear-4.webp', 'assets/img/gallery/mystery-newyear-5.webp', 'assets/img/gallery/mystery-newyear-6.webp', 'assets/img/gallery/mystery-newyear-7.webp', 'assets/img/gallery/mystery-newyear-8.webp', 'assets/img/gallery/mystery-newyear-9.webp', 'assets/img/gallery/mystery-newyear-10.webp', 'assets/img/gallery/mystery-newyear-11.webp', 'assets/img/gallery/mystery-newyear-12.webp', 'assets/img/gallery/mystery-newyear-13.webp', 'assets/img/gallery/mystery-newyear-14.webp', 'assets/img/gallery/mystery-newyear-15.webp', 'assets/img/gallery/mystery-newyear-16.webp']
    },
    {
      title: 'Хеллоуин',
      date: '2024',
      text: 'Спуки скери скелетон! Здесь мне очень нравится граф Квакула и жабка в гробу… А призрака было делать легче всего ехехех',
      cover: 'assets/img/gallery/mystery-halloween-cover.webp',
      photos: ['assets/img/gallery/mystery-halloween-1.webp', 'assets/img/gallery/mystery-halloween-2.webp', 'assets/img/gallery/mystery-halloween-3.webp', 'assets/img/gallery/mystery-halloween-4.webp', 'assets/img/gallery/mystery-halloween-5.webp', 'assets/img/gallery/mystery-halloween-6.webp', 'assets/img/gallery/mystery-halloween-7.webp', 'assets/img/gallery/mystery-halloween-8.webp', 'assets/img/gallery/mystery-halloween-9.webp'],
      secret: ['assets/img/gallery/mystery-halloween-secret-2.webp', 'assets/img/gallery/mystery-halloween-secret.mp4']
    },
    {
      title: 'Осенняя',
      date: '2024',
      text: 'Коллекция отражает осеннее настроение: укутаться в свитер, слушать музыку с кофе, лежать подолгу в ванне.',
      photos: ['assets/img/gallery/mystery-autumn-1.webp', 'assets/img/gallery/mystery-autumn-2.webp', 'assets/img/gallery/mystery-autumn-3.webp', 'assets/img/gallery/mystery-autumn-4.webp', 'assets/img/gallery/mystery-autumn-5.webp', 'assets/img/gallery/mystery-autumn-6.webp', 'assets/img/gallery/mystery-autumn-7.webp', 'assets/img/gallery/mystery-autumn-8.webp'],
      // секретная жабка — показывается под спойлером
      secret: ['assets/img/gallery/mystery-autumn-secret.webp']
    }
  ],
  exclusive: [
    { title: '', date: '', text: '', photos: ['assets/img/gallery/exclusive-zhabash.mp4'] }, // Жабаш (название Лера попросила убрать)
    // видео от Леры 11.11.2026; названия пока не придуманы (title: '' — заголовок не показывается)
    { title: '', date: '', text: '', photos: ['assets/img/gallery/exclusive-0417.mp4'] }, // жабка на офисном кресле
    { title: '', date: '', text: '', photos: ['assets/img/gallery/exclusive-1086.mp4'] }, // жабка-бабочка на цветке
    { title: '', date: '', text: '', photos: ['assets/img/gallery/exclusive-2748.mp4'] }, // она же, второе видео (Лера просила отдельной карточкой)
    { title: '', date: '', text: '', photos: ['assets/img/gallery/exclusive-3339.mp4'] }, // подставка для благовоний «водопад»
    { title: '', date: '', text: '', photos: ['assets/img/gallery/exclusive-6399.mp4'] }, // жабка на грибе на мху
    { title: '', date: '', text: '', photos: ['assets/img/gallery/exclusive-6680.mp4'] }, // брелок-фея
    { title: '', date: '', text: '', photos: ['assets/img/gallery/exclusive-9296.mp4'] } // две жабки в обнимку
  ]
};
