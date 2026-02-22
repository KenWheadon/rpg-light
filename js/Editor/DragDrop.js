import EventBus from '../EventBus.js';

export default class DragDrop {
  constructor(stage, stateManager, renderer) {
    this.stage = stage;
    this.stateManager = stateManager;
    this.renderer = renderer;
    this.isDragging = false;
    this.currentEntityId = null;
    this.offsetX = 0;
    this.offsetY = 0;

    this.stage.addEventListener('mousedown', e => this.onMouseDown(e));
    document.addEventListener('mousemove', e => this.onMouseMove(e));
    document.addEventListener('mouseup', () => this.onMouseUp());
  }

  onMouseDown(e) {
    if (!this.stage.classList.contains('editor-mode')) return;
    const img = e.target.closest('img[data-id]');
    if (!img) return;

    this.currentEntityId = img.dataset.id;
    this.isDragging = true;

    // Select immediately
    EventBus.emit('ENTITY_SELECTED', this.currentEntityId);

    const rect = this.stage.getBoundingClientRect();
    this.offsetX = (e.clientX - rect.left) / rect.width * 100 - parseFloat(img.style.left);
    this.offsetY = (e.clientY - rect.top) / rect.height * 100 - parseFloat(img.style.top);
  }

  onMouseMove(e) {
    if (!this.isDragging || !this.currentEntityId) return;

    const rect = this.stage.getBoundingClientRect();
    let newX = (e.clientX - rect.left) / rect.width * 100 - this.offsetX;
    let newY = (e.clientY - rect.top) / rect.height * 100 - this.offsetY;

    // Clamp
    newX = Math.max(5, Math.min(95, newX));
    newY = Math.max(5, Math.min(95, newY));

    this.stateManager.updateEntityPosition(this.currentEntityId, newX, newY);
    this.renderer.render(); // live update
  }

  onMouseUp() {
    if (this.isDragging) {
      this.isDragging = false;
      this.currentEntityId = null;
      EventBus.emit('STATE_UPDATED');
    }
  }
}