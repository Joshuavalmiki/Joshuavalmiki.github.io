/* ==========================================================
   EDIT THIS BLOCK TO UPDATE YOUR SITE. Nothing below it needs touching.
   Journey status: "done" | "learning" | "next" | "goal"
   Skill level: 0 to 100. Be honest: it is your growth chart.
   Always add real things only (no invented achievements).
   ========================================================== */
const CONFIG = {
  updated: "2026-10-01",            // change this when you update the site
  github: "https://github.com/Joshuavalmiki",
  email: "",                        // e.g. "you@example.com" (hidden while empty)
  linkedin: "",                     // full URL (hidden while empty)

  about: [
    "I'm Joshua, and online I go by LOSERxTOBI. I'm a beginner in cybersecurity and I say so openly, because this site is a record of me getting better, not a show of what I already know.",
    "What pulls me in is understanding how systems work well enough to see where they can fail. I want to do that professionally as a penetration tester, and I'm aiming for OSCP as the proof that I can.",
    "I study a little every day, write down what I learn, and publish it here."
  ],

  journey: [
    { title: "Linux", status: "learning", date: "", desc: "Getting comfortable in the terminal: files, permissions, processes and the commands I'll use every day." },
    { title: "Networking", status: "learning", date: "", desc: "How data moves: IP, ports, DNS, and the protocols that attackers and defenders both depend on." },
    { title: "Web Security", status: "next", date: "", desc: "How HTTP works and how web apps break, using Burp Suite to inspect and test traffic." },
    { title: "Ethical Hacking", status: "next", date: "", desc: "Reconnaissance, enumeration and exploitation, practised legally in labs." },
    { title: "Penetration Testing", status: "next", date: "", desc: "Turning techniques into a repeatable method, plus writing clear reports." },
    { title: "OSCP", status: "goal", date: "", desc: "The long-term goal: earning the Offensive Security Certified Professional certification." }
    // Add a step: { title: "Bash scripting", status: "next", date: "Nov 2026", desc: "What it is and why." },
  ],

  skills: [
    { name: "Linux", level: 30, note: "Learning the terminal" },
    { name: "Networking", level: 25, note: "Core protocols and ports" },
    { name: "HTTP", level: 25, note: "Requests, responses, headers" },
    { name: "Web Security", level: 15, note: "Just starting" },
    { name: "Burp Suite", level: 10, note: "First steps" },
    { name: "Ethical Hacking", level: 15, note: "Fundamentals" },
    { name: "Python", level: 20, note: "Basics" },
    { name: "Git", level: 30, note: "Commits and GitHub Pages" }
  ],

  projects: [
    {
      title: "This portfolio",
      desc: "A hand-built site made with plain HTML, CSS and JavaScript. I update it as I learn, so it doubles as my learning log.",
      tech: ["HTML", "CSS", "JavaScript", "GitHub Pages"],
      link: "https://github.com/Joshuavalmiki"
    }
    // Add a project: { title: "", desc: "", tech: ["Python"], link: "https://github.com/Joshuavalmiki/repo" },
  ],

  // Only certifications, labs and results you have actually completed.
  achievements: [
    // { title: "Completed: Room or lab name", detail: "Platform, what you learned", date: "Oct 2026" },
  ]
};
/* ====================== END OF EDIT BLOCK ====================== */

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
  ? CONFIG.achievements.map(a => `<li><strong>${esc(a.title)}</strong><span>${esc(a.detail || "")}${a.date ? " · " + esc(a.date) : ""}</span></li>`).join("")
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
