let player;
let joyStick;

// --- New Puzzle Variables ---
let hasKey = false;
let keyRevealed = false;
let uiText;
let keyItem;

// ==========================================
// SCENE 1: The Start Screen
// ==========================================
const startScene = {
    key: 'StartScene',
    create: function() {
        const text = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY, 'Start Puzzle Game 😸\n(Turn your phone sideways!)', {
            fontSize: '28px', fill: '#ffffff', align: 'center'
        }).setOrigin(0.5).setInteractive();

        text.on('pointerdown', () => {
            if (!this.scale.isFullscreen) this.scale.startFullscreen();
            try { if (screen.orientation && screen.orientation.lock) screen.orientation.lock('landscape'); } catch (e) {}
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
        this.load.plugin('rexvirtualjoystickplugin', 'https://cdn.jsdelivr.net/npm/phaser3-rex-plugins@1.1.39/dist/rexvirtualjoystickplugin.min.js', true);
    },

    create: function() {
        // Reset our puzzle variables every time the game starts
        hasKey = false;
        keyRevealed = false;

        // ==========================================
        // 🎨 ART STUDIO
        // ==========================================
        const tileArt = this.make.graphics();
        // 0: Grass, 1: Path, 2: Water, 3: Tree, 4: Bridge
        tileArt.fillStyle(0x55aa55, 1); tileArt.fillRect(0, 0, 16, 16); tileArt.fillStyle(0x449944, 1); tileArt.fillRect(2, 2, 2, 4); tileArt.fillRect(10, 8, 2, 3);
        tileArt.fillStyle(0xaa7744, 1); tileArt.fillRect(16, 0, 16, 16); tileArt.fillStyle(0x885522, 1); tileArt.fillRect(18, 4, 2, 2); tileArt.fillRect(26, 10, 3, 2);
        tileArt.fillStyle(0x4488ff, 1); tileArt.fillRect(32, 0, 16, 16); tileArt.fillStyle(0x77aaff, 1); tileArt.fillRect(34, 4, 6, 2);
        tileArt.fillStyle(0x55aa55, 1); tileArt.fillRect(48, 0, 16, 16); tileArt.fillStyle(0x443322, 1); tileArt.fillRect(54, 8, 4, 8); tileArt.fillStyle(0x226622, 1); tileArt.fillCircle(56, 8, 7);
        tileArt.fillStyle(0x4488ff, 1); tileArt.fillRect(64, 0, 16, 16); tileArt.fillStyle(0x996633, 1); tileArt.fillRect(64, 2, 16, 12); tileArt.fillStyle(0x442200, 1); tileArt.fillRect(64, 6, 16, 1);
        tileArt.generateTexture('my_custom_tiles', 80, 16);

        const catStand = this.make.graphics();
        catStand.fillStyle(0xcc8800, 1); catStand.fillRoundedRect(22, 18, 8, 4, 2); 
        catStand.fillStyle(0xffaa00, 1); catStand.fillCircle(16, 16, 10); 
        catStand.fillTriangle(6, 6, 12, 10, 10, 16); catStand.fillTriangle(26, 6, 20, 10, 22, 16); 
        catStand.fillStyle(0xffcccc, 1); catStand.fillTriangle(8, 8, 11, 11, 10, 14); catStand.fillTriangle(24, 8, 21, 11, 22, 14); 
        catStand.fillStyle(0xffffff, 1); catStand.fillCircle(12, 24, 3); catStand.fillCircle(20, 24, 3); 
        catStand.generateTexture('cat_stand', 32, 32);

        const catWalk = this.make.graphics();
        catWalk.fillStyle(0xcc8800, 1); catWalk.fillRoundedRect(22, 20, 8, 4, 2); 
        catWalk.fillStyle(0xffaa00, 1); catWalk.fillCircle(16, 18, 10); 
        catWalk.fillTriangle(6, 8, 12, 12, 10, 18); catWalk.fillTriangle(26, 8, 20, 12, 22, 18); 
        catWalk.fillStyle(0xffcccc, 1); catWalk.fillTriangle(8, 10, 11, 13, 10, 16); catWalk.fillTriangle(24, 10, 21, 13, 22, 16);
        catWalk.fillStyle(0xffffff, 1); catWalk.fillCircle(12, 26, 3); catWalk.fillCircle(20, 26, 3); 
        catWalk.generateTexture('cat_walk', 32, 32);

        // 🌳 NEW: Puzzle Item Art!
        const puzzleArt = this.make.graphics();
        // The Secret Bush
        puzzleArt.fillStyle(0x114411, 1); puzzleArt.fillCircle(16, 16, 14); puzzleArt.fillCircle(8, 24, 8); puzzleArt.fillCircle(24, 24, 8);
        puzzleArt.generateTexture('secret_bush', 32, 32);
        puzzleArt.clear();
        // The Golden Key 🗝️
        puzzleArt.fillStyle(0xffcc00, 1); puzzleArt.fillCircle(8, 8, 6); puzzleArt.fillRect(8, 6, 16, 4); puzzleArt.fillRect(20, 10, 4, 4);
        puzzleArt.generateTexture('key_item', 32, 16);
        puzzleArt.clear();
        // The Wooden Door 🚪
        puzzleArt.fillStyle(0x663311, 1); puzzleArt.fillRect(0, 0, 32, 64); puzzleArt.fillStyle(0x442200, 1); puzzleArt.fillRect(4, 4, 24, 56);
        puzzleArt.fillStyle(0xcccccc, 1); puzzleArt.fillRect(20, 30, 6, 8); puzzleArt.fillStyle(0x000000, 1); puzzleArt.fillRect(22, 32, 2, 4); // Keyhole
        puzzleArt.generateTexture('locked_door', 32, 64);


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
            [3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 4, 1, 1, 1, 1, 1, 0, 3], // The Bridge is here!
            [3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 1, 0, 3],
            [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3]
        ];
        
        const map = this.make.tilemap({ data: levelData, tileWidth: 16, tileHeight: 16 });
        const tileset = map.addTilesetImage('my_custom_tiles');
        const layer = map.createLayer(0, tileset, 0, 0);
        layer.setScale(4); 
        layer.setCollision([2, 3]); // Water and Trees are solid

        const worldWidth = map.widthInPixels * 4;
        const worldHeight = map.heightInPixels * 4;
        this.physics.world.setBounds(0, 0, worldWidth, worldHeight);

        // ==========================================
        // 🧩 PLACING PUZZLE ITEMS
        // ==========================================
        
        // 1. Place the Secret Bush at the top left
        const secretBush = this.physics.add.staticSprite(200, 150, 'secret_bush');
        secretBush.setScale(2);

        // 2. Place the Locked Door right on the bridge!
        const door = this.physics.add.staticSprite(760, 544, 'locked_door');
        door.setScale(2);

        // 3. Add the cat
        player = this.physics.add.sprite(200, 350, 'cat_stand');
        player.setScale(2); 
        player.setCollideWorldBounds(true); 

        // 4. Setup Puzzle Collisions!
        this.physics.add.collider(player, layer); // Solid map
        
        // When the cat touches the bush...
        this.physics.add.overlap(player, secretBush, () => {
            if (!keyRevealed) {
                keyRevealed = true;
                uiText.setText("A Key popped out! 🗝️");
                // Spawn the key next to the bush
                keyItem = this.physics.add.sprite(secretBush.x + 60, secretBush.y, 'key_item');
                keyItem.setScale(2);
                
                // When the cat touches the newly spawned key...
                this.physics.add.overlap(player, keyItem, () => {
                    hasKey = true;
                    keyItem.destroy(); // Remove key from map
                    uiText.setText("Got the Key! Go to the door. 😸");
                });
            }
        });

        // When the cat bumps into the door...
        this.physics.add.collider(player, door, () => {
            if (hasKey) {
                door.destroy(); // The door opens!
                uiText.setText("Door Unlocked! The path is clear! 🚪✨");
                hasKey = false; // Used the key
            } else {
                uiText.setText("It's locked... Maybe there's a secret bush? 🤔");
            }
        });

        // ==========================================
        // 🎥 CAMERA & UI
        // ==========================================
        this.anims.create({ key: 'walk', frames: [ { key: 'cat_stand' }, { key: 'cat_walk' } ], frameRate: 5, repeat: -1 });
        this.cameras.main.setBounds(0, 0, worldWidth, worldHeight);
        this.cameras.main.startFollow(player, true, 0.08, 0.08);

        // Add UI Text to the screen (setScrollFactor(0) pins it to the glass so it doesn't move with the map)
        uiText = this.add.text(this.cameras.main.centerX, 30, 'Explore the forest! 🌳', {
            fontSize: '24px', fill: '#ffffff', backgroundColor: '#00000088', padding: {x: 10, y: 5}
        }).setOrigin(0.5).setScrollFactor(0);

        joyStick = this.plugins.get('rexvirtualjoystickplugin').add(this, {
            x: 100, y: this.cameras.main.height - 100, radius: 50,
            base: this.add.circle(0, 0, 50, 0x888888).setAlpha(0.5).setScrollFactor(0), 
            thumb: this.add.circle(0, 0, 25, 0xcccccc).setAlpha(0.8).setScrollFactor(0), 
            dir: '4dir', forceMin: 16
        });
    },

    update: function() {
        player.setVelocity(0);

        if (joyStick.left) { player.setVelocityX(-150); player.anims.play('walk', true); player.setFlipX(false); } 
        else if (joyStick.right) { player.setVelocityX(150); player.anims.play('walk', true); player.setFlipX(true); } 
        else if (joyStick.up) { player.setVelocityY(-150); player.anims.play('walk', true); } 
        else if (joyStick.down) { player.setVelocityY(150); player.anims.play('walk', true); } 
        else { player.anims.stop(); player.setTexture('cat_stand'); }
    }
};

const config = {
    type: Phaser.AUTO, scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH, width: 800, height: 400 },
    backgroundColor: '#222', pixelArt: true, physics: { default: 'arcade', arcade: { gravity: { y: 0 } } },
    scene: [startScene, gameScene] 
};
const game = new Phaser.Game(config);
