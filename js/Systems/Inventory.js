import EventBus from '../EventBus.js';

export default class Inventory {
  constructor(stateManager) {
    this.stateManager = stateManager;
    this.bar = document.getElementById('inventory-bar');
    this.optionsMenu = document.getElementById('inventory-options');
    this.wieldBtn = document.getElementById('inv-wield-btn');
    this.descBtn = document.getElementById('inv-desc-btn');
    this.selectedItemId = null;

    EventBus.on('STATE_UPDATED', () => this.render());

    this.wieldBtn.addEventListener('click', () => {
      if (this.selectedItemId) {
        this.stateManager.setActiveItem(this.selectedItemId);
        this.render(); // highlight active
        this.hideOptions();
      }
    });

    this.descBtn.addEventListener('click', () => {
      if (this.selectedItemId) {
        const item = this.stateManager.data.state.inventory.find(i => i.id === this.selectedItemId);
        if (item) {
          const description = item.description || "A mysterious object of unknown origin.";
          EventBus.emit('SHOW_DIALOGUE', {
            rawDialogue: {
              text: description,
              choices: [
                {
                  label: "Close",
                  conditions: [],
                  actions: []
                }
              ]
            }
          });
        }
        this.hideOptions();
      }
    });

    this.bar.addEventListener('click', e => {
      const dialogueBox = document.getElementById('dialogue-box');
      if (dialogueBox && !dialogueBox.classList.contains('hidden')) {
        return; // clicking the inventory isn't possible while a dialogue or choice is on screen
      }

      const img = e.target.closest('img');
      if (img) {
        this.selectedItemId = img.dataset.id;
        const rect = img.getBoundingClientRect();
        this.showOptions(rect);
      } else {
        this.hideOptions();
      }
    });

    document.addEventListener('click', e => {
      if (!e.target.closest('#inventory-bar') && !e.target.closest('#inventory-options')) {
        this.hideOptions();
      }
    });
  }

  showOptions(rect) {
    this.optionsMenu.style.left = `${rect.left + rect.width / 2}px`;
    this.optionsMenu.style.top = `${rect.top - 10}px`;
    
    // Update button text based on active state
    if (this.stateManager.activeItem === this.selectedItemId) {
      this.wieldBtn.textContent = 'Unequip';
    } else {
      this.wieldBtn.textContent = 'Wield';
    }

    this.optionsMenu.classList.remove('hidden');
  }

  hideOptions() {
    this.optionsMenu.classList.add('hidden');
    this.selectedItemId = null;
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