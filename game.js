const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

const TILE_SIZE = 40;

// --- CONFIGURATION DES BÂTIMENTS ---
const BUILDING_TYPES = {
    COAL_MINER: 'coal_miner', COPPER_MINER: 'copper_miner', IRON_MINER: 'iron_miner',
    GOLD_MINER: 'gold_miner', SILVER_MINER: 'silver_miner', ZINC_MINER: 'zinc_miner',
    BAUXITE_MINER: 'bauxite_miner', NICKEL_MINER: 'nickel_miner', COBALT_MINER: 'cobalt_miner',
    LITHIUM_MINER: 'lithium_miner', URANIUM_MINER: 'uranium_miner', OIL_PUMP: 'oil_pump',
    COPPER_SMELTER: 'copper_smelter', IRON_SMELTER: 'iron_smelter', GOLD_SMELTER: 'gold_smelter',
    SILVER_SMELTER: 'silver_smelter', ALUMINUM_SMELTER: 'aluminum_smelter', OIL_REFINERY: 'oil_refinery',
    CIRCUIT_FACTORY: 'circuit_factory', CHEMISTRY_FACTORY: 'chemistry_factory',
    BATTERY_FACTORY: 'battery_factory', SOLAR_PANEL_FACTORY: 'solar_panel_factory',
    ADVANCED_CIRCUIT_FACTORY: 'advanced_circuit_factory', IRON_PLATE_FACTORY: 'iron_plate_factory',
    COAL_GENERATOR: 'coal_generator', NUCLEAR_GENERATOR: 'nuclear_generator',
    HYDRO_GENERATOR: 'hydro_generator', SOLAR_GENERATOR: 'solar_generator',
    WIND_GENERATOR: 'wind_generator', GEO_GENERATOR: 'geo_generator', GAS_GENERATOR: 'gas_generator'
};

const BUILDING_CONFIG = {
    // Mines (Exemple court, applique à tous)
    [BUILDING_TYPES.COAL_MINER]: { name: 'Mine Charbon', emoji: '⛏️', color: '#333', productionTime: 40, energyUsage: 30, output: 'coal_ore' },
    [BUILDING_TYPES.IRON_MINER]: { name: 'Mine Fer', emoji: '⛏️', color: '#a88', productionTime: 40, energyUsage: 30, output: 'iron_ore' },
    [BUILDING_TYPES.COPPER_MINER]: { name: 'Mine Cuivre', emoji: '⛏️', color: '#b84', productionTime: 40, energyUsage: 30, output: 'copper_ore' },
    [BUILDING_TYPES.URANIUM_MINER]: { name: 'Mine Uranium', emoji: '⛏️', color: '#4f4', productionTime: 100, energyUsage: 50, output: 'uranium_ore' },
    [BUILDING_TYPES.OIL_PUMP]: { name: 'Pompe Pétrole', emoji: '🛢️', color: '#441', productionTime: 60, energyUsage: 40, output: 'crude_oil' },

    // Fonderies
    [BUILDING_TYPES.IRON_SMELTER]: { name: 'Fonderie Fer', emoji: '🔥', color: '#c88', productionTime: 80, energyUsage: 15, input: { iron_ore: 2 }, output: { iron_plate: 1 } },
    [BUILDING_TYPES.COPPER_SMELTER]: { name: 'Fonderie Cuivre', emoji: '🔥', color: '#d84', productionTime: 80, energyUsage: 15, input: { copper_ore: 2 }, output: { copper_plate: 1 } },
    [BUILDING_TYPES.OIL_REFINERY]: { name: 'Raffinerie', emoji: '🏭', color: '#541', productionTime: 100, energyUsage: 25, input: { crude_oil: 2 }, output: { plastic: 1 } },

    // Usines
    [BUILDING_TYPES.CIRCUIT_FACTORY]: { name: 'Usine Circuits', emoji: '🔌', color: '#48f', productionTime: 120, energyUsage: 30, input: { copper_plate: 1, iron_plate: 1 }, output: { circuit: 1 } },

    // Générateurs
    [BUILDING_TYPES.COAL_GENERATOR]: { name: 'Générateur Charbon', emoji: '⚡', color: '#444', energyProvided: 100, input: { coal_ore: 1 }, productionTime: 100 },
    [BUILDING_TYPES.SOLAR_GENERATOR]: { name: 'Panneau Solaire', emoji: '☀️', color: '#ff8', energyProvided: 40 },
};

// --- ÉTAT DU JEU ---
let gameState = {
    buildings: [],
    resources: {
        energy: 100, coal_ore: 0, copper_ore: 0, iron_ore: 0, uranium_ore: 0, crude_oil: 0,
        iron_plate: 0, copper_plate: 0, plastic: 0, circuit: 0, advanced_circuit: 0, 
        battery: 0, silicon: 0, solar_panel: 0
    },
    selectedBuildingType: null,
    deleteMode: false,
    paused: false,
    tick: 0
};

// --- LOGIQUE DES BÂTIMENTS ---
class Building {
    constructor(type, x, y) {
        this.type = type;
        this.x = x;
        this.y = y;
        this.config = BUILDING_CONFIG[type];
        this.progress = 0;
    }

    produce() {
        const conf = this.config;
        
        // Vérifier l'énergie consommée (si ce n'est pas un générateur)
        if (!conf.energyProvided && gameState.resources.energy < (conf.energyUsage || 0)) return;

        // Vérifier les ressources d'entrée
        if (conf.input) {
            for (let [res, amt] of Object.entries(conf.input)) {
                if (gameState.resources[res] < amt) return;
            }
        }

        // Progression
        if (conf.productionTime) {
            this.progress++;
            if (this.progress >= conf.productionTime) {
                this.progress = 0;
                this.finalizeProduction();
            }
        } else if (conf.energyProvided) {
            // Source passive (ex: Solaire)
            gameState.resources.energy += conf.energyProvided / 60;
        }
    }

    finalizeProduction() {
        const conf = this.config;
        
        // Consommer entrées
        if (conf.input) {
            for (let [res, amt] of Object.entries(conf.input)) {
                gameState.resources[res] -= amt;
            }
        }
        
        // Produire sorties
        if (typeof conf.output === 'string') {
            gameState.resources[conf.output] += 1;
        } else if (typeof conf.output === 'object') {
            for (let [res, amt] of Object.entries(conf.output)) {
                gameState.resources[res] += amt;
            }
        }

        // Énergie
        if (conf.energyProvided) gameState.resources.energy += conf.energyProvided;
        if (conf.energyUsage) gameState.resources.energy -= conf.energyUsage;
    }

    render(px, py) {
        ctx.fillStyle = this.config.color;
        ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
        
        if (gameState.deleteMode) {
            ctx.strokeStyle = 'red';
            ctx.strokeRect(px, py, TILE_SIZE, TILE_SIZE);
        }

        ctx.font = '20px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(this.config.emoji, px + TILE_SIZE/2, py + TILE_SIZE/1.5);

        if (this.config.productionTime) {
            ctx.fillStyle = '#0f0';
            ctx.fillRect(px, py + TILE_SIZE - 4, (this.progress / this.config.productionTime) * TILE_SIZE, 4);
        }
    }
}

// --- INTERFACE DYNAMIQUE ---
function updateUI() {
    // 1. Mise à jour de toutes les ressources
    const container = document.getElementById('resource-container');
    let html = '';
    for (const [key, value] of Object.entries(gameState.resources)) {
        const name = key.replace('_', ' ');
        html += `<div class="resource-item">
                    <span class="res-name">${name}</span>
                    <span class="res-val">${Math.floor(value)}</span>
                 </div>`;
    }
    container.innerHTML = html;

    // 2. Info bar
    document.getElementById('info').textContent = gameState.deleteMode ? 
        "🗑️ Mode suppression actif" : 
        (gameState.selectedBuildingType ? `📍 Placement: ${BUILDING_CONFIG[gameState.selectedBuildingType].name}` : "Sélectionnez un outil");

    document.getElementById('stats').textContent = `Bâtiments: ${gameState.buildings.length} | Tick: ${gameState.tick}`;
}

// --- BOUTONS ---
function setupMenu() {
    const categories = {
        'buildMiner': [BUILDING_TYPES.COAL_MINER, BUILDING_TYPES.IRON_MINER, BUILDING_TYPES.COPPER_MINER, BUILDING_TYPES.OIL_PUMP],
        'buildSmelter': [BUILDING_TYPES.IRON_SMELTER, BUILDING_TYPES.COPPER_SMELTER, BUILDING_TYPES.OIL_REFINERY],
        'buildFactory': [BUILDING_TYPES.CIRCUIT_FACTORY],
        'buildGenerator': [BUILDING_TYPES.COAL_GENERATOR, BUILDING_TYPES.SOLAR_GENERATOR]
    };

    Object.entries(categories).forEach(([id, types]) => {
        document.getElementById(id).onclick = () => {
            const menu = document.getElementById('typeButtons');
            menu.innerHTML = '';
            types.forEach(t => {
                const b = document.createElement('button');
                b.textContent = `${BUILDING_CONFIG[t].emoji} ${BUILDING_CONFIG[t].name}`;
                b.onclick = () => {
                    gameState.selectedBuildingType = t;
                    gameState.deleteMode = false;
                    document.getElementById('typeButtons').style.display = 'none';
                    document.getElementById('mainButtons').style.display = 'flex';
                };
                menu.appendChild(b);
            });
            document.getElementById('mainButtons').style.display = 'none';
            menu.style.display = 'flex';
        };
    });

    document.getElementById('delete').onclick = () => {
        gameState.deleteMode = !gameState.deleteMode;
        gameState.selectedBuildingType = null;
    };
}

// --- BOUCLE DE JEU ---
function gameLoop() {
    if (!gameState.paused) {
        gameState.tick++;
        gameState.buildings.forEach(b => b.produce());
        if (gameState.resources.energy < 50) gameState.resources.energy += 0.05; // Régen passive
    }

    // Rendu
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Grille
    ctx.strokeStyle = '#333';
    for(let i=0; i<canvas.width; i+=TILE_SIZE) {
        ctx.beginPath(); ctx.moveTo(i,0); ctx.lineTo(i, canvas.height); ctx.stroke();
    }
    for(let i=0; i<canvas.height; i+=TILE_SIZE) {
        ctx.beginPath(); ctx.moveTo(0,i); ctx.lineTo(canvas.width, i); ctx.stroke();
    }

    // Bâtiments
    gameState.buildings.forEach(b => b.render(b.x * TILE_SIZE, b.y * TILE_SIZE));

    updateUI();
    requestAnimationFrame(gameLoop);
}

// --- CLIC CANVAS ---
canvas.onclick = (e) => {
    const rect = canvas.getBoundingClientRect();
    const gx = Math.floor((e.clientX - rect.left) / TILE_SIZE);
    const gy = Math.floor((e.clientY - rect.top) / TILE_SIZE);

    if (gameState.deleteMode) {
        gameState.buildings = gameState.buildings.filter(b => !(b.x === gx && b.y === gy));
    } else if (gameState.selectedBuildingType) {
        if (!gameState.buildings.some(b => b.x === gx && b.y === gy)) {
            gameState.buildings.push(new Building(gameState.selectedBuildingType, gx, gy));
        }
    }
};

setupMenu();
gameLoop();
