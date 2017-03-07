'use strict';

const BaseElement = require('./baseElement');

module.exports = PieceContainer;

function PieceContainer() {
    BaseElement.call(this, 'pieceContainer_v1');

    let positions = [];
    
    this.setPositions = function(value) {
        positions = value;
    };
    this.getPositions = function() {
        return positions;
    };

    this.toArray = function() {
        return {
            positions: positions
        };
    };

    this.calculateNextIndexes = function(startIndex, steps) {
        if (steps > 0) {
            let indexes = [];
            for (let i = 0; i < positions.length; i++) {
                if (positions[i].index === startIndex) {
                    for (let j = 0; j < positions[i].next.length; j++) {
                        indexes = indexes.concat(this.calculateNextIndexes(positions[i].next[j], steps - 1));
                    }
                }
            }
            return indexes;
        } else {
            return [startIndex];
        }
    }
}
PieceContainer.prototype = Object.create(BaseElement.prototype);
PieceContainer.prototype.constructor = PieceContainer;