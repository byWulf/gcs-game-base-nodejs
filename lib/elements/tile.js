'use strict';

const BaseElement = require('./baseElement');
const Sleep = require('sleep');

module.exports = Tile;

function Tile() {
    BaseElement.call(this, 'tile_v1');

    let frontImage = '';
    let backImage = '';

    let side = 'back';
    let rotation = 0;
    let height = 0.2;
    let width = 5;
    let form = 'square'; //square, hexagonal, triangular

    let frontVisibleFor = [];
    let possibleMovements = [];
    let canBeRotated = true;
    let flipPlayers = [];

    this.onAfterMove = null;
    this.onBeforeFlip = null;
    this.onAfterFlip = null;

    this.setFrontImage = function(value) {
        frontImage = value;
    };

    this.setBackImage = function(value) {
        backImage = value;
    };

    this.setSide = function(value) {
        side = value;

        this.sendEvent('tile.flipped', {
            side: side
        });
    };

    this.setRotation = function(value) {
        rotation = value;
    };

    this.setHeight = function(value) {
        height = value;
    };

    this.setWidth = function(value) {
        width = value;
    };

    this.setForm = function(value) {
        form = value;
    };

    this.setCanBeRotated = function(value) {
        canBeRotated = value;
    };

    this.toArray = function() {
        return {
            frontImage: frontImage,
            backImage: backImage,
            side: side,
            rotation: rotation,
            height: height,
            width: width,
            form: form,
            canBeRotated: canBeRotated,
            frontVisibleFor: frontVisibleFor,
            canBeMovedBy: possibleMovements,
            canBeFlippedBy: flipPlayers
        };
    };

    this._sendPermissionChanged = function() {
        this.sendEvent('tile.permissionChanged', {
            frontVisibleFor: frontVisibleFor,
            canBeMovedBy: possibleMovements,
            canBeFlippedBy: flipPlayers
        });
    };

    this.setFrontVisibility = function(newFrontVisibleFor) {
        if (!(newFrontVisibleFor instanceof Array)) {
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
            this.onAfterMove.call(this, slotIndex, this.getParent());
        }
    });

    this.on('tile.flip', (slotIndex, data) => {
        this.setSide(side === 'front' ? 'back' : 'front');

        this.GameBase.Elements.clearPermissions();

        if (typeof this.onBeforeFlip === 'function') {
            this.onBeforeFlip.call(this, slotIndex, side);
        }

        Sleep.sleep(1);

        if (typeof this.onAfterFlip === 'function') {
            this.onAfterFlip.call(this, slotIndex, side);
        }
    });

}
Tile.prototype = Object.create(BaseElement.prototype);
Tile.prototype.constructor = Tile;