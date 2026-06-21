(function(){
  "use strict";

  /* ---------- Preloader ---------- */
  window.addEventListener('load', function(){
    var pre = document.getElementById('preloader');
    setTimeout(function(){
      pre.classList.add('hide');
      setTimeout(function(){ pre.style.display = 'none'; }, 1300);
    }, 2200);
  });

  /* ---------- Navbar: scroll state + mobile menu ---------- */
  var nav = document.getElementById('nav');
  var burger = document.getElementById('nav-burger');
  var mobileMenu = document.getElementById('nav-mobile');
  var burgerIcon = document.getElementById('burger-icon');
  var menuOpen = false;

  function setBurgerIcon(open){
    burgerIcon.innerHTML = open
      ? '<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>'
      : '<path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16"/>';
  }

  burger.addEventListener('click', function(){
    menuOpen = !menuOpen;
    mobileMenu.classList.toggle('open', menuOpen);
    nav.classList.toggle('menu-open', menuOpen);
    burger.setAttribute('aria-expanded', String(menuOpen));
    setBurgerIcon(menuOpen);
  });

  mobileMenu.querySelectorAll('a').forEach(function(a){
    a.addEventListener('click', function(){
      menuOpen = false;
      mobileMenu.classList.remove('open');
      nav.classList.remove('menu-open');
      burger.setAttribute('aria-expanded', 'false');
      setBurgerIcon(false);
    });
  });

  function onScroll(){
    var y = window.scrollY || window.pageYOffset;
    nav.classList.toggle('scrolled', y > 40);

    var btt = document.getElementById('back-to-top');
    var showBtt = y > 600;
    btt.classList.toggle('show', showBtt);

    var tooltipEl = document.getElementById('chatbot-tooltip');
    tooltipEl.classList.toggle('beside-btt', showBtt);
  }
  window.addEventListener('scroll', onScroll, { passive:true });
  onScroll();

  document.getElementById('back-to-top').addEventListener('click', function(){
    window.scrollTo({ top:0, behavior:'smooth' });
  });

  /* ---------- Floating chatbot button tooltip ---------- */
  var fab = document.getElementById('chatbot-fab');
  var tooltip = document.getElementById('chatbot-tooltip');
  fab.addEventListener('mouseenter', function(){ tooltip.classList.add('show'); });
  fab.addEventListener('mouseleave', function(){ tooltip.classList.remove('show'); });
  setTimeout(function(){
    tooltip.classList.add('show');
    setTimeout(function(){ tooltip.classList.remove('show'); }, 3000);
  }, 3000);

  /* ---------- Scroll reveal (IntersectionObserver) ---------- */
  /* Watches both [data-reveal] (hero/about/process/contact/credentials fade-ups) and
     [data-card-reveal] (Systems project cards) so every reveal-style element
     in the page is covered by one observer. */
  var revealEls = document.querySelectorAll('[data-reveal], [data-card-reveal]');
  if ('IntersectionObserver' in window){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if (entry.isIntersecting){
          var delay = entry.target.getAttribute('data-trigger');
          if (delay){
            setTimeout(function(){ entry.target.classList.add('in'); }, Math.min(parseInt(delay,10) / 4, 400));
          } else {
            entry.target.classList.add('in');
          }
          io.unobserve(entry.target);
        }
      });
    }, { threshold:0.15, rootMargin:'0px 0px -60px 0px' });
    revealEls.forEach(function(el){ io.observe(el); });
  } else {
    revealEls.forEach(function(el){ el.classList.add('in'); });
  }

  /* ---------- Hero rotating keyword effect ---------- */
  var rotatorWords = ['intelligent systems.', 'computer vision.', 'RAG pipelines.', 'LLM applications.', 'production AI.'];
  var rotatorEl = document.getElementById('hero-rotator-word');
  var reduceMotionRotator = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (rotatorEl){
    if (reduceMotionRotator){
      rotatorEl.textContent = rotatorWords[0];
    } else {
      var wIndex = 0, charIndex = 0, typing = true;
      function typeLoop(){
        var word = rotatorWords[wIndex];
        if (typing){
          charIndex++;
          rotatorEl.textContent = word.slice(0, charIndex);
          if (charIndex >= word.length){
            typing = false;
            setTimeout(typeLoop, 1500);
            return;
          }
          setTimeout(typeLoop, 55);
        } else {
          charIndex--;
          rotatorEl.textContent = word.slice(0, charIndex);
          if (charIndex <= 0){
            typing = true;
            wIndex = (wIndex + 1) % rotatorWords.length;
            setTimeout(typeLoop, 300);
            return;
          }
          setTimeout(typeLoop, 28);
        }
      }
      typeLoop();
    }
  }

  /* ---------- Stats counter animation ---------- */
  /* Selects every .stat-count on the page — covers both the top Stats section
     and the Credentials summary strip, since both reuse this same class. */
  var statEls = document.querySelectorAll('.stat-count');
  if (statEls.length){
    var statObserver = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if (entry.isIntersecting){
          animateCount(entry.target);
          statObserver.unobserve(entry.target);
        }
      });
    }, { threshold:0.4 });
    statEls.forEach(function(el){ statObserver.observe(el); });
  }

  function animateCount(el){
    var target = parseInt(el.getAttribute('data-target'), 10) || 0;
    var duration = 1400;
    var startTime = null;

    function step(timestamp){
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target);
      if (progress < 1){
        requestAnimationFrame(step);
      } else {
        el.textContent = target;
      }
    }
    requestAnimationFrame(step);
  }

  /* ---------- Show more projects ---------- */
  var moreBtn = document.getElementById('btn-show-more');
  var extraGrid = document.getElementById('sys-grid-extra');
  if (moreBtn && extraGrid && extraGrid.children.length > 0){
    moreBtn.hidden = false;
    var extraCards = extraGrid.querySelectorAll('[data-card-reveal]');
    moreBtn.addEventListener('click', function(){
      var isShown = extraGrid.classList.toggle('show');
      moreBtn.classList.toggle('expanded', isShown);
      var label = moreBtn.querySelector('.btn-more-label');
      if (label) label.textContent = isShown ? 'Show Less' : 'Show More Projects';
      if (isShown){
        extraCards.forEach(function(el){
          if ('IntersectionObserver' in window) io.observe(el);
          else el.classList.add('in');
        });
      }
    });
  }

  /* ---------- Hero canvas: lightweight particle field (video replacement) ---------- */
  var canvas = document.getElementById('hero-canvas');
  var ctx = canvas.getContext('2d');
  var particles = [];
  var dpr = Math.min(window.devicePixelRatio || 1, 2);
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function resizeCanvas(){
    var hero = document.querySelector('.hero');
    var w = hero.clientWidth, h = hero.clientHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    ctx.setTransform(dpr,0,0,dpr,0,0);
  }

  function initParticles(){
    var hero = document.querySelector('.hero');
    var count = Math.max(28, Math.floor((hero.clientWidth * hero.clientHeight) / 28000));
    particles = [];
    for (var i=0; i<count; i++){
      particles.push({
        x: Math.random() * hero.clientWidth,
        y: Math.random() * hero.clientHeight,
        r: Math.random() * 1.6 + 0.6,
        vx: (Math.random() - 0.5) * 0.18,
        vy: (Math.random() - 0.5) * 0.18,
        a: Math.random() * 0.5 + 0.15
      });
    }
  }

  function drawFrame(){
    var hero = document.querySelector('.hero');
    var w = hero.clientWidth, h = hero.clientHeight;
    ctx.clearRect(0,0,w,h);

    // subtle vignette gradient base
    var grad = ctx.createLinearGradient(0,0,0,h);
    grad.addColorStop(0, 'rgba(20,0,0,0.5)');
    grad.addColorStop(1, 'rgba(0,0,0,0.85)');
    ctx.fillStyle = grad;
    ctx.fillRect(0,0,w,h);

    for (var i=0; i<particles.length; i++){
      var p = particles[i];
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = w; if (p.x > w) p.x = 0;
      if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
      ctx.fillStyle = 'rgba(255,255,255,' + p.a + ')';
      ctx.fill();
    }

    // connecting lines for nearby particles (subtle network feel)
    for (var i=0; i<particles.length; i++){
      for (var j=i+1; j<particles.length; j++){
        var dx = particles[i].x - particles[j].x;
        var dy = particles[i].y - particles[j].y;
        var dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 120){
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = 'rgba(255,42,42,' + (0.12 * (1 - dist/120)) + ')';
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    if (!reduceMotion) requestAnimationFrame(drawFrame);
  }

  resizeCanvas();
  initParticles();
  drawFrame();
  if (reduceMotion){
    // draw a single static frame, no loop
    drawFrame();
  }

  var resizeTimer;
  window.addEventListener('resize', function(){
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function(){
      resizeCanvas();
      initParticles();
      if (reduceMotion) drawFrame();
    }, 150);
  });

  /* ---------- Process: scroll-driven dashed path fill + active card ---------- */
  var stage = document.getElementById('process-stage');
  var fillDesktop = document.getElementById('path-fill-desktop');
  var fillMobile = document.getElementById('path-fill-mobile');
  var lenDesktop = fillDesktop.getTotalLength();
  var lenMobile = fillMobile.getTotalLength();

  [fillDesktop, fillMobile].forEach(function(path, idx){
    var len = idx === 0 ? lenDesktop : lenMobile;
    path.style.strokeDasharray = len + ' ' + len;
    path.style.strokeDashoffset = len;
  });

  var cards = Array.prototype.slice.call(document.querySelectorAll('.tag-card'));

  function updateProcessScroll(){
    var rect = stage.getBoundingClientRect();
    var vh = window.innerHeight;
    var total = rect.height + vh;
    var progressed = vh - rect.top;
    var progress = Math.max(0, Math.min(1, progressed / total));

    var offD = lenDesktop * (1 - progress);
    var offM = lenMobile * (1 - progress);
    fillDesktop.style.strokeDashoffset = offD;
    fillMobile.style.strokeDashoffset = offM;

    cards.forEach(function(card){
      var trig = parseInt(card.getAttribute('data-trigger') || '0', 10);
      var threshold = trig / 1350;
      card.classList.toggle('is-active', progress >= threshold && progress < threshold + 0.22);
    });
  }

  window.addEventListener('scroll', updateProcessScroll, { passive:true });
  window.addEventListener('resize', updateProcessScroll);
  updateProcessScroll();

  /* ---------- Contact form: mailto handoff ---------- */
  var form = document.getElementById('contact-form');
  form.addEventListener('submit', function(e){
    e.preventDefault();
    var name = document.getElementById('cf-name').value.trim();
    var email = document.getElementById('cf-email').value.trim();
    var message = document.getElementById('cf-message').value.trim();

    var subject = encodeURIComponent('Portfolio inquiry from ' + (name || 'website visitor'));
    var body = encodeURIComponent(
      'Name: ' + name + '\n' +
      'Email: ' + email + '\n\n' +
      'Message:\n' + message
    );
    window.location.href = 'mailto:hamaylzahid@gmail.com?subject=' + subject + '&body=' + body;

    document.getElementById('form-fields').style.display = 'none';
    document.getElementById('form-success').classList.add('show');
  });

  /* ---------- Footer year ---------- */
  document.getElementById('year').textContent = '2026';

})();
