import EventBus from './EventBus.js';

export default class StateManager {
  constructor() {
    this.data = null;
    this.currentScene = null;
    this.activeItem = null;
    this.selectedEntityId = null;
  }

  async loadData() {
    const res = await fetch('data/game_data.json');
    this.data = await res.json();
    this.currentScene = this.data.settings.start_scene;
    EventBus.emit('STATE_UPDATED');
  }

  getCurrentSceneData() { return this.data.scenes[this.currentScene]; }
  getData() { return this.data; }

  // === NEW METHODS FOR PHASE 3 ===
  addItem(itemId) {
    const scene = this.getCurrentSceneData();
    const entity = scene.entities.find(e => e.id === itemId);
    if (entity) {
      // Store minimal item data in inventory
      this.data.state.inventory.push({
        id: entity.id,
        name: entity.name,
        image: entity.image
      });
      EventBus.emit('STATE_UPDATED');
    }
  }

  removeEntity(entityId) {
    const scene = this.getCurrentSceneData();
    scene.entities = scene.entities.filter(e => e.id !== entityId);
    EventBus.emit('STATE_UPDATED');
  }

  changeScene(newScene) {
    if (this.data.scenes[newScene]) {
      this.currentScene = newScene;
      this.activeItem = null;
      EventBus.emit('CLOSE_DIALOGUE');
      EventBus.emit('HIDE_MESSAGE');
      EventBus.emit('STATE_UPDATED');
    }
  }

  setFlag(flag, value) {
    this.data.state.flags[flag] = value;
    EventBus.emit('STATE_UPDATED');
  }

  setActiveItem(itemId) {
    this.activeItem = (this.activeItem === itemId) ? null : itemId;
    EventBus.emit('STATE_UPDATED');
  }

  updateEntityPosition(entityId, newX, newY) {
    const scene = this.getCurrentSceneData();
    const entity = scene.entities.find(e => e.id === entityId);
    if (entity) {
      entity.x = newX;
      entity.y = newY;
    }
  }
}