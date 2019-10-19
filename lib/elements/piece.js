'use strict';

const BaseElement = require('./baseElement');
const delay = require('delay');

module.exports = Piece;

function Piece() {
    BaseElement.call(this, 'piece_v1');

    let model = '';
    let color = '#ffffff';
    let possibleMovements = [];
    let isLaying = false;

    this.onAfterMove = null;
    
    this.setModel = function(value) {
        model = value;
    };
    this.getModel = function() {
        return model;
    };
    
    this.setColor = function(value) {
        color = value;
    };
    this.getColor = function() {
        return color;
    };

    this.layDown = function() {
        isLaying = true;

        this.sendEvent('piece.layingChanged', {isLaying: true});
    };
    this.layUp = function() {
        isLaying = false;

        this.sendEvent('piece.layingChanged', {isLaying: false});
    };
    this.isLaying = function() {
        return isLaying;
    };

    this.toArray = function() {
        return {
            model: model,
            color: color,
            canBeMovedBy: possibleMovements,
            isLaying: isLaying
        };
    };

    this.canBeMovedBy = function(newPossibleMovements) {
        if (!(newPossibleMovements instanceof Array)) {
            newPossibleMovements = [newPossibleMovements];
        }
        possibleMovements = newPossibleMovements;

        this.sendEvent('piece.permissionChanged', {canBeMovedBy: possibleMovements});
    };

    this.clearPermissions = function() {
        if (possibleMovements.length) {
            this.canBeMovedBy([]);
        }
    };

    this.on('piece.move', async (slotIndex, data) => {
        this.moveTo(
            this.GameBase.Elements.getElementById(data.containerId),
            {index: data.index}
        );

        this.GameBase.Elements.clearPermissions();
        await delay(1000);

        if (typeof this.onAfterMove === 'function') {
            await this.onAfterMove.call(this, slotIndex, this.getParent());
        }
    });
}
Piece.prototype = Object.create(BaseElement.prototype);
Piece.prototype.constructor = Piece;