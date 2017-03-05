'use strict';

const crypto = require('crypto');

module.exports = BaseElement;

function BaseElement(elementType, customId) {
    let id = customId || crypto.randomBytes(20).toString('hex');

    let container = {
        id: null,
        data: null
    };

    let type = elementType;

    this.getId = function() {
        return id;
    };

    this.moveTo = function(targetElement, additionalData) {
        if (targetElement && !(targetElement instanceof BaseElement)) throw new Error('BaseElement.moveTo: targetElement must be a BaseElement');
        container.id = targetElement ? targetElement.getId() : null;
        container.data = additionalData;
    };

    this.getAsArray = function(elementData) {
        return {
            id: id,
            type: type,
            parent: container,
            element: elementData
        };
    };

    this.toArray = function() {
        return this.getAsArray();
    };
}