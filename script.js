const navToggle = document.getElementById("nav-toggle");
const navMenu = document.getElementById("nav-menu");
const navLinks = navMenu ? [...navMenu.querySelectorAll("a[href^='#']")] : [];
const revealItems = [...document.querySelectorAll(".reveal")];
const rotatingText = document.getElementById("rotating-text");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Keep mobile navigation simple and accessible.

if (navToggle && navMenu) {
  navToggle.addEventListener("click", () => {
    const isOpen = navMenu.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
    document.body.classList.toggle("menu-open", isOpen);
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
      document.body.classList.remove("menu-open");
    });
  });
}

// Reveal sections as they enter the viewport for a polished one-page flow.
if (!prefersReducedMotion && revealItems.length > 0) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: "0px 0px -8% 0px",
    }
  );

  revealItems.forEach((item, index) => {
    item.style.transitionDelay = `${Math.min(index * 60, 360)}ms`;
    revealObserver.observe(item);
  });
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

if (rotatingText && !prefersReducedMotion) {
  const phrases = [
    "LLM workflows",
    "real-time ML systems",
    "NLP automation",
    "AI agents",
  ];

  let phraseIndex = 0;

  window.setInterval(() => {
    phraseIndex = (phraseIndex + 1) % phrases.length;
    rotatingText.textContent = phrases[phraseIndex];
  }, 2200);
}

const canvas = document.getElementById("particle-canvas");

if (canvas && !prefersReducedMotion) {
  const ctx = canvas.getContext("2d");
  const particles = [];
  const particleCount = 40;

  // Draw a light particle network to add depth without overwhelming the content.
  const resizeCanvas = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };

  const randomBetween = (min, max) => Math.random() * (max - min) + min;

  const createParticle = () => ({
    x: randomBetween(0, canvas.width),
    y: randomBetween(0, canvas.height),
    radius: randomBetween(1, 2.8),
    speedX: randomBetween(-0.25, 0.25),
    speedY: randomBetween(-0.2, 0.2),
    alpha: randomBetween(0.15, 0.6),
    hue: Math.random() > 0.5 ? 200 : 255,
  });

  const initParticles = () => {
    particles.length = 0;
    for (let index = 0; index < particleCount; index += 1) {
      particles.push(createParticle());
    }
  };

  const drawParticle = (particle) => {
    ctx.beginPath();
    ctx.fillStyle = `hsla(${particle.hue}, 100%, 70%, ${particle.alpha})`;
    ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
    ctx.fill();
  };

  const connectParticles = () => {
    for (let i = 0; i < particles.length; i += 1) {
      for (let j = i + 1; j < particles.length; j += 1) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 130) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(126, 111, 255, ${0.08 - distance / 2400})`;
          ctx.lineWidth = 1;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  };

  const updateParticles = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((particle) => {
      particle.x += particle.speedX;
      particle.y += particle.speedY;

      if (particle.x < -10 || particle.x > canvas.width + 10) {
        particle.speedX *= -1;
      }

      if (particle.y < -10 || particle.y > canvas.height + 10) {
        particle.speedY *= -1;
      }

      drawParticle(particle);
    });

    connectParticles();
    window.requestAnimationFrame(updateParticles);
  };

  resizeCanvas();
  initParticles();
  updateParticles();
  window.addEventListener("resize", () => {
    resizeCanvas();
    initParticles();
  });
} else if (canvas) {
  canvas.style.display = "none";
}
