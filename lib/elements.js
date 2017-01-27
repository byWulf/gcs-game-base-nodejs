module.exports = Elements;

function Elements(GameBase) {
    let self = this;

    let elements = [];
    let nextElementId = 1;

    this.GameBase = GameBase;

    this.Type = {
        ClickableImage: require(__dirname + '/elements/clickableImage')
    };

    this.registerElement = function(element) {
        if (element.getId() === null) {
            element.setId(nextElementId);
        }
        nextElementId++;

        elements.push(element);

        element.eventEmitter.on('changed', function(field) {
            self.GameBase.Game.backendCommunicator.sendCommand('element.changed', element.toArray(), field);
        });

        this.GameBase.Game.backendCommunicator.sendCommand('element.added', element.toArray());
    };

    this.removeElement = function(element) {
        for (let i = 0; i < elements.length; i++) {
            if (elements[i] === element) {
                elements.splice(i, 1);
            }
        }

        this.GameBase.Game.backendCommunicator.sendCommand('element.removed', element.toArray());
    };
}