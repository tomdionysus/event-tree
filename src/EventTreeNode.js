class EventTreeNode {
	constructor(parentNode = null) {
		this._map = {};
		this._calls = [];
		this._parentNode = parentNode
	}

	on(eventName, options = {}, handler) {
		// Is this the last Node?
		if(eventName === null || eventName.length === 0) {
			this._calls.push({
				fn: handler,
				op: options
			})
			return;
		}

		this._walk(eventName, (eventName, rest)=>{
			this._map[eventName].on(rest, options, handler);
		})
	}

	unon(eventName, handler) {
		// Is this the last Node?
		if(eventName === null || eventName.length === 0) {
			this._calls = this._calls.filter(item => item.fn !== handler);
			if(this._parentNode) this._parentNode.prune();
			return;
		}

		this._walk(eventName, (eventName, rest)=>{
			this._map[eventName].unon(rest, handler);
		})
	}

	trigger(eventName, context, originalEventName = null) {
		// Store this on the first call
		if(originalEventName === null) originalEventName = eventName;

		// Prevent propogation?
		var stop = false;

		// Call all registered listeners
		this._calls.forEach((item)=>{
			if(item.fn({ eventName: originalEventName, context: context, options: item.op}) === false) stop = true;
		})

		// Return now if propogation stopped
		if(stop) return;

		// Return if no more path
		if(eventName === null || eventName.length === 0) return;

		// Test for further node path
		let p = eventName.indexOf('.')
		var rest = null;

		// No further node paths
		if(p != -1) {
			rest = eventName.slice(p+1);
			eventName = eventName.slice(0, p);
		}

		// Drop off end of node tree.
		if(this._map[eventName]) this._map[eventName].trigger(rest, context, originalEventName);
	}

	_walk(eventName, callback) {
		// Test for further node path
		let p = eventName.indexOf('.')
		var rest = null;

		// No further node paths
		if(p != -1) {
			rest = eventName.slice(p+1);
			eventName = eventName.slice(0, p);
		}

		// Create node if necessary		
		if(!this._map[eventName]) this._map[eventName] = new EventTreeNode();

		callback(eventName, rest);
	}

	prune() {
		if(this._map == {} && this._calls.length === 0) return true;

		let toDelete = [];
		for(let sub in this._map) {
			let node = this._map[sub];
			if(node.prune()) toDelete.push(sub);
		}

		while(toDelete.length>0) {
			delete this._map[toDelete.pop()]
		}

		return false;
	}
}

module.exports = EventTreeNode;