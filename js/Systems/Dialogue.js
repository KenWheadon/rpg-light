import EventBus from '../EventBus.js';

export default class Dialogue {
  constructor(stateManager, questLogic) {
    this.stateManager = stateManager;
    this.questLogic = questLogic;

    this.box = document.getElementById('dialogue-box');
    this.backdrop = document.getElementById('dialogue-backdrop');
    this.textEl = document.getElementById('dialogue-text');
    this.choicesEl = document.getElementById('dialogue-choices');

    EventBus.on('SHOW_DIALOGUE', target => this.show(target));
    EventBus.on('CLOSE_DIALOGUE', () => this.close());
  }

  show({ targetId, sourceEntityId }) {
    const dialogue = this.stateManager.data.dialogues[targetId];
    if (!dialogue) {
      console.warn(`Dialogue "${targetId}" not found`);
      return;
    }

    // Attempt to fetch the avatar image from the invoking entity
    let avatarImg = '';
    if (sourceEntityId) {
      const scene = this.stateManager.getCurrentSceneData();
      const entity = scene.entities.find(e => e.id === sourceEntityId);
      if (entity && entity.image) {
        avatarImg = `<img src="${entity.image}" class="dialogue-avatar" alt="${entity.name || 'Speaker'}" />`;
      }
    }

    // Wrap the text in an inner container next to the avatar (if any)
    this.textEl.innerHTML = `
      ${avatarImg}
      <div class="dialogue-content">${dialogue.text}</div>
    `;

    this.choicesEl.innerHTML = '';

    dialogue.choices.forEach((choice, index) => {
      // Logic: If no conditions, show it. If conditions exist, check them.
      if (choice.conditions && choice.conditions.length > 0) {
        if (!this.questLogic.checkConditions(choice.conditions)) return;
      }

      const btn = document.createElement('button');
      btn.textContent = choice.label;
      btn.addEventListener('click', () => {
        this.questLogic.executeActions(choice.actions, sourceEntityId);
        // Dialogue auto-closes after any choice (standard in most story engines)
        this.close();
      });
      this.choicesEl.appendChild(btn);
    });

    this.box.classList.remove('hidden');
    this.backdrop.classList.remove('hidden');
  }

  close() {
    this.box.classList.add('hidden');
    this.backdrop.classList.add('hidden');
  }
}