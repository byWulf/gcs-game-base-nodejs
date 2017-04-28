'use strict';

const BaseElement = require('./baseElement');

module.exports = Button;

function Button() {
    BaseElement.call(this, 'button_v1');

    let label = '';
    let canBeClickedByPlayerIndexes = [];

    this.onClick = null;

    this.setLabel = function(value) {
        label = value;
    };
    this.getLabel = function() {
        return label;
    };

    this.toArray = function() {
        return {
            label: label,
            canBeClickedBy: canBeClickedByPlayerIndexes
        };
    };

    this.canBeClickedBy = function(playerIndexes) {
        if (typeof playerIndexes === 'number') {
            playerIndexes = [playerIndexes];
        }

        canBeClickedByPlayerIndexes = playerIndexes;

        this.sendEvent('button.permissionChanged', {canBeClickedBy: canBeClickedByPlayerIndexes});
    };

    this.clearPermissions = function() {
        if (canBeClickedByPlayerIndexes.length) {
            this.canBeClickedBy([]);
        }
    };

    this.on('button.click', (slotIndex) => {
        this.GameBase.Elements.clearPermissions();

        if (typeof this.onClick === 'function') {
            this.onClick.call(this, slotIndex);
        }
    });
}
Button.prototype = Object.create(BaseElement.prototype);
Button.prototype.constructor = Button;