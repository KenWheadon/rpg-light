export default class EventBus {
  static events = {};

  static on(event, callback) {
    if (!EventBus.events[event]) EventBus.events[event] = [];
    EventBus.events[event].push(callback);
  }

  static emit(event, data = null) {
    if (EventBus.events[event]) {
      EventBus.events[event].forEach(cb => cb(data));
    }
  }

  static off(event, callback) {
    if (EventBus.events[event]) {
      EventBus.events[event] = EventBus.events[event].filter(cb => cb !== callback);
    }
  }
}