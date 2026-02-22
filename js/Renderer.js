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
      // Create a container for the entity and its label
      const container = document.createElement('div');
      container.style.position = 'absolute';
      container.style.left = `${entity.x}%`;
      container.style.top = `${entity.y}%`;
      container.style.transform = 'translate(-50%, -50%)';
      container.style.display = 'flex';
      container.style.flexDirection = 'column';
      container.style.alignItems = 'center';
      container.style.pointerEvents = 'auto'; // allow clicks on container
      container.style.cursor = 'pointer';
      container.dataset.id = entity.id; // required for InputHandler to know what we clicked

      const img = document.createElement('img');
      img.src = entity.image;
      img.alt = entity.name || entity.id;
      img.style.pointerEvents = 'none'; // let the container handle clicks
      img.style.userSelect = 'none';

      // Visual sizing
      img.style.maxWidth = '100px'; // fixed max width for now to prevent huge entities
      img.style.height = 'auto';

      // Editor highlight when selected
      if (selectedId === entity.id) {
        img.classList.add('selected');
      }

      const label = document.createElement('div');
      label.textContent = entity.name || entity.id;
      label.className = 'entity-label';

      container.appendChild(label);
      container.appendChild(img);
      this.stage.appendChild(container);
    });

    console.log(`%cRenderer: Painted ${scene.entities.length} entities in "${this.stateManager.currentScene}"`, 'color:#0af');
  }
}