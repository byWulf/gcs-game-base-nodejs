# GameCentralStation - Game base (nodejs)
## Installation

    npm install gcs-game-base --save
    
## Usage

### GameBase.Game

Provides basic methods to handle the game state.

#### GameBase.Game.init(callback)

Call this to initialize the game and to connect to the backend system. As soon as a successful connection is established, the `callback` function is called.

    const GameBase = require('gcs-game-base');
    
    GameBase.Game.init(function() {
        //...start game logic...
    });
    
#### GameBase.Game.finish()

Signal the backend system, that the game is over. You should have given every player his won points before calling this method. The process terminates after successfully sending this information to the backend system.

    GameBase.Game.finish();
    
### GameBase.Players

Provides user based methods to find players of the game and to manipulate them.

#### GameBase.Players.getByUserId(userId);

Returns the player object of the player with the given user id.

    var player = GameBase.Players.getByUserId(123);

#### GameBase.Players.getByIndex(index);

Returns the player object of the player with the given index in the game (where the first player in this round has index 0).

    var player = GameBase.Players.getByIndex(0);

#### GameBase.Players.getActivePlayers();

Returns each player, whose state is currently "on its turn".

    var players = GameBase.Players.getActivePlayers();


#### GameBase.Players.getPlayerCount();

Returns the player count of the players ingame.

    var count = GameBase.Players.getPlayerCount();


#### GameBase.Players.getAll();

Returns all players ingame.

    var players = GameBase.Players.getAll();

### Player object

Methods a returned player object provides.

#### player.getIndex()

Get the index of the player object (where the first player in this round has index 0).

    var player = GameBase.Players.getByIndex(0);
    console.log(player.getIndex()) // -> 0

#### player.setActive()

Set the active state of this player to "on his turn", so he can play.

    var player = GameBase.Players.getByIndex(0);
    player.setActive();
    

#### player.setInactive()

Set the active state of this player to "waiting", so he can't play.

    var player = GameBase.Players.getByIndex(0);
    player.setInactive();

#### player.addPoints(points)

Add points to this player. The player with the most points at the end wins.

    var player = GameBase.Players.getByIndex(0);
    player.addPoints(5);

### GameBase.Elements

#### GameBase.Elements.registerElement(element)

#### GameBase.Elements.removeElement(element)

### GameBase.Elemenets.Type

Multiple game elements. Defined elements will be rendered by the frontends.

#### GameBase.Elements.Type.ClickableImage

A clickable image. You can define, which player may click it, what image is displayed and where it should be displayed.

##### ClickableImage.setX(x)

### GameBase.Sequence
