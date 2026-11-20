// Слои конструктора. Все картинки в одном масштабе: 100 px = 1 см.
// w, h — размер картинки. Подвинуть слой можно, поменяв ax и ay.
// Жабка: ax, ay — точка на макушке, куда встаёт шляпа; by — уровень, которым жабка стоит на коврике.
// Шляпа: ax, ay — точка шляпы, которая совпадает с макушкой жабки.
// Коврик ставится центром под жабку. transform — поворот и наклон (у кувшинки, чтобы вырез был виден сбоку).
window.LARION_CONSTRUCTOR = {
  frogs: [
    { id: '146011476013', src: 'assets/img/constructor/frog-146011476013.png', w: 308, h: 263, ax: 156, ay: 2, by: 258 },
    { id: '235460268133', src: 'assets/img/constructor/frog-235460268133.png', w: 303, h: 272, ax: 164, ay: 10, by: 259 },
    { id: '749964285913', src: 'assets/img/constructor/frog-749964285913.png', w: 339, h: 389, ax: 175, ay: 14, by: 362 }
  ],
  hats: [
    { id: '559100002902', src: 'assets/img/constructor/hat-559100002902-head.png', w: 117, h: 106, ax: 58, ay: 90 }, // цветочек без палочки, первым
    { id: '142358658773', src: 'assets/img/constructor/hat-142358658773.png', w: 101, h: 202, ax: 50, ay: 188 },
    { id: '322615804733', src: 'assets/img/constructor/hat-322615804733.png', w: 160, h: 139, ax: 68, ay: 127 },
    { id: '853321795823', src: 'assets/img/constructor/hat-853321795823.png', w: 90, h: 102, ax: 50, ay: 93 },
    { id: '979047627703', src: 'assets/img/constructor/hat-979047627703.png', w: 198, h: 240, ax: 105, ay: 241 },
    { id: '559100000599', src: 'assets/img/constructor/hat-559100000599.png', w: 101, h: 103, ax: 51, ay: 87 },
    { id: '559100000744', src: 'assets/img/constructor/hat-559100000744.png', w: 95, h: 86, ax: 42, ay: 72 },
    { id: '559100000889', src: 'assets/img/constructor/hat-559100000889.png', w: 93, h: 113, ax: 47, ay: 104 },
    { id: '559100000971', src: 'assets/img/constructor/hat-559100000971.png', w: 118, h: 150, ax: 71, ay: 136 },
    { id: '559100001183', src: 'assets/img/constructor/hat-559100001183.png', w: 240, h: 302, ax: 115, ay: 296 },
    { id: '559100001276', src: 'assets/img/constructor/hat-559100001276.png', w: 99, h: 80, ax: 39, ay: 62 },
    { id: '559100001430', src: 'assets/img/constructor/hat-559100001430.png', w: 117, h: 92, ax: 52, ay: 74 },
    { id: '559100001540', src: 'assets/img/constructor/hat-559100001540.png', w: 127, h: 92, ax: 49, ay: 77 },
    { id: '559100001678', src: 'assets/img/constructor/hat-559100001678.png', w: 80, h: 133, ax: 39, ay: 115 },
    { id: '559100001802', src: 'assets/img/constructor/hat-559100001802.png', w: 103, h: 92, ax: 41, ay: 71 },
    { id: '559100001946', src: 'assets/img/constructor/hat-559100001946.png', w: 109, h: 104, ax: 50, ay: 92 },
    { id: '559100002101', src: 'assets/img/constructor/hat-559100002101.png', w: 141, h: 89, ax: 64, ay: 71 },
    { id: '559100002237', src: 'assets/img/constructor/hat-559100002237.png', w: 68, h: 108, ax: 32, ay: 90 },
    { id: '559100002379', src: 'assets/img/constructor/hat-559100002379.png', w: 100, h: 123, ax: 50, ay: 105 },
    { id: '559100002413', src: 'assets/img/constructor/hat-559100002413.png', w: 100, h: 107, ax: 47, ay: 89 },
    { id: '559100002586', src: 'assets/img/constructor/hat-559100002586.png', w: 95, h: 133, ax: 50, ay: 115 },
    { id: '559100002801', src: 'assets/img/constructor/hat-559100002801.png', w: 128, h: 136, ax: 64, ay: 122 }
  ],
  mats: [
    { id: '798615472313', src: 'assets/img/constructor/mat-798615472313.png', w: 510, h: 481, transform: 'scaleY(.58) rotate(118deg)' },
    { id: '672138673013', src: 'assets/img/constructor/mat-672138673013.png', w: 874, h: 676 },
    { id: '330055288513', src: 'assets/img/constructor/mat-330055288513.png', w: 772, h: 557 },
    { id: '592423008803', src: 'assets/img/constructor/mat-592423008803.png', w: 535, h: 427 },
    { id: '559100000146', src: 'assets/img/constructor/mat-559100000146.png', w: 720, h: 599 },
    { id: '559100000350', src: 'assets/img/constructor/mat-559100000350.png', w: 688, h: 608 },
    { id: '559100000433', src: 'assets/img/constructor/mat-559100000433.png', w: 485, h: 425 }
  ]
};
