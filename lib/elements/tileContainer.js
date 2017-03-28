'use strict';

const BaseElement = require('./baseElement');

module.exports = TileContainer;

function TileContainer() {
    BaseElement.call(this, 'tileContainer_v1');

    let tileForm = 'square'; //square, hexagonal, triangular
    let stackElementRadius = 5;
    
    this.setTileForm = function(value) {
        tileForm = value;
    };
    this.getTileForm = function() {
        return tileForm;
    };
    
    this.setStackElementRadius = function(value) {
        stackElementRadius = value;
    };
    this.getStackElementRadius = function() {
        return stackElementRadius;
    };
    
    this.toArray = function() {
        return {
            tileForm: tileForm,
            stackElementRadius: stackElementRadius
        };
    };

    this.getChildren = function(x, y) {
        let children = [];

        let elements = this.GameBase.Elements.getElements();
        for (let i = 0; i < elements.length; i++) {
            if (elements[i].getParent().id === this.getId() && elements[i].getParent().data.x === x && elements[i].getParent().data.y === y) {
                children.push(elements[i]);
            }
        }

        return children;
    }
}
TileContainer.prototype = Object.create(BaseElement.prototype);
TileContainer.prototype.constructor = TileContainer;