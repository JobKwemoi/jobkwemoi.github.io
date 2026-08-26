document.addEventListener('DOMContentLoaded', function() {
  // ===== LOADER FIXED 👑 =====
  const loader = document.getElementById('loader');
  window.addEventListener('load', () => {
    setTimeout(() => {
      if(loader){
        loader.classList.add('hidden');
        setTimeout(() => loader.style.display = 'none', 600);
      }
      showToast('Karibu 🥰, Loaded Successfully 🔥','welcome');
    }, 800);
  });

  // ===== TOAST - ONE VERSION ONLY =====
  window.showToast = function(message, type='welcome') {
    let toast = document.getElementById('toast');
    if(!toast){
      toast = document.createElement('div');
      toast.id = 'toast';
      toast.className = 'toast';
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.style.background = type === 'welcome' ? '#6D28D9' : '#ff4444';
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
  }

  // ===== THEME TOGGLE FIXED =====
  const themeToggle = document.getElementById('themeToggle');
  if(themeToggle) {
    const savedTheme = localStorage.getItem('theme') || 'light';
    if(savedTheme === 'dark') document.body.classList.add('dark-mode');
    themeToggle.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
    themeToggle.addEventListener('click', () => {
      document.body.classList.toggle('dark-mode');
      const isDark = document.body.classList.contains('dark-mode');
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
      themeToggle.textContent = isDark ? '☀️' : '🌙';
    });
  }

  // ===== TYPING ANIMATION - NEW TEXTS =====
  const textEN = "Hello, I'm Kirong Job Kwemoi 👑";
  const textSWA = "Habari, Mimi ni Kirong Job Kwemoi 👑";
  let i = 0;
  let typingTimeout;

  function typeWriter() {
    const lang = localStorage.getItem('preferredLang') || 'en';
    const targetElement = lang === 'en' ? document.getElementById('typed-text') : document.getElementById('typed-text-swa');
    const text = lang === 'en' ? textEN : textSWA;
    if(!targetElement) return;
    if(i < text.length) {
      targetElement.textContent += text.charAt(i);
      i++;
      typingTimeout = setTimeout(typeWriter, 70);
    }
  }
  setTimeout(typeWriter, 600);

  // ===== LANGUAGE TOGGLE =====
  const btnEn = document.getElementById('btn-en');
  const btnSwa = document.getElementById('btn-swa');
  
  window.setLanguage = function(lang) {
    const enElements = document.querySelectorAll('.lang-en');
    const swaElements = document.querySelectorAll('.lang-swa');
    if(lang === 'swa') {
      enElements.forEach(el => el.style.display = 'none');
      swaElements.forEach(el => el.style.display = 'block');
    } else {
      enElements.forEach(el => el.style.display = 'block');
      swaElements.forEach(el => el.style.display = 'none');
    }
    if(btnEn && btnSwa){
      btnEn.classList.remove('active');
      btnSwa.classList.remove('active');
      if(lang==='swa') btnSwa.classList.add('active');
      else btnEn.classList.add('active');
    }
    localStorage.setItem('preferredLang', lang);
    const typedEn = document.getElementById('typed-text');
    const typedSwa = document.getElementById('typed-text-swa'); 
    if(typedEn) typedEn.textContent = '';
    if(typedSwa) typedSwa.textContent = '';
    i = 0;
    clearTimeout(typingTimeout);
    setTimeout(typeWriter, 100);
  }
  
  if(btnEn && btnSwa) {
    btnEn.addEventListener('click', () => setLanguage('en'));
    btnSwa.addEventListener('click', () => setLanguage('swa'));
  }
  const savedLang = localStorage.getItem('preferredLang') || 'en';
  setLanguage(savedLang);

  // ===== STATS COUNTER =====
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
              entry.target.textContent = current.toFixed(target%1===0?0:1);
              requestAnimationFrame(updateCounter);
            } else {
              entry.target.textContent = target;
            }
          };
          updateCounter();
          statsObserver.unobserve(entry.target);
        }
      });
    },{threshold:0.5});
    stats.forEach(stat => statsObserver.observe(stat));
  }

  // ===== SCROLL PROGRESS - FIXED BUG =====
  window.addEventListener('scroll', ()=>{
    const winScroll = document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll/height)*100;
    const bar = document.getElementById('progressBar');
    if(bar) bar.style.width = scrolled + '%';
  });

  // ===== SCROLL TO TOP =====
  const scrollBtn = document.getElementById('scrollTopBtn');
  if(scrollBtn) {
    window.addEventListener('scroll',()=>{
      if(window.scrollY > 300) scrollBtn.classList.add('show');
      else scrollBtn.classList.remove('show');
    });
    scrollBtn.addEventListener('click', ()=>window.scrollTo({top:0, behavior:'smooth'}));
  }

  // ===== PROJECT FILTER - UPGRADED 🔥 =====
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');
  filterBtns.forEach(btn=>{
    btn.addEventListener('click', ()=>{
      filterBtns.forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');
      projectCards.forEach(card=>{
        if(filter==='all' || card.getAttribute('data-category')===filter){
          card.style.display='block';
          card.style.animation='fadeInUp 0.5s forwards';
        } else {
          card.style.display='none';
        }
      });
    });
  });

  // ===== PROJECT ANIMATION =====
  const observer = new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        entry.target.style.opacity=1;
        entry.target.style.transform='translateY(0)';
      }
    });
  },{threshold:0.1});
  projectCards.forEach(card=>{
    card.style.opacity=0;
    card.style.transform='translateY(20px)';
    card.style.transition='all 0.6s ease';
    observer.observe(card);
  });

  // ===== NEW: LIVE VISITOR COUNTER 👑 =====
  const visitorEl = document.getElementById('visitorCount');
  if(visitorEl){
    let count = 247;
    setInterval(()=>{
      count += Math.floor(Math.random()*3)-1;
      if(count<235) count=235;
      if(count>310) count=310;
      visitorEl.textContent = count;
    }, 2500);
  }

  // ===== NEW: NAV DOTS ACTIVE =====
  const sections = document.querySelectorAll('section');
  const navDots = document.querySelectorAll('.nav-dot a');
  window.addEventListener('scroll', ()=>{
    let current='';
    sections.forEach(section=>{
      const top = section.offsetTop;
      if(scrollY >= top-200) current = section.getAttribute('id');
    });
    navDots.forEach(dot=>{
      dot.classList.remove('active');
      if(dot.getAttribute('data-section')===current) dot.classList.add('active');
    });
  });

  // ===== PRIVATE MODE - BLOCK INSPECT =====
  document.addEventListener('contextmenu', e=>e.preventDefault());
  document.addEventListener('keydown', e=>{
    if(e.key==='F12' || (e.ctrlKey && e.shiftKey && (e.key==='I' || e.key==='J')) || (e.ctrlKey && e.key==='U')){
      e.preventDefault();
      showToast('Code ni private bro 👑','error');
    }
  });

  console.log('🔥 Kirong Mansion v2.0 - All systems online 👑');
});

// ===== COPY EMAIL =====
function copyEmail(event) {
  const email='kirongjob@gmail.com';
  const btn = event ? event.currentTarget : null;
  navigator.clipboard.writeText(email).then(()=>{
    if(btn) {
      const originalText = btn.textContent;
      btn.textContent = 'Copied! ✅';
      setTimeout(() => btn.textContent = originalText, 2000);
    }
    showToast('Email copied! 📋');
  }).catch(()=>{
    showToast('Failed to copy 🥲','error');
  });
}

// ===== CHAT FUNCTIONS =====
function toggleChat() {
  const chat = document.getElementById('kirongChat');
  if(chat) chat.style.display = chat.style.display === 'flex' ? 'none' : 'flex';
}
async function sendMessage() {
  const input = document.getElementById("userInput");
  const chat = document.getElementById("chatMessages");
  if(!input || !chat) return;
  const message = input.value.trim();
  if (message === "") return;
  chat.innerHTML += `<div class="message user"><b>Wewe:</b> ${message}</div>`;
  input.value ="";
  chat.scrollTop = chat.scrollHeight;
  try{
    const response = await fetch("/.netlify/functions/gemini", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({message})
    });
    const data = await response.json();
    chat.innerHTML += `<div class="message bot"><b>Dr. Kirong 👑:</b> ${data.reply}</div>`;
    chat.scrollTop = chat.scrollHeight;
  }catch(e){
    chat.innerHTML += `<div class="message bot"><b>Dr. Kirong:</b> Pole, server iko busy. Jaribu tena ama WhatsApp me direct 👑</div>`;
  }
}
