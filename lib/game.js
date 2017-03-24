'use strict';

const BackendCommunicator = require('./backendCommunicator');
const EventEmitter = require('events');
const Slot = require('./players/slot');

module.exports = Game;

function Game(GameBase) {
    let self = this;

    this.GameBase = GameBase;

    this.backendCommunicator = null;

    this.settings = null;

    this.eventEmitter = new EventEmitter();
    this.eventEmitter.on('error', function(a) { });
    this.Event = {
        Started: 'match.started'
    };

    this.init = function(callback) {
        console.log("Connecting to backend...");
        this.backendCommunicator = new BackendCommunicator('127.0.0.1', 3702);
        console.log("...connected!");

        this.backendCommunicator.eventEmitter.on('match.requestingAuth', function() {
            self.backendCommunicator.sendCommand('match.auth', process.argv[2]);
        });
        this.backendCommunicator.eventEmitter.on('match.authed', function(data) {
            self.settings = data.settings;

            let slots = [];
            for (let slotData of data.slots) {
                let slot = new Slot();
                slot._setIndex(slots.length);
                slot._setUser(slotData.user);
                slot._setColor(slotData.color);

                slots.push(slot);

                slot.getEventEmitter().on('event', function(data) {
                    self.backendCommunicator.sendCommand('event', data);
                });
            }

            self.GameBase.Players.slots = slots;

            console.log("Starting callback");
            callback();
        });

        this.backendCommunicator.eventEmitter.on('socketError', function(error) {
            console.log('socketError', error);
        });
        this.backendCommunicator.eventEmitter.on('invalidRequest', function(error, e) {
            console.log('invalidRequest', error, e);
        });
        this.backendCommunicator.eventEmitter.on('match.error', function(error) {
            console.error('Got error from backend:', error);
            process.exit();
        });

        this.backendCommunicator.eventEmitter.on('terminateGame', function() {
            process.exit();
        });

        this.backendCommunicator.eventEmitter.on('user.joined', function(data) {
            self.GameBase.Players.getSlot(data.slotIndex)._setUser(data.user);

            self.GameBase.Players.eventEmitter.emit(self.GameBase.Players.Event.Joined, data.slotIndex, data.user);
        });

        this.backendCommunicator.eventEmitter.on('user.switched', function(data) {
            self.GameBase.Players.getSlot(data.oldSlotIndex)._setUser(null);
            self.GameBase.Players.getSlot(data.newSlotIndex)._setUser(data.user);

            self.GameBase.Players.eventEmitter.emit(self.GameBase.Players.Event.Switched, data.oldSlotIndex, data.newSlotIndex, data.user);
        });

        this.backendCommunicator.eventEmitter.on('user.left', function(data) {
            self.GameBase.Players.getSlot(data.slotIndex)._setUser(null);

            self.GameBase.Players.eventEmitter.emit(self.GameBase.Players.Event.Left, data.slotIndex);
        });

        this.backendCommunicator.eventEmitter.on('match.started', function(data) {
            self.addNotification('Die Partie beginnt. Viel Glück!');
            self.eventEmitter.emit(self.Event.Started);
        });

        this.backendCommunicator.eventEmitter.on('match.method', function(data) {
            let element = self.GameBase.Elements.getElementById(data.elementId);
            if (element) {
                element.getEventEmitter().emit('method', data.method, data.slotIndex, data.data);
            }
        });
    };

    this.finish = function() {
        let winners = [];

        let maxPoints = 0;
        for (let slot of self.GameBase.Players.getSlots()) {
            maxPoints = Math.max(maxPoints, slot.getPoints());
        }
        for (let slot of self.GameBase.Players.getSlots()) {
            if (slot.getPoints() === maxPoints) {
                winners.push(slot.getIndex());
            }
        }

        let winningString = '';
        for (let i = 0; i < winners.length; i++) {
            if (i > 0 && i === winners.length - 1) winningString += ' und ';
            else if (i > 0) winningString += ', ';

            winningString += '%' + winners[i];
        }
        if (winners.length > 1) {
            winningString += ' haben die Partie gewonnen. Herzlichen Glückwunsch!';
        } else {
            winningString += ' hat die Partie gewonnen. Herzlichen Glückwunsch!';
        }

        self.addNotification(winningString);

        this.backendCommunicator.sendCommand('finish')
    };

    this.addNotification = function(text, onlyForSlotIndexes) {
        if (onlyForSlotIndexes && typeof onlyForSlotIndexes === 'number') {
            onlyForSlotIndexes = [onlyForSlotIndexes];
        }

        this.backendCommunicator.sendCommand('event', {
            event: 'notification.added',
            text: text,
            targetPlayers: onlyForSlotIndexes || null
        });
    };
}