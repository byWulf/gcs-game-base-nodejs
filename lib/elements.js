'use strict';

const BaseElement = require('./elements/baseElement');

module.exports = Elements;

function Elements(GameBase) {
    let self = this;

    let elements = [];

    this.GameBase = GameBase;

    this.Type = {
        Board: require('./elements/board'),
        Dice: require('./elements/dice'),
        Piece: require('./elements/piece'),
        PieceContainer: require('./elements/PieceContainer')
    };

    this.Default = {
        CenterContainer: new BaseElement('centerContainer_v1', 'centerContainer'),
        PlayerContainer: new BaseElement('playerContainer_v1', 'playerContainer'),
        PackageContainer: new BaseElement('packageContainer_v1', 'packageContainer'),
    };

    this.registerElement = function(element) {
        elements.push(element);

        let elementAsArray = element.toArray();
        elementAsArray.event = 'element.added';

        element.getEventEmitter().on('event', function(data) {
            self.GameBase.Game.backendCommunicator.sendCommand('event', data);
        });

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
}