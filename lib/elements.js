'use strict';

const BaseElement = require('./elements/baseElement');

module.exports = Elements;

function Elements(GameBase) {
    let self = this;

    let elements = [];

    this.GameBase = GameBase;

    this.Type = {
        AutoResizeContainer: require('./elements/autoResizeContainer'),
        Board: require('./elements/board'),
        Button: require('./elements/button'),
        Dice: require('./elements/dice'),
        Piece: require('./elements/piece'),
        PieceContainer: require('./elements/pieceContainer'),
        Tile: require('./elements/tile'),
        TileContainer: require('./elements/tileContainer')
    };

    this.Default = {
        TableContainer: new BaseElement('default_tableContainer', 'tableContainer'),
        PackageContainer: new BaseElement('packageContainer_v1', 'packageContainer')
    };

    this.registerElement = function(element) {
        elements.push(element);

        let elementAsArray = element.toArray();

        elementAsArray.event = 'element.added';

        element.getEventEmitter().on('event', function(data) {
            self.GameBase.Game.backendCommunicator.sendCommand('event', data);
        });

        element.GameBase = this.GameBase;

        element.getEventEmitter().emit('event', {
            event: 'element.added',
            id: element.getId(),
            type: element.getType(),
            parent: element.getParent(),
            element: element.toArray()
        });
    };

    this.removeElement = function(element) {
        for (let i = 0; i < elements.length; i++) {
            if (elements[i] === element) {
                elements.splice(i, 1);
            }
        }

        element.getEventEmitter().emit('event', {
            event: 'element.removed',
            id: element.getId()
        });
    };

    this.getElementById = function(elementId) {
        for (let i = 0; i < elements.length; i++) {
            if (elements[i].getId() === elementId) {
                return elements[i];
            }
        }

        return null;
    };

    this.getElements = function() {
        return elements;
    };

    this.clearPermissions = function() {
        for (let i = 0; i < elements.length; i++) {
            elements[i].clearPermissions();
        }
    }
}