const cur = document.getElementById('cur');
const tr1 = document.getElementById('tr1');
const tr2 = document.getElementById('tr2');

let mx = window.innerWidth / 2;
let my = window.innerHeight / 2;

let x1 = mx;
let y1 = my;
let x2 = mx;
let y2 = my;

document.addEventListener('mousemove', e => {
  mx = e.clientX;
  my = e.clientY;
});

function animateCursor() {
  if (!cur || !tr1 || !tr2) return;

  x1 += (mx - x1) * 0.18;
  y1 += (my - y1) * 0.18;

  x2 += (mx - x2) * 0.1;
  y2 += (my - y2) * 0.1;

  cur.style.transform = `translate3d(${mx - 12}px, ${my - 12}px, 0)`;
  tr1.style.transform = `translate3d(${x1 - 4.5}px, ${y1 - 4.5}px, 0)`;
  tr2.style.transform = `translate3d(${x2 - 3}px, ${y2 - 3}px, 0)`;

  requestAnimationFrame(animateCursor);
}

animateCursor();

window.addEventListener('scroll', () => {
  document.getElementById('mainNav').classList.toggle('scrolled', scrollY > 50);
  revealAll();
  countNums();
});

const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.dot');
let si = 0;

function goToSlide(index) {
  slides[si].classList.remove('active');
  dots[si].classList.remove('active');

  si = index;

  slides[si].classList.add('active');
  dots[si].classList.add('active');
}

function next() {
  goToSlide((si + 1) % slides.length);
}

setInterval(next, 4500);

dots.forEach(d => {
  d.addEventListener('click', () => {
    goToSlide(+d.dataset.i);
  });
});

function revealAll() {
  document.querySelectorAll('.reveal').forEach(el => {
    if (el.getBoundingClientRect().top < innerHeight * 0.9) {
      el.classList.add('visible');
    }
  });

  document.querySelectorAll('.card').forEach((c, i) => {
    if (c.getBoundingClientRect().top < innerHeight * 0.92) {
      setTimeout(() => c.classList.add('visible'), i * 65);
    }
  });
}

revealAll();

let counted = false;

function countNums() {
  if (counted) return;

  const row = document.querySelector('.stats-row');
  if (!row || row.getBoundingClientRect().top > innerHeight) return;

  counted = true;

  document.querySelectorAll('.stat-num[data-target]').forEach(el => {
    const tgt = +el.dataset.target;
    let n = 0;
    const step = Math.ceil(tgt / 38);

    const t = setInterval(() => {
      n = Math.min(n + step, tgt);
      el.textContent = n + '+';
      if (n >= tgt) clearInterval(t);
    }, 38);
  });
}

(function () {
  const canvas = document.getElementById('leafCanvas3D');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');

  function sz() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }

  sz();
  window.addEventListener('resize', sz);

  const ITEMS = Array.from({ length: 16 }, () => ({
    x: Math.random() * 500,
    y: Math.random() * 400,
    angle: Math.random() * Math.PI * 2,
    scale: 0.35 + Math.random() * 0.75,
    rot: (Math.random() - 0.5) * 0.018,
    driftX: (Math.random() - 0.5) * 0.45,
    driftY: -0.22 - Math.random() * 0.48,
    alpha: 0.35 + Math.random() * 0.5,
    hue: 100 + Math.random() * 60,
    phase: Math.random() * Math.PI * 2,
    type: Math.floor(Math.random() * 3),
  }));

  function drawItem(l) {
    ctx.save();
    ctx.translate(l.x, l.y);
    ctx.rotate(l.angle);
    ctx.scale(l.scale, l.scale);
    ctx.globalAlpha = l.alpha;

    if (l.type === 0) {
      ctx.beginPath();
      ctx.moveTo(0, -28);
      ctx.bezierCurveTo(20, -18, 26, 4, 17, 22);
      ctx.bezierCurveTo(8, 33, -8, 33, -17, 22);
      ctx.bezierCurveTo(-26, 4, -20, -18, 0, -28);
      ctx.fillStyle = `hsl(${l.hue},55%,42%)`;
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(0, -28);
      ctx.lineTo(0, 18);
      ctx.strokeStyle = `hsl(${l.hue},45%,30%)`;
      ctx.lineWidth = 1.8;
      ctx.stroke();
    } else if (l.type === 1) {
      ctx.beginPath();
      ctx.arc(0, 0, 11, 0, Math.PI * 2);
      ctx.fillStyle = `hsl(${l.hue + 30},65%,52%)`;
      ctx.fill();
    } else {
      ctx.beginPath();
      for (let i = 0; i < 5; i++) {
        const a = (i / 5) * Math.PI * 2 - Math.PI / 2;
        ctx.lineTo(Math.cos(a) * 15, Math.sin(a) * 15);
        const a2 = a + Math.PI / 5;
        ctx.lineTo(Math.cos(a2) * 7, Math.sin(a2) * 7);
      }
      ctx.closePath();
      ctx.fillStyle = `hsl(${l.hue - 25},72%,62%)`;
      ctx.fill();
    }

    ctx.restore();
  }

  function drawOrb(t) {
    const cx = canvas.width * 0.5;
    const cy = canvas.height * 0.44;
    const r = Math.min(canvas.width, canvas.height) * 0.28;

    const g = ctx.createRadialGradient(cx - r * 0.3, cy - r * 0.3, r * 0.04, cx, cy, r);
    g.addColorStop(0, 'rgba(149,213,178,.42)');
    g.addColorStop(0.5, 'rgba(82,183,136,.22)');
    g.addColorStop(1, 'rgba(64,145,108,.04)');

    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fillStyle = g;
    ctx.fill();

    for (let i = 0; i < 4; i++) {
      const ph = t * 0.7 + i * (Math.PI / 4);
      ctx.save();
      ctx.translate(cx, cy + Math.sin(ph) * r * 0.28);
      ctx.scale(1, 0.22);
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.86, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(82,183,136,${0.1 + i * 0.025})`;
      ctx.lineWidth = 1.5;
      ctx.setLineDash([7, 7]);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();
    }

    const sh = ctx.createRadialGradient(cx - r * 0.34, cy - r * 0.34, 2, cx - r * 0.18, cy - r * 0.18, r * 0.48);
    sh.addColorStop(0, 'rgba(255,255,255,.28)');
    sh.addColorStop(1, 'rgba(255,255,255,0)');

    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fillStyle = sh;
    ctx.fill();
  }

  function tick(ts) {
    const t = ts * 0.001;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#1b4332';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawOrb(t);

    ITEMS.forEach(l => {
      l.angle += l.rot;
      l.x += l.driftX + Math.sin(t + l.phase) * 0.3;
      l.y += l.driftY;

      if (l.y < -40) {
        l.y = canvas.height + 40;
        l.x = Math.random() * canvas.width;
      }

      drawItem(l);
    });

    requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
})();

(function () {
  const canvas = document.getElementById('natureCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');

  function sz() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }

  sz();
  window.addEventListener('resize', sz);

  const spores = Array.from({ length: 100 }, () => ({
    x: Math.random() * 2000,
    y: Math.random() * 500,
    r: 1 + Math.random() * 2.8,
    vy: 0.25 + Math.random() * 0.55,
    phase: Math.random() * Math.PI * 2,
    hue: 95 + Math.random() * 80,
    alpha: 0.25 + Math.random() * 0.5,
  }));

  const flies = Array.from({ length: 24 }, () => ({
    x: Math.random() * 1600,
    y: Math.random() * 500,
    phase: Math.random() * Math.PI * 2,
    speed: 0.32 + Math.random() * 0.8,
  }));

  function terrain(t) {
    const w = canvas.width;
    const h = canvas.height;

    for (let layer = 3; layer >= 1; layer--) {
      ctx.beginPath();
      ctx.moveTo(0, h);

      for (let x = 0; x <= w; x += 5) {
        const y =
          h * (0.3 + layer * 0.19) +
          Math.sin(x * 0.005 * layer + t * 0.34 + layer) * 26 * layer +
          Math.sin(x * 0.013 + t * 0.54) * 13;
        ctx.lineTo(x, y);
      }

      ctx.lineTo(w, h);
      ctx.lineTo(0, h);
      ctx.fillStyle = `rgba(64,145,108,${0.1 + layer * 0.08})`;
      ctx.fill();
    }
  }

  function anim(ts) {
    const t = ts * 0.001;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const bg = ctx.createLinearGradient(0, 0, 0, canvas.height);
    bg.addColorStop(0, '#0d2b1a');
    bg.addColorStop(1, '#081c15');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    terrain(t);

    spores.forEach(s => {
      s.y -= s.vy;
      s.x += Math.sin(t + s.phase) * 0.5;

      if (s.y < -5) {
        s.y = canvas.height + 5;
        s.x = Math.random() * canvas.width;
      }

      const g = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r * 3);
      g.addColorStop(0, `hsla(${s.hue},65%,55%,${s.alpha})`);
      g.addColorStop(1, `hsla(${s.hue},65%,55%,0)`);

      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r * 3, 0, Math.PI * 2);
      ctx.fillStyle = g;
      ctx.fill();
    });

    flies.forEach(f => {
      f.x += Math.cos(t * 0.6 + f.phase) * f.speed;
      f.y += Math.sin(t * 0.5 + f.phase * 0.7) * f.speed * 0.5;

      if (f.x > canvas.width + 20) f.x = -20;
      if (f.x < -20) f.x = canvas.width + 20;

      const gl = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, 9);
      const a = 0.5 + Math.sin(t * 2 + f.phase) * 0.4;
      gl.addColorStop(0, `rgba(190,255,85,${a})`);
      gl.addColorStop(1, 'rgba(190,255,85,0)');

      ctx.beginPath();
      ctx.arc(f.x, f.y, 9, 0, Math.PI * 2);
      ctx.fillStyle = gl;
      ctx.fill();
    });

    requestAnimationFrame(anim);
  }

  requestAnimationFrame(anim);
})();