/* TwoMeows — скрол-анімації */
(function () {
  "use strict";

  /* ── Поява секцій при прокрутці ── */
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("shown");
          revealObserver.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

  /* ── Котики: виглядають з боків, коли їхня секція у в'юпорті ──
     Секція позначається data-cat-section="ім'я",
     котик — data-cat="ім'я". Показуємо котика тієї секції,
     що зараз найближча до центру екрана. */
  const cats = document.querySelectorAll(".cat[data-cat]");
  const catSections = document.querySelectorAll("[data-cat-section]");
  if (cats.length && catSections.length) {
    const showCatFor = () => {
      // активна секція — та, що перекриває центральну смугу екрана
      // і чий центр найближчий до центру в'юпорта
      const vh = window.innerHeight;
      const center = vh / 2;
      let best = null;
      let bestDist = Infinity;
      catSections.forEach((sec) => {
        const r = sec.getBoundingClientRect();
        if (r.bottom < vh * 0.2 || r.top > vh * 0.8) return; // поза центральною смугою
        const dist = Math.abs(r.top + r.height / 2 - center);
        if (dist < bestDist) { bestDist = dist; best = sec; }
      });
      const active = best ? best.dataset.catSection : null;
      cats.forEach((cat) => {
        cat.classList.toggle("visible", cat.dataset.cat === active);
      });
    };

    // легкий тротлінг без rAF (rAF не спрацьовує у фонових вкладках)
    let lastRun = 0;
    let trailing = null;
    const onScroll = () => {
      const now = Date.now();
      if (now - lastRun > 80) {
        lastRun = now;
        showCatFor();
      } else if (!trailing) {
        trailing = setTimeout(() => { trailing = null; lastRun = Date.now(); showCatFor(); }, 90);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    showCatFor();
  }
})();
