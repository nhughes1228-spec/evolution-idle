const researchDefs = [
  { id: "amino", page: 1, era: 1, name: "Amino Acids", icon: "🧬", color: "cyan", description: "Simple organic molecules begin to collect in the ancient sea.", baseTime: 1.4, timeScale: 1.18, gains: { biomass: 1 } },
  { id: "membranes", page: 1, era: 1, name: "Lipid Membranes", icon: "🛡️", color: "green", description: "Boundaries form. Inside and outside become meaningful.", baseTime: 1.8, timeScale: 1.2, gains: { stability: 1 } },
  { id: "rna", page: 1, era: 1, name: "RNA Strands", icon: "💡", color: "pink", description: "Information begins to store itself in fragile chains.", baseTime: 2.2, timeScale: 1.22, gains: { insight: 1 } },
  { id: "vents", page: 1, era: 1, name: "Hydrothermal Vents", icon: "⚡", color: "orange", description: "Mineral chimneys provide heat, pressure, and gradients.", baseTime: 2.6, timeScale: 1.24, gains: { energy: 1 } },
  { id: "catalysts", page: 1, era: 1, name: "Mineral Catalysts", icon: "⛏️", color: "blue", description: "Stone surfaces make unlikely reactions repeatable.", baseTime: 4, timeScale: 1.28, gains: { speed: 0.03 }, requires: { amino: 3, vents: 2 } },

  { id: "protocells", page: 2, era: 2, name: "Protocells", icon: "🫧", color: "green", description: "Chemistry gathers into tiny compartments with persistence.", baseTime: 5, timeScale: 1.25, gains: { biomass: 5, complexity: 1 } },
  { id: "replication", page: 2, era: 2, name: "Replication", icon: "🧬", color: "cyan", description: "Life learns the central trick: make another version of itself.", baseTime: 5.5, timeScale: 1.26, gains: { biomass: 8, adaptation: 1 } },
  { id: "metabolism", page: 2, era: 2, name: "Metabolism", icon: "⚡", color: "orange", description: "Energy becomes a managed process instead of a lucky accident.", baseTime: 6, timeScale: 1.27, gains: { energy: 4, biomass: 4 } },
  { id: "dna", page: 2, era: 2, name: "DNA", icon: "💡", color: "pink", description: "Genetic memory becomes sturdier and more expandable.", baseTime: 8, timeScale: 1.3, gains: { insight: 5, stability: 3, complexity: 2 } }
];

const defaultState = {
  selected: null,
  activePage: 1,
  highestPage: 1,
  firstLevelTen: null,
  progress: {},
  levels: {},
  resources: { biomass: 0, insight: 0, energy: 0, stability: 0, adaptation: 0, complexity: 0, tools: 0 },
  speedBonus: 0,
  lastTick: Date.now()
};

let state = JSON.parse(JSON.stringify(defaultState));
let lastFullRender = 0;
let lastSave = 0;

const els = {
  researchList: document.getElementById("researchList"),
  biomassDisplay: document.getElementById("biomassDisplay"),
  insightMult: document.getElementById("insightMult"),
  energyMult: document.getElementById("energyMult"),
  stabilityMult: document.getElementById("stabilityMult"),
  adaptationDisplay: document.getElementById("adaptationDisplay"),
  complexityDisplay: document.getElementById("complexityDisplay"),
  toolDisplay: document.getElementById("toolDisplay"),
  speedDisplay: document.getElementById("speedDisplay"),
  resetBtn: document.getElementById("resetBtn"),
  eraTwoTab: document.getElementById("eraTwoTab")
};

function level(s, id) { return s.levels[id] || 0; }
function format(num) { if (num < 1000) return num.toFixed(num < 10 ? 1 : 0); if (num < 1_000_000) return (num / 1000).toFixed(2) + "K"; if (num < 1_000_000_000) return (num / 1_000_000).toFixed(2) + "M"; return (num / 1_000_000_000).toFixed(2) + "B"; }
function gainText(def) { const icons = { biomass: "🧬", insight: "💡", energy: "⚡", stability: "🛡️", adaptation: "🧭", complexity: "✦", tools: "🔨", speed: "⏩" }; return Object.entries(def.gains).map(([key, value]) => `${key === "speed" ? "+" + Math.round(value * 100) + "%" : "+" + value} ${icons[key] || key}`).join(" "); }
function isUnlocked(def) { return def.page <= state.highestPage && (!def.requires || Object.entries(def.requires).every(([id, req]) => level(state, id) >= req)); }
function visibleResearch() { return researchDefs.filter(def => def.page === state.activePage); }
function researchTime(def) { return def.baseTime * Math.pow(def.timeScale, level(state, def.id)); }
function researchSpeed() { return 1 + state.speedBonus + state.resources.insight * 0.002 + state.resources.energy * 0.0015; }

function selectResearch(id) {
  const def = researchDefs.find(r => r.id === id);
  if (!def || !isUnlocked(def)) return;
  state.selected = state.selected === id ? null : id;
  renderFull(true);
  updateProgressBars();
  save();
}

function checkPageUnlock(def) {
  if (level(state, def.id) >= 10 && def.page === state.highestPage && state.highestPage < 2) {
    state.highestPage = 2;
    state.activePage = 2;
    state.selected = null;
    if (!state.firstLevelTen) state.firstLevelTen = def.id;
  }
}

function completeResearch(def) {
  state.progress[def.id] = 0;
  state.levels[def.id] = level(state, def.id) + 1;
  for (const [key, value] of Object.entries(def.gains)) {
    if (key === "speed") state.speedBonus += value;
    else state.resources[key] += value * (1 + level(state, def.id) * 0.08);
  }
  checkPageUnlock(def);
  renderFull(true);
}

function renderFull(force = false) {
  const now = Date.now();
  if (!force && now - lastFullRender < 500) return;
  lastFullRender = now;

  els.researchList.innerHTML = visibleResearch().map(def => {
    const unlocked = isUnlocked(def);
    const currentLevel = level(state, def.id);
    const reqText = def.requires ? Object.entries(def.requires).map(([id, req]) => `${researchDefs.find(r => r.id === id).name} ${req}`).join(" · ") : def.page > state.highestPage ? "Reach Level 10 on the previous page" : "Available";
    return `<button type="button" class="research-row ${def.color} ${state.selected === def.id ? "selected" : ""} ${unlocked ? "" : "locked"}" data-id="${def.id}">
      <div class="fill" data-fill="${def.id}"></div>
      <div class="level-box" data-level="${def.id}">${currentLevel}</div>
      <div class="research-main"><div class="research-title">${def.name}</div><div class="research-desc">${unlocked ? def.description : "Requires: " + reqText}</div></div>
      <div class="reward-box">${gainText(def)}<span class="row-icon">${def.icon}</span></div>
    </button>`;
  }).join("");

  renderResources();
  renderTabs();
}

function renderResources() {
  els.biomassDisplay.textContent = format(state.resources.biomass);
  els.insightMult.textContent = "x" + (1 + state.resources.insight * 0.01).toFixed(2);
  els.energyMult.textContent = "x" + (1 + state.resources.energy * 0.01).toFixed(2);
  els.stabilityMult.textContent = "x" + (1 + state.resources.stability * 0.01).toFixed(2);
  els.adaptationDisplay.textContent = format(state.resources.adaptation);
  els.complexityDisplay.textContent = format(state.resources.complexity);
  els.toolDisplay.textContent = format(state.resources.tools);
  els.speedDisplay.textContent = researchSpeed().toFixed(2);
}

function renderTabs() {
  document.querySelectorAll(".era-tab").forEach((tab, index) => {
    const page = index + 1;
    tab.classList.toggle("active", page === state.activePage);
    tab.classList.toggle("locked", page > state.highestPage);
  });
}

function updateProgressBars() {
  for (const def of visibleResearch()) {
    const fill = document.querySelector(`[data-fill="${def.id}"]`);
    if (!fill) continue;
    const progress = ((state.progress[def.id] || 0) / researchTime(def)) * 100;
    fill.style.transform = `scaleX(${Math.max(0, Math.min(1, progress / 100))})`;
  }
}

function save() { localStorage.setItem("evolutionIdleSaveV5", JSON.stringify(state)); }
function load() { const saved = localStorage.getItem("evolutionIdleSaveV5"); if (saved) state = { ...JSON.parse(JSON.stringify(defaultState)), ...JSON.parse(saved), lastTick: Date.now() }; }

els.researchList.addEventListener("click", event => {
  const row = event.target.closest(".research-row");
  if (row) selectResearch(row.dataset.id);
});

document.querySelectorAll(".era-tab").forEach((tab, index) => {
  tab.addEventListener("click", () => {
    const page = index + 1;
    if (page > state.highestPage) return;
    state.activePage = page;
    state.selected = null;
    renderFull(true);
    updateProgressBars();
    save();
  });
});

els.resetBtn.addEventListener("click", () => {
  if (!confirm("Reset your Evolution Idle save?")) return;
  localStorage.removeItem("evolutionIdleSaveV5");
  location.reload();
});

function loop() {
  const now = Date.now();
  const delta = Math.min(0.05, (now - state.lastTick) / 1000);
  state.lastTick = now;
  const active = researchDefs.find(r => r.id === state.selected);
  if (active && isUnlocked(active)) {
    state.progress[active.id] = (state.progress[active.id] || 0) + delta * researchSpeed();
    if (state.progress[active.id] >= researchTime(active)) completeResearch(active);
  }
  updateProgressBars();
  renderResources();
  renderTabs();
  if (now - lastSave > 1000) { save(); lastSave = now; }
  requestAnimationFrame(loop);
}

load();
renderFull(true);
updateProgressBars();
loop();
