'use strict';

const BaseElement = require('./baseElement');
const Sleep = require('sleep');

module.exports = Piece;

function Piece() {
    BaseElement.call(this, 'piece_v1');

    let model = '';
    let color = '#ffffff';
    let possibleMovements = [];

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

    this.toArray = function() {
        return {
            model: model,
            color: color,
            canBeMovedBy: possibleMovements
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

    this.on('piece.move', (slotIndex, data) => {
        this.moveTo(
            this.GameBase.Elements.getElementById(data.containerId),
            {index: data.index}
        );

        this.GameBase.Elements.clearPermissions();
        Sleep.sleep(1);

        if (typeof this.onAfterMove === 'function') {
            this.onAfterMove.call(this, slotIndex, this.getParent());
        }
    });
}
Piece.prototype = Object.create(BaseElement.prototype);
Piece.prototype.constructor = Piece;