const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Responsive canvas
function resizeCanvas() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Game Constants
const GRID_SIZE = 40;
const TILE_SIZE = 40;

// Building types with variants - MINES
const BUILDING_TYPES = {
    // MINES
    COAL_MINER: 'coal_miner',
    COPPER_MINER: 'copper_miner',
    IRON_MINER: 'iron_miner',
    GOLD_MINER: 'gold_miner',
    SILVER_MINER: 'silver_miner',
    ZINC_MINER: 'zinc_miner',
    BAUXITE_MINER: 'bauxite_miner',
    NICKEL_MINER: 'nickel_miner',
    COBALT_MINER: 'cobalt_miner',
    LITHIUM_MINER: 'lithium_miner',
    URANIUM_MINER: 'uranium_miner',
    OIL_PUMP: 'oil_pump',
    
    // SMELTERS & REFINERIES
    COPPER_SMELTER: 'copper_smelter',
    IRON_SMELTER: 'iron_smelter',
    GOLD_SMELTER: 'gold_smelter',
    SILVER_SMELTER: 'silver_smelter',
    ALUMINUM_SMELTER: 'aluminum_smelter',
    OIL_REFINERY: 'oil_refinery',
    
    // FACTORIES
    CIRCUIT_FACTORY: 'circuit_factory',
    CHEMISTRY_FACTORY: 'chemistry_factory',
    BATTERY_FACTORY: 'battery_factory',
    SOLAR_PANEL_FACTORY: 'solar_panel_factory',
    ADVANCED_CIRCUIT_FACTORY: 'advanced_circuit_factory',
    
    // GENERATORS
    COAL_GENERATOR: 'coal_generator',
    NUCLEAR_GENERATOR: 'nuclear_generator',
    HYDRO_GENERATOR: 'hydro_generator',
    SOLAR_GENERATOR: 'solar_generator',
    WIND_GENERATOR: 'wind_generator',
    GEO_GENERATOR: 'geo_generator',
    GAS_GENERATOR: 'gas_generator'
};

// Building config
const BUILDING_CONFIG = {
    // MINES
    [BUILDING_TYPES.COAL_MINER]: {
        name: 'Mine de Charbon',
        emoji: '⛏️',
        color: '#333',
        productionTime: 2,
        energyUsage: 5,
        output: 'coal_ore'
    },
    [BUILDING_TYPES.COPPER_MINER]: {
        name: 'Mine de Cuivre',
        emoji: '⛏️',
        color: '#b84',
        productionTime: 2,
        energyUsage: 5,
        output: 'copper_ore'
    },
    [BUILDING_TYPES.IRON_MINER]: {
        name: 'Mine de Fer',
        emoji: '⛏️',
        color: '#a88',
        productionTime: 2,
        energyUsage: 5,
        output: 'iron_ore'
    },
    [BUILDING_TYPES.GOLD_MINER]: {
        name: 'Mine d\'Or',
        emoji: '⛏️',
        color: '#fd7',
        productionTime: 3,
        energyUsage: 8,
        output: 'gold_ore'
    },
    [BUILDING_TYPES.SILVER_MINER]: {
        name: 'Mine d\'Argent',
        emoji: '⛏️',
        color: '#ddd',
        productionTime: 3,
        energyUsage: 8,
        output: 'silver_ore'
    },
    [BUILDING_TYPES.ZINC_MINER]: {
        name: 'Mine de Zinc',
        emoji: '⛏️',
        color: '#9af',
        productionTime: 2,
        energyUsage: 6,
        output: 'zinc_ore'
    },
    [BUILDING_TYPES.BAUXITE_MINER]: {
        name: 'Mine de Bauxite',
        emoji: '⛏️',
        color: '#f9a',
        productionTime: 3,
        energyUsage: 7,
        output: 'bauxite_ore'
    },
    [BUILDING_TYPES.NICKEL_MINER]: {
        name: 'Mine de Nickel',
        emoji: '⛏️',
        color: '#d8d',
        productionTime: 3,
        energyUsage: 7,
        output: 'nickel_ore'
    },
    [BUILDING_TYPES.COBALT_MINER]: {
        name: 'Mine de Cobalt',
        emoji: '⛏️',
        color: '#55d',
        productionTime: 3,
        energyUsage: 8,
        output: 'cobalt_ore'
    },
    [BUILDING_TYPES.LITHIUM_MINER]: {
        name: 'Mine de Lithium',
        emoji: '⛏️',
        color: '#8f8',
        productionTime: 4,
        energyUsage: 10,
        output: 'lithium_ore'
    },
    [BUILDING_TYPES.URANIUM_MINER]: {
        name: 'Mine d\'Uranium',
        emoji: '⛏️',
        color: '#4f4',
        productionTime: 5,
        energyUsage: 12,
        output: 'uranium_ore'
    },
    [BUILDING_TYPES.OIL_PUMP]: {
        name: 'Pompe à Pétrole',
        emoji: '🛢️',
        color: '#441',
        productionTime: 2,
        energyUsage: 6,
        output: 'crude_oil'
    },
    
    // SMELTERS & REFINERIES
    [BUILDING_TYPES.COPPER_SMELTER]: {
        name: 'Fonderie de Cuivre',
        emoji: '🔥',
        color: '#d84',
        productionTime: 4,
        energyUsage: 10,
        input: 'copper_ore',
        output: 'copper_plate'
    },
    [BUILDING_TYPES.IRON_SMELTER]: {
        name: 'Fonderie de Fer',
        emoji: '🔥',
        color: '#c88',
        productionTime: 4,
        energyUsage: 10,
        input: 'iron_ore',
        output: 'iron_plate'
    },
    [BUILDING_TYPES.GOLD_SMELTER]: {
        name: 'Fonderie d\'Or',
        emoji: '🔥',
        color: '#fd7',
        productionTime: 5,
        energyUsage: 12,
        input: 'gold_ore',
        output: 'gold_plate'
    },
    [BUILDING_TYPES.SILVER_SMELTER]: {
        name: 'Fonderie d\'Argent',
        emoji: '🔥',
        color: '#ddd',
        productionTime: 5,
        energyUsage: 12,
        input: 'silver_ore',
        output: 'silver_plate'
    },
    [BUILDING_TYPES.ALUMINUM_SMELTER]: {
        name: 'Fonderie d\'Aluminium',
        emoji: '🔥',
        color: '#aaa',
        productionTime: 6,
        energyUsage: 15,
        input: 'bauxite_ore',
        output: 'aluminum_plate'
    },
    [BUILDING_TYPES.OIL_REFINERY]: {
        name: 'Raffinerie',
        emoji: '🏭',
        color: '#541',
        productionTime: 4,
        energyUsage: 15,
        input: 'crude_oil',
        output: 'plastic'
    },
    
    // FACTORIES
    [BUILDING_TYPES.CIRCUIT_FACTORY]: {
        name: 'Usine de Circuits',
        emoji: '🏭',
        color: '#48f',
        productionTime: 6,
        energyUsage: 20,
        output: 'circuit'
    },
    [BUILDING_TYPES.ADVANCED_CIRCUIT_FACTORY]: {
        name: 'Usine Circuits Avancés',
        emoji: '🏭',
        color: '#58f',
        productionTime: 8,
        energyUsage: 30,
        output: 'advanced_circuit'
    },
    [BUILDING_TYPES.CHEMISTRY_FACTORY]: {
        name: 'Usine Chimique',
        emoji: '🏭',
        color: '#f8f',
        productionTime: 5,
        energyUsage: 18,
        output: 'chemical'
    },
    [BUILDING_TYPES.BATTERY_FACTORY]: {
        name: 'Usine de Batteries',
        emoji: '🔋',
        color: '#f84',
        productionTime: 7,
        energyUsage: 25,
        output: 'battery'
    },
    [BUILDING_TYPES.SOLAR_PANEL_FACTORY]: {
        name: 'Usine Panneaux Solaires',
        emoji: '☀️',
        color: '#ff8',
        productionTime: 6,
        energyUsage: 22,
        output: 'solar_panel'
    },
    
    // GENERATORS
    [BUILDING_TYPES.COAL_GENERATOR]: {
        name: 'Générateur Charbon',
        emoji: '⚡',
        color: '#444',
        energyProvided: 100
    },
    [BUILDING_TYPES.NUCLEAR_GENERATOR]: {
        name: 'Générateur Nucléaire',
        emoji: '☢️',
        color: '#4f4',
        energyProvided: 500
    },
    [BUILDING_TYPES.HYDRO_GENERATOR]: {
        name: 'Générateur Hydro',
        emoji: '💧',
        color: '#4af',
        energyProvided: 200
    },
    [BUILDING_TYPES.SOLAR_GENERATOR]: {
        name: 'Panneau Solaire',
        emoji: '☀️',
        color: '#ff8',
        energyProvided: 80
    },
    [BUILDING_TYPES.WIND_GENERATOR]: {
        name: 'Turbine Éolienne',
        emoji: '💨',
        color: '#aaf',
        energyProvided: 150
    },
    [BUILDING_TYPES.GEO_GENERATOR]: {
        name: 'Générateur Géothermique',
        emoji: '🌋',
        color: '#f88',
        energyProvided: 250
    },
    [BUILDING_TYPES.GAS_GENERATOR]: {
        name: 'Générateur Gaz',
        emoji: '💨',
        color: '#fa8',
        energyProvided: 180
    }
};

// Game state
let gameState = {
    buildings: [],
    resources: {
        energy: 0,
        coal_ore: 0,
        copper_ore: 0,
        iron_ore: 0,
        gold_ore: 0,
        silver_ore: 0,
        zinc_ore: 0,
        bauxite_ore: 0,
        nickel_ore: 0,
        cobalt_ore: 0,
        lithium_ore: 0,
        uranium_ore: 0,
        crude_oil: 0,
        copper_plate: 0,
        iron_plate: 0,
        gold_plate: 0,
        silver_plate: 0,
        aluminum_plate: 0,
        plastic: 0,
        circuit: 0,
        advanced_circuit: 0,
        chemical: 0,
        battery: 0,
        solar_panel: 0,
        silicon: 0
    },
    selectedBuildingType: null,
    deleteMode: false,
    paused: false,
    gameSpeed: 1,
    tick: 0
};

// Building class
class Building {
    constructor(type, x, y) {
        this.type = type;
        this.x = x;
        this.y = y;
        this.config = BUILDING_CONFIG[type];
        this.productionProgress = 0;
    }

    produce() {
        const energyUsage = this.config.energyUsage || 0;
        const isGenerator = this.config.energyProvided !== undefined;
        
        if (gameState.resources.energy < energyUsage && !isGenerator) {
            return;
        }

        if (energyUsage > 0 || isGenerator) {
            this.productionProgress++;
        }

        if (this.productionProgress >= (this.config.productionTime || 1)) {
            this.productionProgress = 0;

            // MINES & EXTRACTION
            if (this.type === BUILDING_TYPES.COAL_MINER) {
                gameState.resources.coal_ore += 2;
                gameState.resources.energy -= energyUsage;
            }
            else if (this.type === BUILDING_TYPES.COPPER_MINER) {
                gameState.resources.copper_ore += 2;
                gameState.resources.energy -= energyUsage;
            }
            else if (this.type === BUILDING_TYPES.IRON_MINER) {
                gameState.resources.iron_ore += 2;
                gameState.resources.energy -= energyUsage;
            }
            else if (this.type === BUILDING_TYPES.GOLD_MINER) {
                gameState.resources.gold_ore += 1;
                gameState.resources.energy -= energyUsage;
            }
            else if (this.type === BUILDING_TYPES.SILVER_MINER) {
                gameState.resources.silver_ore += 1;
                gameState.resources.energy -= energyUsage;
            }
            else if (this.type === BUILDING_TYPES.ZINC_MINER) {
                gameState.resources.zinc_ore += 2;
                gameState.resources.energy -= energyUsage;
            }
            else if (this.type === BUILDING_TYPES.BAUXITE_MINER) {
                gameState.resources.bauxite_ore += 2;
                gameState.resources.energy -= energyUsage;
            }
            else if (this.type === BUILDING_TYPES.NICKEL_MINER) {
                gameState.resources.nickel_ore += 1;
                gameState.resources.energy -= energyUsage;
            }
            else if (this.type === BUILDING_TYPES.COBALT_MINER) {
                gameState.resources.cobalt_ore += 1;
                gameState.resources.energy -= energyUsage;
            }
            else if (this.type === BUILDING_TYPES.LITHIUM_MINER) {
                gameState.resources.lithium_ore += 1;
                gameState.resources.energy -= energyUsage;
            }
            else if (this.type === BUILDING_TYPES.URANIUM_MINER) {
                gameState.resources.uranium_ore += 1;
                gameState.resources.energy -= energyUsage;
            }
            else if (this.type === BUILDING_TYPES.OIL_PUMP) {
                gameState.resources.crude_oil += 2;
                gameState.resources.energy -= energyUsage;
            }
            
            // SMELTERS & REFINERIES
            else if (this.type === BUILDING_TYPES.COPPER_SMELTER) {
                if (gameState.resources.copper_ore >= 2) {
                    gameState.resources.copper_ore -= 2;
                    gameState.resources.copper_plate += 1;
                    gameState.resources.energy -= energyUsage;
                }
            }
            else if (this.type === BUILDING_TYPES.IRON_SMELTER) {
                if (gameState.resources.iron_ore >= 2) {
                    gameState.resources.iron_ore -= 2;
                    gameState.resources.iron_plate += 1;
                    gameState.resources.energy -= energyUsage;
                }
            }
            else if (this.type === BUILDING_TYPES.GOLD_SMELTER) {
                if (gameState.resources.gold_ore >= 2) {
                    gameState.resources.gold_ore -= 2;
                    gameState.resources.gold_plate += 1;
                    gameState.resources.energy -= energyUsage;
                }
            }
            else if (this.type === BUILDING_TYPES.SILVER_SMELTER) {
                if (gameState.resources.silver_ore >= 2) {
                    gameState.resources.silver_ore -= 2;
                    gameState.resources.silver_plate += 1;
                    gameState.resources.energy -= energyUsage;
                }
            }
            else if (this.type === BUILDING_TYPES.ALUMINUM_SMELTER) {
                if (gameState.resources.bauxite_ore >= 2) {
                    gameState.resources.bauxite_ore -= 2;
                    gameState.resources.aluminum_plate += 1;
                    gameState.resources.energy -= energyUsage;
                }
            }
            else if (this.type === BUILDING_TYPES.OIL_REFINERY) {
                if (gameState.resources.crude_oil >= 2) {
                    gameState.resources.crude_oil -= 2;
                    gameState.resources.plastic += 1;
                    gameState.resources.energy -= energyUsage;
                }
            }
            
            // FACTORIES
            else if (this.type === BUILDING_TYPES.CIRCUIT_FACTORY) {
                if (gameState.resources.copper_plate >= 1 && gameState.resources.iron_plate >= 1) {
                    gameState.resources.copper_plate -= 1;
                    gameState.resources.iron_plate -= 1;
                    gameState.resources.circuit += 1;
                    gameState.resources.energy -= energyUsage;
                }
            }
            else if (this.type === BUILDING_TYPES.ADVANCED_CIRCUIT_FACTORY) {
                if (gameState.resources.circuit >= 2 && gameState.resources.plastic >= 1) {
                    gameState.resources.circuit -= 2;
                    gameState.resources.plastic -= 1;
                    gameState.resources.advanced_circuit += 1;
                    gameState.resources.energy -= energyUsage;
                }
            }
            else if (this.type === BUILDING_TYPES.CHEMISTRY_FACTORY) {
                if (gameState.resources.copper_ore >= 1 && gameState.resources.plastic >= 1) {
                    gameState.resources.copper_ore -= 1;
                    gameState.resources.plastic -= 1;
                    gameState.resources.chemical += 2;
                    gameState.resources.energy -= energyUsage;
                }
            }
            else if (this.type === BUILDING_TYPES.BATTERY_FACTORY) {
                if (gameState.resources.iron_plate >= 1 && gameState.resources.copper_plate >= 1 && gameState.resources.chemical >= 1) {
                    gameState.resources.iron_plate -= 1;
                    gameState.resources.copper_plate -= 1;
                    gameState.resources.chemical -= 1;
                    gameState.resources.battery += 1;
                    gameState.resources.energy -= energyUsage;
                }
            }
            else if (this.type === BUILDING_TYPES.SOLAR_PANEL_FACTORY) {
                if (gameState.resources.silicon >= 2 && gameState.resources.aluminum_plate >= 1) {
                    gameState.resources.silicon -= 2;
                    gameState.resources.aluminum_plate -= 1;
                    gameState.resources.solar_panel += 1;
                    gameState.resources.energy -= energyUsage;
                }
            }
            
            // GENERATORS
            else if (this.type === BUILDING_TYPES.COAL_GENERATOR) {
                gameState.resources.energy += this.config.energyProvided;
            }
            else if (this.type === BUILDING_TYPES.NUCLEAR_GENERATOR) {
                if (gameState.resources.uranium_ore >= 1) {
                    gameState.resources.uranium_ore -= 1;
                    gameState.resources.energy += this.config.energyProvided;
                }
            }
            else if (this.type === BUILDING_TYPES.HYDRO_GENERATOR) {
                gameState.resources.energy += this.config.energyProvided;
            }
            else if (this.type === BUILDING_TYPES.SOLAR_GENERATOR) {
                gameState.resources.energy += this.config.energyProvided;
            }
            else if (this.type === BUILDING_TYPES.WIND_GENERATOR) {
                gameState.resources.energy += this.config.energyProvided;
            }
            else if (this.type === BUILDING_TYPES.GEO_GENERATOR) {
                gameState.resources.energy += this.config.energyProvided;
            }
            else if (this.type === BUILDING_TYPES.GAS_GENERATOR) {
                gameState.resources.energy += this.config.energyProvided;
            }
        }
    }

    render(x, y) {
        ctx.fillStyle = this.config.color;
        ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);

        // Draw border if in delete mode
        if (gameState.deleteMode) {
            ctx.strokeStyle = '#f44';
            ctx.lineWidth = 2;
            ctx.strokeRect(x, y, TILE_SIZE, TILE_SIZE);
        }

        // Draw emoji
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#fff';
        ctx.fillText(this.config.emoji, x + TILE_SIZE/2, y + TILE_SIZE/2);

        // Draw production progress
        if (this.config.productionTime) {
            const progress = this.productionProgress / this.config.productionTime;
            ctx.fillStyle = 'rgba(0, 255, 0, 0.5)';
            ctx.fillRect(x, y + TILE_SIZE - 4, TILE_SIZE * progress, 4);
        }
    }
}

// Input handling
function getGridPos(clientX, clientY) {
    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    return {
        gridX: Math.floor(x / TILE_SIZE),
        gridY: Math.floor(y / TILE_SIZE)
    };
}

function placeBuilding(gridX, gridY, buildingType) {
    // Check bounds
    if (gridX < 0 || gridY < 0 || gridX * TILE_SIZE >= canvas.width || gridY * TILE_SIZE >= canvas.height) {
        return false;
    }

    // Check if occupied
    for (let building of gameState.buildings) {
        if (building.x === gridX && building.y === gridY) {
            return false;
        }
    }

    const building = new Building(buildingType, gridX, gridY);
    gameState.buildings.push(building);
    return true;
}

function deleteBuilding(gridX, gridY) {
    gameState.buildings = gameState.buildings.filter(b => !(b.x === gridX && b.y === gridY));
}

function isBuildingAt(gridX, gridY) {
    return gameState.buildings.some(b => b.x === gridX && b.y === gridY);
}

// Canvas events
canvas.addEventListener('click', (e) => {
    const {gridX, gridY} = getGridPos(e.clientX, e.clientY);
    
    if (gameState.deleteMode) {
        deleteBuilding(gridX, gridY);
    } else if (gameState.selectedBuildingType) {
        placeBuilding(gridX, gridY, gameState.selectedBuildingType);
    }
});

// UI Button handlers
function createBuildingMenu(category, types) {
    const mainButtons = document.getElementById('mainButtons');
    const typeButtons = document.getElementById('typeButtons');
    
    typeButtons.innerHTML = '';
    
    types.forEach(type => {
        const btn = document.createElement('button');
        btn.textContent = `${BUILDING_CONFIG[type].emoji} ${BUILDING_CONFIG[type].name}`;
        btn.onclick = () => {
            gameState.selectedBuildingType = type;
            gameState.deleteMode = false;
            showMainMenu();
            updateButtonStates();
        };
        typeButtons.appendChild(btn);
    });
    
    const backBtn = document.createElement('button');
    backBtn.textContent = '← Retour';
    backBtn.style.marginTop = '10px';
    backBtn.onclick = showMainMenu;
    typeButtons.appendChild(backBtn);
    
    mainButtons.style.display = 'none';
    typeButtons.style.display = 'flex';
    typeButtons.style.flexWrap = 'wrap';
    typeButtons.style.gap = '5px';
}

function showMainMenu() {
    document.getElementById('mainButtons').style.display = 'flex';
    document.getElementById('typeButtons').style.display = 'none';
    gameState.deleteMode = false;
}

document.getElementById('buildMiner').addEventListener('click', () => {
    createBuildingMenu('miner', [
        BUILDING_TYPES.COAL_MINER,
        BUILDING_TYPES.COPPER_MINER,
        BUILDING_TYPES.IRON_MINER,
        BUILDING_TYPES.GOLD_MINER,
        BUILDING_TYPES.SILVER_MINER,
        BUILDING_TYPES.ZINC_MINER,
        BUILDING_TYPES.BAUXITE_MINER,
        BUILDING_TYPES.NICKEL_MINER,
        BUILDING_TYPES.COBALT_MINER,
        BUILDING_TYPES.LITHIUM_MINER,
        BUILDING_TYPES.URANIUM_MINER,
        BUILDING_TYPES.OIL_PUMP
    ]);
});

document.getElementById('buildSmelter').addEventListener('click', () => {
    createBuildingMenu('smelter', [
        BUILDING_TYPES.COPPER_SMELTER,
        BUILDING_TYPES.IRON_SMELTER,
        BUILDING_TYPES.GOLD_SMELTER,
        BUILDING_TYPES.SILVER_SMELTER,
        BUILDING_TYPES.ALUMINUM_SMELTER,
        BUILDING_TYPES.OIL_REFINERY
    ]);
});

document.getElementById('buildFactory').addEventListener('click', () => {
    createBuildingMenu('factory', [
        BUILDING_TYPES.CIRCUIT_FACTORY,
        BUILDING_TYPES.ADVANCED_CIRCUIT_FACTORY,
        BUILDING_TYPES.CHEMISTRY_FACTORY,
        BUILDING_TYPES.BATTERY_FACTORY,
        BUILDING_TYPES.SOLAR_PANEL_FACTORY
    ]);
});

document.getElementById('buildPipe').addEventListener('click', () => {
    // Pour la cohérence, on gardera les tuyaux mais ils ne sont pas dans ce jeu
    alert('Les tuyaux ne sont pas disponibles dans cette version');
});

document.getElementById('buildGenerator').addEventListener('click', () => {
    createBuildingMenu('generator', [
        BUILDING_TYPES.COAL_GENERATOR,
        BUILDING_TYPES.NUCLEAR_GENERATOR,
        BUILDING_TYPES.HYDRO_GENERATOR,
        BUILDING_TYPES.SOLAR_GENERATOR,
        BUILDING_TYPES.WIND_GENERATOR,
        BUILDING_TYPES.GEO_GENERATOR,
        BUILDING_TYPES.GAS_GENERATOR
    ]);
});

document.getElementById('delete').addEventListener('click', () => {
    gameState.deleteMode = true;
    gameState.selectedBuildingType = null;
    document.getElementById('delete').classList.add('selected');
    document.getElementById('mainButtons').style.display = 'flex';
    document.getElementById('typeButtons').style.display = 'none';
    updateButtonStates();
});

document.getElementById('speed').addEventListener('click', (e) => {
    gameState.paused = !gameState.paused;
    e.target.textContent = gameState.paused ? '▶️ Reprendre' : '⏸️ Pause';
});

function updateButtonStates() {
    document.querySelectorAll('button').forEach(btn => {
        btn.classList.remove('selected');
    });

    if (gameState.deleteMode) {
        document.getElementById('delete').classList.add('selected');
    } else if (gameState.selectedBuildingType) {
        const btnId = {
            // Mines
            [BUILDING_TYPES.COAL_MINER]: '#buildMiner',
            [BUILDING_TYPES.COPPER_MINER]: '#buildMiner',
            [BUILDING_TYPES.IRON_MINER]: '#buildMiner',
            [BUILDING_TYPES.GOLD_MINER]: '#buildMiner',
            [BUILDING_TYPES.SILVER_MINER]: '#buildMiner',
            [BUILDING_TYPES.ZINC_MINER]: '#buildMiner',
            [BUILDING_TYPES.BAUXITE_MINER]: '#buildMiner',
            [BUILDING_TYPES.NICKEL_MINER]: '#buildMiner',
            [BUILDING_TYPES.COBALT_MINER]: '#buildMiner',
            [BUILDING_TYPES.LITHIUM_MINER]: '#buildMiner',
            [BUILDING_TYPES.URANIUM_MINER]: '#buildMiner',
            [BUILDING_TYPES.OIL_PUMP]: '#buildMiner',
            // Smelters
            [BUILDING_TYPES.COPPER_SMELTER]: '#buildSmelter',
            [BUILDING_TYPES.IRON_SMELTER]: '#buildSmelter',
            [BUILDING_TYPES.GOLD_SMELTER]: '#buildSmelter',
            [BUILDING_TYPES.SILVER_SMELTER]: '#buildSmelter',
            [BUILDING_TYPES.ALUMINUM_SMELTER]: '#buildSmelter',
            [BUILDING_TYPES.OIL_REFINERY]: '#buildSmelter',
            // Factories
            [BUILDING_TYPES.CIRCUIT_FACTORY]: '#buildFactory',
            [BUILDING_TYPES.ADVANCED_CIRCUIT_FACTORY]: '#buildFactory',
            [BUILDING_TYPES.CHEMISTRY_FACTORY]: '#buildFactory',
            [BUILDING_TYPES.BATTERY_FACTORY]: '#buildFactory',
            [BUILDING_TYPES.SOLAR_PANEL_FACTORY]: '#buildFactory',
            // Generators
            [BUILDING_TYPES.COAL_GENERATOR]: '#buildGenerator',
            [BUILDING_TYPES.NUCLEAR_GENERATOR]: '#buildGenerator',
            [BUILDING_TYPES.HYDRO_GENERATOR]: '#buildGenerator',
            [BUILDING_TYPES.SOLAR_GENERATOR]: '#buildGenerator',
            [BUILDING_TYPES.WIND_GENERATOR]: '#buildGenerator',
            [BUILDING_TYPES.GEO_GENERATOR]: '#buildGenerator',
            [BUILDING_TYPES.GAS_GENERATOR]: '#buildGenerator'
        }[gameState.selectedBuildingType];
        
        if (btnId) {
            document.querySelector(btnId).classList.add('selected');
        }
    }
}

// Update UI
function updateUI() {
    document.getElementById('energy').textContent = Math.max(0, Math.floor(gameState.resources.energy));
    document.getElementById('copper').textContent = Math.floor(gameState.resources.copper_plate);
    document.getElementById('iron').textContent = Math.floor(gameState.resources.iron_plate);
    document.getElementById('circuits').textContent = Math.floor(gameState.resources.circuit);

    let info = 'Sélectionnez un bâtiment et tapez sur la grille';
    if (gameState.deleteMode) {
        info = '🗑️ Mode suppression: tapez sur un bâtiment';
    } else if (gameState.selectedBuildingType) {
        info = `📍 Placement: ${BUILDING_CONFIG[gameState.selectedBuildingType].name}`;
    }
    document.getElementById('info').textContent = info;

    const totalEnergyProduced = gameState.buildings.reduce((sum, b) => sum + (b.config.energyProvided || 0), 0);
    const totalEnergyUsed = gameState.buildings.reduce((sum, b) => sum + (b.config.energyUsage || 0), 0);
    const buildingCount = gameState.buildings.length;
    
    document.getElementById('stats').textContent = `🏭 ${buildingCount} bâtiments | ⚡ ${totalEnergyProduced} généré / ${totalEnergyUsed} utilisé`;
}

// Game loop
function gameLoop() {
    // Update
    if (!gameState.paused) {
        gameState.tick++;

        for (let building of gameState.buildings) {
            if (gameState.tick % 2 === 0) {
                building.produce();
            }
        }

        // Passive energy regeneration if low
        if (gameState.resources.energy < 50) {
            gameState.resources.energy += 0.1;
        }
    }

    // Ensure energy doesn't go too negative
    if (gameState.resources.energy < 0) {
        gameState.resources.energy = 0;
    }

    // Render
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    ctx.strokeStyle = 'rgba(100, 150, 100, 0.1)';
    ctx.lineWidth = 1;
    for (let x = 0; x < canvas.width; x += TILE_SIZE) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += TILE_SIZE) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }

    // Draw buildings
    for (let building of gameState.buildings) {
        building.render(building.x * TILE_SIZE, building.y * TILE_SIZE);
    }

    updateUI();
    requestAnimationFrame(gameLoop);
}

gameLoop();
