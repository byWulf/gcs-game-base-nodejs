'use strict';

const BaseElement = require('./baseElement');

module.exports = Dice;

function Dice() {
    BaseElement.call(this, 'dice_v1');

    let value = 6;

    this.roll = function() {
        value = Math.floor(Math.random() * 6) + 1;

        this.getEventEmitter().emit('event', {
            event: 'dice.rolled',
            id: this.getId(),
            value: value
        });

        return value;
    }
}
Dice.prototype = Object.create(BaseElement.prototype);
Dice.prototype.constructor = Dice;