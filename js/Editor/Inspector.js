import EventBus from '../EventBus.js';

export default class Inspector {
  constructor(stateManager) {
    this.stateManager = stateManager;
    this.selectedId = null;

    this.fieldsDiv = document.getElementById('inspector-fields');

    EventBus.on('ENTITY_SELECTED', id => this.show(id));
  }

  show(id) {
    this.selectedId = id;
    const scene = this.stateManager.getCurrentSceneData();
    const entity = scene.entities.find(e => e.id === id);
    if (!entity) return;

    let html = `
      <label>ID <input id="edit-id" value="${entity.id}" readonly></label>
      <label>Name <input id="edit-name" value="${entity.name}"></label>
      <label>Type 
        <select id="edit-type">
          <option value="item" ${entity.type==='item'?'selected':''}>Item</option>
          <option value="portal" ${entity.type==='portal'?'selected':''}>Portal</option>
          <option value="decor" ${entity.type==='decor'?'selected':''}>Decor</option>
        </select>
      </label>
      <label>X % <input id="edit-x" type="number" step="0.1" value="${entity.x}"></label>
      <label>Y % <input id="edit-y" type="number" step="0.1" value="${entity.y}"></label>
      <label>Image URL <input id="edit-image" value="${entity.image}"></label>
      
      <label style="margin-top:20px">on_click (JSON)</label>
      <textarea id="edit-onclick" style="height:180px">${JSON.stringify(entity.on_click, null, 2)}</textarea>
      
      <button id="apply-btn">Apply Changes</button>
      <button id="delete-btn" style="background:#f44;margin-top:8px">Delete Entity</button>
    `;

    this.fieldsDiv.innerHTML = html;

    // Apply button
    document.getElementById('apply-btn').onclick = () => this.applyChanges();
    document.getElementById('delete-btn').onclick = () => this.deleteEntity();
  }

  applyChanges() {
    if (!this.selectedId) return;
    const scene = this.stateManager.getCurrentSceneData();
    const entity = scene.entities.find(e => e.id === this.selectedId);
    if (!entity) return;

    entity.name = document.getElementById('edit-name').value;
    entity.type = document.getElementById('edit-type').value;
    entity.x = parseFloat(document.getElementById('edit-x').value);
    entity.y = parseFloat(document.getElementById('edit-y').value);
    entity.image = document.getElementById('edit-image').value;

    try {
      entity.on_click = JSON.parse(document.getElementById('edit-onclick').value);
    } catch (err) {
      alert("Invalid JSON in on_click!");
      return;
    }

    EventBus.emit('STATE_UPDATED');
    alert("✅ Entity updated!");
  }

  deleteEntity() {
    if (confirm("Delete this entity permanently?")) {
      this.stateManager.removeEntity(this.selectedId);
      this.fieldsDiv.innerHTML = '<p style="color:#666">No entity selected</p>';
      this.selectedId = null;
    }
  }
}