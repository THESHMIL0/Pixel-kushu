let player;
let joyStick;

// ==========================================
// SCENE 1: The Start Screen
// ==========================================
const startScene = {
    key: 'StartScene',
    create: function() {
        const text = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY, 'Start your game 😸\n(Turn your phone sideways!)', {
            fontSize: '28px', fill: '#ffffff', align: 'center'
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
        this.load.plugin('rexvirtualjoystickplugin', 'https://cdn.jsdelivr.net/npm/phaser3-rex-plugins@1.1.39/dist/rexvirtualjoystickplugin.min.js', true);
    },

    create: function() {
        // ==========================================
        // 🎨 OUR CODE ART STUDIO
        // ==========================================
        const tileArt = this.make.graphics();
        
        // 0: Grass, 1: Path, 2: Water, 3: Tree
        tileArt.fillStyle(0x55aa55, 1); tileArt.fillRect(0, 0, 16, 16);
        tileArt.fillStyle(0xaa7744, 1); tileArt.fillRect(16, 0, 16, 16);
        tileArt.fillStyle(0x4488ff, 1); tileArt.fillRect(32, 0, 16, 16);
        
        tileArt.fillStyle(0x55aa55, 1); tileArt.fillRect(48, 0, 16, 16);
        tileArt.fillStyle(0x664422, 1); tileArt.fillRect(54, 8, 4, 8);
        tileArt.fillStyle(0x227722, 1); tileArt.fillCircle(56, 6, 6);

        tileArt.generateTexture('my_custom_tiles', 64, 16);

        // 😸 THE CAT ART
        const catStand = this.make.graphics();
        catStand.fillStyle(0xffaa00, 1); 
        catStand.fillCircle(16, 16, 10); 
        catStand.fillTriangle(6, 6, 12, 10, 10, 16); 
        catStand.fillTriangle(26, 6, 20, 10, 22, 16); 
        catStand.generateTexture('cat_stand', 32, 32);

        const catWalk = this.make.graphics();
        catWalk.fillStyle(0xffaa00, 1); 
        catWalk.fillCircle(16, 18, 10); 
        catWalk.fillTriangle(6, 8, 12, 12, 10, 18); 
        catWalk.fillTriangle(26, 8, 20, 12, 22, 18); 
        catWalk.generateTexture('cat_walk', 32, 32);

        // ==========================================
        // 🌍 BUILDING THE WORLD
        // ==========================================
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
        const tileset = map.addTilesetImage('my_custom_tiles');
        const layer = map.createLayer(0, tileset, 0, 0);
        layer.setScale(4); 

        const worldWidth = map.widthInPixels * 4;
        const worldHeight = map.heightInPixels * 4;
        this.physics.world.setBounds(0, 0, worldWidth, worldHeight);

        // --- NEW COLLISION CODE STARTS HERE ---
        
        // Tell the map that Water (2) and Trees (3) are solid!
        layer.setCollision([2, 3]); 

        // Add the cat
        player = this.physics.add.sprite(200, 350, 'cat_stand');
        player.setScale(2); 
        player.setCollideWorldBounds(true); 

        // Tell the physics engine to stop the player if they hit a solid part of the layer
        this.physics.add.collider(player, layer);

        // --- NEW COLLISION CODE ENDS HERE ---

        this.anims.create({ 
            key: 'walk', 
            frames: [ { key: 'cat_stand' }, { key: 'cat_walk' } ], 
            frameRate: 5, 
            repeat: -1 
        });

        this.cameras.main.setBounds(0, 0, worldWidth, worldHeight);
        this.cameras.main.startFollow(player, true, 0.08, 0.08);

        joyStick = this.plugins.get('rexvirtualjoystickplugin').add(this, {
            x: 100, y: this.cameras.main.height - 100, radius: 50,
            base: this.add.circle(0, 0, 50, 0x888888).setAlpha(0.5).setScrollFactor(0), 
            thumb: this.add.circle(0, 0, 25, 0xcccccc).setAlpha(0.8).setScrollFactor(0), 
            dir: '4dir', forceMin: 16
        });
    },

    update: function() {
        player.setVelocity(0);

        if (joyStick.left) {
            player.setVelocityX(-150);
            player.anims.play('walk', true);
            player.setFlipX(false); 
        } else if (joyStick.right) {
            player.setVelocityX(150);
            player.anims.play('walk', true);
            player.setFlipX(true); 
        } else if (joyStick.up) {
            player.setVelocityY(-150);
            player.anims.play('walk', true);
        } else if (joyStick.down) {
            player.setVelocityY(150);
            player.anims.play('walk', true);
        } else {
            player.anims.stop();
            player.setTexture('cat_stand'); 
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
