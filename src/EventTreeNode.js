class EventTreeNode {
  constructor (parentNode = null) {
    this._map = {}
    this._calls = []
    this._parentNode = parentNode
  }

  on (eventName, options = {}, handler) {
    // Is this the last Node?
    if (eventName === null || eventName.length === 0) {
      this._calls.push({
        fn: handler,
        op: options
      })
      return
    }

    this._walk(eventName, (eventName, rest) => {
      this._map[eventName].on(rest, options, handler)
    }, true)
  }

  unon (eventName, handler) {
    // Is this the last Node?
    if (eventName === null || eventName.length === 0) {
      this._calls = this._calls.filter(item => item.fn !== handler)
      if (this._parentNode) this._parentNode.prune()
      return
    }

    this._walk(eventName, (eventName, rest) => {
      this._map[eventName].unon(rest, handler)
    })
  }

  trigger (eventName, context, originalEventName = null) {
    // Store this on the first call
    if (originalEventName === null) originalEventName = eventName

    // Prevent propogation?
    let stop = false

    // Call all registered listeners
    this._calls.forEach((item) => {
      if (item.fn({ eventName: originalEventName, context, options: item.op }) === false) stop = true
    })

    // Return now if propogation stopped
    if (stop) return

    // Return if no more path
    if (eventName === null || eventName.length === 0) return

    this._walk(eventName, (eventName, rest) => {
      this._map[eventName].trigger(rest, context, originalEventName)
    })
  }

  _walk (eventName, callback, create = false) {
    // Test for further node path
    const p = eventName.indexOf('.')
    let rest = null

    // No further node paths
    if (p !== -1) {
      rest = eventName.slice(p + 1)
      eventName = eventName.slice(0, p)
    }

    // Create node if necessary
    if (create && !this._map[eventName]) this._map[eventName] = new EventTreeNode(this)

    // If the event now exists, do the callback with it
    if (this._map[eventName]) callback(eventName, rest)
  }

  prune () {
    if (Object.keys(this._map).length === 0 && this._calls.length === 0) return true

    const toDelete = []
    for (const sub in this._map) {
      const node = this._map[sub]
      if (node.prune()) toDelete.push(sub)
    }

    while (toDelete.length > 0) {
      delete this._map[toDelete.pop()]
    }

    return false
  }

  listeners (eventName, listeners = []) {
    // Add all registered listeners
    this._calls.forEach((item) => listeners.push(item.fn))

    // Return if no more path
    if (eventName === null || eventName.length === 0) return

    this._walk(eventName, (eventName, rest) => {
      this._map[eventName].listeners(rest, listeners)
    })

    return listeners
  }
}

module.exports = EventTreeNode
