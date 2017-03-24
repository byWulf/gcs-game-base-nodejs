'use strict';

const EventEmitter = require('events');

module.exports = Slot;

function Slot() {
    let eventEmitter = new EventEmitter();
    eventEmitter.on('error', function() {});

    let user = null;
    let color = '#000000';
    let active = false;
    let points = 0;
    let index = null;

    this.getEventEmitter = function() {
        return eventEmitter;
    };

    this._setIndex = function(newIndex) {
        index = newIndex;
    };
    this.getIndex = function() {
        return index;
    };

    this._setUser = function(newUser) {
        user = newUser;
    };
    this.getUser = function() {
        return user;
    };

    this._setColor = function(newColor) {
        color = newColor;
    };
    this.getColor = function() {
        return color;
    };

    this.setActive = function() {
        active = true;

        eventEmitter.emit('event', {
            event: 'slot.activeChanged',
            slotIndex: index,
            isActive: active
        });
    };
    this.setInactive = function() {
        active = false;

        eventEmitter.emit('event', {
            event: 'slot.activeChanged',
            slotIndex: index,
            isActive: active
        });
    };

    this.addPoints = function(additionalPoints) {
        points += additionalPoints;

        eventEmitter.emit('event', {
            event: 'slot.pointsChanged',
            slotIndex: index,
            points: points
        });
    };
    this.setPoints = function(newPoints) {
        points = newPoints;

        eventEmitter.emit('event', {
            event: 'slot.pointsChanged',
            slotIndex: index,
            points: points
        });
    };
    this.getPoints = function() {
        return points;
    }
}