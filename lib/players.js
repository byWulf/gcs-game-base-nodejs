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

    this.getNextSlotIndex = function(slotIndex, filterCallback) {
        if (typeof this.slots[slotIndex] === 'undefined') throw new Error('Unknown slotIndex ' + slotIndex);

        for (let i = 0; i < this.slots.length; i++) {
            slotIndex = (slotIndex + 1) % this.slots.length;

            if (this.slots[slotIndex].user !== null) {
                if (typeof filterCallback === 'function' && !filterCallback(this.slots[slotIndex], slotIndex)) {
                    continue;
                }

                return slotIndex;
            }
        }

        throw new Error('Could not determine the next slot index.');
    }
}