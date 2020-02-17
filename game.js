var config = {
    type: Phaser.AUTO,
    width: 256,
    height: 272,
    backgroundColor: 0x000000,
    scene: [Scene1, Scene2],
    physics: {
        default: "arcade",
        arcade: {
            debug: false
        }
    },
    pixelArt: true,
    zoom: 2
};

var gameSettings = {
    playerSpeed: 200
};

var game = new Phaser.Game(config);

var score = 0;