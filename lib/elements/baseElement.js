'use strict';

const crypto = require('crypto');
const EventEmitter = require('events');

module.exports = BaseElement;

function BaseElement(elementType, customId) {
    let eventEmitter = new EventEmitter();
    eventEmitter.on('error', function() {});

    let id = customId || crypto.randomBytes(20).toString('hex');

    let parent = {
        id: null,
        data: null
    };

    let type = elementType;

    this.getId = function() {
        return id;
    };
    this.getType = function() {
        return type;
    };
    this.getParent = function() {
        return parent;
    };
    this.getEventEmitter = function() {
        return eventEmitter;
    };

    this.moveTo = function(targetElement, additionalData) {
        if (targetElement && !(targetElement instanceof BaseElement)) throw new Error('BaseElement.moveTo: targetElement must be a BaseElement');
        parent.id = targetElement ? targetElement.getId() : null;
        parent.data = additionalData;

        eventEmitter.emit('event', {
            event: 'element.moved',
            id: id,
            parent: parent,
            duration: 500
        });
    };

    this.toArray = function() {
        return {};
    };
}