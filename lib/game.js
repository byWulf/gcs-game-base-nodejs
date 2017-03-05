'use strict';

const BackendCommunicator = require('./backendCommunicator');

module.exports = Game;

function Game(GameBase) {
    let self = this;

    this.GameBase = GameBase;

    this.backendCommunicator = null;

    this.settings = null;

    this.init = function(callback) {
        console.log("Connecting to backend...");
        this.backendCommunicator = new BackendCommunicator('127.0.0.1', 3702);
        console.log("...connected!");

        this.backendCommunicator.eventEmitter.on('match.requestingAuth', function() {
            self.backendCommunicator.sendCommand('match.auth', process.argv[2]);
        });
        this.backendCommunicator.eventEmitter.on('match.authed', function(settings, players) {
            self.settings = settings;
            self.GameBase.Players.players = players;

            console.log("Starting callback");
            callback();
        });

        this.backendCommunicator.eventEmitter.on('socketError', function(error) {
            console.log('socketError', error);
        });
        this.backendCommunicator.eventEmitter.on('invalidRequest', function(error) {
            console.log('invalidRequest', error);
        });
        this.backendCommunicator.eventEmitter.on('match.error', function(error) {
            console.error('Got error from backend:', error);
            process.exit();
        });

        this.backendCommunicator.eventEmitter.on('terminateGame', function() {
            process.exit();
        });
    };

    this.finish = function() {
        this.backendCommunicator.sendCommand('finish', {players: this.GameBase.Players.getAll()})
    };
};