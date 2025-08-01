// ==========================
// Smooth Scroll
// ==========================
document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        window.scrollTo({
          top: target.offsetTop - 50,
          behavior: 'smooth'
        });
      }
    });
  });
  
  // ==========================
  // Preloader
  // ==========================
  window.addEventListener('load', () => {
    const loader = document.getElementById('preloader');
    if (loader) loader.style.display = 'none';
  });
  
// ==========================
// Theme Toggle + Persistence
// ==========================
const toggleBtn = document.querySelector('.theme-toggle');
const body = document.body;
const githubStatsImg = document.getElementById('github-stats-img');

function updateGitHubStatsImage(isDark) {
  const darkTheme = 'radical'; // or 'github_dark'
  const lightTheme = 'default'; // or 'vue'

  githubStatsImg.src = `https://github-readme-stats.vercel.app/api?username=hamaylzahid&show_icons=true&theme=${isDark ? darkTheme : lightTheme}`;
}

function setTheme(isDark) {
  if (isDark) {
    body.classList.add('dark-mode');
    localStorage.setItem('theme', 'dark');
    toggleBtn.innerHTML = '<i class="fas fa-sun"></i>';
  } else {
    body.classList.remove('dark-mode');
    localStorage.setItem('theme', 'light');
    toggleBtn.innerHTML = '<i class="fas fa-moon"></i>';
  }
  updateGitHubStatsImage(isDark);
}

window.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('theme');
  const isDark = savedTheme === 'dark';
  setTheme(isDark);
});

toggleBtn.addEventListener('click', () => {
  const isDark = !body.classList.contains('dark-mode');
  setTheme(isDark);
});

  
  // ==========================
  // Scroll to Top
  // ==========================
  const scrollBtn = document.getElementById("scrollTopBtn");
  
  window.onscroll = () => {
    scrollBtn.style.display = (window.scrollY > 200) ? "block" : "none";
  };
  
  scrollBtn.onclick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  // ==========================
// Contact Form Validation with Inline Message
// ==========================
document.querySelector('#contactForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const name = this.querySelector('input[type="text"]').value.trim();
    const email = this.querySelector('input[type="email"]').value.trim();
    const message = this.querySelector('textarea').value.trim();
    const feedback = document.getElementById('formFeedback');
  
    if (!name || !email || !message) {
      feedback.textContent = '❗ Please fill in all fields.';
      feedback.className = 'error';
    } else {
      feedback.textContent = '✅ Thank you for your message!';
      feedback.className = 'success';
      this.reset();
    }
  
    feedback.style.opacity = 1;
    setTimeout(() => {
      feedback.style.opacity = 0;
    }, 4000);
  });
  
  
  // ==========================
  // AOS Initialization
  // ==========================
  AOS.init({
    duration: 1000,
    easing: 'ease-in-out',
    once: true,
    mirror: false
  });

  AOS.init({
    duration: 800,
    once: true
  });
  document.querySelectorAll('.flip-card').forEach(card => {
  card.addEventListener('mouseenter', (e) => {
    // Only flip if not hovering over demo button
    if (!e.target.closest('.demo-btn')) {
      card.classList.add('flip-hover');
    }
  });

  card.addEventListener('mouseleave', () => {
    card.classList.remove('flip-hover');
  });
});
document.addEventListener("DOMContentLoaded", function () {
  const maylBotBtn = document.getElementById("maylbot-button");
  maylBotBtn.addEventListener("click", function () {
    if (typeof chatbase === "function") {
      chatbase('open');
    } else {
      alert("Chatbot is still loading. Please try again in a second!");
    }
  });
});

