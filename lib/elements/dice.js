'use strict';

const BaseElement = require('./baseElement');

module.exports = Dice;

function Dice() {
    BaseElement.call(this, 'dice_v1');

    let value = 6;
    let canBeRolledByPlayerIndexes = [];

    this.roll = function() {
        value = Math.floor(Math.random() * 6) + 1;

        this.sendEvent('dice.rolled', {value: value});

        return value;
    };

    this.canBeRolledBy = function(playerIndexes) {
        if (typeof playerIndexes === 'number') {
            playerIndexes = [playerIndexes];
        }

        canBeRolledByPlayerIndexes = playerIndexes;

        this.sendEvent('dice.permissionChanged', {canBeRolledBy: canBeRolledByPlayerIndexes});
    };
}
Dice.prototype = Object.create(BaseElement.prototype);
Dice.prototype.constructor = Dice;