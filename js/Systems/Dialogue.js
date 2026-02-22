import EventBus from '../EventBus.js';

export default class Dialogue {
  constructor(stateManager, questLogic) {
    this.stateManager = stateManager;
    this.questLogic = questLogic;

    this.box = document.getElementById('dialogue-box');
    this.textEl = document.getElementById('dialogue-text');
    this.choicesEl = document.getElementById('dialogue-choices');

    EventBus.on('SHOW_DIALOGUE', target => this.show(target));
    EventBus.on('CLOSE_DIALOGUE', () => this.close());
  }

  show(dialogueId) {
    const dialogue = this.stateManager.data.dialogues[dialogueId];
    if (!dialogue) {
      console.warn(`Dialogue "${dialogueId}" not found`);
      return;
    }

    this.textEl.textContent = dialogue.text;
    this.choicesEl.innerHTML = '';

    dialogue.choices.forEach((choice, index) => {
      // Logic: If no conditions, show it. If conditions exist, check them.
      if (choice.conditions && choice.conditions.length > 0) {
        if (!this.questLogic.checkConditions(choice.conditions)) return;
      }

      const btn = document.createElement('button');
      btn.textContent = choice.label;
      btn.addEventListener('click', () => {
        this.questLogic.executeActions(choice.actions);
        // Dialogue auto-closes after any choice (standard in most story engines)
        this.close();
      });
      this.choicesEl.appendChild(btn);
    });

    this.box.classList.remove('hidden');
  }

  close() {
    this.box.classList.add('hidden');
  }
}