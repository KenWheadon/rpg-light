import EventBus from "./EventBus.js";
import StateManager from "./StateManager.js";
import Renderer from "./Renderer.js";
import InputHandler from "./InputHandler.js";
import QuestLogic from "./Systems/QuestLogic.js";
import Inventory from "./Systems/Inventory.js";
import Dialogue from "./Systems/Dialogue.js";
import DragDrop from "./Editor/DragDrop.js";
import Inspector from "./Editor/Inspector.js";
import Exporter from "./Editor/Exporter.js";

console.log(
  "%c2D Story Engine + Editor — PHASE 5 COMPLETE 🔥",
  "color:#0f0; font-size:1.5rem; font-weight:bold",
);

const stateManager = new StateManager();
const stage = document.getElementById("stage");
const renderer = new Renderer(stage, stateManager);
const inputHandler = new InputHandler(stage);
const questLogic = new QuestLogic(stateManager);
const inventory = new Inventory(stateManager);
const dialogueSystem = new Dialogue(stateManager, questLogic);

new DragDrop(stage, stateManager, renderer);
new Inspector(stateManager);
new Exporter(stateManager);

// Message popup
const messagePopup = document.getElementById("message-popup");
EventBus.on("SHOW_MESSAGE", (payload) => {
  // Support both old string payloads and new object payloads
  const msg = typeof payload === "string" ? payload : payload.msg;
  const sourceEntityId = typeof payload === "string" ? null : payload.sourceEntityId;
  const customAvatar = typeof payload === "string" ? null : payload.customAvatar;

  let avatarImg = '';
  
  if (customAvatar) {
    // Explicit avatar provided in JSON
    avatarImg = `<img src="${customAvatar}" class="message-avatar" alt="Speaker" />`;
  } else if (sourceEntityId) {
    // Fallback to the entity's image
    const scene = stateManager.getCurrentSceneData();
    const entity = scene.entities.find(e => e.id === sourceEntityId);
    if (entity && entity.image) {
      avatarImg = `<img src="${entity.image}" class="message-avatar" alt="${entity.name || 'Object'}" />`;
    }
  }

  messagePopup.innerHTML = `
    ${avatarImg}
    <div class="message-content">${msg}</div>
  `;
  messagePopup.classList.add("show");
});

messagePopup.addEventListener("click", () => {
  messagePopup.classList.remove("show");
});

EventBus.on("HIDE_MESSAGE", () => {
  messagePopup.classList.remove("show");
  messagePopup.innerHTML = '';
});

async function boot() {
  await stateManager.loadData();
}

boot();

// === EDITOR TOGGLE ===
let isEditorMode = false;
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    isEditorMode = !isEditorMode;
    const panel = document.getElementById("editor-panel");
    stage.classList.toggle("editor-mode", isEditorMode);
    panel.classList.toggle("active", isEditorMode);
    console.log(`Editor Mode: ${isEditorMode ? "ENABLED" : "DISABLED"}`);
  }
});
