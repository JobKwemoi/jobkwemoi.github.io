document.addEventListener('DOMContentLoaded', () => {

  /* ---------- LOADER ---------- */
  window.addEventListener('load', () => {
    setTimeout(() => document.getElementById('loader').classList.add('hidden'), 400);
  });

  /* ---------- PROGRESS BAR ---------- */
  const progressBar = document.getElementById('progressBar');
  window.addEventListener('scroll', () => {
    const h = document.documentElement;
    const scrolled = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
    progressBar.style.width = scrolled + '%';
  });

  /* ---------- LANGUAGE TOGGLE ---------- */
  const btnEn = document.getElementById('btn-en');
  const btnSwa = document.getElementById('btn-swa');
  const bilingualEls = document.querySelectorAll('[data-en][data-swa]');

  function setLang(lang) {
    bilingualEls.forEach(el => { el.innerHTML = el.getAttribute('data-' + lang); });
    btnEn.classList.toggle('active', lang === 'en');
    btnSwa.classList.toggle('active', lang === 'swa');
    document.documentElement.lang = lang === 'swa' ? 'sw' : 'en';
  }
  btnEn.addEventListener('click', () => setLang('en'));
  btnSwa.addEventListener('click', () => setLang('swa'));

  /* ---------- THEME TOGGLE ---------- */
  const themeToggle = document.getElementById('themeToggle');
  themeToggle.addEventListener('click', () => {
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    document.documentElement.setAttribute('data-theme', isLight ? 'dark' : 'light');
    themeToggle.textContent = isLight ? '🌙' : '☀️';
  });

  /* ---------- MOBILE NAV ---------- */
  const navBurger = document.getElementById('navBurger');
  const navMobile = document.getElementById('navMobile');
  navBurger.addEventListener('click', () => navMobile.classList.toggle('open'));
  navMobile.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navMobile.classList.remove('open')));

  /* ---------- SCROLL SPY ---------- */
  const sections = document.querySelectorAll('section[id]');
  const navDots = document.querySelectorAll('.nav-dot a');
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 140;
      if (window.scrollY >= top) current = sec.id;
    });
    navDots.forEach(dot => dot.classList.toggle('active', dot.dataset.section === current));

    const scrollBtn = document.getElementById('scrollTopBtn');
    scrollBtn.classList.toggle('show', window.scrollY > 500);
  });

  /* ---------- SCROLL REVEAL ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(el => io.observe(el));

  /* ---------- STAT COUNTERS ---------- */
  const statNumbers = document.querySelectorAll('.stat-number');
  const statIo = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseFloat(el.dataset.target);
      const isDecimal = el.dataset.decimal === 'true';
      let current = 0;
      const step = target / 40;
      const timer = setInterval(() => {
        current += step;
        if (current >= target) { current = target; clearInterval(timer); }
        el.textContent = isDecimal ? current.toFixed(1) : Math.floor(current);
      }, 25);
      statIo.unobserve(el);
    });
  }, { threshold: 0.5 });
  statNumbers.forEach(el => statIo.observe(el));

  /* ---------- PHONE CHAT ANIMATION ---------- */
  const phoneBody = document.getElementById('phoneBody');
  const chatScript = [
    { side: 'in', text: 'Hi! Do you have chapati and beans today?' },
    { side: 'out', text: 'Yes! Ready in 10 min 🍽️' },
    { side: 'in', text: '2 plates please, deliver to Milimani' },
    { side: 'out', text: 'Order confirmed ✅ KES 240' },
    { side: 'in', text: 'Perfect, sending payment now' }
  ];
  let chatIndex = 0;
  function playChat() {
    if (chatIndex >= chatScript.length) {
      setTimeout(() => { phoneBody.innerHTML = ''; chatIndex = 0; playChat(); }, 2200);
      return;
    }
    const msg = chatScript[chatIndex];
    const bubble = document.createElement('div');
    bubble.className = 'phone-bubble ' + msg.side;
    bubble.textContent = msg.text;
    phoneBody.appendChild(bubble);
    while (phoneBody.children.length > 4) phoneBody.removeChild(phoneBody.firstChild);
    chatIndex++;
    setTimeout(playChat, 1500);
  }
  playChat();

  /* ---------- TERMINAL TYPE EFFECT ---------- */
  const terminalBody = document.getElementById('terminalBody');
  const terminalLines = [
    { cmd: '$ stack --frontend', out: 'HTML5, CSS3, JavaScript, React' },
    { cmd: '$ stack --styling', out: 'Tailwind CSS, Vanilla CSS' },
    { cmd: '$ stack --deploy', out: 'Netlify, basic SEO setup' },
    { cmd: '$ whoami', out: 'Job Kwemoi — developer, Nairobi 🇰🇪' }
  ];
  const termIo = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { typeTerminal(); termIo.unobserve(entry.target); }
    });
  }, { threshold: 0.4 });
  termIo.observe(terminalBody);

  function typeTerminal() {
    let i = 0;
    function nextLine() {
      if (i >= terminalLines.length) return;
      const line = terminalLines[i];
      const cmdEl = document.createElement('div');
      cmdEl.className = 'cmd';
      terminalBody.appendChild(cmdEl);
      let c = 0;
      const typer = setInterval(() => {
        cmdEl.textContent = line.cmd.slice(0, c + 1);
        c++;
        if (c >= line.cmd.length) {
          clearInterval(typer);
          const outEl = document.createElement('div');
          outEl.className = 'out';
          outEl.textContent = line.out;
          terminalBody.appendChild(outEl);
          i++;
          setTimeout(nextLine, 400);
        }
      }, 28);
    }
    nextLine();
  }

  /* ---------- PROJECT FILTER ---------- */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      projectCards.forEach(card => {
        const match = filter === 'all' || card.dataset.category === filter;
        card.classList.toggle('hide', !match);
      });
    });
  });

  /* ---------- VISITOR COUNTER ---------- */
  const visitorEl = document.getElementById('visitorCount');
  setInterval(() => {
    const base = 247;
    const wiggle = Math.floor(Math.random() * 9) - 4;
    visitorEl.textContent = base + wiggle;
  }, 4000);

  /* ---------- COPY EMAIL ---------- */
  window.copyEmail = function (e) {
    e.preventDefault();
    navigator.clipboard.writeText('kirongjob@gmail.com').then(showToast);
  };
  function showToast() {
    const toast = document.getElementById('toast');
    toast.textContent = 'Email copied ✅';
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2200);
  }

  /* ---------- SCROLL TO TOP ---------- */
  document.getElementById('scrollTopBtn').addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

});
