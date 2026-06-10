// ─── PARTICLES ───
(function(){
  const canvas = document.getElementById('particles-canvas');
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];
  function resize(){ W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
  resize();
  window.addEventListener('resize', resize);
  for(let i=0;i<55;i++) particles.push({
    x: Math.random()*window.innerWidth,
    y: Math.random()*window.innerHeight,
    r: Math.random()*1.8+0.4,
    vx: (Math.random()-0.5)*0.25,
    vy: (Math.random()-0.5)*0.25,
    o: Math.random()*0.35+0.07
  });
  function draw(){
    ctx.clearRect(0,0,W,H);
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if(p.x<0)p.x=W; if(p.x>W)p.x=0;
      if(p.y<0)p.y=H; if(p.y>H)p.y=0;
      ctx.beginPath();
      ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fillStyle = `rgba(99,200,230,${p.o})`;
      ctx.fill();
    });
    // draw connections
    for(let i=0;i<particles.length;i++){
      for(let j=i+1;j<particles.length;j++){
        const dx=particles[i].x-particles[j].x, dy=particles[i].y-particles[j].y;
        const dist=Math.sqrt(dx*dx+dy*dy);
        if(dist<120){
          ctx.beginPath();
          ctx.strokeStyle=`rgba(99,200,230,${0.06*(1-dist/120)})`;
          ctx.lineWidth=0.6;
          ctx.moveTo(particles[i].x,particles[i].y);
          ctx.lineTo(particles[j].x,particles[j].y);
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }
  draw();
})();

// ─── TYPED ───
(function(){
  const el = document.getElementById('typed-text');
  const strings = ['AI/ML Engineer','Computer Vision Specialist','NLP Systems Builder','Deep Learning Researcher','Production AI Developer'];
  let si=0, ci=0, deleting=false;
  function type(){
    const s = strings[si];
    el.textContent = deleting ? s.substring(0,ci--) : s.substring(0,ci++);
    if(!deleting && ci===s.length+1){ setTimeout(()=>{deleting=true;},1400); setTimeout(type,100); return; }
    if(deleting && ci===0){ deleting=false; si=(si+1)%strings.length; setTimeout(type,300); return; }
    setTimeout(type, deleting?45:75);
  }
  setTimeout(type, 600);
})();

// ─── SCROLL REVEAL ───
(function(){
  const els = document.querySelectorAll('.reveal,.reveal-left,.reveal-right');
  const obs = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('visible'); obs.unobserve(e.target); } });
  },{threshold:0.12});
  els.forEach(e=>obs.observe(e));
})();

// ─── NAV SCROLL ───
window.addEventListener('scroll',()=>{
  const n=document.getElementById('navbar');
  n.style.background = window.scrollY>20 ? 'rgba(13,31,45,0.97)' : 'rgba(13,31,45,0.85)';
});

// ─── HAMBURGER ───
document.getElementById('hamburger').addEventListener('click',()=>{
  document.getElementById('mobileNav').classList.toggle('open');
});
function closeMobileNav(){ document.getElementById('mobileNav').classList.remove('open'); }

// ─── FLOATING CHAT ───
const floatBtn = document.getElementById('floatChatBtn');
const floatModal = document.getElementById('floatModal');
document.getElementById('floatModalClose').addEventListener('click',()=>floatModal.classList.remove('open'));
floatBtn.addEventListener('click',()=>floatModal.classList.toggle('open'));

// ─── VIEW ALL PROJECTS ───
let expanded = false;
function toggleExtraProjects(){
  expanded = !expanded;
  const extras = document.getElementById('extraProjects');
  const btn = document.getElementById('viewAllText');
  const icon = document.getElementById('viewAllIcon');
  if(expanded){
    extras.classList.add('visible');
    btn.textContent = 'Show Less';
    icon.className = 'fas fa-chevron-up';
    icon.style.marginLeft = '6px';
  } else {
    extras.classList.remove('visible');
    btn.textContent = 'View All 24 Projects';
    icon.className = 'fas fa-chevron-down';
    icon.style.marginLeft = '6px';
  }
  // trigger reveal for newly visible cards
  setTimeout(()=>{
    document.querySelectorAll('#extraProjects .reveal').forEach(el=>{
      el.classList.add('visible');
    });
  }, 50);
}

// ─── CONTRIBUTION GRAPH ───
(function(){
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const days = ['','Mon','','Wed','','Fri',''];
  const grid = document.getElementById('contribGrid');
  const monthsEl = document.getElementById('contribMonths');

  // Generate 52 weeks of data
  const seed = [0,0,0,1,1,2,0,1,0,0,1,2,3,1,0,0,1,2,2,4,3,2,1,0,0,1,3,4,3,2,1,0,1,2,3,2,1,0,0,1,2,3,4,3,2,1,0,1,2,3,4,3];
  
  // months row
  const now = new Date();
  for(let m=0;m<12;m++){
    const d = document.createElement('div');
    d.className = 'contrib-month';
    const mIdx = (now.getMonth() - 11 + m + 12) % 12;
    d.textContent = months[mIdx];
    monthsEl.appendChild(d);
  }

  for(let row=0;row<7;row++){
    const rowEl = document.createElement('div');
    rowEl.className = 'contrib-row';
    const lbl = document.createElement('div');
    lbl.className = 'contrib-day-label';
    lbl.textContent = days[row];
    rowEl.appendChild(lbl);
    const cells = document.createElement('div');
    cells.className = 'contrib-cells';
    for(let col=0;col<53;col++){
      const cell = document.createElement('div');
      cell.className = 'contrib-cell';
      const v = seed[(col+row)%seed.length];
      if(v===1)cell.classList.add('l1');
      else if(v===2)cell.classList.add('l2');
      else if(v===3)cell.classList.add('l3');
      else if(v===4)cell.classList.add('l4');
      const weekDate = new Date(now); weekDate.setDate(now.getDate()-(52-col)*7+row);
      const label = `${weekDate.toDateString()}: ${v} contribution${v!==1?'s':''}`;
      cell.addEventListener('mousemove',(e)=>{
        const tip = document.getElementById('contribTooltip');
        tip.textContent = label;
        tip.style.left = (e.clientX+12)+'px';
        tip.style.top = (e.clientY-28)+'px';
        tip.classList.add('show');
      });
      cell.addEventListener('mouseleave',()=>{
        document.getElementById('contribTooltip').classList.remove('show');
      });
      cells.appendChild(cell);
    }
    rowEl.appendChild(cells);
    grid.appendChild(rowEl);
  }
})();

// ─── STREAK COUNTER ANIMATION ───
(function(){
  const el = document.getElementById('streakCounter');
  const target = 14;
  const obs = new IntersectionObserver((entries)=>{
    if(entries[0].isIntersecting){
      let v=0;
      const t = setInterval(()=>{
        v += 1; el.textContent = v;
        if(v>=target){ clearInterval(t); }
      }, 60);
      obs.disconnect();
    }
  },{threshold:0.5});
  obs.observe(el);
})();

// ─── CONTACT FORM ───
const form = document.getElementById("contactForm");
const status = document.getElementById("formStatus");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("formName").value.trim();
  const email = document.getElementById("formEmail").value.trim();
  const subject = document.getElementById("formSubject").value.trim();
  const message = document.getElementById("formMessage").value.trim();

  // reset status
  status.style.display = "block";

  // validation
  if (!name || !email || !subject || !message) {
    status.innerText = "⚠ Please fill all fields properly.";
    status.style.color = "#ff6b6b";
    return;
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailPattern.test(email)) {
    status.innerText = "⚠ Enter a valid email address.";
    status.style.color = "#ff6b6b";
    return;
  }

  status.innerText = "Sending message...";
  status.style.color = "#58a6ff";

  const formData = new FormData(form);

  try {
    const res = await fetch(form.action, {
      method: "POST",
      body: formData,
      headers: {
        Accept: "application/json"
      }
    });

    if (res.ok) {
      status.innerText = "✓ Message sent successfully!";
      status.style.color = "#4ade80";
      form.reset();
    } else {
      status.innerText = "⚠ Failed to send. Try again.";
      status.style.color = "#ff6b6b";
    }

  } catch (err) {
    status.innerText = "⚠ Network error. Check connection.";
    status.style.color = "#ff6b6b";
  }
});

// ─── SMOOTH SCROLL ───
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click',e=>{
    const t = document.querySelector(a.getAttribute('href'));
    if(t){ e.preventDefault(); t.scrollIntoView({behavior:'smooth',block:'start'}); closeMobileNav(); }
  });
});

