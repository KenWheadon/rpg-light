import EventBus from './EventBus.js';

export default class Renderer {
  constructor(stageElement, stateManager) {
    this.stage = stageElement;
    this.stateManager = stateManager;

    // Re-render whenever the game state changes OR when an entity is selected in the editor
    EventBus.on('STATE_UPDATED', () => this.render());
    EventBus.on('ENTITY_SELECTED', () => this.render());
  }

  render() {
    const scene = this.stateManager.getCurrentSceneData();
    if (!scene) return;

    // Background image (responsive)
    this.stage.style.backgroundImage = `url(${scene.background})`;
    this.stage.style.backgroundSize = 'cover';
    this.stage.style.backgroundPosition = 'center';

    // Clear all old entities
    this.stage.innerHTML = '';

    const selectedId = this.stateManager.selectedEntityId || null;

    // Draw every entity at its exact percentage coordinates
    scene.entities.forEach(entity => {
      const img = document.createElement('img');

      img.src = entity.image;
      img.alt = entity.name || entity.id;
      img.dataset.id = entity.id;

      // Core positioning (exactly as specified in the blueprint)
      img.style.position = 'absolute';
      img.style.left = `${entity.x}%`;
      img.style.top = `${entity.y}%`;
      img.style.transform = 'translate(-50%, -50%)';

      // Visual sizing
      img.style.maxWidth = '15%';
      img.style.height = 'auto';
      img.style.pointerEvents = 'auto';
      img.style.userSelect = 'none';
      img.style.cursor = 'pointer';

      // Editor highlight when selected
      if (selectedId === entity.id) {
        img.classList.add('selected');
      }

      this.stage.appendChild(img);
    });

    console.log(`%cRenderer: Painted ${scene.entities.length} entities in "${this.stateManager.currentScene}"`, 'color:#0af');
  }
}