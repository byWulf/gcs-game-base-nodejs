const EventEmitter = require('events');

module.exports = Sequence;

function Sequence(GameBase) {
    this.GameBase = GameBase;
    
    this.eventEmitter = new EventEmitter();
    this.eventEmitter.on('error', function() {});

    this.Type = {
        Method: 'method',
        Loop: 'loop',
        NextPlayer: 'nextPlayer',
        Wait: 'wait'
    };

    this.start = function(definition) {
        for (let i = 0; i < definition.length; i++) {
            this.executeElement(definition[i]);
        }
    };

    this.executeElement = function(element) {
        if (typeof element.type === 'undefined') {
            throw new Error('Missing parameter "type".');
        }
        if (typeof this.Type[element.type] === 'undefined') {
            throw new Error('Invalid value for parameter "type".');
        }

        require(__dirname + '/sequence/' + element.type)(this, element);
    };
};