/**
 * NEXUS AI — Animation Engine & Visual Effects
 * 60fps particle mesh canvas, smooth number counters, and token streaming
 */

window.NexusAnimations = {
  particleAnimationId: null,

  initParticleCanvas(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let width = (canvas.width = canvas.parentElement.offsetWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement.offsetHeight || 600);

    const particles = [];
    const particleCount = window.innerWidth < 768 ? 35 : 70;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        radius: Math.random() * 1.8 + 0.8,
        color: Math.random() > 0.4 ? "rgba(0, 240, 255, " : "rgba(99, 102, 241, ",
        alpha: Math.random() * 0.5 + 0.2
      });
    }

    const mouse = { x: -1000, y: -1000 };

    window.addEventListener("mousemove", (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 110) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(0, 240, 255, ${0.18 * (1 - dist / 110)})`;
            ctx.lineWidth = 0.75;
            ctx.stroke();
          }
        }
      }

      // Update and draw particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        // Mouse interaction
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 90) {
          p.x -= (dx / dist) * 1.5;
          p.y -= (dy / dist) * 1.5;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color + p.alpha + ")";
        ctx.shadowBlur = 8;
        ctx.shadowColor = "#00F0FF";
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      this.particleAnimationId = requestAnimationFrame(render);
    };

    render();

    window.addEventListener("resize", () => {
      if (canvas && canvas.parentElement) {
        width = canvas.width = canvas.parentElement.offsetWidth || window.innerWidth;
        height = canvas.height = canvas.parentElement.offsetHeight || 600;
      }
    });
  },

  animateCounter(element, targetValue, duration = 1500, suffix = "") {
    if (!element) return;
    const start = 0;
    const startTime = performance.now();

    const update = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOutQuad = 1 - (1 - progress) * (1 - progress);
      const current = Math.floor(start + (targetValue - start) * easeOutQuad);

      element.textContent = current.toLocaleString() + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    };

    requestAnimationFrame(update);
  },

  triggerConfetti() {
    if (typeof confetti !== "undefined") {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#00F0FF", "#3B82F6", "#8B5CF6", "#10B981"]
      });
    }
  },

  streamText(targetElement, fullText, speed = "fast", onComplete = null) {
    if (!targetElement) return;
    let index = 0;
    const delay = speed === "instant" ? 0 : speed === "fast" ? 12 : 28;

    if (speed === "instant") {
      targetElement.innerHTML = fullText;
      if (onComplete) onComplete();
      return;
    }

    targetElement.innerHTML = "";
    const interval = setInterval(() => {
      if (index < fullText.length) {
        // Stream in chunks of characters for fast feel
        const chunkSize = speed === "fast" ? 3 : 1;
        targetElement.innerHTML = fullText.substring(0, index + chunkSize) + '<span class="chat-cursor-blink"></span>';
        index += chunkSize;
      } else {
        clearInterval(interval);
        targetElement.innerHTML = fullText;
        if (onComplete) onComplete();
      }
    }, delay);

    return () => clearInterval(interval);
  }
};
