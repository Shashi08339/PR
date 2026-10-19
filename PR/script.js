'use strict';
/* ════════════════════════════════
   PRELOADER — always dismisses
════════════════════════════════ */
const pl = document.getElementById('preloader');
function dismissPL(){
  pl.classList.add('gone');
  // trigger hero reveals
  document.querySelectorAll('#hero .rv').forEach(el => el.classList.add('on'));
}
// Hard dismiss at 2s regardless of network
const plTimer = setTimeout(dismissPL, 2000);
window.addEventListener('load', ()=>{ clearTimeout(plTimer); setTimeout(dismissPL,1600); });
if(document.readyState==='complete'){ clearTimeout(plTimer); setTimeout(dismissPL,1600); }

/* ════════════════════════════════
   DEBOUNCE
════════════════════════════════ */
function debounce(fn,ms){ let t; return(...a)=>{ clearTimeout(t); t=setTimeout(()=>fn(...a),ms); }; }

/* ════════════════════════════════
   NAVBAR
════════════════════════════════ */
const nav = document.getElementById('nav');
const onScroll = debounce(()=>{
  nav.classList.toggle('stuck', window.scrollY > 60);
  btt.classList.toggle('on', window.scrollY > 400);
}, 10);
window.addEventListener('scroll', onScroll, {passive:true});
onScroll();

/* ════════════════════════════════
   HAMBURGER
════════════════════════════════ */
const ham = document.getElementById('ham');
const mob = document.getElementById('mob-menu');
ham.addEventListener('click',()=>{
  const o = ham.classList.toggle('open');
  mob.classList.toggle('open');
  ham.setAttribute('aria-expanded', o);
});
mob.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{
  ham.classList.remove('open'); mob.classList.remove('open');
}));

/* ════════════════════════════════
   SCROLL REVEALS
════════════════════════════════ */
const ro = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      const d = parseInt(e.target.dataset.delay||'0');
      setTimeout(()=>e.target.classList.add('on'), d);
      ro.unobserve(e.target);
    }
  });
},{threshold:0.1});
document.querySelectorAll('.rv:not(#hero .rv)').forEach(el=>ro.observe(el));

/* ════════════════════════════════
   COUNTERS
════════════════════════════════ */
function countUp(el){
  const target = +el.dataset.target;
  const dur = 2000;
  const start = performance.now();
  (function tick(now){
    const p = Math.min((now-start)/dur,1);
    const ease = 1-Math.pow(1-p,3);
    el.textContent = Math.floor(ease*target).toLocaleString();
    if(p<1) requestAnimationFrame(tick);
    else el.textContent = target.toLocaleString();
  })(start);
}
const statsObs = new IntersectionObserver(entries=>{
  entries.forEach(e=>{ if(e.isIntersecting){ e.target.querySelectorAll('.snum').forEach(countUp); statsObs.unobserve(e.target); } });
},{threshold:0.3});
statsObs.observe(document.getElementById('stats'));

/* ════════════════════════════════
   TESTIMONIALS
════════════════════════════════ */
const slides = [...document.querySelectorAll('.tslide')];
const dots   = [...document.querySelectorAll('.tdot')];
let cur=0, autoT;

function goTo(i){
  slides[cur].classList.remove('on'); dots[cur].classList.remove('on');
  cur = (i+slides.length)%slides.length;
  slides[cur].classList.add('on');   dots[cur].classList.add('on');
}
function startAuto(){ stopAuto(); autoT=setInterval(()=>goTo(cur+1),4500); }
function stopAuto(){ clearInterval(autoT); }

document.getElementById('tnext').addEventListener('click',()=>{goTo(cur+1);startAuto();});
document.getElementById('tprev').addEventListener('click',()=>{goTo(cur-1);startAuto();});
dots.forEach(d=>d.addEventListener('click',()=>{goTo(+d.dataset.i);startAuto();}));
startAuto();

/* ════════════════════════════════
   SHOP FILTER
════════════════════════════════ */
document.querySelectorAll('.fb').forEach(btn=>{
  btn.addEventListener('click',()=>{
    document.querySelectorAll('.fb').forEach(b=>b.classList.remove('on'));
    btn.classList.add('on');
    const f = btn.dataset.f;
    document.querySelectorAll('.scard').forEach(c=>{
      const match = f==='all'||c.dataset.cat===f;
      c.classList.toggle('gone',!match);
      if(match){ void c.offsetWidth; c.classList.add('fin'); setTimeout(()=>c.classList.remove('fin'),400); }
    });
  });
});

/* ════════════════════════════════
   CART
════════════════════════════════ */
let cart = JSON.parse(localStorage.getItem('sc2_cart')||'[]');
function saveCart(){ localStorage.setItem('sc2_cart',JSON.stringify(cart)); }

function renderCart(){
  const list=document.getElementById('clist');
  const cnt=document.getElementById('c-cnt');
  const tot=document.getElementById('ctotal');
  list.innerHTML = cart.length
    ? cart.map((it,i)=>`<li class="ci"><span>${it.name} ×${it.qty}</span><span>₹${it.price*it.qty}<button onclick="rmCart(${i})" aria-label="Remove">×</button></span></li>`).join('')
    : '<li class="cempty">Your cart is empty 🥐</li>';
  cnt.textContent = cart.reduce((s,i)=>s+i.qty,0);
  tot.textContent = '₹'+ cart.reduce((s,i)=>s+i.price*i.qty,0).toLocaleString();
}
window.rmCart = function(i){ cart.splice(i,1); saveCart(); renderCart(); };

function addCart(name,price){
  const ex = cart.find(i=>i.name===name);
  ex ? ex.qty++ : cart.push({name,price:+price,qty:1});
  saveCart(); renderCart();
  // bounce cart icon
  const ico=document.querySelector('.cart-ico');
  ico.style.transform='scale(1.35)';
  setTimeout(()=>ico.style.transform='',250);
  // toast
  const t=document.getElementById('toast');
  t.textContent='✓ Added: '+name;
  t.classList.add('on');
  clearTimeout(t._t);
  t._t=setTimeout(()=>t.classList.remove('on'),2200);
}
renderCart();

// Toggle cart dropdown
const cartIco = document.getElementById('cart-ico');
const cdrop   = document.getElementById('cdrop');
cartIco.addEventListener('click',()=>cdrop.classList.toggle('on'));
cartIco.addEventListener('keydown',e=>{ if(e.key==='Enter'||e.key===' ') cdrop.classList.toggle('on'); });
document.addEventListener('click',e=>{ if(!e.target.closest('#cart-wrap')) cdrop.classList.remove('on'); });

// Add to cart buttons
document.addEventListener('click',e=>{
  const btn=e.target.closest('[data-name][data-price]');
  if(btn){ addCart(btn.dataset.name, btn.dataset.price); createRipple(e,btn); }
});

/* ════════════════════════════════
   RIPPLE
════════════════════════════════ */
function createRipple(e,el){
  const r=el.getBoundingClientRect();
  const s=Math.max(r.width,r.height);
  const x=e.clientX-r.left-s/2, y=e.clientY-r.top-s/2;
  const w=document.createElement('span');
  w.className='rpl-w';
  w.style.cssText=`width:${s}px;height:${s}px;left:${x}px;top:${y}px`;
  el.appendChild(w);
  w.addEventListener('animationend',()=>w.remove());
}
document.querySelectorAll('.rpl:not([data-name])').forEach(el=>{
  el.addEventListener('click',e=>createRipple(e,el));
});

/* ════════════════════════════════
   GALLERY LIGHTBOX
════════════════════════════════ */
const lbItems = [...document.querySelectorAll('.mi')];
const lb      = document.getElementById('lb');
const lbContent = document.getElementById('lb-content');
let lbI = 0;

const galleryData = [
  {emoji:'🍰',bg:'linear-gradient(135deg,#F7C5C0,#E07070,#C05050)',label:'Celebration Cake'},
  {emoji:'🥐',bg:'linear-gradient(135deg,#D4B896,#C09060,#8B5E3A)',label:'Butter Croissants'},
  {emoji:'🍫',bg:'linear-gradient(135deg,#3D2010,#6B3820,#C08040)',label:'Chocolate Treats'},
  {emoji:'🍬',bg:'linear-gradient(135deg,#E8D4B0,#D0A060,#A07030)',label:'Sweet Macarons'},
  {emoji:'🎂',bg:'linear-gradient(135deg,#F0C8D4,#D07090,#A04060)',label:'Birthday Cakes'},
  {emoji:'🧁',bg:'linear-gradient(135deg,#C0D4F0,#8090C8,#5060A0)',label:'Decorated Cupcakes'},
];

function openLB(i){
  lbI=i;
  const d=galleryData[i];
  lbContent.style.background=d.bg;
  lbContent.innerHTML=`<div style="font-size:9rem;user-select:none">${d.emoji}</div>`;
  lb.classList.add('on');
  document.body.style.overflow='hidden';
  lb.focus();
}
function closeLB(){ lb.classList.remove('on'); document.body.style.overflow=''; }
function navLB(dir){
  lbI=(lbI+dir+galleryData.length)%galleryData.length;
  const d=galleryData[lbI];
  lbContent.style.transition='opacity .18s';
  lbContent.style.opacity='0';
  setTimeout(()=>{
    lbContent.style.background=d.bg;
    lbContent.innerHTML=`<div style="font-size:9rem">${d.emoji}</div>`;
    lbContent.style.opacity='1';
  },180);
}
lbItems.forEach((el,i)=>{
  el.addEventListener('click',()=>openLB(i));
  el.addEventListener('keydown',e=>{ if(e.key==='Enter'||e.key===' ') openLB(i); });
});
document.getElementById('lb-x').addEventListener('click',closeLB);
document.getElementById('lb-p').addEventListener('click',()=>navLB(-1));
document.getElementById('lb-n').addEventListener('click',()=>navLB(1));
lb.addEventListener('click',e=>{ if(e.target===lb) closeLB(); });
document.addEventListener('keydown',e=>{
  if(!lb.classList.contains('on')) return;
  if(e.key==='Escape') closeLB();
  if(e.key==='ArrowLeft') navLB(-1);
  if(e.key==='ArrowRight') navLB(1);
});

/* ════════════════════════════════
   CONTACT FORM
════════════════════════════════ */
document.getElementById('cform').addEventListener('submit',e=>{
  e.preventDefault();
  let ok=true;
  const checks=[
    {id:'cname',errId:'err-name',test:v=>v.trim().length>=2,msg:'Name must be at least 2 characters.'},
    {id:'cemail',errId:'err-email',test:v=>/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),msg:'Enter a valid email address.'},
    {id:'cmsg',errId:'err-msg',test:v=>v.trim().length>=10,msg:'Message must be at least 10 characters.'},
  ];
  checks.forEach(c=>{
    const inp=document.getElementById(c.id);
    const err=document.getElementById(c.errId);
    const valid=c.test(inp.value);
    inp.classList.toggle('err',!valid);
    err.textContent=valid?'':c.msg;
    if(!valid) ok=false;
  });
  if(ok){
    const btn=e.target.querySelector('button[type=submit]');
    btn.textContent='Sending…'; btn.disabled=true;
    setTimeout(()=>{
      document.getElementById('fsuc').textContent='✓ Message sent! We\'ll get back to you within 24 hours.';
      e.target.reset();
      btn.textContent='Send Message'; btn.disabled=false;
      setTimeout(()=>document.getElementById('fsuc').textContent='',5000);
    },1400);
  }
});

/* ════════════════════════════════
   NEWSLETTER
════════════════════════════════ */
document.getElementById('nlform').addEventListener('submit',e=>{
  e.preventDefault();
  const inp=e.target.querySelector('input');
  if(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inp.value.trim())){
    inp.value=''; inp.placeholder='✓ Subscribed! Thank you.';
    setTimeout(()=>inp.placeholder='your@email.com',3000);
  }
});

/* ════════════════════════════════
   BACK TO TOP
════════════════════════════════ */
const btt = document.getElementById('btt');
btt.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));

/* ════════════════════════════════
   DARK MODE
════════════════════════════════ */
const thm = document.getElementById('thm');
document.documentElement.dataset.theme = localStorage.getItem('sc_theme')||'light';
thm.addEventListener('click',()=>{
  const dark = document.documentElement.dataset.theme==='dark';
  document.documentElement.dataset.theme = dark?'light':'dark';
  localStorage.setItem('sc_theme', document.documentElement.dataset.theme);
});

/* ════════════════════════════════
   SMOOTH SCROLL
════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click',e=>{
    const t=document.querySelector(a.getAttribute('href'));
    if(!t) return; e.preventDefault();
    window.scrollTo({top:t.getBoundingClientRect().top+window.scrollY-72,behavior:'smooth'});
  });
});

/* ════════════════════════════════
   PARALLAX HERO
════════════════════════════════ */
window.addEventListener('scroll',debounce(()=>{
  const bg=document.querySelector('.hero-bg');
  if(bg && window.scrollY<window.innerHeight)
    bg.style.transform=`translateY(${window.scrollY*.22}px)`;
},16),{passive:true});
