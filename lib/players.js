'use strict';

const EventEmitter = require('events');

module.exports = Players;

function Players(GameBase) {
    this.GameBase = GameBase;

    this.slots = [];

    this.eventEmitter = new EventEmitter();
    this.eventEmitter.on('error', function(a) { });
    this.Event = {
        Joined: 'user.joined',
        Switched: 'user.switched',
        Left: 'user.left'
    };

    this.getByUserId = function(userId) {

    };

    this.getByIndex = function(index) {

    };

    this.getActivePlayers = function() {

    };

    this.getPlayerCount = function() {

    };

    this.getAll = function() {

    };
}