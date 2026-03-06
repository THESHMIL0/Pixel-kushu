let player;
let joyStick;

// --- Puzzle Variables ---
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
        const text = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY, 'Start Your Journey 😸\n(Turn your phone sideways!)', {
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
        hasKey = false;
        keyRevealed = false;

        // ==========================================
        // 🎨 ART STUDIO
        // ==========================================
        const tileArt = this.make.graphics();
        tileArt.fillStyle(0x55aa55, 1); tileArt.fillRect(0, 0, 16, 16); 
        tileArt.fillStyle(0xaa7744, 1); tileArt.fillRect(16, 0, 16, 16); 
        tileArt.fillStyle(0x4488ff, 1); tileArt.fillRect(32, 0, 16, 16); 
        tileArt.fillStyle(0x4488ff, 1); tileArt.fillRect(48, 0, 16, 16); tileArt.fillStyle(0x996633, 1); tileArt.fillRect(48, 2, 16, 12); tileArt.fillStyle(0x442200, 1); tileArt.fillRect(48, 6, 16, 1); tileArt.fillRect(48, 10, 16, 1);
        tileArt.generateTexture('my_custom_tiles', 64, 16);

        const houseArt = this.make.graphics();
        houseArt.fillStyle(0xdddddd, 1); houseArt.fillRect(4, 20, 40, 28); houseArt.fillStyle(0xcc4444, 1); houseArt.fillTriangle(24, 0, 0, 0, 20, 48, 20); houseArt.fillStyle(0x444444, 1); houseArt.fillRect(36, 4, 6, 16); houseArt.fillStyle(0x663311, 1); houseArt.fillRect(20, 32, 8, 16); houseArt.fillStyle(0x000000, 1); houseArt.fillCircle(26, 40, 1); houseArt.fillStyle(0x88ccff, 1); houseArt.fillRect(8, 26, 8, 8); houseArt.fillRect(32, 26, 8, 8); houseArt.generateTexture('house', 48, 48);

        const catStand = this.make.graphics();
        catStand.fillStyle(0xcc8800, 1); catStand.fillRoundedRect(22, 18, 8, 4, 2); catStand.fillStyle(0xffaa00, 1); catStand.fillCircle(16, 16, 10); catStand.fillTriangle(6, 6, 12, 10, 10, 16); catStand.fillTriangle(26, 6, 20, 10, 22, 16); catStand.fillStyle(0xffcccc, 1); catStand.fillTriangle(8, 8, 11, 11, 10, 14); catStand.fillTriangle(24, 8, 21, 11, 22, 14); catStand.fillStyle(0xffffff, 1); catStand.fillCircle(12, 24, 3); catStand.fillCircle(20, 24, 3); catStand.generateTexture('cat_stand', 32, 32);
        
        const catWalk = this.make.graphics();
        catWalk.fillStyle(0xcc8800, 1); catWalk.fillRoundedRect(22, 20, 8, 4, 2); catWalk.fillStyle(0xffaa00, 1); catWalk.fillCircle(16, 18, 10); catWalk.fillTriangle(6, 8, 12, 12, 10, 18); catWalk.fillTriangle(26, 8, 20, 12, 22, 18); catWalk.fillStyle(0xffcccc, 1); catWalk.fillTriangle(8, 10, 11, 13, 10, 16); catWalk.fillTriangle(24, 10, 21, 13, 22, 16); catWalk.fillStyle(0xffffff, 1); catWalk.fillCircle(12, 26, 3); catWalk.fillCircle(20, 26, 3); catWalk.generateTexture('cat_walk', 32, 32);

        const detailedTreeArt = this.make.graphics();
        detailedTreeArt.fillStyle(0x664422, 1); detailedTreeArt.fillRect(12, 32, 8, 32); detailedTreeArt.fillStyle(0x553311, 1); detailedTreeArt.fillRect(12, 32, 2, 32); detailedTreeArt.fillStyle(0x226622, 1); detailedTreeArt.fillCircle(8, 36, 6); detailedTreeArt.fillCircle(24, 36, 6); detailedTreeArt.fillCircle(16, 40, 7); detailedTreeArt.fillStyle(0x2d882d, 1); detailedTreeArt.fillCircle(8, 28, 7); detailedTreeArt.fillCircle(24, 28, 7); detailedTreeArt.fillCircle(16, 32, 8); detailedTreeArt.fillCircle(16, 24, 8); detailedTreeArt.fillStyle(0x44bb44, 1); detailedTreeArt.fillCircle(8, 20, 6); detailedTreeArt.fillCircle(24, 20, 6); detailedTreeArt.fillCircle(16, 16, 8); detailedTreeArt.fillCircle(16, 8, 6);
        detailedTreeArt.generateTexture('detailed_tree', 32, 64);

        const puzzleArt = this.make.graphics();
        puzzleArt.fillStyle(0x114411, 1); puzzleArt.fillCircle(16, 16, 14); puzzleArt.fillCircle(8, 24, 8); puzzleArt.fillCircle(24, 24, 8); puzzleArt.generateTexture('secret_bush', 32, 32); puzzleArt.clear();
        puzzleArt.fillStyle(0xffcc00, 1); puzzleArt.fillCircle(8, 8, 6); puzzleArt.fillRect(8, 6, 16, 4); puzzleArt.fillRect(20, 10, 4, 4); puzzleArt.generateTexture('key_item', 32, 16); puzzleArt.clear();
        puzzleArt.fillStyle(0x663311, 1); puzzleArt.fillRect(0, 0, 32, 64); puzzleArt.fillStyle(0x442200, 1); puzzleArt.fillRect(4, 4, 24, 56); puzzleArt.fillStyle(0xcccccc, 1); puzzleArt.fillRect(20, 30, 6, 8); puzzleArt.fillStyle(0x000000, 1); puzzleArt.fillRect(22, 32, 2, 4); puzzleArt.generateTexture('locked_door', 32, 64);

        // ==========================================
        // 🌍 BUILDING THE WORLD 
        // ==========================================
        const levelData = [
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2],
            [0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 2, 2, 0],
            [0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 2, 2, 0, 0],
            [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 2, 2, 0, 0, 0],
            [0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0],
            [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0],
            [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0],
            [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 3, 1, 1, 0, 0, 0, 0, 0], 
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 1, 1, 0, 0, 0, 0], 
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 1, 1, 1, 0, 0]  
        ];
        
        const map = this.make.tilemap({ data: levelData, tileWidth: 16, tileHeight: 16 });
        const tileset = map.addTilesetImage('my_custom_tiles');
        const layer = map.createLayer(0, tileset, 0, 0);
        layer.setScale(4); 
        layer.setCollision([2]); 

        const worldWidth = map.widthInPixels * 4;
        const worldHeight = map.heightInPixels * 4;
        this.physics.world.setBounds(0, 0, worldWidth, worldHeight);

        // ==========================================
        // 🌲 PLACING TREES WITH FIXED HITBOXES
        // ==========================================
        const forestGroup = this.physics.add.staticGroup();
        
        // Helper function to plant a tree, fix its hitbox, and set its depth!
        const plantTree = (x, y) => {
            let tree = forestGroup.create(x, y, 'detailed_tree').setOrigin(0,0).setScale(4);
            tree.refreshBody(); 
            // 🌟 1. Shrink the invisible collision box to just the trunk!
            tree.body.width = 48;  
            tree.body.height = 48; 
            tree.body.x = tree.x + 40; 
            tree.body.y = tree.y + 208; 
            // 🌟 2. Set drawing depth based on the trunk's vertical position
            tree.setDepth(tree.y + 208);
        };

        for (let x = 0; x <= worldWidth; x += 128) {
            plantTree(x, 0);
            if (x < worldWidth / 2) plantTree(x, worldHeight - 128);
        }

        // ==========================================
        // 🏠 PLACING THE HOUSE
        // ==========================================
        const myHouse = this.physics.add.staticSprite(1100, 600, 'house');
        myHouse.setScale(3); 
        myHouse.refreshBody();
        // Shrink house hitbox to just the bottom walls/door
        myHouse.body.setSize(120, 60);
        myHouse.body.setOffset(12, 84);
        myHouse.setDepth(myHouse.y + 60); // Set house depth

        // 🧩 Puzzle Items
        const secretBush = this.physics.add.staticSprite(950, 480, 'secret_bush');
        secretBush.setScale(2);
        secretBush.setDepth(secretBush.y + 32);

        const door = this.physics.add.staticSprite(730, 544, 'locked_door');
        door.setScale(2);
        door.setDepth(door.y + 64);

        // ==========================================
        // 😸 THE PLAYER & ANIMATIONS
        // ==========================================
        player = this.physics.add.sprite(1100, 670, 'cat_stand');
        player.setScale(2); 
        player.setCollideWorldBounds(true); 

        player.breathTween = this.tweens.add({
            targets: player, scaleY: 2.1, scaleX: 2.05, duration: 900, yoyo: true, repeat: -1, ease: 'Sine.easeInOut'
        });

        this.anims.create({ key: 'walk', frames: [ { key: 'cat_stand' }, { key: 'cat_walk' } ], frameRate: 5, repeat: -1 });

        // Collisions
        this.physics.add.collider(player, layer); 
        this.physics.add.collider(player, forestGroup); 
        this.physics.add.collider(player, myHouse); 
        
        this.physics.add.overlap(player, secretBush, () => {
            if (!keyRevealed) {
                keyRevealed = true;
                uiText.setText("Found the house keys! 🗝️");
                keyItem = this.physics.add.sprite(secretBush.x + 60, secretBush.y, 'key_item');
                keyItem.setScale(2);
                keyItem.setDepth(keyItem.y + 32);
                this.physics.add.overlap(player, keyItem, () => {
                    hasKey = true; keyItem.destroy();
                    uiText.setText("Got it! Time to cross the bridge. 😸");
                });
            }
        });

        this.physics.add.collider(player, door, () => {
            if (hasKey) {
                door.destroy(); uiText.setText("Door Unlocked! The world awaits! 🚪✨"); hasKey = false;
            } else {
                uiText.setText("The bridge is locked... check the bush near the house! 🤔");
            }
        });

        // ==========================================
        // 🎥 CAMERA & UI
        // ==========================================
        this.cameras.main.setBounds(0, 0, worldWidth, worldHeight);
        this.cameras.main.startFollow(player, true, 0.08, 0.08);
        
        // 🌟 3. ZOOM OUT! This gives us a much wider view of the beautiful map
        this.cameras.main.setZoom(0.8);

        uiText = this.add.text(this.cameras.main.centerX, 30, 'Home sweet home. Let\'s explore! 🌳', {
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
        let isMoving = false;
        player.setVelocity(0);

        if (joyStick.left) { player.setVelocityX(-150); player.setFlipX(false); isMoving = true; } 
        else if (joyStick.right) { player.setVelocityX(150); player.setFlipX(true); is moving = true; } 
        
        if (joyStick.up) { player.setVelocityY(-150); isMoving = true; } 
        else if (joyStick.down) { player.setVelocityY(150); isMoving = true; } 

        // 🌟 4. Dynamic Depth Updating
        // This makes sure the cat's rendering order changes as it walks up and down!
        player.setDepth(player.y + 32);

        if (isMoving) {
            player.anims.play('walk', true);
            player.breathTween.pause(); 
            player.setScale(2); 
        } else {
            player.anims.stop(); 
            player.setTexture('cat_stand'); 
            if (player.breathTween.isPaused()) player.breathTween.resume(); 
        }
    }
};

const config = {
    type: Phaser.AUTO, scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH, width: 800, height: 400 },
    backgroundColor: '#222', pixelArt: true, physics: { default: 'arcade', arcade: { gravity: { y: 0 } } },
    scene: [startScene, gameScene] 
};
const game = new Phaser.Game(config);
