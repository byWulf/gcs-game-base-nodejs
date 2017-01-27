const EventEmitter = require('events');

module.exports = ClickableImage;

function ClickableImage() {
    this.eventEmitter = new EventEmitter();

    let config = {
        id: null,
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        image: '',
        onClick: null
    };

    this.getId = function() {
        return config.id;
    };

    this.setId = function(id) {
        config.id = id;

        this.eventEmitter.emit('changed', 'id');
    };

    this.setX = function(x) {
        config.x = x;

        this.eventEmitter.emit('changed', 'x');
    };

    this.setY = function(y) {
        config.y = y;

        this.eventEmitter.emit('changed', 'y');
    };

    this.setWidth = function(width) {
        config.width = width;

        this.eventEmitter.emit('changed', 'width');
    };

    this.setHeight = function(height) {
        config.height = height;

        this.eventEmitter.emit('changed', 'height');
    };

    this.setImage = function(imagePath) {
        config.image = imagePath;

        this.eventEmitter.emit('changed', 'image');
    };

    this.onClick = function(callback) {
        config.onClick = callback;

        this.eventEmitter.emit('changed', 'onClick');
    };

    this.toArray = function() {
        return config;
    };
}