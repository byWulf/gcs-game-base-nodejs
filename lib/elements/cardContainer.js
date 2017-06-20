'use strict';

const BaseElement = require('./baseElement');

module.exports = CardContainer;

function CardContainer() {
    BaseElement.call(this, 'cardContainer_v1');
    
    let cardWidth = 6;
    let cardHeight = 9;
    let cardDepth = 0.03;
    let cardCornerRadius = 0.5;
    let spacing = 1;
    let stackShattering = 'ordered'; //ordered, little, shattered
    
    this.setCardWidth = function(value) {
        cardWidth = value;
    };
    this.getCardWidth = function() {
        return cardWidth;
    };
    
    this.setCardHeight = function(value) {
        cardHeight = value;
    };
    this.getCardHeight = function() {
        return cardHeight;
    };
    
    this.setCardDepth = function(value) {
        cardDepth = value;
    };
    this.getCardDepth = function() {
        return cardDepth;
    };
    
    this.setCardCornerRadius = function(value) {
        cardCornerRadius = value;
    };
    this.getCardCornerRadius = function() {
        return cardCornerRadius;
    };
    
    this.setSpacing = function(value) {
        spacing = value;
    };
    this.getSpacing = function() {
        return spacing;
    };
    
    this.setStackShattering = function(value) {
        stackShattering = value;
    };
    this.getStackShattering = function() {
        return stackShattering;
    };

    this.toArray = function() {
        return {
            cardWidth: cardWidth,
            cardHeight: cardHeight,
            cardDepth: cardDepth,
            cardCornerRadius: cardCornerRadius,
            spacing: spacing,
            stackShattering: stackShattering
        };
    };
}
CardContainer.prototype = Object.create(BaseElement.prototype);
CardContainer.prototype.constructor = CardContainer;