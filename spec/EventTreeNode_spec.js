const EventTreeNode = require('../src/EventTreeNode')

describe('EventTreeNode', () => {
	describe('constructor', () => {
		it('should allow New', () => {
			var x1 = new EventTreeNode()
			var x2 = new EventTreeNode()

			expect(x1).not.toBe(x2)
		})
	})

	describe('on', function () {
		var x1, x, options;

		beforeEach(()=>{
			x1 = new EventTreeNode()

			x = { handler: ()=>{ return 0; } }
			options = { optionOne: 1 }
		})

		it('should create a single node', () => {
			spyOn(x,'handler').and.callThrough();

			x1.on('testevent', options, x.handler);

			expect(x1).not.toBeNull();
			expect(x1._calls).toEqual([]);
			expect(x1._map['testevent']).not.toBeNull();
			expect(x1._map['testevent']).toBeInstanceOf(EventTreeNode);
			expect(x1._map['testevent']._calls.find(item => item.fn === x.handler).op).toEqual(options);
		})

		it('should create a chain of nodes', () => {
			spyOn(x,'handler').and.callThrough();

			x1.on('testevent.subevent', options, x.handler);

			expect(x1).not.toBeNull();
			expect(x1._calls).toEqual([]);
			expect(x1._map['testevent']).not.toBeNull();
			expect(x1._map['testevent']).toBeInstanceOf(EventTreeNode);
			expect(x1._map['testevent']._calls).toEqual([]);
			expect(x1._map['testevent']._map['subevent']).toBeInstanceOf(EventTreeNode);
			expect(x1._map['testevent']._map['subevent']._calls.find(item => item.fn === x.handler).op).toEqual(options);
		})

		it('should create handlers and use existing nodes', () => {
			spyOn(x,'handler').and.callThrough();

			x1.on('testevent', options, x.handler);

			var x2 = { handler: ()=>{ return 1; } }
			var options2 = { optionTwo: 1 }

			x1.on('testevent.subevent', options2, x2.handler);

			expect(x1._map['testevent']._calls.find(item => item.fn === x.handler).op).toEqual(options);
			expect(x1._map['testevent']._map['subevent']._calls.find(item => item.fn === x2.handler).op).toEqual(options2);
		})
	})

	describe('trigger', function () {
	  var x1, x, options, context;

	  beforeEach(() => {
		x1 = new EventTreeNode();

		x = { handler: () => { return 0; } };
		options = { optionOne: 1 };

		context = { contextValue: 'foo' }
	  });

	  it('should call a single node handler', () => {
		spyOn(x, 'handler').and.callThrough();

		x1.on('testevent', options, x.handler);
		x1.trigger('testevent', context);

		expect(x.handler).toHaveBeenCalledWith({ eventName: 'testevent', context: context, options: options });
	  });

	  it('should call handlers in a chain of nodes', () => {
		var x2 = { handler: () => { return 1; } };
		var options2 = { optionTwo: 1 };

		spyOn(x, 'handler').and.callThrough();
		spyOn(x2, 'handler').and.callThrough();

		x1.on('testevent', options, x.handler);
		x1.on('testevent.subevent', options2, x2.handler);

		x1.trigger('testevent.subevent', context);

		expect(x.handler).toHaveBeenCalledWith({ eventName: 'testevent.subevent', context: context, options: options });
		expect(x2.handler).toHaveBeenCalledWith({ eventName: 'testevent.subevent', context: context, options: options2 });
	  });

	  it('should stop propagation if a handler returns false', () => {
		var x2 = { handler: () => { return false; } };
		var x3 = { handler: () => { return 2; } };
		var options2 = { optionTwo: 1 };
		var options3 = { optionThree: 1 };

		spyOn(x, 'handler').and.callThrough();
		spyOn(x2, 'handler').and.callThrough();
		spyOn(x3, 'handler').and.callThrough();

		x1.on('testevent', options, x.handler);
		x1.on('testevent.subevent', options2, x2.handler);
		x1.on('testevent.subevent.subsubevent', options3, x3.handler);

		x1.trigger('testevent.subevent.subsubevent', context);

		expect(x.handler).toHaveBeenCalledWith({ eventName: 'testevent.subevent.subsubevent', context: context, options: options });
		expect(x2.handler).toHaveBeenCalledWith({ eventName: 'testevent.subevent.subsubevent', context: context, options: options2 });
		expect(x3.handler).not.toHaveBeenCalled();
	  });
	});

	describe('unon', function () {
		var x1, x, options;

		beforeEach(()=>{
			x1 = new EventTreeNode()

			x = { handler: ()=>{ return 0; }, handler2: ()=>{ return 0; } }
			options = { optionOne: 1 }
		})

		it('should remove a single handler', () => {
			x1.on('testevent', options, x.handler);
			x1.unon('testevent', x.handler);

			expect(Object.keys(x1._map).length).toEqual(0);
		})

		it('should remove a handler from a chain of nodes', () => {
			x1.on('testevent.subevent', options, x.handler);
			x1.on('testevent.subevent', options, x.handler2);
			x1.unon('testevent.subevent', x.handler);

			expect(x1._map['testevent']._map['subevent']._calls).toEqual([ { fn: x.handler2, op: options }]);
		})

		it('should remove a handler and keep the others', () => {
			var x2 = { handler: ()=>{ return 1; } }
			var options2 = { optionTwo: 1 }

			x1.on('testevent', options, x.handler);
			x1.on('testevent', options2, x2.handler);
			x1.unon('testevent', x.handler);

			expect(x1._map['testevent']._calls.length).toEqual(1);
			expect(x1._map['testevent']._calls.find(item => item.fn === x2.handler).op).toEqual(options2);
		})
	})

	describe('prune', () => {
		let rootNode;
		let handler1, handler2, handler3;
		let options1, options2;

		beforeEach(() => {
			rootNode = new EventTreeNode();

			handler1 = jasmine.createSpy('handler1');
			handler2 = jasmine.createSpy('handler2');
			handler3 = jasmine.createSpy('handler3');

			options1 = { optionOne: 1 };
			options2 = { optionTwo: 2 };
		});
		
		it('should not prune a node with calls', () => {
			rootNode.on('event1', options1, handler1);
			rootNode.on('event2.subevent', options2, handler2);

			rootNode.prune();

			expect(rootNode._map['event1']).toBeInstanceOf(EventTreeNode);
		});

		it('should not prune a node with downstream maps', () => {
			rootNode.on('event1', options1, handler1);
			rootNode.on('event2.subevent', options2, handler2);

			rootNode.unon('event1', handler1);
			rootNode.prune();

			expect(rootNode._map['event2']).toBeInstanceOf(EventTreeNode);
		});
	});
});
