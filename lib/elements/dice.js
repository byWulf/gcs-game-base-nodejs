'use strict';

const BaseElement = require('./baseElement');
const Sleep = require('sleep');

module.exports = Dice;

function Dice() {
    BaseElement.call(this, 'dice_v1');

    let value = 6;
    let canBeRolledByPlayerIndexes = [];

    this.onAfterRoll = null;

    this.roll = function() {
        value = Math.floor(Math.random() * 6) + 1;

        this.sendEvent('dice.rolled', {value: value});

        this.canBeRolledBy([]);
        Sleep.sleep(2);

        return value;
    };

    this.canBeRolledBy = function(playerIndexes) {
        if (typeof playerIndexes === 'number') {
            playerIndexes = [playerIndexes];
        }

        canBeRolledByPlayerIndexes = playerIndexes;

        this.sendEvent('dice.permissionChanged', {canBeRolledBy: canBeRolledByPlayerIndexes});
    };

    this.on('dice.roll', (slotIndex, data) => {
        let value = this.roll();

        if (typeof this.onAfterRoll === 'function') {
            this.onAfterRoll.call(this, slotIndex, value);
        }
    });
}
Dice.prototype = Object.create(BaseElement.prototype);
Dice.prototype.constructor = Dice;