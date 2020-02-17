class Scene2 extends Phaser.Scene {
    constructor() {
        super("playGame");
    }

    create() {
        this.background = this.add.tileSprite(0,0, config.width, config.height, "background");
        this.background.setOrigin(0,0);

        this.gameScore = this.add.text(20,20, `Score: ${score}`, {
            font: "25px Arial",
            fill: "yellow"
        });

        this.player = this.physics.add.sprite(config.width/2 - 8, config.height - 64, "player");
        this.player.play("thruster");
        this.player.setCollideWorldBounds(true);
        
        //ask phaser to create cursor keys: Up Down, Left, Right.
        this.cursorKeys = this.input.keyboard.createCursorKeys();
        this.projectiles = this.add.group();

        //place the ships on the screen.
        this.ship1 = this.add.sprite(config.width/2 - 50, config.height/3, "ship1");
        this.ship2 = this.add.sprite(config.width/2, config.height/3, "ship2");
        this.ship3 = this.add.sprite(config.width/2 + 50, config.height/3, "ship3");

        this.enemies = this.physics.add.group();
        this.enemies.add(this.ship1);
        this.enemies.add(this.ship2);
        this.enemies.add(this.ship3);

        //play the created animations in Scene1.
        this.ship1.play("ship1_anim");
        this.ship2.play("ship2_anim");
        this.ship3.play("ship3_anim");

        //let the ships be "clickable" i.e. be able to recieve events.
        // this.ship1.setInteractive();
        // this.ship2.setInteractive();
        // this.ship3.setInteractive();

        //listen to a mouse click.
        this.input.on("gameobjectdown", this.destroyShip, this);

        //create powerups objects and assign random painting/skin with the appropriate animation.
        this.powerUps = this.physics.add.group();
        var maxObj = 2;
        for (var i = 0; i < maxObj; i++) {
            var powerUp = this.physics.add.sprite(16, 16, "power-ups");
            this.powerUps.add(powerUp);
            powerUp.setRandomPosition(0,0, config.width, config.height);

            if (Math.random() < 0.5) {
                powerUp.play("red");
            } else {
                powerUp.play('grey');
            }
            powerUp.setCollideWorldBounds(true);
            powerUp.setBounce(1);
            powerUp.setVelocity(100, 100); 
        }

        //collision of projectiles with powerUps.
        this.physics.add.collider(this.projectiles, this.powerUps, (projectiles, powerUps) => {
            projectiles.destroy();
        });

        //overlap of player and powerUps.
        this.physics.add.overlap(this.player, this.powerUps, this.pickUp, null, this);

        this.physics.add.overlap(this.player, this.enemies, this.hurtPlayer, null, this);

        this.physics.add.overlap(this.projectiles, this.enemies, this.hitShip, null, this);

    }

    update() {
        this.moveShip(this.ship1, 1);
        this.moveShip(this.ship2, 2);
        this.moveShip(this.ship3, 3);

        this.playerManager();

        this.background.tilePositionY -= 0.5;
    }

    //functions used in update() loop.
    playerManager() {
        if (this.cursorKeys.left.isDown){
            this.player.setVelocityX(-gameSettings.playerSpeed);
        } else if (this.cursorKeys.right.isDown) {
            this.player.setVelocityX(gameSettings.playerSpeed);
        } else {
            this.player.setVelocityX(0);
        }
       
        if (this.cursorKeys.up.isDown) {
            this.player.setVelocityY(-gameSettings.playerSpeed);
        } else if (this.cursorKeys.down.isDown) {
            this.player.setVelocityY(gameSettings.playerSpeed);
        } else {    
            this.player.setVelocityY(0);
        }

        //execute a blast only when space key is donw.
        if (Phaser.Input.Keyboard.JustDown(this.cursorKeys.space)) {
           //this.shootBeam();
           var beam = new Beam(this);
        }
        for (var i=0; i<this.projectiles.getChildren().length; i++) {
            var projectile = this.projectiles.getChildren()[i];
            projectile.update();
        }
    }

    pickUp(player, powerUp) {
        score += 50;
        this.gameScore.setText(`Score: ${score}`);

        powerUp.disableBody(true, true);
    }

    hurtPlayer(player, ship) {
        score = 0;
        this.gameScore.setText(`Score: ${score}`);

        var ups = this.powerUps.getChildren();
        ups.forEach(up => {
            up.enableBody(true, 0, 0, true, true);
            up.setRandomPosition(0,0, config.width, config.height);
            up.setCollideWorldBounds(true);
            up.setVelocity(100, 100); 
            up.setBounce(1);
        });

        player.x = config.width/2 - 8;
        player.y = config.height - 64;

        this.resetShipPos(ship);
    }

    hitShip(projectile, ship) {
        score += 15;
        this.gameScore.setText(`Score: ${score}`);

        this.resetShipPos(ship);
        projectile.destroy();
    }

    // shootBeam() {
    //     var beam = this.physics.add.sprite(this.player.x, this.player.y, "beam");
    //     beam.play('beam_anim');
    //     beam.setVelocityY(-200);
    // }

    moveShip(ship, speed) {
        ship.y += speed;
        if (ship.y > config.height) {
            this.resetShipPos(ship);
        }
    }

    resetShipPos(ship) {
        ship.y = 0;
        var randomX = Phaser.Math.Between(0, config.width);
        ship.x = randomX;

        // if (ship.texture.key == "explosion") {
        //     var random = Phaser.Math.Between(1,3);
        //     ship.setTexture(`ship${random}`)
        //     ship.play(`ship${random}_anim`);
        // }
    }

    destroyShip(pointer, gameObject) {
        gameObject.setTexture("explosion");
        gameObject.play("explode");
        score += 15;
        this.gameScore.setText(`Score: ${score}`);
    }

    // destroyShip(projectile, gameObject) {
    //     //projectile.disableBody(true, true);
    //     gameObject.setTexture("explosion");
    //     gameObject.play("explode");
    //     score += 15;
    //     this.gameScore.setText(`Score: ${score}`);
    // }
}