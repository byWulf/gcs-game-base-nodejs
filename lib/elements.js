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
        PlayerContainer: new BaseElement('playerContainer_v1', 'playerContainer')
    };

    this.registerElement = function(element) {
        elements.push(element);

        this.GameBase.Game.backendCommunicator.sendCommand('element.added', element.toArray());
    };

    this.removeElement = function(element) {
        for (let i = 0; i < elements.length; i++) {
            if (elements[i] === element) {
                elements.splice(i, 1);
            }
        }

        this.GameBase.Game.backendCommunicator.sendCommand('element.removed', {id: element.getId()});
    };
}