'use strict';

const BaseElement = require('./baseElement');

module.exports = Dice;

function Dice() {
    BaseElement.call(this, 'Dice_v1');
}
Dice.prototype = Object.create(BaseElement.prototype);
Dice.prototype.constructor = Dice;