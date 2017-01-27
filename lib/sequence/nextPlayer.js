module.exports = function(sequence, parameters) {
    let activePlayers = sequence.GameBase.Players.getActivePlayers();
    if (activePlayers.length > 1) {
        throw new Error('Can only use "nextPlayer" when at most one player is on his turn.');
    }

    if (activePlayers.length === 0) {
        sequence.GameBase.Players.getByIndex(0).setActive();
    } else {
        activePlayers[0].setInactive();
        sequence.GameBase.Players.getByIndex((activePlayers[0].index + 1) % sequence.GameBase.Players.getPlayerCount()).setActive();
    }
};