module.exports = function* (sequence, parameters) {
    if (typeof parameters.event === 'undefined') {
        throw new Error('Missing parameter "event".');
    }
    
    yield sequence.eventEmitter.once(parameters.event);
};