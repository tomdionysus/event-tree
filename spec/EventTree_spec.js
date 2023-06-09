const EventTree = require('../src/EventTree');

describe('EventTree', () => {
    let eventTree;
    let handler1, handler2, handler3;
    let options1, options2;

    beforeEach(() => {
        eventTree = new EventTree();

        handler1 = jasmine.createSpy('handler1');
        handler2 = jasmine.createSpy('handler2');
        handler3 = jasmine.createSpy('handler3');

        options1 = { optionOne: 1 };
        options2 = { optionTwo: 2 };
    });

    describe('on', () => {
        it('should register an event listener', () => {
            eventTree.on('event1', options1, handler1);
            eventTree.trigger('event1');

            expect(handler1).toHaveBeenCalled();
        });
    });

    describe('unon', () => {
        it('should unregister an event listener', () => {
            eventTree.on('event1', options1, handler1);
            eventTree.unon('event1', handler1);
            eventTree.trigger('event1');

            expect(handler1).not.toHaveBeenCalled();
        });
    });

    describe('trigger', () => {
        it('should trigger an event and call the registered listener', () => {
            eventTree.on('event1', options1, handler1);
            eventTree.trigger('event1');

            expect(handler1).toHaveBeenCalled();
        });

        it('should trigger a hierarchical event and call the registered listeners', () => {
            eventTree.on('event1.subevent', options1, handler1);
            eventTree.on('event1', options2, handler2);
            eventTree.trigger('event1.subevent');

            expect(handler1).toHaveBeenCalled();
            expect(handler2).toHaveBeenCalled();
        });
    });

    describe('addEventListener', () => {
        it('should register an event listener', () => {
            eventTree.addEventListener('event1', options1, handler1);
            eventTree.trigger('event1');

            expect(handler1).toHaveBeenCalled();
        });
    });

    describe('removeEventListener', () => {
        it('should unregister an event listener', () => {
            eventTree.addEventListener('event1', options1, handler1);
            eventTree.removeEventListener('event1', handler1);
            eventTree.trigger('event1');

            expect(handler1).not.toHaveBeenCalled();
        });
    });

    describe('dispatch', () => {
        it('should trigger an event and call the registered listener', () => {
            eventTree.on('event1', options1, handler1);
            eventTree.dispatch('event1');

            expect(handler1).toHaveBeenCalled();
        });

        it('should trigger a hierarchical event and call the registered listeners', () => {
            eventTree.on('event1.subevent', options1, handler1);
            eventTree.on('event1', options2, handler2);
            eventTree.dispatch('event1.subevent');

            expect(handler1).toHaveBeenCalled();
            expect(handler2).toHaveBeenCalled();
        });
    });

    describe('prune', () => {
        it('should trigger an event and call the registered listener', () => {
            eventTree.on('event1', options1, handler1);
            eventTree.unon('event1', handler1);

            eventTree.prune();

            expect(handler1).not.toHaveBeenCalled();
        });
    });

    describe('listeners()', () => {
        let eventTree;

        beforeEach(() => {
            eventTree = new EventTree();
        });

        it('should return an empty array when no listeners are added', () => {
            expect(eventTree.listeners('event')).toEqual([]);
        });

        it('should return listeners added to the specific event', () => {
            const handler1 = () => {};
            const handler2 = () => {};

            eventTree.on('event', {}, handler1);
            eventTree.on('event', {}, handler2);

            expect(eventTree.listeners('event')).toEqual([handler1, handler2]);
        });

        it('should return listeners from ancestor nodes', () => {
            const handler1 = () => {};
            const handler2 = () => {};

            eventTree.on('event.subevent', {}, handler1);
            eventTree.on('event', {}, handler2);

            expect(eventTree.listeners('event.subevent')).toEqual([handler2, handler1]);
        });

        it('should not return listeners from other branches', () => {
            const handler1 = () => {};
            const handler2 = () => {};

            eventTree.on('event1.subevent', {}, handler1);
            eventTree.on('event2.subevent', {}, handler2);

            expect(eventTree.listeners('event1.subevent')).toEqual([handler1]);
            expect(eventTree.listeners('event2.subevent')).toEqual([handler2]);
        });
    });

    describe('BDD - event registered on null should call for all events', () => {
        it('should trigger an event and call the registered listener', () => {
            eventTree.on('event1', options1, handler1);
            eventTree.on('event1.event2', options1, handler2);
            eventTree.on(null, options1, handler3);

            eventTree.trigger('event1')
            expect(handler3).toHaveBeenCalledWith({ eventName: 'event1', context: {  }, options: { optionOne: 1 } } );

            eventTree.trigger('event1.event2', { context: 2})
            expect(handler3).toHaveBeenCalledWith({ eventName: 'event1.event2', context: { context: 2}, options: { optionOne: 1 } } );
        });
    });
});