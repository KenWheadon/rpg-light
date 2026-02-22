import EventBus from '../EventBus.js';

export default class QuestLogic {
  constructor(stateManager) {
    this.stateManager = stateManager;

    EventBus.on('INTERACT_ENTITY', data => this.processInteraction(data.entityId));
  }

  processInteraction(entityId) {
    const scene = this.stateManager.getCurrentSceneData();
    const entity = scene.entities.find(e => e.id === entityId);
    if (!entity || !entity.on_click) return;

    const block = entity.on_click.find(b => {
      if (b.conditions.length === 0 || b.conditions[0] === "default") return true;
      return this.checkConditions(b.conditions);
    });

    if (block) {
      this.executeActions(block.actions, entityId);
    }
  }

  checkConditions(conditions) {
    for (const cond of conditions) {
      switch (cond.type) {
        case 'requires_active_item':
          if (this.stateManager.activeItem !== cond.value) return false;
          break;
        case 'has_item':
          const hasItem = this.stateManager.data.state.inventory.some(i => i.id === cond.value);
          if (!hasItem) return false;
          break;
        default:
          return false;
      }
    }
    return true;
  }

  // PUBLIC & REUSABLE — used by both entity clicks and dialogue choices
  executeActions(actions, sourceEntityId = null) {
    actions.forEach(action => {
      switch (action.type) {
        case 'add_item':
          this.stateManager.addItem(action.target);
          break;
        case 'remove_entity':
          const entityToRemove = action.target || sourceEntityId;
          if (entityToRemove) this.stateManager.removeEntity(entityToRemove);
          break;
        case 'show_message':
          EventBus.emit('SHOW_MESSAGE', { 
            msg: action.value, 
            sourceEntityId,
            customAvatar: action.avatar 
          });
          break;
        case 'change_scene':
          this.stateManager.changeScene(action.target);
          break;
        case 'set_flag':
          this.stateManager.setFlag(action.target, action.value);
          break;
        case 'show_dialogue':
          EventBus.emit('SHOW_DIALOGUE', { targetId: action.target, sourceEntityId: sourceEntityId });
          break;
        case 'close_dialogue':
          EventBus.emit('CLOSE_DIALOGUE');
          break;
      }
    });
    EventBus.emit('STATE_UPDATED');
  }
}