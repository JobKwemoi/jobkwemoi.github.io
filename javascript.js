document.addEventListener('DOMContentLoaded', function() {
const loader=
document.getElementById('loader');

window.addEventListener('loader', () => {
  loader.classList.add('hidden');

  setTimeout(() => {
    loader.style.display= 'none';
  },600);
});
window.addEventListener('load',() => {
  setTimeout(() => {
    const loader = document.querySelector('.loader, #loader, #loading-screen');
    if(loader) {
      loader.style.opacity='0';
      loader.style.transition ='opacity 0.5s';
      setTimeout(() => loader.remove(), 500);
    }
    showToast('Karibu🥰,Loaded Successfully🔥','welcome');
  },1000);
});
//toast function
function showToast(message,type= 'welcome') {
  const toast = document.createElement('div');
  toast.textContent = message;
  toast.style.cssText =`
  position:fixed;
  bottom:30px;
  left:50%;
  transform:translateX(-50%);
  background: ${type=== 'welcome' ? '#1f6feb' : '#ff4444'};
  color:white;
  padding: 14px 28px;
  border-radius: 12px;
  font-weight:600;
  font-size: 1rem;
  z-index:9999;
  box-shadow:0 8px 20px rgba(0,0,0,0.3);
  animation:slideUp o.3s ease;
  `;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition ='opacity 0.5s';
    setTimeout(() => toast.remove(), 500);
  },3000);

}
//toast animation
const style = document.createElement('style');
style.textContent =`
@keyframes slideUp {
from { transform:translateX(-50%) translateY(100px); opacity: 0; }
to { transform: translateX(-50%) translateY(0); opacity:1; }
}
`;
document.head.appendChild(style);


  //Night/Day Toggle
  const themeToggle = document.getElementById('themeToggle');
  if(themeToggle) {
    const savedTheme = localStorage.getItem('theme') || 'light';
    if(savedTheme === 'dark') document.body.classList.add('dark-mode');
    themeToggle.textContent = savedTheme === 'dark' ? '☀️' : ' 🌙🌠';

    themeToggle.addEventListener('click', () => {
      document.body.classList.toggle('dark-mode');
      const isDark = document.body.classList.contains('dark-mode');
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
      themeToggle.textContent = isDark ? '☀️' : ' 🌙🌠=';
    });
  }

  //Typing Animation
  const textEN = "Hello,I'm Kirong Job Kwemoi";
  const textSWA = "Habari, Mimi ni Kirong Job Kwemoi";
  let i = 0;

  function typeWriter() {
  const lang = localStorage.getItem('preferredLang') || 'en';
  const targetElement = lang === 'en'
  ?
  document.getElementById('typed-text')
  :  
  document.getElementById('typed-text-swa');
  const text = lang === 'en' ? textEN : textSWA;
  if(targetElement && i < text.length) {
    targetElement.textContent +=text.charAt(i);
    i++;
    setTimeout(typeWriter,80);
  
    }
  }
    setTimeout(typeWriter,500);

    //language Toggle
    const btnEn = document.getElementById('btn-en');
    const btnSwa = document.getElementById('btn-swa');
    function setLanguage(lang) {

      const enElements =
    document.querySelectorAll('.lang-en');
    const swaElements =  
    document.querySelectorAll('.lang-swa');

    if(lang=== 'swa') {
      enElements.forEach(el =>
      el.style.display ='none');
      swaElements.forEach(el =>
      el.style.display ='block');
    } else {
      enElements.forEach(el =>
      el.style.display ='block');
      swaElements.forEach(el =>
      el.style.display ='none');
    }

    btnEn.classList.remove('active');
    btnSwa.classList.remove('active');

    if(lang==='swa'){
      btnSwa.classList.add('active');
    } else {
      btnEn.classList.add('active');
    }
    
    localStorage.setItem('preferredLang', lang);
    
    const typedEn =  
    document.getElementById('typed-text');
    const typedSwa =  
    document.getElementById('typed-text-swa'); 

    if(typedEn) typedEn.textContent ='';
    if(typedSwa) typedSwa.textContent ='';

    i = 0;

    setTimeout(typeWriter, 100);
  
    }
    if(btnEn && btnSwa) {
      btnEn.addEventListener('click', 
      function () {
        setLanguage('en');
      });

      btnSwa.addEventListener('click',
      function () {
        setLanguage('swa');
      });
    }
    const savedLang =  
    localStorage.getItem('preferredLang') ||
    'en'
    setLanguage(savedLang); 
  
    
   
    //stats Counter
    const stats = document.querySelectorAll('.stat-number');
    if(stats.length > 0) {
      const statsObserver = new IntersectionObserver(entries=>{
        entries.forEach(entry=>{
          if(entry.isIntersecting){
            const target = parseFloat(entry.target.getAttribute('data-target'));
            let current=0;
            const duration=2000;
            const step = target/(duration/16);

            const updateCounter = ()=>{
              current+=step;
              if(current<target){
                entry.target.textContent =current.toFixed(target%1===0?0:1);
                requestAnimationFrame(updateCounter);
              } else {
                entry.target.textContent = target;
              }
            };
            updateCounter();
            statsObserver.unobserve(entry.target);
            
          }
        });
      },{threshold:0.1});
      stats.forEach(stat => statsObserver.observe(stat));
    }

    //Scroll progress Bar
    window.addEventListener('scroll', ()=>{
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll/height)*100;
      const bar = document.getElementById('progressBar');
      if(bar) bar.style.width = scroll + '%';
    });

    //Scroll to Top
    const scrollBtn = document.getElementById('scrollTopBtn');
    if(scrollBtn) {
      window.addEventListener('scroll',()=>{
        if(window.scrollY > 300) scrollBtn.classList.add('show');
        else scrollBtn.classList.remove('show');
      });
      scrollBtn.addEventListener('click', ()=>window.scrollTo({top:0, behavior:'smooth'}));
    }

    //project card animation
    const projectCards = document.querySelectorAll('.project-card');
    const observer = new IntersectionObserver(entries=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){
          entry.target.style.opacity=1;
          entry.target.style.transform='translateY(0)';
        }
      });
    },{threshold:0.1});
    projectCards.forEach(card=>observer.observe(card));

    console.log('🔥 All systems online - website revived!');
  });

  //Copy Email Function
function copyEmail(event) {
  const email='kirongjob@gmail.com';
  const btn = event ? event.currentTarget : null;

  navigator.clipboard.writeText(email).then(()=>{
    if(btn) {
      const originalText =btn.textContent;
      btn.textContent = 'Copied!';
      btn.style.background = '#25D366';
      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = 'var(--accent)';
      },2000);
    }
    showToast('Email copied! 📄');
  }).catch(()=>{
    showToast('Failed copied! 🥲');
  });
}

//Toast function
function showToast(message) {
  let toast = document.getElementById('toast');
  if(!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  },3000);
}

function toggleChat() {
  const chat = document.getElementById('kirongChat');
  chat.style.display = chat.style.display === 'flex' ? 'none' : 'flex' ;
}
async function sendMessage() {
  const input = document.getElementById("userInput");
  const chat = document.getElementById("chatMessages");
  const message = input.value;

  if (message.trim() === "") return;
  chat.innerHTML += `<div class="message user"><b>wewe:</b> ${message}</div>`;
  input.value ="";

  const response = await fetch("/.netlify/functions/gemini", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({message})
  });

  const data =await response.json();
  chat.innerHTML += `<div class= "message bot"><b>Dr. Kirong :</b> ${data.reply}</p>`;
  
  
}

