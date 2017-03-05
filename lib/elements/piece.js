'use strict';

const BaseElement = require('./baseElement');

module.exports = Piece;

function Piece() {
    BaseElement.call(this, 'Piece_v1');

    let width = 0;
    let height = 0;
    let depth = 0;
    let model = '';
    
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
    
    this.setDepth = function(value) {
        depth = value;
    };
    this.getDepth = function() {
        return depth;
    };
    
    this.setModel = function(value) {
        model = value;
    };
    this.getModel = function() {
        return model;
    };

    this.toArray = function() {
        return this.getAsArray({
            width: width,
            height: height,
            depth: depth,
            model: model
        });
    };
}
Piece.prototype = Object.create(BaseElement.prototype);
Piece.prototype.constructor = Piece;