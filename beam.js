class Beam extends Phaser.GameObjects.Sprite {
    constructor(scene) {

        var playerX = scene.player.x;
        var playerY = scene.player.y;
        super(scene, playerX, playerY-16, "beam");
        
        scene.add.existing(this);
        scene.projectiles.add(this); //add our beam to an group (i.e. array) of projectiles in the Scene2.
        this.play("beam_anim");

        scene.physics.world.enableBody(this);
        this.body.velocity.y = -200;
    }

    update() {
        if (this.y < 32) {
            this.destroy();
        }
    }
}