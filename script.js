/* ========== CONFIGURATION & STATE ========== */
const CONFIG = {
  particles: {
    count: 60,
    color: '#00e5ff',
    sizeRange: [1, 3],
    speedRange: [0.2, 0.8]
  },
  typed: {
    strings: ['Ideas', 'Sueños', 'Proyectos', 'Negocios'],
    typeSpeed: 100,
    backSpeed: 50,
    delay: 2000
  },
  stats: {
    duration: 2000
  },
  code: `function ManzaDev() {
  const mission = "Transforming ideas into code";
  const skills = [
    "Full-Stack Web",
    "Mobile Apps",
    "Artificial Intelligence",
    "Cloud Infrastructure"
  ];
  const priority = "User Experience & Security";

  return {
    status: "Ready to build",
    quality: "Premium",
    delivery: "On-time"
  };
}`
};

/* ========== INITIALIZATION ========== */
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initParticles();
  initTypedText();
  initCodeAnimation();
  initCounter();
  initAOS();
  initContactForm();
  initBackToTop();
  initFAQ();
});

/* ========== NAVBAR ========== */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
  });

  // Close menu when clicking a link
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('active');
    });
  });
}

/* ========== PARTICLES BG ========== */
function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let particles = [];

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * (CONFIG.particles.sizeRange[1] - CONFIG.particles.sizeRange[0]) + CONFIG.particles.sizeRange[0];
      this.speedX = (Math.random() - 0.5) * CONFIG.particles.speedRange[1];
      this.speedY = (Math.random() - 0.5) * CONFIG.particles.speedRange[1];
      this.opacity = Math.random() * 0.5 + 0.2;
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
        this.reset();
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = CONFIG.particles.color;
      ctx.globalAlpha = this.opacity;
      ctx.fill();
    }
  }

  function init() {
    resize();
    for (let i = 0; i < CONFIG.particles.count; i++) {
      particles.push(new Particle());
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    requestAnimationFrame(animate);
  }

  window.addEventListener('resize', resize);
  init();
  animate();
}

/* ========== TYPED TEXT ========== */
function initTypedText() {
  const el = document.getElementById('typed-text');
  if (!el) return;
  
  let strIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function type() {
    const current = CONFIG.typed.strings[strIndex];
    
    if (isDeleting) {
      el.textContent = current.substring(0, charIndex--);
    } else {
      el.textContent = current.substring(0, charIndex++);
    }

    let speed = isDeleting ? CONFIG.typed.backSpeed : CONFIG.typed.typeSpeed;

    if (!isDeleting && charIndex > current.length) {
      speed = CONFIG.typed.delay;
      isDeleting = true;
    } else if (isDeleting && charIndex < 0) {
      isDeleting = false;
      strIndex = (strIndex + 1) % CONFIG.typed.strings.length;
      charIndex = 0;
      speed = 500;
    }

    setTimeout(type, speed);
  }

  type();
}

/* ========== CODE ANIMATION ========== */
function initCodeAnimation() {
  const codeEl = document.getElementById('code-animation');
  if (!codeEl) return;

  let i = 0;
  const code = CONFIG.code;

  function typeCode() {
    if (i < code.length) {
      codeEl.textContent += code.charAt(i);
      i++;
      setTimeout(typeCode, 20);
    }
  }

  // Use Intersection Observer to start when visible
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      typeCode();
      observer.disconnect();
    }
  }, { threshold: 0.5 });

  observer.observe(codeEl);
}

/* ========== COUNTER STATS ========== */
function initCounter() {
  const stats = document.querySelectorAll('.stat-number');
  
  const animateCounter = (el) => {
    const target = parseInt(el.getAttribute('data-target'));
    const increment = target / (CONFIG.stats.duration / 16);
    let current = 0;

    const update = () => {
      current += increment;
      if (current < target) {
        el.textContent = Math.floor(current);
        requestAnimationFrame(update);
      } else {
        el.textContent = target;
      }
    };
    update();
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.8 });

  stats.forEach(s => observer.observe(s));
}

/* ========== AOS (Simple reveal) ========== */
function initAOS() {
  const elements = document.querySelectorAll('[data-aos]');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('aos-animate');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  // Add styles dynamically for AOS
  const style = document.createElement('style');
  style.innerHTML = `
    [data-aos] {
      opacity: 0;
      transform: translateY(30px);
      transition: opacity 1s ease, transform 1s cubic-bezier(0.4, 0, 0.2, 1);
    }
    [data-aos].aos-animate {
      opacity: 1;
      transform: translateY(0);
    }
    [data-aos-delay="100"] { transition-delay: 0.1s; }
    [data-aos-delay="200"] { transition-delay: 0.2s; }
    [data-aos-delay="300"] { transition-delay: 0.3s; }
    [data-aos-delay="400"] { transition-delay: 0.4s; }
    [data-aos-delay="500"] { transition-delay: 0.5s; }
  `;
  document.head.appendChild(style);

  elements.forEach(el => observer.observe(el));
}

/* ========== CONTACT FORM ========== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const success = document.getElementById('form-success');
  const btn = document.getElementById('submit-btn');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Simple validation
    const inputs = form.querySelectorAll('input, select, textarea');
    let isValid = true;

    inputs.forEach(input => {
      const errorMsg = document.getElementById(`error-${input.id}`);
      if (input.required && !input.value.trim()) {
        isValid = false;
        if (errorMsg) {
          errorMsg.textContent = 'Este campo es obligatorio';
          errorMsg.style.display = 'block';
        }
        input.style.borderColor = 'var(--accent)';
      } else {
        if (errorMsg) errorMsg.style.display = 'none';
        input.style.borderColor = 'var(--glass-border)';
      }
    });

    if (isValid) {
      btn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Enviando...';
      btn.disabled = true;

      // Real Netlify Form Submission
      const formData = new FormData(form);
      fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(formData).toString(),
      })
      .then(() => {
        form.reset();
        success.style.display = 'block';
        btn.innerHTML = '<i class="fas fa-check"></i> Enviado';
        
        setTimeout(() => {
          success.style.display = 'none';
          btn.innerHTML = '<i class="fas fa-paper-plane"></i> Enviar Consulta';
          btn.disabled = false;
        }, 5000);
      })
      .catch((error) => {
        console.error('Error:', error);
        btn.innerHTML = 'Error al enviar';
        btn.disabled = false;
      });
    }
  });
}

/* ========== FAQ ACCORDION ========== */
function initFAQ() {
  const faqItems = document.querySelectorAll('.faq-item');
  
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      
      // Close all other items
      faqItems.forEach(i => i.classList.remove('active'));
      
      // Toggle current item
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });
}

/* ========== BACK TO TOP ========== */
function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
      btn.classList.add('show');
    } else {
      btn.classList.remove('show');
    }
  });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ========== MANZA ASSISTANT & MARKETING LOGIC (2026) ========== */

document.addEventListener('DOMContentLoaded', () => {
    initManzaAssistant();
    initMarketingComponents();
});

function initManzaAssistant() {
    const bubble = document.getElementById('assistant-bubble');
    const assistantWindow = document.getElementById('assistant-window');
    const closeBtn = document.getElementById('close-assistant');
    const form = document.getElementById('assistant-form');
    const input = document.getElementById('assistant-input');
    const messagesContainer = document.getElementById('chat-messages');
    const quickReplyBtns = document.querySelectorAll('.quick-reply-btn');

    if (!bubble || !assistantWindow) return;

    let isTyping = false;

    bubble.addEventListener('click', () => {
        assistantWindow.classList.toggle('hidden');
        if (!assistantWindow.classList.contains('hidden')) {
            input.focus();
            if (messagesContainer.children.length === 0) {
                setTimeout(() => appendAssistantMsg("¡Hola! 👋 Soy el asistente de **ManzaDev**. ¿Cómo podemos potenciar tu proyecto hoy?"), 500);
            }
        }
    });

    if (closeBtn) {
        closeBtn.addEventListener('click', () => assistantWindow.classList.add('hidden'));
    }

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const text = input.value.trim();
            if (text && !isTyping) {
                input.value = '';
                appendMsg('user', text);
                getAIResponse(text.toLowerCase());
            }
        });
    }

    quickReplyBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const query = btn.getAttribute('data-query');
            const label = btn.textContent;
            if (!isTyping) {
                appendMsg('user', label);
                getAIResponse(query);
            }
        });
    });

    function appendMsg(sender, text) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `message ${sender}-msg`;
        msgDiv.innerHTML = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>');
        if (messagesContainer) {
            messagesContainer.appendChild(msgDiv);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
    }

    function appendAssistantMsg(text) {
        appendMsg('assistant', text);
    }

    function getAIResponse(query) {
        isTyping = true;
        const typing = document.createElement('div');
        typing.className = 'message assistant-msg';
        typing.innerHTML = '...';
        messagesContainer.appendChild(typing);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        setTimeout(() => {
            typing.remove();
            isTyping = false;
            let response = "";
            
            if (query.includes('hola')) response = "¡Hola! Un gusto saludarte. Soy el asistente de **ManzaDev**. ¿En qué puedo orientarte?";
            else if (query.includes('servicio')) response = "Expertos en: **Web (Next.js), Mobile (React Native), IA y Sistemas**. ¿Cuál te interesa?";
            else if (query.includes('presupuesto')) response = "Hacemos presupuestos a medida. ¡La primera reunión es **SIN CARGO**! ¿Te parece coordinar?";
            else if (query.includes('contacto')) response = "Directo al WhatsApp: **3725430303**. O dejanos tu número y te contactamos.";
            else response = "Excelente duda. En **ManzaDev** siempre buscamos la mejor arquitectura técnica. ¿Te gustaría profundizar?";

            appendAssistantMsg(response);
        }, 1500);
    }
}

function initMarketingComponents() {
    const promoBanner = document.getElementById('promo-banner');
    const closeBanner = document.getElementById('close-banner');
    const promoCta = document.getElementById('promo-cta');
    const leadModal = document.getElementById('lead-modal');
    const closeModal = document.getElementById('close-modal');
    const leadForm = document.getElementById('lead-form-modal');

    // Cerrar banner
    if (closeBanner) {
        closeBanner.addEventListener('click', () => promoBanner.classList.add('hidden'));
    }

    // CTA del banner
    if (promoCta) {
        promoCta.addEventListener('click', () => {
             const assistantWindow = document.getElementById('assistant-window');
             if(assistantWindow) assistantWindow.classList.remove('hidden');
             promoBanner.classList.add('hidden');
        });
    }

    // Lead Magnet despues de 5 segundos
    setTimeout(() => {
        if (leadModal && !sessionStorage.getItem('leadShown2026')) {
            leadModal.classList.remove('hidden');
            sessionStorage.setItem('leadShown2026', 'true');
        }
    }, 5000);

    if (closeModal) {
        closeModal.addEventListener('click', () => leadModal.classList.add('hidden'));
    }

    if (leadForm) {
        leadForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = leadForm.querySelector('button');
            if (btn) {
                btn.disabled = true;
                btn.innerText = "¡Enviado! Revisá tu WhatsApp 🚀";
                setTimeout(() => leadModal.classList.add('hidden'), 2500);
            }
        });
    }
}
