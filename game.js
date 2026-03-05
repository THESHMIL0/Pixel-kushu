let player;
let joyStick;

// ==========================================
// SCENE 1: The Start Screen
// ==========================================
const startScene = {
    key: 'StartScene',
    create: function() {
        // Add our welcome text to the center of the screen
        const text = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY, 'Start your game 😸', {
            fontSize: '32px',
            fill: '#ffffff'
        }).setOrigin(0.5); // Centers the text exactly

        // Make the text interactive so we can tap it
        text.setInteractive();

        // When the text is tapped...
        text.on('pointerdown', () => {
            // 1. Go Fullscreen
            if (!this.scale.isFullscreen) {
                this.scale.startFullscreen();
            }
            // 2. Start the actual game scene!
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
        this.load.image('tiles', 'https://labs.phaser.io/assets/tilemaps/tiles/super-mario.png'); 
        this.load.spritesheet('cat', 'https://labs.phaser.io/assets/sprites/baddie.png', { frameWidth: 32, frameHeight: 32 });
        
        // Load the Virtual Joystick Plugin from the web
        this.load.plugin('rexvirtualjoystickplugin', 'https://cdn.jsdelivr.net/npm/phaser3-rex-plugins@1.1.39/dist/rexvirtualjoystickplugin.min.js', true);
    },

    create: function() {
        // 1. Build the Map
        const levelData = [
            [14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14],
            [14, 15, 15, 15, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14],
            [14, 14, 14, 15, 15, 15, 15, 14, 14, 14, 14, 14, 14, 14, 14],
            [14, 14, 14, 14, 14, 14, 15, 15, 15, 15, 14, 14, 14, 14, 14],
            [14, 14, 14, 14, 14, 14, 14, 14, 14, 15, 15, 14, 14, 14, 14],
            [14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14]
        ];
        const map = this.make.tilemap({ data: levelData, tileWidth: 16, tileHeight: 16 });
        const tileset = map.addTilesetImage('tiles');
        const layer = map.createLayer(0, tileset, 0, 0);
        layer.setScale(4); 

        // 2. Add our Cat Player
        player = this.physics.add.sprite(200, 200, 'cat');
        player.setScale(2); 

        this.anims.create({ key: 'walk-left', frames: this.anims.generateFrameNumbers('cat', { start: 0, end: 1 }), frameRate: 5, repeat: -1 });
        this.anims.create({ key: 'walk-right', frames: this.anims.generateFrameNumbers('cat', { start: 2, end: 3 }), frameRate: 5, repeat: -1 });

        // 3. Create the Virtual Joystick
        // We place it in the bottom left corner
        joyStick = this.plugins.get('rexvirtualjoystickplugin').add(this, {
            x: 120, // Distance from left edge
            y: this.cameras.main.height - 120, // Distance from bottom edge
            radius: 60,
            base: this.add.circle(0, 0, 60, 0x888888).setAlpha(0.5), // The grey base circle
            thumb: this.add.circle(0, 0, 30, 0xcccccc).setAlpha(0.8), // The lighter thumb stick
            dir: '4dir', // 4 directions (up, down, left, right)
            forceMin: 16
        });
    },

    update: function() {
        player.setVelocity(0);

        // Check our joystick input instead of keyboard cursors!
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
        // FIT stretches the game to fit the screen while keeping its landscape shape
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 800,  // Base landscape width
        height: 400  // Base landscape height
    },
    backgroundColor: '#222', 
    pixelArt: true,
    physics: {
        default: 'arcade',
        arcade: { gravity: { y: 0 } }
    },
    // We put both scenes here. Phaser automatically starts the first one in the list.
    scene: [startScene, gameScene] 
};

const game = new Phaser.Game(config);
