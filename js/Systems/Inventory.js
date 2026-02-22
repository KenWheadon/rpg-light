import EventBus from '../EventBus.js';

export default class Inventory {
  constructor(stateManager) {
    this.stateManager = stateManager;
    this.bar = document.getElementById('inventory-bar');

    EventBus.on('STATE_UPDATED', () => this.render());

    this.bar.addEventListener('click', e => {
      const img = e.target.closest('img');
      if (img) {
        const itemId = img.dataset.id;
        this.stateManager.setActiveItem(itemId);
        this.render(); // highlight active
      }
    });
  }

  render() {
    this.bar.innerHTML = '';
    this.stateManager.data.state.inventory.forEach(item => {
      const img = document.createElement('img');
      img.src = item.image;
      img.alt = item.name;
      img.dataset.id = item.id;
      if (this.stateManager.activeItem === item.id) img.classList.add('active');
      this.bar.appendChild(img);
    });
  }
}