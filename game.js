const researchDefs = [
  { id: "amino", era: 1, name: "Amino Acids", icon: "🧬", color: "cyan", description: "Simple organic molecules begin to collect in the ancient sea.", baseTime: 1.4, timeScale: 1.18, gains: { biomass: 1 }, visible: () => true },
  { id: "membranes", era: 1, name: "Lipid Membranes", icon: "🛡️", color: "green", description: "Boundaries form. Inside and outside become meaningful.", baseTime: 1.8, timeScale: 1.2, gains: { stability: 1 }, visible: () => true },
  { id: "rna", era: 1, name: "RNA Strands", icon: "💡", color: "pink", description: "Information begins to store itself in fragile chains.", baseTime: 2.2, timeScale: 1.22, gains: { insight: 1 }, visible: () => true },
  { id: "vents", era: 1, name: "Hydrothermal Vents", icon: "⚡", color: "orange", description: "Mineral chimneys provide heat, pressure, and gradients.", baseTime: 2.6, timeScale: 1.24, gains: { energy: 1 }, visible: () => true },
  { id: "catalysts", era: 1, name: "Mineral Catalysts", icon: "⛏️", color: "blue", description: "Stone surfaces make unlikely reactions repeatable.", baseTime: 4, timeScale: 1.28, gains: { speed: 0.03 }, requires: { amino: 3, vents: 2 }, visible: s => level(s, "amino") >= 3 || level(s, "vents") >= 2 },
  { id: "protocells", era: 2, name: "Protocells", icon: "🫧", color: "green", description: "Chemistry gathers into tiny compartments with persistence.", baseTime: 5, timeScale: 1.25, gains: { biomass: 5, complexity: 1 }, requires: { amino: 8, membranes: 8 }, visible: s => level(s, "amino") >= 6 && level(s, "membranes") >= 6 },
  { id: "replication", era: 2, name: "Replication", icon: "🧬", color: "cyan", description: "Life learns the central trick: make another version of itself.", baseTime: 5.5, timeScale: 1.26, gains: { biomass: 8, adaptation: 1 }, requires: { rna: 8, amino: 6 }, visible: s => level(s, "rna") >= 6 },
  { id: "metabolism", era: 2, name: "Metabolism", icon: "⚡", color: "orange", description: "Energy becomes a managed process instead of a lucky accident.", baseTime: 6, timeScale: 1.27, gains: { energy: 4, biomass: 4 }, requires: { vents: 8, catalysts: 4 }, visible: s => level(s, "vents") >= 6 && level(s, "catalysts") >= 2 },
  { id: "dna", era: 2, name: "DNA", icon: "💡", color: "pink", description: "Genetic memory becomes sturdier and more expandable.", baseTime: 8, timeScale: 1.3, gains: { insight: 5, stability: 3, complexity: 2 }, requires: { replication: 5, protocells: 5 }, visible: s => level(s, "replication") >= 3 && level(s, "protocells") >= 3 }
];

const defaultState = { selected: "amino", progress: {}, levels: {}, resources: { biomass: 0, insight: 0, energy: 0, stability: 0, adaptation: 0, complexity: 0, tools: 0 }, speedBonus: 0, lastTick: Date.now() };
let state = JSON.parse(JSON.stringify(defaultState));
let lastRender = 0;

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
function isUnlocked(def) { return !def.requires || Object.entries(def.requires).every(([id, req]) => level(state, id) >= req); }
function visibleResearch() { return researchDefs.filter(def => def.visible(state)); }
function researchTime(def) { return def.baseTime * Math.pow(def.timeScale, level(state, def.id)); }
function researchSpeed() { return 1 + state.speedBonus + state.resources.insight * 0.002 + state.resources.energy * 0.0015; }

function selectResearch(id) {
  const def = researchDefs.find(r => r.id === id);
  if (!def || !isUnlocked(def)) return;
  state.selected = id;
  render(true);
  save();
}

function completeResearch(def) {
  state.progress[def.id] = 0;
  state.levels[def.id] = level(state, def.id) + 1;
  for (const [key, value] of Object.entries(def.gains)) {
    if (key === "speed") state.speedBonus += value;
    else state.resources[key] += value * (1 + level(state, def.id) * 0.08);
  }
  render(true);
}

function render(force = false) {
  const now = Date.now();
  if (!force && now - lastRender < 120) return;
  lastRender = now;

  els.researchList.innerHTML = visibleResearch().map(def => {
    const unlocked = isUnlocked(def);
    const currentLevel = level(state, def.id);
    const progress = ((state.progress[def.id] || 0) / researchTime(def)) * 100;
    const reqText = def.requires ? Object.entries(def.requires).map(([id, req]) => `${researchDefs.find(r => r.id === id).name} ${req}`).join(" · ") : "Available";
    return `<button type="button" class="research-row ${def.color} ${state.selected === def.id ? "selected" : ""} ${unlocked ? "" : "locked"}" data-id="${def.id}">
      <div class="level-box">${currentLevel}</div>
      <div class="research-main"><div class="research-title">${def.name}</div><div class="research-desc">${unlocked ? def.description : "Requires: " + reqText}</div><div class="bar"><div class="fill" style="width:${Math.min(100, progress)}%"></div></div></div>
      <div class="reward-box">${gainText(def)}<span class="row-icon">${def.icon}</span></div>
    </button>`;
  }).join("");

  els.biomassDisplay.textContent = format(state.resources.biomass);
  els.insightMult.textContent = "x" + (1 + state.resources.insight * 0.01).toFixed(2);
  els.energyMult.textContent = "x" + (1 + state.resources.energy * 0.01).toFixed(2);
  els.stabilityMult.textContent = "x" + (1 + state.resources.stability * 0.01).toFixed(2);
  els.adaptationDisplay.textContent = format(state.resources.adaptation);
  els.complexityDisplay.textContent = format(state.resources.complexity);
  els.toolDisplay.textContent = format(state.resources.tools);
  els.speedDisplay.textContent = researchSpeed().toFixed(2);
  if (visibleResearch().some(r => r.era === 2)) els.eraTwoTab.classList.remove("locked");
}

function save() { localStorage.setItem("evolutionIdleSaveV3", JSON.stringify(state)); }
function load() { const saved = localStorage.getItem("evolutionIdleSaveV3"); if (saved) state = { ...JSON.parse(JSON.stringify(defaultState)), ...JSON.parse(saved), lastTick: Date.now() }; }

els.researchList.addEventListener("click", event => {
  const row = event.target.closest(".research-row");
  if (row) selectResearch(row.dataset.id);
});

els.resetBtn.addEventListener("click", () => {
  if (!confirm("Reset your Evolution Idle save?")) return;
  localStorage.removeItem("evolutionIdleSaveV3");
  location.reload();
});

function loop() {
  const now = Date.now();
  const delta = Math.min(0.1, (now - state.lastTick) / 1000);
  state.lastTick = now;
  const active = researchDefs.find(r => r.id === state.selected);
  if (active && isUnlocked(active)) {
    state.progress[active.id] = (state.progress[active.id] || 0) + delta * researchSpeed();
    if (state.progress[active.id] >= researchTime(active)) completeResearch(active);
  }
  render();
  save();
  requestAnimationFrame(loop);
}

load();
render(true);
loop();
