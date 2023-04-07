const EventTreeNode = require('./EventTreeNode')

class EventTree {
  constructor () {
    this._root = new EventTreeNode()
  }

  on (eventName, options = {}, handler) {
    this._root.on(eventName, options, handler)
  }

  unon (eventName, handler) {
    this._root.unon(eventName, handler)
  }

  trigger (eventName, context = {}) {
    this._root.trigger(eventName, context)
  }

  addEventListener (eventName, options = {}, handler) {
    this.on(eventName, options, handler)
  }

  removeEventListener (eventName, handler) {
    this.unon(eventName, handler)
  }

  dispatch (eventName, context = {}) {
    this.trigger(eventName, context)
  }
}

module.exports = EventTree
