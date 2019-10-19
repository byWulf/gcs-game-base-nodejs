'use strict';

const BaseElement = require('./baseElement');
const delay = require('delay');

module.exports = Card;

function Card() {
    BaseElement.call(this, 'card_v1');

    let frontImage = '';
    let backImage = '';

    let selected = false;
    let side = 'back'; //front, back
    let rotation = 0; //in degree, clockwise
    let width = 6;
    let height = 9;
    let depth = 0.03;
    let cornerRadius = 0.5;

    let frontVisibleFor = null; //null for all, othervise array of allowed slotIndizes, empty array for no one
    let canBeSelectedBy = [];
    let canBeMovedBy = [];
    let canBeRotatedBy = [];
    let canBeFlippedBy = [];

    this.onBeforeFlip = null;
    this.onAfterFlip = null;
    this.onAfterRotate = null;
    this.onAfterMove = null;

    this.setFrontImage = function(value) {
        frontImage = value;
    };
    this.getFrontImage = function() {
        return frontImage;
    };

    this.setBackImage = function(value) {
        backImage = value;
    };
    this.getBackImage = function() {
        return backImage;
    };

    this.flip = function() {
        this.setSide(side === 'front' ? 'back' : 'front');
    };
    this.setSide = function(value) {
        side = value;

        this.sendEvent('card.sideChanged', {
            side: side
        });
    };
    this.getSide = function() {
        return side;
    };

    this.setRotation = function(value) {
        rotation = value;

        this.sendEvent('card.rotationChanged', {
            rotation: rotation
        });
    };
    this.getRotation = function() {
        return rotation;
    };

    this.setWidth = function(value) {
        width = value;
    };
    this.getWidth = function() {
        return width;
    };

    this.setHeight = function(value) {
        height = value;
    };
    this.getHeight = function() {
        return height;
    };

    this.setDepth = function(value) {
        depth = value;
    };
    this.getDepth = function() {
        return depth;
    };

    this.setCornerRadius = function(value) {
        cornerRadius = value;
    };
    this.getCornerRadius = function() {
        return cornerRadius;
    };

    this.setSelected = function(value) {
        selected = !!value;

        this.sendEvent('card.selectedChanged', {
            selected: selected
        });
    };
    this.getSelected = function() {
        return selected;
    };

    this.setFrontVisibility = function(value) {
        if (!(value instanceof Array)) {
            value = [value];
        }

        frontVisibleFor = value;

        this.sendPermissions();
    };
    this.getFrontVisibility = function() {
        return frontVisibleFor;
    };

    this.setCanBeSelectedBy = function(value) {
        if (!(value instanceof Array)) {
            value = [value];
        }

        canBeSelectedBy = value;

        this.sendPermissions();
    };
    this.getCanBeSelectedBy = function() {
        return canBeSelectedBy;
    };

    this.setCanBeMovedBy = function(value) {
        if (!(value instanceof Array)) {
            value = [value];
        }

        canBeMovedBy = value;

        this.sendPermissions();
    };
    this.getCanBeMovedBy = function() {
        return canBeMovedBy;
    };

    this.setCanBeRotatedBy = function(value) {
        if (!(value instanceof Array)) {
            value = [value];
        }

        canBeRotatedBy = value;

        this.sendPermissions();
    };
    this.getCanBeRotatedBy = function() {
        return canBeRotatedBy;
    };

    this.setCanBeFlippedBy = function(value) {
        if (!(value instanceof Array)) {
            value = [value];
        }

        canBeFlippedBy = value;

        this.sendPermissions();
    };
    this.getCanBeFlippedBy = function() {
        return canBeFlippedBy;
    };

    this.toArray = function() {
        return {
            frontImage: frontImage,
            backImage: backImage,
            side: side,
            rotation: rotation,
            width: width,
            height: height,
            depth: depth,
            cornerRadius: cornerRadius,
            frontVisibleFor: frontVisibleFor,
            canBeSelectedBy: canBeSelectedBy,
            canBeMovedBy: canBeMovedBy,
            canBeRotatedBy: canBeRotatedBy,
            canBeFlippedBy: canBeFlippedBy
        };
    };

    this.sendPermissions = function() {
        this.sendEvent('card.permissionChanged', {
            frontVisibleFor: frontVisibleFor,
            canBeSelectedBy: canBeSelectedBy,
            canBeMovedBy: canBeMovedBy,
            canBeRotatedBy: canBeRotatedBy,
            canBeFlippedBy: canBeFlippedBy
        });
    };

    this.clearPermissions = function() {
        if (canBeSelectedBy.length) {
            this.setCanBeSelectedBy([]);
        }
        if (canBeMovedBy.length) {
            this.setCanBeMovedBy([]);
        }
        if (canBeRotatedBy.length) {
            this.setCanBeRotatedBy([]);
        }
        if (canBeFlippedBy.length) {
            this.setCanBeFlippedBy([]);
        }

        if (selected) {
            this.setSelected(false);
        }
    };

    this.on('card.select', (slotIndex, data) => {
        this.setSelected(data.selected);
    });

    this.on('card.flip', async slotIndex => {
        this.flip();

        this.GameBase.Elements.clearPermissions();

        if (typeof this.onBeforeFlip === 'function') {
            await this.onBeforeFlip.call(this, slotIndex, side, this);
        }

        await delay(1000);

        if (typeof this.onAfterFlip === 'function') {
            await this.onAfterFlip.call(this, slotIndex, side, this);
        }
    });

    this.on('card.rotate', async (slotIndex, data) => {
        this.setRotation(data.rotation);

        await delay(1000);

        if (typeof this.onAfterRotate === 'function') {
            await this.onAfterRotate.call(this, slotIndex, rotation, this);
        }
    });

    this.on('card.move', async (slotIndex, data) => {
        this.moveTo(
            this.GameBase.Elements.getElementById(data.containerId),
            {
                position: data.position,
                index: data.index
            }
        );

        this.GameBase.Elements.clearPermissions();
        await delay(1000);

        if (typeof this.onAfterMove === 'function') {
            await this.onAfterMove.call(this, slotIndex, this.getParent());
        }
    });
}
Card.prototype = Object.create(BaseElement.prototype);
Card.prototype.constructor = Card;