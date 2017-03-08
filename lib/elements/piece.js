'use strict';

const BaseElement = require('./baseElement');

module.exports = Piece;

function Piece() {
    BaseElement.call(this, 'piece_v1');

    let width = 0;
    let height = 0;
    let depth = 0;
    let model = '';
    let color = '#ffffff';
    
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
    
    this.setColor = function(value) {
        color = value;
    };
    this.getColor = function() {
        return color;
    };

    this.toArray = function() {
        return {
            width: width,
            height: height,
            depth: depth,
            model: model,
            color: color
        };
    };
}
Piece.prototype = Object.create(BaseElement.prototype);
Piece.prototype.constructor = Piece;