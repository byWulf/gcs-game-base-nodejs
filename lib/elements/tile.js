'use strict';

const BaseElement = require('./baseElement');
const Sleep = require('sleep');

module.exports = Tile;

function Tile() {
    BaseElement.call(this, 'tile_v1');

    let frontImage = '';
    let backImage = '';

    let side = 'back';
    let rotation = 0; //in degree, clockwise
    let height = 0.2;
    let radius = 5; //border to border
    let form = 'square'; //square, hexagonal

    let frontVisibleFor = null; //null for all, othervise array of allowed slotIndizes, empty array for no one
    let possibleMovements = [];
    let possibleRotations = [];
    let flipPlayers = [];

    this.onAfterMove = null;
    this.onBeforeFlip = null;
    this.onAfterFlip = null;
    this.onAfterRotate = null;

    this.setFrontImage = function(value) {
        frontImage = value;
    };

    this.setBackImage = function(value) {
        backImage = value;
    };

    this.setSide = function(value) {
        side = value;

        this.sendEvent('tile.sideChanged', {
            side: side
        });
    };
    this.flip = function() {
        this.setSide(side === 'front' ? 'back' : 'front');
    };

    this.getRotation = function() {
        return rotation;
    };
    this.setRotation = function(value) {
        rotation = value;

        this.sendEvent('tile.rotationChanged', {
            rotation: rotation
        });
    };
    this.turnRight = function() {
        if (form === 'square') this.setRotation(rotation + 90);
        if (form === 'hexagonal') this.setRotation(rotation + 60);
    };
    this.turnLeft = function() {
        if (form === 'square') this.setRotation(rotation - 90);
        if (form === 'hexagonal') this.setRotation(rotation - 60);
    };

    this.setHeight = function(value) {
        height = value;
    };

    this.setRadius = function(value) {
        radius = value;
    };

    this.setForm = function(value) {
        form = value;
    };

    this.toArray = function() {
        return {
            frontImage: frontImage,
            backImage: backImage,
            side: side,
            rotation: rotation,
            height: height,
            radius: radius,
            form: form,
            frontVisibleFor: frontVisibleFor,
            canBeMovedBy: possibleMovements,
            canBeRotatedBy: possibleRotations,
            canBeFlippedBy: flipPlayers
        };
    };

    this._sendPermissionChanged = function() {
        this.sendEvent('tile.permissionChanged', {
            frontVisibleFor: frontVisibleFor,
            canBeMovedBy: possibleMovements,
            canBeRotatedBy: possibleRotations,
            canBeFlippedBy: flipPlayers
        });
    };

    this.setFrontVisibility = function(newFrontVisibleFor) {
        if (!(newFrontVisibleFor instanceof Array) && newFrontVisibleFor !== null) {
            newFrontVisibleFor = [newFrontVisibleFor];
        }
        frontVisibleFor = newFrontVisibleFor;

        this._sendPermissionChanged();
    };

    this.canBeMovedBy = function(newPossibleMovements) {
        if (!(newPossibleMovements instanceof Array)) {
            newPossibleMovements = [newPossibleMovements];
        }
        possibleMovements = newPossibleMovements;

        this._sendPermissionChanged();
    };

    this.canBeRotatedBy = function(newPossibleRotations) {
        if (!(newPossibleRotations instanceof Array)) {
            newPossibleRotations = [newPossibleRotations];
        }
        possibleRotations = newPossibleRotations;

        this._sendPermissionChanged();
    };

    this.canBeFlippedBy = function(newFlipPlayers) {
        if (!(newFlipPlayers instanceof Array)) {
            newFlipPlayers = [newFlipPlayers];
        }
        flipPlayers = newFlipPlayers;

        this._sendPermissionChanged();
    };

    this.clearPermissions = function() {
        if (possibleMovements.length) {
            this.canBeMovedBy([]);
        }
        if (possibleRotations.length) {
            this.canBeRotatedBy([]);
        }
        if (flipPlayers.length) {
            this.canBeFlippedBy([]);
        }
    };

    this.on('tile.move', (slotIndex, data) => {
        this.moveTo(
            this.GameBase.Elements.getElementById(data.containerId),
            {
                x: data.x,
                y: data.y,
                index: data.index
            }
        );

        this.GameBase.Elements.clearPermissions();
        Sleep.sleep(1);

        if (typeof this.onAfterMove === 'function') {
            this.onAfterMove.call(this, slotIndex, this.getParent(), this);
        }
    });

    this.on('tile.flip', (slotIndex, data) => {
        this.flip();

        this.GameBase.Elements.clearPermissions();

        if (typeof this.onBeforeFlip === 'function') {
            this.onBeforeFlip.call(this, slotIndex, side, this);
        }

        Sleep.sleep(1);

        if (typeof this.onAfterFlip === 'function') {
            this.onAfterFlip.call(this, slotIndex, side, this);
        }
    });

    this.on('tile.rotate', (slotIndex, data) => {
        this.setRotation(data.rotation);

        Sleep.sleep(1);

        if (typeof this.onAfterRotate === 'function') {
            this.onAfterRotate.call(this, slotIndex, rotation, this);
        }
    });

    this.getNeighbours = function() {
        let parent = this.GameBase.Elements.getElementById(this.getParent().id);
        if (parent === null || !(parent instanceof this.GameBase.Elements.Type.TileContainer)) {
            return [];
        }

        let neighbours = [];
        let neighbourOffsets = [];
        if (form === 'square') {
            neighbourOffsets = [[-1, 0],[0, -1], [1, 0], [0, 1]];
        }
        if (form === 'hexagonal') {
            if (this.getParent().data.y % 2) {
                neighbourOffsets = [[-1, 0], [0, -1], [1, -1], [1, 0], [1, 1], [0, 1]];
            } else {
                neighbourOffsets = [[-1, 0], [-1, -1], [0, -1], [1, 0], [0, 1], [-1, 1]];
            }
        }

        let allElements = this.GameBase.Elements.getElements();
        for (let offset of neighbourOffsets) {
            let elements = [];
            for (let i = 0; i < allElements.length; i++) {
                if (
                    allElements[i].getParent().id === this.getParent().id &&
                    allElements[i].getParent().data.x === this.getParent().data.x + offset[0] &&
                    allElements[i].getParent().data.y === this.getParent().data.y + offset[1]
                ) {
                    elements.push(allElements[i]);
                }
            }

            neighbours.push({
                x: this.getParent().data.x + offset[0],
                y: this.getParent().data.y + offset[1],
                elements: elements
            });
        }

        return neighbours;
    }

}
Tile.prototype = Object.create(BaseElement.prototype);
Tile.prototype.constructor = Tile;