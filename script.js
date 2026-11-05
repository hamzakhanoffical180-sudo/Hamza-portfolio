const menuToggle=document.getElementById('menuToggle');
const nav=document.getElementById('mainNav');
menuToggle.addEventListener('click',()=>{const opened=nav.classList.toggle('open');menuToggle.setAttribute('aria-expanded',opened);menuToggle.textContent=opened?'×':'☰';});
nav.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>{nav.classList.remove('open');menuToggle.setAttribute('aria-expanded','false');menuToggle.textContent='☰';}));

// Light mode is the default on every fresh page load.
const themeToggle=document.getElementById('themeToggle');
themeToggle.addEventListener('click',()=>{const dark=document.body.classList.toggle('dark');themeToggle.setAttribute('aria-label',dark?'Switch to light mode':'Switch to dark mode');});

const revealObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');revealObserver.unobserve(entry.target);}}),{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>revealObserver.observe(el));

const progress=document.getElementById('scrollProgress'),backTop=document.getElementById('backTop');
function updateScroll(){const max=document.documentElement.scrollHeight-window.innerHeight;progress.style.width=(max>0?(window.scrollY/max)*100:0)+'%';backTop.classList.toggle('show',window.scrollY>450);}
window.addEventListener('scroll',updateScroll,{passive:true});updateScroll();
backTop.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));

const sections=[...document.querySelectorAll('main section[id]')],links=[...nav.querySelectorAll('a')];
const sectionObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){links.forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+entry.target.id));}}),{rootMargin:'-35% 0px -55% 0px'});
sections.forEach(section=>sectionObserver.observe(section));

// Prime Dealer popup: WhatsApp Channel + Facebook Page.
const primeModal=document.getElementById('primeModal'),primeButton=document.getElementById('primeButton');
function openPrime(){primeModal.classList.add('open');primeModal.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';primeModal.querySelector('.modal-close').focus();}
function closePrime(){primeModal.classList.remove('open');primeModal.setAttribute('aria-hidden','true');document.body.style.overflow='';primeButton.focus();}
primeButton.addEventListener('click',openPrime);
primeModal.querySelectorAll('[data-close-modal]').forEach(btn=>btn.addEventListener('click',closePrime));
primeModal.addEventListener('click',e=>{if(e.target===primeModal)closePrime();});

// Certificate lightbox.
const certificateModal=document.getElementById('certificateModal'),certificateLarge=document.getElementById('certificateLarge'),certificateTitle=document.getElementById('certificateTitle');
document.querySelectorAll('[data-certificate]').forEach(card=>card.addEventListener('click',()=>{certificateLarge.src=card.dataset.certificate;certificateLarge.alt=card.dataset.title;certificateTitle.textContent=card.dataset.title;certificateModal.classList.add('open');certificateModal.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';}));
function closeCertificate(){certificateModal.classList.remove('open');certificateModal.setAttribute('aria-hidden','true');document.body.style.overflow='';certificateLarge.src='';}
certificateModal.querySelector('.certificate-modal-close').addEventListener('click',closeCertificate);
certificateModal.addEventListener('click',e=>{if(e.target===certificateModal)closeCertificate();});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){if(primeModal.classList.contains('open'))closePrime();if(certificateModal.classList.contains('open'))closeCertificate();}});

document.getElementById('contactForm').addEventListener('submit',event=>{event.preventDefault();const data=new FormData(event.currentTarget);const subject=encodeURIComponent('Portfolio contact from '+data.get('name'));const body=encodeURIComponent('Name: '+data.get('name')+'\nEmail: '+data.get('email')+'\n\n'+data.get('message'));window.location.href='mailto:hamzakhanoffical180@gmail.com?subject='+subject+'&body='+body;});
