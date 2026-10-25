(() => {
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  const toggle = document.getElementById("menu-toggle");
  const nav = document.getElementById("nav");
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
      toggle.textContent = open ? "[ CLOSE ]" : "[ MENU ]";
    });
    nav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
      nav.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.textContent = "[ MENU ]";
    }));
  }


  // Load the last successfully collected public TryHackMe snapshot.
  const thmPanel = document.getElementById("thm-stats-panel");
  if (thmPanel) {
    fetch("./tryhackme-progress.json", {cache: "no-store"})
      .then(response => {
        if (!response.ok) throw new Error("No successful snapshot yet");
        return response.json();
      })
      .then(data => {
        const stats = data.public_stats || {};
        const set = (id, value) => {
          const el = document.getElementById(id);
          if (el) el.textContent = value === undefined || value === null || value === "" ? "—" : String(value);
        };
        set("thm-status", "PUBLIC DATA UPDATED");
        set("thm-checked", data.checked_at_utc || "—");
        set("thm-points", stats.points);
        set("thm-rank", stats.rank);
        set("thm-level", stats.level);
        set("thm-rooms", data.completed_rooms_total_is_exact ? data.completed_rooms_total : String(data.completed_rooms_visible_on_first_page || 0) + " visible (first page)");
      })
      .catch(() => {
        const status = document.getElementById("thm-status");
        if (status) status.textContent = "No successful snapshot yet";
      });
  }

  // Low-key blue terminal rain: decorative only, with a reduced-motion fallback.
  const canvas = document.getElementById("matrix");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let width = 0, height = 0, drops = [], fontSize = 15, frame = 0;
  const chars = "01アイウエオカキクケコ<>[]{}:/\\|";
  function resize() {
    const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.floor(width * ratio);
    canvas.height = Math.floor(height * ratio);
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    const columns = Math.ceil(width / fontSize);
    drops = Array.from({length: columns}, () => Math.random() * -height / fontSize);
  }
  function draw() {
    if (reduceMotion) return;
    ctx.fillStyle = "rgba(8,13,20,0.12)";
    ctx.fillRect(0, 0, width, height);
    ctx.font = fontSize + "px IBM Plex Mono, monospace";
    for (let i = 0; i < drops.length; i++) {
      const char = chars[Math.floor(Math.random() * chars.length)];
      const x = i * fontSize;
      const y = drops[i] * fontSize;
      ctx.fillStyle = Math.random() > 0.985 ? "#c8e7ff" : "#368dd8";
      ctx.globalAlpha = Math.random() * 0.55 + 0.12;
      ctx.fillText(char, x, y);
      ctx.globalAlpha = 1;
      if (y > height && Math.random() > 0.975) drops[i] = Math.random() * -10;
      else drops[i] += 0.35 + Math.random() * 0.25;
    }
    frame = window.requestAnimationFrame(draw);
  }
  resize();
  if (!reduceMotion) draw();
  window.addEventListener("resize", resize, {passive:true});
  document.addEventListener("visibilitychange", () => {
    if (document.hidden && frame) window.cancelAnimationFrame(frame);
    else if (!document.hidden && !reduceMotion) draw();
  });
})();