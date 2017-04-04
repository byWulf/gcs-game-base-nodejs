'use strict';

const BaseElement = require('./baseElement');

module.exports = AutoResizeContainer;

function AutoResizeContainer() {
    BaseElement.call(this, 'autoResizeContainer_v1');

    let spacing = 5;

    this.setSpacing = function(value) {
        spacing = value;
    };
    this.getSpacing = function() {
        return spacing;
    };

    this.toArray = function() {
        return {
            spacing: spacing
        };
    };
}
AutoResizeContainer.prototype = Object.create(BaseElement.prototype);
AutoResizeContainer.prototype.constructor = AutoResizeContainer;