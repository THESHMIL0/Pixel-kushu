let player;
let joyStick;

// ==========================================
// SCENE 1: The Start Screen
// ==========================================
const startScene = {
    key: 'StartScene',
    create: function() {
        const text = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY, 'Start your game 😸', {
            fontSize: '32px', fill: '#ffffff'
        }).setOrigin(0.5).setInteractive();

        text.on('pointerdown', () => {
            if (!this.scale.isFullscreen) this.scale.startFullscreen();
            try {
                if (screen.orientation && screen.orientation.lock) {
                    screen.orientation.lock('landscape');
                }
            } catch (error) { console.log("Orientation lock not supported"); }
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
        console.log("Loading plugins...");
        // We only need to load our joystick now! No more external images.
        this.load.plugin('rexvirtualjoystickplugin', 'https://cdn.jsdelivr.net/npm/phaser3-rex-plugins@1.1.39/dist/rexvirtualjoystickplugin.min.js', true);
    },

    create: function() {
        // ==========================================
        // OUR CODE ART STUDIO 🎨
        // ==========================================

        // 1. DRAWING THE TILESET (Grass, Path, Water, Tree)
        const tileArt = this.make.graphics();
        
        // Tile 0: Grass (Green Square)
        tileArt.fillStyle(0x55aa55, 1);
        tileArt.fillRect(0, 0, 16, 16);
        
        // Tile 1: Dirt Path (Brown Square)
        tileArt.fillStyle(0xaa7744, 1);
        tileArt.fillRect(16, 0, 16, 16);
        
        // Tile 2: Water (Blue Square)
        tileArt.fillStyle(0x4488ff, 1);
        tileArt.fillRect(32, 0, 16, 16);
        
        // Tile 3: Tree (Green Grass base + Brown Trunk + Dark Green Leaves)
        tileArt.fillStyle(0x55aa55, 1); // Grass background
        tileArt.fillRect(48, 0, 16, 16);
        tileArt.fillStyle(0x664422, 1); // Trunk
        tileArt.fillRect(54, 8, 4, 8);
        tileArt.fillStyle(0x227722, 1); // Leaves circle
        tileArt.fillCircle(56, 6, 6);

        // Save our tile drawing as an image the game can use!
        tileArt.generateTexture('my_tiles', 64, 16);

        // 2. DRAWING THE 😸 CAT
        // Frame 1: Standing
        const catStand = this.make.graphics();
        catStand.fillStyle(0xffaa00, 1); // Orange body
        catStand.fillCircle(16, 16, 10); // Round face
        catStand.fillTriangle(6, 6, 12, 10, 10, 16); // Left ear
        catStand.fillTriangle(26, 6, 20, 10, 22, 16); // Right ear
        catStand.generateTexture('cat_stand', 32, 32);

        // Frame 2: Walking (Shifted down slightly to look like a footstep)
        const catWalk = this.make.graphics();
        catWalk.fillStyle(0xffaa00, 1); 
        catWalk.fillCircle(16, 18, 10); 
        catWalk.fillTriangle(6, 8, 12, 12, 10, 18); 
        catWalk.fillTriangle(26, 8, 20, 12, 22, 18); 
        catWalk.generateTexture('cat_walk', 32, 32);


        // ==========================================
        // BUILDING THE WORLD
        // ==========================================

        // 0 = Grass, 1 = Path, 2 = Water, 3 = Tree
        const levelData = [
            [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
            [3, 0, 0, 0, 0, 0, 3, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2],
            [3, 0, 3, 3, 0, 0, 1, 1, 0, 1, 1, 1, 0, 3, 3, 0, 0, 2, 2, 0],
            [3, 0, 3, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 2, 2, 0, 0],
            [3, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 2, 2, 0, 0, 3],
            [3, 1, 1, 1, 1, 1, 0, 3, 3, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 3],
            [3, 1, 0, 0, 0, 0, 0, 3, 3, 0, 0, 0, 0, 2, 2, 0, 0, 3, 3, 3],
            [3, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 3],
            [3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 1, 1, 1, 1, 1, 0, 3],
            [3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 1, 0, 3],
            [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3]
        ];
        
        const map = this.make.tilemap({ data: levelData, tileWidth: 16, tileHeight: 16 });
        const tileset = map.addTilesetImage('my_tiles');
        const layer = map.createLayer(0, tileset, 0, 0);
        layer.setScale(4); 

        const worldWidth = map.widthInPixels * 4;
        const worldHeight = map.heightInPixels * 4;
        this.physics.world.setBounds(0, 0, worldWidth, worldHeight);

        // Add the cat using our coded 'cat_stand' image!
        player = this.physics.add.sprite(200, 350, 'cat_stand');
        player.setScale(2); 
        player.setCollideWorldBounds(true); 

        // Create an animation using our two coded frames
        this.anims.create({ 
            key: 'walk', 
            frames: [ { key: 'cat_stand' }, { key: 'cat_walk' } ], 
            frameRate: 5, 
            repeat: -1 
        });

        this.cameras.main.setBounds(0, 0, worldWidth, worldHeight);
        this.cameras.main.startFollow(player, true, 0.08, 0.08);

        joyStick = this.plugins.get('rexvirtualjoystickplugin').add(this, {
            x: 120, y: this.cameras.main.height - 120, radius: 60,
            base: this.add.circle(0, 0, 60, 0x888888).setAlpha(0.5).setScrollFactor(0), 
            thumb: this.add.circle(0, 0, 30, 0xcccccc).setAlpha(0.8).setScrollFactor(0), 
            dir: '4dir', forceMin: 16
        });
    },

    update: function() {
        player.setVelocity(0);

        if (joyStick.left) {
            player.setVelocityX(-150);
            player.anims.play('walk', true);
            player.setFlipX(false); // Make cat face left
        } else if (joyStick.right) {
            player.setVelocityX(150);
            player.anims.play('walk', true);
            player.setFlipX(true); // Flip image to face right
        } else if (joyStick.up) {
            player.setVelocityY(-150);
            player.anims.play('walk', true);
        } else if (joyStick.down) {
            player.setVelocityY(150);
            player.anims.play('walk', true);
        } else {
            player.anims.stop();
            player.setTexture('cat_stand'); // Stand still when not moving
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
