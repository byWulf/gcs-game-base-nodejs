'use strict';

const BaseElement = require('./baseElement');

module.exports = Board;

function Board() {
    BaseElement.call(this, 'Board_v1');

    let width = 0;
    let height = 0;
    let image = '';
    
    this.setWidth = function(value) {
        width = value;
    };
    this.getWidth = function() {
        return width;
    };
    
    this.setHeight = function(value) {
        height = value;
    };
    this.getHeight = function() {
        return height;
    };
    
    this.setImage = function(value) {
        image = value;
    };
    this.getImage = function() {
        return image;
    };

    this.toArray = function() {
        return this.getAsArray({
            width: width,
            height: height,
            image: image
        });
    };
}
Board.prototype = Object.create(BaseElement.prototype);
Board.prototype.constructor = Board;