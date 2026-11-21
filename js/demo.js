/* Local-only interface fixtures. No request is ever forwarded to a server. */
(function(){
 'use strict';
 var values={},calls=[];
 var memory={getItem:function(k){return values[k]||null;},setItem:function(k,v){values[k]=String(v);},removeItem:function(k){delete values[k];}};
 function say(text){if(window.LarionSay)window.LarionSay(text);}
 function response(data){return Promise.resolve({ok:!!data.ok,status:data.ok?200:400,headers:{get:function(){return 'application/json';}},json:function(){return Promise.resolve(data);}});}
 function request(url,options){
  calls.push(String(url).split('?')[0]);
  var u=new URL(url,location.href),d={ok:false,error:'Демо: это действие не отправляется на сервер.'};
  if(u.pathname.endsWith('/delivery.php')){
   d={ok:true,mapKey:'',price:350,days:4,cities:[{code:1,name:'Демогород, Россия'}],points:[{code:'DEMO-01',cityCode:1,city:'Демогород',address:'Учебная улица, 1 — вымышленный пункт',note:'ДЕМО · доставка 350 ₽, тариф вымышленный',time:'Пример: 10:00–19:00',country:'RU'}]};
  }else if(u.pathname.endsWith('/cert.php')){
   d=u.searchParams.get('code')==='DEMO500'?{ok:true,code:'DEMO500',balance:500}:{ok:false,error:'Демо: используйте DEMO500. Настоящие сертификаты не проверяются.'};
  }
  return response(d);
 }
 function finish(form,root){
  var error=null, items=root.querySelectorAll('.cart__item');
  if(!items.length)error='Добавьте товар для проверки оформления.';
  else if(!form.elements.email.value.trim().match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))error='Укажите почту или нажмите «Заполнить пример заказа».';
  else if(!form.elements.consent.checked)error='Отметьте галочку согласия и снова нажмите «Проверить оформление».';
  else if(form.elements.preorderConsent.required&&!form.elements.preorderConsent.checked)error='Подтвердите, что изделие ручной работы может немного отличаться от фото.';
  var ship=root.querySelector('[data-ship]');
  if(!error&&ship&&!ship.hidden){
   var phone=form.elements.phone;
   if(!form.elements.name.value.trim()||phone.value.replace(/\D/g,'').length!==phone.placeholder.replace(/\D/g,'').length)error='Нажмите «Заполнить пример» или заполните вымышленные ФИО и телефон.';
   if(!error&&form.querySelector('[name=shipWay]:checked').value==='cdek'&&!localStorage.getItem('larion_demo_cdek'))error='Выберите вымышленный пункт выдачи или «Другой способ».';
  }
  var note=root.querySelector('[data-cart-note]');note.hidden=!error;note.setAttribute('role','status');
  note.textContent=error||'';
  if(error)note.scrollIntoView({block:'nearest',behavior:'smooth'});
  window.LarionDemo.lastResult=error?'validation-error':'demo-success';
  return !error;
 }
 function fillExample(form){
  var samples={email:'demo@example.invalid',name:'Покупатель Тестовый Демонстрационный',phone:form.elements.phone.placeholder,comment:'Вымышленный заказ для проверки интерфейса'};
  Object.keys(samples).forEach(function(key){
   var input=form.elements[key];
   input.value=samples[key];
   input.dispatchEvent(new Event('input',{bubbles:true}));
  });
 }
 document.addEventListener('click',function(event){
  var button=event.target.closest('[data-demo-checkout]');
  if(!button)return;
  var form=button.form;
  fillExample(form);
  var other=form.querySelector('[name=shipWay][value=other]');
  if(!localStorage.getItem('larion_demo_cdek')&&!other.checked){
   other.checked=true;
   other.dispatchEvent(new Event('change',{bubbles:true}));
  }
  var note=form.querySelector('[data-cart-note]');
  note.hidden=false;
  note.textContent=form.elements.consent.checked
   ? 'Пример заполнен. Нажмите «Проверить оформление».'
   : 'Пример заполнен. Отметьте галочку согласия и нажмите «Проверить оформление».';
 });
 window.LarionDemo={request:request,finish:finish,memory:memory,calls:calls,lastResult:null};
 window.fetch=function(){return Promise.reject(new Error('Network disabled in Larion demo'));};
 XMLHttpRequest.prototype.open=function(){throw new Error('Network disabled in Larion demo');};
 if(navigator.sendBeacon)navigator.sendBeacon=function(){return false;};
 document.addEventListener('click',function(e){var a=e.target.closest('a');if(!a)return;var href=a.getAttribute('href')||'';if(/^(https?:|mailto:|tel:|tg:)/i.test(href)||href==='#demo-contact'||/^(admin|api|server)\//.test(href)){e.preventDefault();e.stopImmediatePropagation();say('Демо: внешние переходы, связь и серверные действия отключены.');}},true);
 document.addEventListener('DOMContentLoaded',function(){
  var bar=document.createElement('div');bar.className='demo-bar';bar.innerHTML='<b>ДЕМО LARION</b><span>Только проверка интерфейса · без оплаты и отправки заказов</span><button type="button" data-demo-fill>Заполнить пример</button><button type="button" data-demo-reset>Сбросить демо</button>';document.body.prepend(bar);
  var topCover=document.createElement('div');
  topCover.className='demo-top-cover';
  topCover.setAttribute('aria-hidden','true');
  document.body.prepend(topCover);
  function updateBarHeight(){
   document.documentElement.style.setProperty('--demo-bar-height',bar.offsetHeight+'px');
  }
  updateBarHeight();
  new ResizeObserver(updateBarHeight).observe(bar);
  bar.querySelector('[data-demo-fill]').onclick=function(){var form=document.querySelector('[data-cart-form]');if(!form){say('Сначала откройте корзину.');return;}fillExample(form);say('Подставлены вымышленные данные. Заказ никуда не отправится.');};
  bar.querySelector('[data-demo-reset]').onclick=function(){Object.keys(localStorage).filter(function(k){return k.indexOf('larion_demo_')===0;}).forEach(function(k){localStorage.removeItem(k);});Object.keys(sessionStorage).filter(function(k){return k.indexOf('larion_demo_')===0;}).forEach(function(k){sessionStorage.removeItem(k);});location.reload();};
 });
})();
