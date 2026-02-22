import EventBus from './EventBus.js';

export default class InputHandler {
  constructor(stageElement) {
    this.stage = stageElement;
    this.stage.addEventListener('click', e => this.handleClick(e));
  }

  handleClick(e) {
    // 1. Editor Mode active → let DragDrop + Inspector handle everything
    if (document.getElementById('editor-panel').classList.contains('active')) {
      return;
    }

    // 2. Dialogue box open → block stage clicks (prevent accidental interactions)
    if (!document.getElementById('dialogue-box').classList.contains('hidden')) {
      return;
    }

    // 3. Normal gameplay click on an entity
    const target = e.target.closest('div[data-id]');
    if (!target) return;

    const entityId = target.dataset.id;
    EventBus.emit('INTERACT_ENTITY', { entityId });
  }
}