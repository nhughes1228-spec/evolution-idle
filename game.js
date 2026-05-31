const IDEA_TYPES = {
  pink: { label: "Pink Ideas", icon: "💡" },
  blue: { label: "Blue Ideas", icon: "💡" },
  green: { label: "Green Ideas", icon: "💡" }
};

const researchDefs = [
  { id: "amino", page: 1, era: 1, name: "Amino Acids", type: "green", description: "Simple organic molecules begin to collect in the ancient sea.", baseTime: 1.4, timeScale: 1.18, kind: "concept" },
  { id: "membranes", page: 1, era: 1, name: "Lipid Membranes", type: "blue", description: "Boundaries form. Inside and outside become meaningful.", baseTime: 1.8, timeScale: 1.2, kind: "concept" },
  { id: "rna", page: 1, era: 1, name: "RNA Strands", type: "pink", description: "Information begins to store itself in fragile chains.", baseTime: 2.2, timeScale: 1.22, kind: "concept" },
  { id: "vents", page: 1, era: 1, name: "Hydrothermal Vents", type: "blue", description: "Mineral chimneys provide heat, pressure, and gradients.", baseTime: 2.6, timeScale: 1.24, kind: "concept" },
  { id: "greenRate", page: 1, era: 1, name: "Green Idea Rate", type: "green", description: "Increase the speed of every green idea this round.", baseTime: 4, timeScale: 1.28, kind: "rate", boosts: "green", requires: { amino: 3 } },
  { id: "blueRate", page: 1, era: 1, name: "Blue Idea Rate", type: "blue", description: "Increase the speed of every blue idea this round.", baseTime: 4, timeScale: 1.28, kind: "rate", boosts: "blue", requires: { membranes: 3 } },
  { id: "pinkRate", page: 1, era: 1, name: "Pink Idea Rate", type: "pink", description: "Increase the speed of every pink idea this round.", baseTime: 4, timeScale: 1.28, kind: "rate", boosts: "pink", requires: { rna: 3 } },

  { id: "protocells", page: 2, era: 2, name: "Protocells", type: "green", description: "Chemistry gathers into tiny compartments with persistence.", baseTime: 5, timeScale: 1.25, kind: "concept" },
  { id: "replication", page: 2, era: 2, name: "Replication", type: "pink", description: "Life learns the central trick: make another version of itself.", baseTime: 5.5, timeScale: 1.26, kind: "concept" },
  { id: "metabolism", page: 2, era: 2, name: "Metabolism", type: "blue", description: "Energy becomes a managed process instead of a lucky accident.", baseTime: 6, timeScale: 1.27, kind: "concept" },
  { id: "dna", page: 2, era: 2, name: "DNA", type: "pink", description: "Genetic memory becomes sturdier and more expandable.", baseTime: 8, timeScale: 1.3, kind: "concept" },
  { id: "homeostasis", page: 2, era: 2, name: "Homeostasis", type: "green", description: "Cells maintain internal balance against a hostile world.", baseTime: 7, timeScale: 1.29, kind: "concept" }
];

const defaultState = {
  selected: null,
  activePage: 1,
  highestPage: 1,
  firstLevelTen: null,
  progress: {},
  levels: {},
  ideaRates: { pink: 1, blue: 1, green: 1 },
  prestigeIdeaRates: { pink: 1, blue: 1, green: 1 },
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
  resetBtn: document.getElementById("resetBtn")
};

function level(s, id) { return s.levels[id] || 0; }
function format(num) { if (num < 1000) return num.toFixed(num < 10 ? 1 : 0); if (num < 1_000_000) return (num / 1000).toFixed(2) + "K"; return (num / 1_000_000).toFixed(2) + "M"; }
function ideaRate(type) { return (state.ideaRates[type] || 1) * (state.prestigeIdeaRates[type] || 1); }
function rewardText(def) { return def.kind === "rate" ? `+0.10 ${IDEA_TYPES[def.boosts].icon}` : `+1 ${IDEA_TYPES[def.type].icon}`; }
function isUnlocked(def) { return def.page <= state.highestPage && (!def.requires || Object.entries(def.requires).every(([id, req]) => level(state, id) >= req)); }
function visibleResearch() { return researchDefs.filter(def => def.page === state.activePage); }
function researchTime(def) { return def.baseTime * Math.pow(def.timeScale, level(state, def.id)); }
function researchSpeed(def) { return ideaRate(def.type); }

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
  if (def.kind === "rate") state.ideaRates[def.boosts] += 0.1;
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
    return `<button type="button" class="research-row ${def.type} ${state.selected === def.id ? "selected" : ""} ${unlocked ? "" : "locked"}" data-id="${def.id}">
      <div class="fill" data-fill="${def.id}"></div>
      <div class="level-box" data-level="${def.id}">${currentLevel}</div>
      <div class="research-main"><div class="research-title">${def.name}</div><div class="research-desc">${unlocked ? def.description : "Requires: " + reqText}</div></div>
      <div class="reward-box"><span>${rewardText(def)}</span><span class="row-icon ${def.type}">${IDEA_TYPES[def.type].icon}</span></div>
    </button>`;
  }).join("");
  renderResources();
  renderTabs();
}

function renderResources() {
  els.biomassDisplay.textContent = `Pink ${ideaRate("pink").toFixed(2)}x`;
  els.insightMult.textContent = `${ideaRate("pink").toFixed(2)}x`;
  els.energyMult.textContent = `${ideaRate("blue").toFixed(2)}x`;
  els.stabilityMult.textContent = `${ideaRate("green").toFixed(2)}x`;
  els.adaptationDisplay.textContent = `Pink ${level(state, "pinkRate")}`;
  els.complexityDisplay.textContent = `Blue ${level(state, "blueRate")}`;
  els.toolDisplay.textContent = `Green ${level(state, "greenRate")}`;
  els.speedDisplay.textContent = state.selected ? ideaRate(researchDefs.find(r => r.id === state.selected).type).toFixed(2) : "1.00";
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

function save() { localStorage.setItem("evolutionIdleSaveV6", JSON.stringify(state)); }
function load() { const saved = localStorage.getItem("evolutionIdleSaveV6"); if (saved) state = { ...JSON.parse(JSON.stringify(defaultState)), ...JSON.parse(saved), lastTick: Date.now() }; }

els.researchList.addEventListener("click", event => { const row = event.target.closest(".research-row"); if (row) selectResearch(row.dataset.id); });
document.querySelectorAll(".era-tab").forEach((tab, index) => { tab.addEventListener("click", () => { const page = index + 1; if (page > state.highestPage) return; state.activePage = page; state.selected = null; renderFull(true); updateProgressBars(); save(); }); });
els.resetBtn.addEventListener("click", () => { if (!confirm("Reset your Evolution Idle save?")) return; localStorage.removeItem("evolutionIdleSaveV6"); location.reload(); });

function loop() {
  const now = Date.now();
  const delta = Math.min(0.05, (now - state.lastTick) / 1000);
  state.lastTick = now;
  const active = researchDefs.find(r => r.id === state.selected);
  if (active && isUnlocked(active)) {
    state.progress[active.id] = (state.progress[active.id] || 0) + delta * researchSpeed(active);
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
