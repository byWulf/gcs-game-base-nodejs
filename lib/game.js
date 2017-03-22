'use strict';

const BackendCommunicator = require('./backendCommunicator');
const EventEmitter = require('events');

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
            self.GameBase.Players.slots = data.slots;

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
            self.GameBase.Players.slots[data.slotIndex].user = data.user;

            self.GameBase.Players.eventEmitter.emit(self.GameBase.Players.Event.Joined, data.slotIndex, data.user);
        });

        this.backendCommunicator.eventEmitter.on('user.switched', function(data) {
            self.GameBase.Players.slots[data.oldSlotIndex].user = null;
            self.GameBase.Players.slots[data.newSlotIndex].user = data.user;

            self.GameBase.Players.eventEmitter.emit(self.GameBase.Players.Event.Switched, data.oldSlotIndex, data.newSlotIndex, data.user);
        });

        this.backendCommunicator.eventEmitter.on('user.left', function(data) {
            self.GameBase.Players.slots[data.slotIndex].user = null;

            self.GameBase.Players.eventEmitter.emit(self.GameBase.Players.Event.Left, data.slotIndex);
        });

        this.backendCommunicator.eventEmitter.on('match.started', function(data) {
            self.GameBase.Game.eventEmitter.emit(self.GameBase.Game.Event.Started);
        });

        this.backendCommunicator.eventEmitter.on('match.method', function(data) {
            let element = self.GameBase.Elements.getElementById(data.elementId);
            if (element) {
                element.getEventEmitter().emit('method', data.method, data.slotIndex, data.data);
            }
        });
    };

    this.finish = function() {
        this.backendCommunicator.sendCommand('finish')
    };
};