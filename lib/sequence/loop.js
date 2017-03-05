'use strict';

module.exports = function(sequence, parameters) {
    if (typeof parameters.whileCondition === 'undefined') {
        throw new Error('Missing parameter "whileCondition".');
    }
    if (typeof parameters.whileCondition !== 'function') {
        throw new Error('Parameter "whileCondition" must be a function.');
    }

    if (typeof parameters.sequence === 'undefined') {
        throw new Error('Missing parameter "sequence".');
    }
    if (parameters.sequence instanceof Array) {
        throw new Error('Parameter "sequence" must be an array.');
    }

    while (parameters.whileCondition()) {
        for (let i = 0; i < parameters.sequence.length; i++) {
            sequence.executeElement(parameters.sequence[i]);
        }
    }
};