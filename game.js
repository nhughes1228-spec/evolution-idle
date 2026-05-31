const upgrades = [
  {
    id: "membrane",
    name: "Cell Membrane",
    description: "Life learns the difference between inside and outside.",
    cost: 25,
    clickBonus: 1,
    rateBonus: 0.1,
    era: "Primordial Soup",
    organism: "Proto-Cell"
  },
  {
    id: "rna",
    name: "RNA Replication",
    description: "Information begins copying itself, imperfectly and wonderfully.",
    cost: 120,
    clickBonus: 2,
    rateBonus: 0.4,
    era: "First Life",
    organism: "Self-Replicator"
  },
  {
    id: "photosynthesis",
    name: "Photosynthesis",
    description: "Sunlight becomes stored energy. The atmosphere will never be the same.",
    cost: 650,
    clickBonus: 5,
    rateBonus: 1.5,
    era: "Microbial World",
    organism: "Cyanobacteria"
  },
  {
    id: "multicellular",
    name: "Multicellularity",
    description: "Cells specialize. Bodies become possible.",
    cost: 3500,
    clickBonus: 12,
    rateBonus: 6,
    era: "Complex Life",
    organism: "Simple Colony"
  },
  {
    id: "eyes",
    name: "Eyes",
    description: "The world becomes visible. Predators and prey enter a new arms race.",
    cost: 15000,
    clickBonus: 30,
    rateBonus: 18,
    era: "Cambrian Bloom",
    organism: "Early Animal"
  },
  {
    id: "land",
    name: "Move Onto Land",
    description: "Fins, lungs, and stubbornness carry life beyond the waterline.",
    cost: 80000,
    clickBonus: 80,
    rateBonus: 75,
    era: "Landfall",
    organism: "Amphibious Pioneer"
  }
];

let state = {
  biomass: 0,
  clickPower: 1,
  biomassRate: 0,
  purchased: [],
  era: "Primordial Soup",
  organism: "Prebiotic Chemistry",
  lastTick: Date.now()
};

const els = {
  biomass: document.getElementById("biomass"),
  biomassRate: document.getElementById("biomassRate"),
  clickBtn: document.getElementById("clickBtn"),
  resetBtn: document.getElementById("resetBtn"),
  upgrades: document.getElementById("upgrades"),
  eraName: document.getElementById("eraName"),
  organismName: document.getElementById("organismName"),
  timeline: document.getElementById("timeline"),
  progressFill: document.getElementById("progressFill"),
  nextDiscoveryText: document.getElementById("nextDiscoveryText")
};

function save() {
  localStorage.setItem("evolutionIdleSave", JSON.stringify(state));
}

function load() {
  const saved = localStorage.getItem("evolutionIdleSave");
  if (saved) state = { ...state, ...JSON.parse(saved), lastTick: Date.now() };
}

function format(num) {
  if (num < 1000) return num.toFixed(num < 10 ? 1 : 0);
  if (num < 1_000_000) return (num / 1000).toFixed(2) + "K";
  return (num / 1_000_000).toFixed(2) + "M";
}

function availableUpgrades() {
  return upgrades.filter(u => !state.purchased.includes(u.id));
}

function buyUpgrade(id) {
  const upgrade = upgrades.find(u => u.id === id);
  if (!upgrade || state.biomass < upgrade.cost || state.purchased.includes(id)) return;

  state.biomass -= upgrade.cost;
  state.clickPower += upgrade.clickBonus;
  state.biomassRate += upgrade.rateBonus;
  state.purchased.push(id);
  state.era = upgrade.era;
  state.organism = upgrade.organism;
  addTimeline(upgrade.name, upgrade.description);
  save();
  render();
}

function addTimeline(title, text) {
  const events = JSON.parse(localStorage.getItem("evolutionIdleTimeline") || "[]");
  events.unshift({ title, text });
  localStorage.setItem("evolutionIdleTimeline", JSON.stringify(events.slice(0, 12)));
}

function renderTimeline() {
  const events = JSON.parse(localStorage.getItem("evolutionIdleTimeline") || "[]");
  els.timeline.innerHTML = events.length
    ? events.map(e => `<div class="event"><strong>${e.title}</strong>${e.text}</div>`).join("")
    : `<div class="event"><strong>Awaiting Abiogenesis</strong>Your timeline begins with the first discovery.</div>`;
}

function renderUpgrades() {
  els.upgrades.innerHTML = availableUpgrades().map(u => `
    <div class="upgrade">
      <h3>${u.name}</h3>
      <p>${u.description}</p>
      <div class="upgrade-footer">
        <span class="cost">${format(u.cost)} biomass</span>
        <button onclick="buyUpgrade('${u.id}')" ${state.biomass < u.cost ? "disabled" : ""}>Discover</button>
      </div>
    </div>
  `).join("") || `<p class="subtitle">You have discovered everything in this tiny prototype. Time to add prestige, eras, and branching paths.</p>`;
}

function renderProgress() {
  const next = availableUpgrades()[0];
  if (!next) {
    els.nextDiscoveryText.textContent = "Prototype Complete";
    els.progressFill.style.width = "100%";
    return;
  }
  els.nextDiscoveryText.textContent = next.name;
  const percent = Math.min(100, (state.biomass / next.cost) * 100);
  els.progressFill.style.width = `${percent}%`;
}

function render() {
  els.biomass.textContent = format(state.biomass);
  els.biomassRate.textContent = format(state.biomassRate);
  els.eraName.textContent = state.era;
  els.organismName.textContent = state.organism;
  renderUpgrades();
  renderTimeline();
  renderProgress();
}

els.clickBtn.addEventListener("click", () => {
  state.biomass += state.clickPower;
  render();
});

els.resetBtn.addEventListener("click", () => {
  if (!confirm("Reset your Evolution Idle save?")) return;
  localStorage.removeItem("evolutionIdleSave");
  localStorage.removeItem("evolutionIdleTimeline");
  location.reload();
});

function loop() {
  const now = Date.now();
  const delta = (now - state.lastTick) / 1000;
  state.lastTick = now;
  state.biomass += state.biomassRate * delta;
  render();
  save();
  requestAnimationFrame(loop);
}

load();
render();
loop();
