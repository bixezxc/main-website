  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  navToggle.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', open);
  });
  navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  }));

  // Scroll reveal
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduceMotion){
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting){ e.target.classList.add('is-visible'); io.unobserve(e.target); } });
    }, { threshold: 0.15 });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('is-visible'));
  }

  // Terminal typewriter
  const lines = [
    { prompt: '$', text: 'whoami', isCommand: true },
    { prompt: '>', text: 'Samost — Python-разработчик', isCommand: false },
    { prompt: '$', text: 'cat about.txt', isCommand: true },
    { prompt: '>', text: 'Пишу backend, автоматизирую рутину, разбираюсь в деталях.', isCommand: false },
  ];
  const body = document.getElementById('terminalBody');

  function renderStatic(){
    body.innerHTML = lines.map(l =>
      `<div class="terminal-line"><span class="prompt">${l.prompt}</span><span class="${l.isCommand ? 'out' : 'out'}"><strong>${l.text}</strong></span></div>`
    ).join('');
  }

  if (reduceMotion){
    renderStatic();
  } else {
    let li = 0;
    function typeLine(){
      if (li >= lines.length) return;
      const { prompt, text } = lines[li];
      const row = document.createElement('div');
      row.className = 'terminal-line';
      row.innerHTML = `<span class="prompt">${prompt}</span><span class="type-target"></span>`;
      body.appendChild(row);
      const target = row.querySelector('.type-target');
      const cursor = document.createElement('span');
      cursor.className = 'cursor';
      row.appendChild(cursor);

      let ci = 0;
      const speed = 28;
      (function typeChar(){
        if (ci < text.length){
          target.textContent += text[ci];
          ci++;
          setTimeout(typeChar, speed);
        } else {
          cursor.remove();
          li++;
              setTimeout(typeLine, 260);
        }
      })();
    }
    // start once terminal is visible
    const startObserver = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting){ typeLine(); startObserver.disconnect(); } });
    }, { threshold: 0.3 });
    startObserver.observe(document.getElementById('terminal'));
  }
  window.addEventListener("load", () => {
    document.body.classList.add("loaded");
});