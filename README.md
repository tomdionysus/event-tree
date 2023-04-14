# event-tree: A Hierarchical Event System

[![CircleCI](https://dl.circleci.com/status-badge/img/gh/tomdionysus/event-tree/tree/main.svg?style=svg)](https://dl.circleci.com/status-badge/redirect/gh/tomdionysus/event-tree/tree/main)
[![Coverage Status](https://coveralls.io/repos/github/tomdionysus/event-tree/badge.svg?branch=main)](https://coveralls.io/github/tomdionysus/event-tree?branch=main)
[![npm version](https://badge.fury.io/js/@tomdionysus%2Fevent-tree.svg)](https://badge.fury.io/js/@tomdionysus%2Fevent-tree)

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

## Installation

```bash
npm i @tomdionysus/event-tree
```

## Examples

### Simple Events

```javascript
const { EventTree } = require('@tomdionysus/event-tree')

// Create a new event tree
const myTree = new EventTree()

// Add an event listener
myTree.on('myEvent', {}, (data) => {
  console.log(`Received data for 'myEvent': ${data}`)
})

// Trigger the event
myTree.trigger('myEvent', 'Hello, world!')
```

In this example, we create a new EventTree instance and add an event listener for the myEvent event. When the event is triggered with the string 'Hello, world!', the listener will log a message to the console.

### Hierarchical Events

```javascript
const { EventTree } = require('@tomdionysus/event-tree')

// Create a new event tree
const myTree = new EventTree()

// Add an event listener for event1
myTree.on('event1', {}, (data) => {
  console.log(`Received data for 'event1': ${data}`)
})

// Add an event listener for event1.event2
myTree.on('event1.event2', {}, (data) => {
  console.log(`Received data for 'event1.event2': ${data}`)
})

// Trigger the event1.event2 event
myTree.trigger('event1.event2', 'Hello, world from event1.event2!')
```

In this example, we create a new EventTree instance and add event listeners for two events, event1 and event1.event2, which is a hierarchical event. When the event1.event2 event is triggered, both event listeners will fire and log messages to the console, since event1 is a parent event of event1.event2. Therefore, the output will be:

```
Received data for 'event1': Hello, world from event1.event2!
Received data for 'event1.event2': Hello, world from event1.event2!
```

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

The following event's listeners will be called:

* `factory`
* `factory.security`
* `factory.security.signIn`

## Listing Events

You can get all the handlers that will be called for an event using `listeners(eventName)`. This will include handlers from ancestor events: 

```javascript
on('event1', {}}, handler1)
on('event1.event2', {}}, handler2)
listeners('event1.event2') === [ handler1, handler2 ]
```

## License

This project is licensed under the terms of the MIT license. See the [LICENSE](LICENSE) file for details.

## Contributor Code Of Conduct

Contributors must observe the [Code Of Conduct](code_of_conduct.md).