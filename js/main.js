import EventBus from './EventBus.js';
import StateManager from './StateManager.js';
import Renderer from './Renderer.js';
import InputHandler from './InputHandler.js';
import QuestLogic from './Systems/QuestLogic.js';
import Inventory from './Systems/Inventory.js';
import Dialogue from './Systems/Dialogue.js';
import DragDrop from './Editor/DragDrop.js';
import Inspector from './Editor/Inspector.js';
import Exporter from './Editor/Exporter.js';

console.log('%c2D Story Engine + Editor — PHASE 5 COMPLETE 🔥', 'color:#0f0; font-size:1.5rem; font-weight:bold');

const stateManager = new StateManager();
const stage = document.getElementById('stage');
const renderer = new Renderer(stage, stateManager);
const inputHandler = new InputHandler(stage);
const questLogic = new QuestLogic(stateManager);
const inventory = new Inventory(stateManager);
const dialogueSystem = new Dialogue(stateManager, questLogic);

new DragDrop(stage, stateManager, renderer);
new Inspector(stateManager);
new Exporter(stateManager);

// Message popup (unchanged)
const messagePopup = document.getElementById('message-popup');
EventBus.on('SHOW_MESSAGE', msg => {
  messagePopup.textContent = msg;
  messagePopup.classList.add('show');
  setTimeout(() => messagePopup.classList.remove('show'), 2200);
});

async function boot() {
  await stateManager.loadData();
}

boot();

// === EDITOR TOGGLE ===
let isEditorMode = false;
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    isEditorMode = !isEditorMode;
    const panel = document.getElementById('editor-panel');
    stage.classList.toggle('editor-mode', isEditorMode);
    panel.classList.toggle('active', isEditorMode);
    console.log(`Editor Mode: ${isEditorMode ? 'ENABLED' : 'DISABLED'}`);
  }
});