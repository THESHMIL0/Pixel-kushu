let player;
let joyStick;

// ==========================================
// SCENE 1: The Start Screen (Updated!)
// ==========================================
const startScene = {
    key: 'StartScene',
    create: function() {
        const text = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY, 'Start your game 😸', {
            fontSize: '32px',
            fill: '#ffffff'
        }).setOrigin(0.5);

        text.setInteractive();

        text.on('pointerdown', () => {
            // 1. Go to full screen
            if (!this.scale.isFullscreen) {
                this.scale.startFullscreen();
            }
            
            // 2. Force the phone to flip sideways into Landscape mode!
            try {
                if (screen.orientation && screen.orientation.lock) {
                    screen.orientation.lock('landscape');
                }
            } catch (error) {
                console.log("Orientation lock not supported on this browser", error);
            }

            // 3. Start the game
            this.scene.start('GameScene');
        });
    }
};

// ==========================================
// SCENE 2: The Main Game 
// ==========================================
const gameScene = {
    key: 'GameScene',
    
    preload: function() {
        console.log("Loading game assets...");
        // These are our placeholders - we will change these next!
        this.load.image('tiles', 'https://labs.phaser.io/assets/tilemaps/tiles/super-mario.png'); 
        this.load.spritesheet('cat', 'https://labs.phaser.io/assets/sprites/baddie.png', { frameWidth: 32, frameHeight: 32 });
        this.load.plugin('rexvirtualjoystickplugin', 'https://cdn.jsdelivr.net/npm/phaser3-rex-plugins@1.1.39/dist/rexvirtualjoystickplugin.min.js', true);
    },

    create: function() {
        const levelData = [
            [14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14],
            [14, 14, 14, 14, 14, 14, 14, 15, 15, 15, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14],
            [14, 14, 14, 14, 14, 14, 15, 15, 14, 15, 15, 15, 14, 14, 14, 14, 14, 14, 14, 14],
            [14, 14, 14, 15, 15, 15, 15, 14, 14, 14, 14, 15, 15, 14, 14, 14, 14, 14, 14, 14],
            [14, 14, 15, 15, 14, 14, 14, 14, 14, 14, 14, 14, 15, 15, 15, 14, 14, 14, 14, 14],
            [14, 15, 15, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 15, 15, 14, 14, 14, 14],
            [14, 15, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 15, 15, 14, 14, 14],
            [14, 15, 15, 15, 15, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 15, 15, 14, 14],
            [14, 14, 14, 14, 15, 15, 15, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 15, 14, 14],
            [14, 14, 14, 14, 14, 14, 15, 15, 15, 15, 15, 15, 14, 14, 14, 14, 15, 15, 14, 14],
            [14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 15, 15, 15, 15, 15, 15, 14, 14, 14],
            [14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14],
            [14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14],
            [14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14],
            [14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14],
            [14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14],
            [14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14],
            [14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14],
            [14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14],
            [14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14]
        ];
        
        const map = this.make.tilemap({ data: levelData, tileWidth: 16, tileHeight: 16 });
        const tileset = map.addTilesetImage('tiles');
        const layer = map.createLayer(0, tileset, 0, 0);
        layer.setScale(4); 

        const worldWidth = map.widthInPixels * 4;
        const worldHeight = map.heightInPixels * 4;

        this.physics.world.setBounds(0, 0, worldWidth, worldHeight);

        player = this.physics.add.sprite(200, 350, 'cat');
        player.setScale(2); 
        player.setCollideWorldBounds(true); 

        this.anims.create({ key: 'walk-left', frames: this.anims.generateFrameNumbers('cat', { start: 0, end: 1 }), frameRate: 5, repeat: -1 });
        this.anims.create({ key: 'walk-right', frames: this.anims.generateFrameNumbers('cat', { start: 2, end: 3 }), frameRate: 5, repeat: -1 });

        this.cameras.main.setBounds(0, 0, worldWidth, worldHeight);
        this.cameras.main.startFollow(player, true, 0.08, 0.08);

        joyStick = this.plugins.get('rexvirtualjoystickplugin').add(this, {
            x: 120, 
            y: this.cameras.main.height - 120, 
            radius: 60,
            base: this.add.circle(0, 0, 60, 0x888888).setAlpha(0.5).setScrollFactor(0), 
            thumb: this.add.circle(0, 0, 30, 0xcccccc).setAlpha(0.8).setScrollFactor(0), 
            dir: '4dir', 
            forceMin: 16
        });
    },

    update: function() {
        player.setVelocity(0);

        if (joyStick.left) {
            player.setVelocityX(-150);
            player.anims.play('walk-left', true);
        } else if (joyStick.right) {
            player.setVelocityX(150);
            player.anims.play('walk-right', true);
        } else if (joyStick.up) {
            player.setVelocityY(-150);
        } else if (joyStick.down) {
            player.setVelocityY(150);
        } else {
            player.anims.stop();
        }
    }
};

// ==========================================
// GAME CONFIGURATION
// ==========================================
const config = {
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 800,  
        height: 400  
    },
    backgroundColor: '#222', 
    pixelArt: true,
    physics: {
        default: 'arcade',
        arcade: { gravity: { y: 0 } }
    },
    scene: [startScene, gameScene] 
};

const game = new Phaser.Game(config);
