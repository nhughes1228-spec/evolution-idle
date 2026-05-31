const IDEA_TYPES = {
  pink: { label: "Pink Ideas", icon: "💡" },
  blue: { label: "Blue Ideas", icon: "💡" },
  green: { label: "Green Ideas", icon: "💡" }
};

const researchDefs = [
  { id: "fire", page: 1, name: "Fire", type: "blue", baseTime: 1.4, timeScale: 1.18, effects: [{ value: 2, icon: "☼" }] },
  { id: "gathering", page: 1, name: "Gathering", type: "green", baseTime: 1.6, timeScale: 1.18, effects: [{ value: 2, icon: "▰" }] },
  { id: "hunting", page: 1, name: "Hunting", type: "green", baseTime: 1.8, timeScale: 1.19, effects: [{ value: 2, icon: "▰" }, { value: 1, icon: "☼" }] },
  { id: "toolUse", page: 1, name: "Tool Use", type: "blue", baseTime: 2.0, timeScale: 1.2, effects: [{ value: 3, icon: "🔨" }] },

  { id: "art", page: 2, name: "Art", type: "pink", baseTime: 2.3, timeScale: 1.2, effects: [{ value: 4, icon: "★" }] },
  { id: "cooking", page: 2, name: "Cooking", type: "green", baseTime: 2.5, timeScale: 1.21, effects: [{ value: 2, icon: "+" }] },
  { id: "language", page: 2, name: "Language", type: "pink", baseTime: 2.8, timeScale: 1.22, ideaBoostAll: 0.05 },
  { id: "shelter", page: 2, name: "Shelter", type: "green", baseTime: 2.7, timeScale: 1.21, effects: [{ value: 2, icon: "☼" }] },
  { id: "spears", page: 2, name: "Spears", type: "blue", baseTime: 3.0, timeScale: 1.23, effects: [{ value: 3, icon: "⚔" }] },

  { id: "burial", page: 3, name: "Burial", type: "pink", baseTime: 3.2, timeScale: 1.23, effects: [{ value: 3, icon: "★" }] },
  { id: "clothing", page: 3, name: "Clothing", type: "green", baseTime: 3.1, timeScale: 1.23, effects: [{ value: 3, icon: "☼" }] },
  { id: "herbalism", page: 3, name: "Herbalism", type: "blue", baseTime: 3.5, timeScale: 1.24, effects: [{ value: 3, icon: "▰" }, { value: 3, icon: "+" }] },
  { id: "shamanism", page: 3, name: "Shamanism", type: "pink", baseTime: 3.8, timeScale: 1.25, ideaBoosts: { pink: 0.05 }, effects: [{ value: 3, icon: "▰" }] },

  { id: "archery", page: 4, name: "Archery", type: "green", baseTime: 4.0, timeScale: 1.24, effects: [{ value: 5, icon: "⚔" }] },
  { id: "cavePainting", page: 4, name: "Cave Painting", type: "pink", baseTime: 4.2, timeScale: 1.25, ideaBoosts: { green: 0.05 }, effects: [{ value: 1, icon: "☼" }] },
  { id: "fishing", page: 4, name: "Fishing", type: "green", baseTime: 4.1, timeScale: 1.24, effects: [{ value: 4, icon: "▰" }] },
  { id: "music", page: 4, name: "Music", type: "pink", baseTime: 4.4, timeScale: 1.25, effects: [{ value: 2, icon: "★" }] },
  { id: "textiles", page: 4, name: "Textiles", type: "blue", baseTime: 4.6, timeScale: 1.26, effects: [{ value: 5, icon: "🔨" }] },

  { id: "domestication", page: 5, name: "Domestication", type: "green", baseTime: 4.8, timeScale: 1.25, effects: [{ value: 5, icon: "▰" }] },
  { id: "pottery", page: 5, name: "Pottery", type: "blue", baseTime: 5.0, timeScale: 1.26, effects: [{ value: 3, icon: "🔨" }, { value: 2, icon: "★" }] },
  { id: "sedentism", page: 5, name: "Sedentism", type: "green", baseTime: 5.2, timeScale: 1.26, effects: [{ value: 2, icon: "🔨" }, { value: 3, icon: "+" }] },
  { id: "warfare", page: 5, name: "Warfare", type: "pink", baseTime: 5.5, timeScale: 1.27, effects: [{ value: 3, icon: "⚔" }] },

  { id: "agriculture", page: 6, name: "Agriculture", type: "green", baseTime: 5.6, timeScale: 1.26, effects: [{ value: 6, icon: "▰" }, { value: 3, icon: "+" }] },
  { id: "artisans", page: 6, name: "Artisans", type: "pink", baseTime: 5.9, timeScale: 1.27, effects: [{ value: 1, icon: "⚔" }, { value: 3, icon: "🔨" }, { value: 3, icon: "★" }] },
  { id: "canoe", page: 6, name: "Canoe", type: "green", baseTime: 5.8, timeScale: 1.27, effects: [{ value: 3, icon: "☼" }, { value: 1, icon: "⚔" }] },
  { id: "symbology", page: 6, name: "Symbology", type: "blue", baseTime: 6.1, timeScale: 1.28, ideaBoosts: { blue: 0.05 } },

  { id: "brewing", page: 7, name: "Brewing", type: "green", baseTime: 6.0, timeScale: 1.27, effects: [{ value: 4, icon: "+" }] },
  { id: "expeditions", page: 7, name: "Expeditions", type: "pink", baseTime: 6.3, timeScale: 1.28, effects: [{ value: 4, icon: "☼" }] },
  { id: "irrigation", page: 7, name: "Irrigation", type: "blue", baseTime: 6.2, timeScale: 1.28, effects: [{ value: 4, icon: "▰" }, { value: 2, icon: "🔨" }] },
  { id: "megaliths", page: 7, name: "Megaliths", type: "pink", baseTime: 6.5, timeScale: 1.29, effects: [{ value: 4, icon: "★" }] },
  { id: "weaving", page: 7, name: "Weaving", type: "green", baseTime: 6.4, timeScale: 1.28, effects: [{ value: 4, icon: "🔨" }] },

  { id: "architecture", page: 8, name: "Architecture", type: "pink", baseTime: 6.8, timeScale: 1.29, effects: [{ value: 5, icon: "+" }, { value: 5, icon: "★" }] },
  { id: "sailing", page: 8, name: "Sailing", type: "green", baseTime: 6.7, timeScale: 1.29, effects: [{ value: 5, icon: "☼" }] },
  { id: "smelting", page: 8, name: "Smelting", type: "green", baseTime: 7.0, timeScale: 1.3, effects: [{ value: 8, icon: "⚔" }, { value: 4, icon: "🔨" }] },
  { id: "wheel", page: 8, name: "Wheel", type: "blue", baseTime: 6.9, timeScale: 1.29, effects: [{ value: 6, icon: "🔨" }] },

  { id: "bronzeWorking", page: 9, name: "Bronze Working", type: "green", baseTime: 7.1, timeScale: 1.3, effects: [{ value: 4, icon: "⚔" }, { value: 8, icon: "🔨" }] },
  { id: "government", page: 9, name: "Government", type: "pink", baseTime: 7.3, timeScale: 1.3, effects: [{ value: 2, icon: "☼" }, { value: 6, icon: "+" }] },
  { id: "horsebackRiding", page: 9, name: "Horseback Riding", type: "green", baseTime: 7.2, timeScale: 1.3, effects: [{ value: 4, icon: "☼" }, { value: 3, icon: "⚔" }] },
  { id: "plough", page: 9, name: "Plough", type: "blue", baseTime: 7.4, timeScale: 1.31, effects: [{ value: 12, icon: "▰" }] },
  { id: "writing", page: 9, name: "Writing", type: "blue", baseTime: 7.7, timeScale: 1.31, ideaBoostAll: 0.05 },

  { id: "mathematics", page: 10, name: "Mathematics", type: "blue", baseTime: 7.8, timeScale: 1.31, ideaBoosts: { blue: 0.05 } },
  { id: "monarchism", page: 10, name: "Monarchism", type: "pink", baseTime: 7.9, timeScale: 1.31, effects: [{ value: 12, icon: "★" }] },
  { id: "money", page: 10, name: "Money", type: "green", baseTime: 8.0, timeScale: 1.32, effects: [{ value: 8, icon: "🔨" }, { value: 4, icon: "★" }] },
  { id: "shipbuilding", page: 10, name: "Shipbuilding", type: "blue", baseTime: 8.1, timeScale: 1.32, effects: [{ value: 6, icon: "☼" }, { value: 2, icon: "⚔" }] },
  { id: "swords", page: 10, name: "Swords", type: "blue", baseTime: 8.0, timeScale: 1.32, effects: [{ value: 6, icon: "⚔" }] }
];

const defaultState = { selected: null, activePage: 1, highestPage: 1, firstLevelTen: null, progress: {}, levels: {}, ideaRates: { pink: 1, blue: 1, green: 1 }, prestigeIdeaRates: { pink: 1, blue: 1, green: 1 }, lastTick: Date.now() };
let state = JSON.parse(JSON.stringify(defaultState));
let lastFullRender = 0;
let lastSave = 0;

const els = { researchList: document.getElementById("researchList"), biomassDisplay: document.getElementById("biomassDisplay"), insightMult: document.getElementById("insightMult"), energyMult: document.getElementById("energyMult"), stabilityMult: document.getElementById("stabilityMult"), adaptationDisplay: document.getElementById("adaptationDisplay"), complexityDisplay: document.getElementById("complexityDisplay"), toolDisplay: document.getElementById("toolDisplay"), speedDisplay: document.getElementById("speedDisplay"), resetBtn: document.getElementById("resetBtn") };

function level(s, id) { return s.levels[id] || 0; }
function format(num) { if (num < 1000) return num.toFixed(num < 10 ? 1 : 0); if (num < 1_000_000) return (num / 1000).toFixed(2) + "K"; return (num / 1_000_000).toFixed(2) + "M"; }
function ideaRate(type) { return (state.ideaRates[type] || 1) * (state.prestigeIdeaRates[type] || 1); }
function rewardText(def) { if (def.ideaBoostAll) return Object.keys(IDEA_TYPES).map(type => `+${Math.round(def.ideaBoostAll * 100)}% <span class="mini-bulb ${type}">💡</span>`).join(""); if (def.ideaBoosts) return Object.entries(def.ideaBoosts).map(([type, value]) => `+${Math.round(value * 100)}% <span class="mini-bulb ${type}">💡</span>`).join(""); return (def.effects || []).map(e => `+${e.value} ${e.icon}`).join(""); }
function isUnlocked(def) { return def.page <= state.highestPage; }
function visibleResearch() { return researchDefs.filter(def => def.page === state.activePage); }
function researchTime(def) { return def.baseTime * Math.pow(def.timeScale, level(state, def.id)); }
function researchSpeed(def) { return ideaRate(def.type); }

function selectResearch(id) { const def = researchDefs.find(r => r.id === id); if (!def || !isUnlocked(def)) return; state.selected = state.selected === id ? null : id; renderFull(true); updateProgressBars(); save(); }
function checkPageUnlock(def) { if (level(state, def.id) >= 10 && def.page === state.highestPage && state.highestPage < 10) { state.highestPage += 1; state.activePage = state.highestPage; state.selected = null; if (!state.firstLevelTen) state.firstLevelTen = def.id; } }
function completeResearch(def) { state.progress[def.id] = 0; state.levels[def.id] = level(state, def.id) + 1; if (def.ideaBoostAll) Object.keys(state.ideaRates).forEach(type => state.ideaRates[type] += def.ideaBoostAll); if (def.ideaBoosts) Object.entries(def.ideaBoosts).forEach(([type, value]) => state.ideaRates[type] += value); checkPageUnlock(def); renderFull(true); }

function renderFull(force = false) { const now = Date.now(); if (!force && now - lastFullRender < 500) return; lastFullRender = now; els.researchList.innerHTML = visibleResearch().map(def => { const currentLevel = level(state, def.id); return `<button type="button" class="research-row ${def.type} ${state.selected === def.id ? "selected" : ""}" data-id="${def.id}"><div class="fill" data-fill="${def.id}"></div><div class="level-box" data-level="${def.id}">${currentLevel}</div><div class="research-main"><div class="research-title">${def.name}</div></div><div class="reward-box">${rewardText(def)}</div></button>`; }).join(""); renderResources(); renderTabs(); }

function renderResources() { els.biomassDisplay.textContent = ""; els.insightMult.textContent = `${ideaRate("pink").toFixed(2)}x`; els.energyMult.textContent = `${ideaRate("blue").toFixed(2)}x`; els.stabilityMult.textContent = `${ideaRate("green").toFixed(2)}x`; els.adaptationDisplay.textContent = ""; els.complexityDisplay.textContent = ""; els.toolDisplay.textContent = ""; els.speedDisplay.textContent = state.selected ? ideaRate(researchDefs.find(r => r.id === state.selected).type).toFixed(2) : "1.00"; }
function renderTabs() { document.querySelectorAll(".era-tab").forEach((tab, index) => { const page = index + 1; tab.classList.toggle("active", page === state.activePage); tab.classList.toggle("locked", page > state.highestPage); }); }
function updateProgressBars() { for (const def of visibleResearch()) { const fill = document.querySelector(`[data-fill="${def.id}"]`); if (!fill) continue; const progress = ((state.progress[def.id] || 0) / researchTime(def)) * 100; fill.style.transform = `scaleX(${Math.max(0, Math.min(1, progress / 100))})`; } }
function save() { localStorage.setItem("evolutionIdleSaveV7", JSON.stringify(state)); }
function load() { const saved = localStorage.getItem("evolutionIdleSaveV7"); if (saved) state = { ...JSON.parse(JSON.stringify(defaultState)), ...JSON.parse(saved), lastTick: Date.now() }; }

els.researchList.addEventListener("click", event => { const row = event.target.closest(".research-row"); if (row) selectResearch(row.dataset.id); });
document.querySelectorAll(".era-tab").forEach((tab, index) => { tab.addEventListener("click", () => { const page = index + 1; if (page > state.highestPage) return; state.activePage = page; state.selected = null; renderFull(true); updateProgressBars(); save(); }); });
els.resetBtn.addEventListener("click", () => { if (!confirm("Reset your Evolution Idle save?")) return; localStorage.removeItem("evolutionIdleSaveV7"); location.reload(); });
function loop() { const now = Date.now(); const delta = Math.min(0.05, (now - state.lastTick) / 1000); state.lastTick = now; const active = researchDefs.find(r => r.id === state.selected); if (active && isUnlocked(active)) { state.progress[active.id] = (state.progress[active.id] || 0) + delta * researchSpeed(active); if (state.progress[active.id] >= researchTime(active)) completeResearch(active); } updateProgressBars(); renderResources(); renderTabs(); if (now - lastSave > 1000) { save(); lastSave = now; } requestAnimationFrame(loop); }
load(); renderFull(true); updateProgressBars(); loop();
