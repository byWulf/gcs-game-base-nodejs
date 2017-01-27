module.exports = function(sequence, parameters) {
    if (typeof parameters.method === 'undefined') {
        throw new Error('Missing parameter "method".');
    }
    if (typeof parameters.method !== 'function') {
        throw new Error('Parameter "method" must be a function.');
    }

    parameters.method();
};