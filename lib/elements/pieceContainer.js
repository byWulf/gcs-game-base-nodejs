'use strict';

const BaseElement = require('./baseElement');

module.exports = PieceContainer;

function PieceContainer() {
    BaseElement.call(this, 'PieceContainer_v1');

    let positions = {};
    
    this.setPositions = function(value) {
        positions = value;
    };
    this.getPositions = function() {
        return positions;
    };

    this.toArray = function() {
        return this.getAsArray({
            positions: positions
        });
    };
}
PieceContainer.prototype = Object.create(BaseElement.prototype);
PieceContainer.prototype.constructor = PieceContainer;