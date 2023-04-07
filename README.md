# event-tree: A Hierarchical Event System

event-tree is a JavaScript library designed to facilitate the organization and management of events using a hierarchical tree structure. The library allows developers to easily subscribe and unsubscribe event listeners, as well as trigger events throughout the tree. By organizing events in a tree, the library helps developers visualize and manage event relationships more effectively. event-tree supports adding and removing event listeners, triggering events, and pruning unused nodes, making it an efficient and practical solution for event-driven applications.

## Overview

Event-Tree organizes events in a hierarchical tree structure, making it simple to visualize and manage event relationships. Here's an example of an event tree:

```
factory
├── security
│   ├── signIn
│   ├── signOut
│   └── alarm
├── process
│   ├── production
│   │   ├── start
│   │   └── stop
│   └── assembly
│       ├── start
│       └── stop
└── timeclock
    ├── shift
    │   ├── starts
    │   └── ends
    ├── dayStart
    └── dayEnd
```


Each node in the tree has an "address" (e.g., `factory.process.production.start` or `factory.timeclock`). You can subscribe to a specific event by its address and provide a callback function.

## Attaching Event Listeners

To subscribe to an event, use `on` or `addEventListener`:

```javascript
on(eventName, [options], handler)
```

The handler function will be called with these parameters: `handler({ eventName: <original eventName>, context: <context from trigger>, options: <options from on> })`

## Removing Event Listeners

To unsubscribe from an event, use unon or removeEventListener:

```javascript
unon(eventName, [options], handler)
```

## Triggering (Dispatching) Events

When you trigger an event, all handlers in the event's route are also called. For example:

```javascript
trigger('factory.security.signIn', context)
```

The following event's listeners will be called:

* `factory`
* `factory.security`
* `factory.security.signIn`

## Propogation

If any handler returns explictly `false`, all downline events will not be triggered. For example: 

```javascript
trigger('factory.security.signIn', context)
```

Event listeners are registered on the following events:

* `factory` - returns null
* `factory.security` - returns false
* `factory.security.signIn` - These handlers will not be called, because a handler on `factory.security` returned false.

## License

This project is licensed under the terms of the MIT license. See the [LICENSE](LICENSE) file for details.

## Contributor Code Of Conduct

Contributors must observe the [Code Of Conduct](code_of_conduct.md).