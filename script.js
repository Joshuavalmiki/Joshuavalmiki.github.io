/* ==========================================================
   EDIT THIS BLOCK TO UPDATE YOUR SITE. Nothing below it needs touching.
   Journey status: "done" | "learning" | "next" | "goal"
   Skill level: 0 to 100. Be honest: it is your growth chart.
   Always add real things only (no invented achievements).
   ========================================================== */
const CONFIG = {
  updated: "2026-10-25",
  github: "https://github.com/Joshuavalmiki",
  email: "",
  linkedin: "",

  about: [
    "I'm Joshua Valmiki, known online as LOSERxTOBI. I'm building my cybersecurity foundations in public and working toward my first role as a SOC Level 1 Analyst.",
    "My current roadmap is TryHackMe Cyber Security 101 followed by SOC Level 1. I want to learn how defenders investigate alerts, understand logs, identify suspicious activity, and document incidents clearly.",
    "I believe in showing real progress. This portfolio will grow with my notes, completed labs, and practical projects—not inflated claims."
  ],

  journey: [
    { title: "TryHackMe Pre Security", status: "done", date: "Completed", desc: "Completed the Pre Security learning path and earned the SEC0 certification shown on my TryHackMe profile." },
    { title: "Cyber Security 101", status: "learning", date: "29% at last update", desc: "My current learning path for building broad cybersecurity knowledge. I'll update this milestone as I progress." },
    { title: "SOC Level 1", status: "next", date: "1% at last update", desc: "Next major focus: defensive security, alert triage, log analysis, and incident investigation through structured labs." },
    { title: "SOC Portfolio Projects", status: "next", date: "", desc: "Build and publish practical, clearly documented exercises using security logs, detection reasoning, findings, and remediation." },
    { title: "First Cybersecurity Role", status: "goal", date: "", desc: "Prepare for entry-level SOC L1 applications with demonstrable fundamentals, hands-on practice, a focused résumé, and interview preparation." },
    { title: "Broader Security Expertise", status: "goal", date: "", desc: "Long-term interests include penetration testing, security architecture, and eventually security leadership." }
  ],

  skills: [
    { name: "Linux", level: 30, note: "Fundamentals and terminal practice" },
    { name: "Networking", level: 25, note: "Core concepts, DNS, and protocols" },
    { name: "HTTP", level: 25, note: "Methods, headers, cookies, and sessions" },
    { name: "Web Security", level: 15, note: "Learning core vulnerability concepts" },
    { name: "Python", level: 20, note: "Basics and simple scripts" },
    { name: "Git & GitHub", level: 30, note: "Repositories, commits, and portfolio updates" },
    { name: "Log Analysis", level: 5, note: "Early learning stage" },
    { name: "Incident Response", level: 5, note: "Planned SOC learning focus" }
  ],

  projects: [
    {
      title: "Cybersecurity Journey",
      desc: "Daily learning logs and study notes covering foundational cybersecurity topics. The repository will grow as I complete more practice.",
      tech: ["Markdown", "Git", "GitHub"],
      link: "https://github.com/Joshuavalmiki/Cybersecurity-Journey"
    },
    {
      title: "Personal Portfolio",
      desc: "A hand-built portfolio using HTML, CSS, and JavaScript to document my learning roadmap and progress.",
      tech: ["HTML", "CSS", "JavaScript", "GitHub Pages"],
      link: "https://github.com/Joshuavalmiki/Joshuavalmiki.github.io"
    }
  ],

  achievements: [
    { title: "TryHackMe Pre Security — Certificate of Completion", detail: "Completed 26 June 2026 · 19 hours 10 minutes · Certificate ID: THM-ZT6BZDT99A", date: "", image: "assets/pre-security-certificate.svg", link: "https://tryhackme-certificates.s3-eu-west-1.amazonaws.com/THM-ZT6BZDT99A.pdf" },
    { title: "TryHackMe profile", detail: "Level 7 · Adept · Top 15% as shown in the screenshot shared on 25 Oct 2026", date: "" }
  ]
};


const $ = s => document.querySelector(s);
const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const STATUS = { done: "Completed", learning: "In progress", next: "Up next", goal: "Long-term goal" };

$("#about-text").innerHTML = CONFIG.about.map(p => `<p>${esc(p)}</p>`).join("");
const now = CONFIG.journey.filter(m => m.status === "learning").map(m => m.title);
$("#now").textContent = now.length ? "Currently learning: " + now.join(", ") : "";

// Journey timeline: one step open at a time
const tl = $("#timeline");
CONFIG.journey.forEach((m, i) => {
  const li = document.createElement("li");
  li.className = "node " + m.status;
  li.innerHTML = `<button aria-expanded="false" aria-controls="step${i}"><span class="dot"></span><span class="t">${esc(m.title)}</span><span class="s mono">${STATUS[m.status] || ""}${m.date ? " · " + esc(m.date) : ""}</span></button><p id="step${i}" hidden>${esc(m.desc)}</p>`;
  tl.appendChild(li);
});
const steps = [...tl.querySelectorAll("button")];
const toggle = b => {
  const open = b.getAttribute("aria-expanded") === "true";
  steps.forEach(x => { x.setAttribute("aria-expanded", "false"); $("#" + x.getAttribute("aria-controls")).hidden = true; });
  if (!open) { b.setAttribute("aria-expanded", "true"); $("#" + b.getAttribute("aria-controls")).hidden = false; }
};
steps.forEach(b => b.addEventListener("click", () => toggle(b)));
const first = CONFIG.journey.findIndex(m => m.status === "learning");
if (steps[first]) toggle(steps[first]);

$("#skills-grid").innerHTML = CONFIG.skills.map(s => {
  const v = Math.max(0, Math.min(100, Number(s.level) || 0));
  return `<div class="skill"><div class="ring" style="--p:${v}" role="img" aria-label="${esc(s.name)}: ${v} out of 100"><b>${v}</b></div><h3>${esc(s.name)}</h3><p>${esc(s.note || "")}</p></div>`;
}).join("");

$("#projects-grid").innerHTML = CONFIG.projects.map(p => `<article class="project"><h3>${esc(p.title)}</h3><p>${esc(p.desc)}</p><ul class="tags">${(p.tech || []).map(t => `<li>${esc(t)}</li>`).join("")}</ul>${p.link ? `<a href="${esc(p.link)}" target="_blank" rel="noopener">View on GitHub</a>` : ""}</article>`).join("");

$("#ach-list").innerHTML = CONFIG.achievements.length
  ? CONFIG.achievements.map(a => `<li>${a.image ? `<a class="certificate-preview" href="${esc(a.link || a.image)}" target="_blank" rel="noopener"><img src="${esc(a.image)}" alt="${esc(a.title)}"></a>` : ""}<strong>${esc(a.title)}</strong><span>${esc(a.detail || "")}${a.date ? " · " + esc(a.date) : ""}${a.link ? ` · <a href="${esc(a.link)}" target="_blank" rel="noopener">View certificate ↗</a>` : ""}</span></li>`).join("")
  : `<li class="empty">Nothing listed yet. Certifications, completed labs and real results will appear here as I earn them.</li>`;

const links = [["GitHub", CONFIG.github], ["Email", CONFIG.email && "mailto:" + CONFIG.email], ["LinkedIn", CONFIG.linkedin]];
$("#links").innerHTML = links.filter(l => l[1]).map((l, i) => `<a class="btn${i ? "" : " primary"}" href="${esc(l[1])}"${l[1].startsWith("http") ? ' target="_blank" rel="noopener"' : ""}>${l[0]}</a>`).join("");
$("#updated").textContent = "Last updated " + CONFIG.updated;

// HUD readouts, calculated from CONFIG
const nDone = CONFIG.journey.filter(m => m.status === "done").length;
const avg = CONFIG.skills.length ? Math.round(CONFIG.skills.reduce((a, s) => a + (Number(s.level) || 0), 0) / CONFIG.skills.length) : 0;
$("#telemetry").innerHTML = [["Milestones", nDone + "/" + CONFIG.journey.length], ["In progress", now.length], ["Avg skill", avg]]
  .map(r => `<div><b>${r[1]}</b><span>${r[0]}</span></div>`).join("");
const tick = () => { $("#clock").textContent = "SYS " + new Date().toLocaleTimeString("en-GB"); };
tick(); setInterval(tick, 1000);

// Cursor light
addEventListener("pointermove", e => {
  document.documentElement.style.setProperty("--mx", e.clientX + "px");
  document.documentElement.style.setProperty("--my", e.clientY + "px");
});

// Code rain: faint lines of code, like the ones behind the logo (skipped when reduced motion is requested)
(() => {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const c = $("#bg"), x = c.getContext("2d"), chars = "01<>/{}$#", size = 16;
  let w, h, drops;
  const fit = () => { w = c.width = innerWidth; h = c.height = innerHeight; drops = Array.from({ length: Math.ceil(w / 22) }, () => Math.random() * h / size | 0); };
  fit(); addEventListener("resize", fit);
  setInterval(() => {
    if (document.hidden) return;
    x.fillStyle = "rgba(8,7,8,.12)"; x.fillRect(0, 0, w, h);
    x.fillStyle = "rgba(253,244,243,.35)"; x.font = size + "px monospace";
    drops.forEach((d, i) => {
      x.fillText(chars[Math.random() * chars.length | 0], i * 22, d * size);
      drops[i] = d * size > h && Math.random() > .97 ? 0 : d + 1;
    });
  }, 70);
})();

// Boot sequence: once per session, click or any key to skip
(() => {
  const root = document.documentElement;
  if (!root.classList.contains("booting")) return;
  const el = document.createElement("div");
  el.id = "boot"; el.setAttribute("aria-hidden", "true");
  el.innerHTML = '<img src="assets/logo.jpg" alt="" width="84" height="84" onerror="this.remove()"><pre></pre><small>press any key or click to skip</small>';
  document.body.appendChild(el);
  const pre = el.querySelector("pre");
  const lines = ["> initializing interface", "> identity: JOSHUA VALMIKI", "> alias: LOSERxTOBI", "> loading modules: " + (now.join(", ") || "linux, networking"), "> status: learning in public", "> interface online"];
  let i = 0, ended = false;
  const finish = () => {
    if (ended) return; ended = true;
    try { sessionStorage.boot = 1; } catch (e) {}
    el.classList.add("off"); root.classList.remove("booting");
    setTimeout(() => el.remove(), 700);
  };
  const next = () => { if (ended) return; if (i < lines.length) { pre.textContent += lines[i++] + "\n"; setTimeout(next, 380); } else setTimeout(finish, 500); };
  next();
  el.addEventListener("click", finish);
  addEventListener("keydown", finish, { once: true });
})();
