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
        // 🎨 UPGRADED CODE ART STUDIO
        // ==========================================
        const tileArt = this.make.graphics();
        
        // Tile 0: Detailed Grass
        tileArt.fillStyle(0x55aa55, 1); tileArt.fillRect(0, 0, 16, 16); // Base green
        tileArt.fillStyle(0x449944, 1); // Darker green for grass blades
        tileArt.fillRect(2, 2, 2, 4); tileArt.fillRect(10, 8, 2, 3); tileArt.fillRect(6, 12, 2, 2);
        
        // Tile 1: Detailed Dirt Path
        tileArt.fillStyle(0xaa7744, 1); tileArt.fillRect(16, 0, 16, 16); // Base brown
        tileArt.fillStyle(0x885522, 1); // Darker brown for pebbles
        tileArt.fillRect(18, 4, 2, 2); tileArt.fillRect(26, 10, 3, 2); tileArt.fillRect(20, 13, 2, 1);

        // Tile 2: Detailed Water
        tileArt.fillStyle(0x4488ff, 1); tileArt.fillRect(32, 0, 16, 16); // Base blue
        tileArt.fillStyle(0x77aaff, 1); // Light blue ripples
        tileArt.fillRect(34, 4, 6, 2); tileArt.fillRect(40, 10, 6, 2);

        // Tile 3: Fluffy Tree
        tileArt.fillStyle(0x55aa55, 1); tileArt.fillRect(48, 0, 16, 16); // Grass underneath
        tileArt.fillStyle(0x443322, 1); tileArt.fillRect(54, 8, 4, 8); // Trunk
        tileArt.fillStyle(0x226622, 1); tileArt.fillCircle(56, 8, 7); // Bottom dark leaves
        tileArt.fillStyle(0x338833, 1); tileArt.fillCircle(56, 5, 5); // Top light leaves

        // Tile 4: The Bridge (NEW!)
        tileArt.fillStyle(0x4488ff, 1); tileArt.fillRect(64, 0, 16, 16); // Water underneath
        tileArt.fillStyle(0x996633, 1); tileArt.fillRect(64, 2, 16, 12); // Wooden bridge base
        tileArt.fillStyle(0x442200, 1); tileArt.fillRect(64, 6, 16, 1); tileArt.fillRect(64, 10, 16, 1); // Planks

        // Save the tileset (Now 80 pixels wide to fit 5 tiles!)
        tileArt.generateTexture('my_custom_tiles', 80, 16);

        // 🏠 THE HOUSE ART (NEW!)
        const houseArt = this.make.graphics();
        houseArt.fillStyle(0xdddddd, 1); houseArt.fillRect(4, 20, 40, 28); // White Walls
        houseArt.fillStyle(0xcc4444, 1); houseArt.fillTriangle(24, 0, 0, 20, 48, 20); // Red Roof
        houseArt.fillStyle(0x663311, 1); houseArt.fillRect(20, 32, 8, 16); // Brown Door
        houseArt.fillStyle(0x000000, 1); houseArt.fillCircle(26, 40, 1); // Doorknob
        houseArt.fillStyle(0x88ccff, 1); houseArt.fillRect(8, 26, 8, 8); houseArt.fillRect(32, 26, 8, 8); // Windows
        houseArt.generateTexture('house', 48, 48);

        // 😸 DETAILED CAT ART
        const catStand = this.make.graphics();
        catStand.fillStyle(0xcc8800, 1); catStand.fillRoundedRect(22, 18, 8, 4, 2); // Tail
        catStand.fillStyle(0xffaa00, 1); catStand.fillCircle(16, 16, 10); // Body
        catStand.fillTriangle(6, 6, 12, 10, 10, 16); catStand.fillTriangle(26, 6, 20, 10, 22, 16); // Outer Ears
        catStand.fillStyle(0xffcccc, 1); catStand.fillTriangle(8, 8, 11, 11, 10, 14); catStand.fillTriangle(24, 8, 21, 11, 22, 14); // Pink Inner Ears
        catStand.fillStyle(0xffffff, 1); catStand.fillCircle(12, 24, 3); catStand.fillCircle(20, 24, 3); // White Paws
        catStand.generateTexture('cat_stand', 32, 32);

        const catWalk = this.make.graphics();
        catWalk.fillStyle(0xcc8800, 1); catWalk.fillRoundedRect(22, 20, 8, 4, 2); // Tail bobbing
        catWalk.fillStyle(0xffaa00, 1); catWalk.fillCircle(16, 18, 10); // Body shifted down
        catWalk.fillTriangle(6, 8, 12, 12, 10, 18); catWalk.fillTriangle(26, 8, 20, 12, 22, 18); 
        catWalk.fillStyle(0xffcccc, 1); catWalk.fillTriangle(8, 10, 11, 13, 10, 16); catWalk.fillTriangle(24, 10, 21, 13, 22, 16);
        catWalk.fillStyle(0xffffff, 1); catWalk.fillCircle(12, 26, 3); catWalk.fillCircle(20, 26, 3); 
        catWalk.generateTexture('cat_walk', 32, 32);

        // ==========================================
        // 🌍 BUILDING THE UPGRADED WORLD
        // ==========================================
        // We replaced two '2's (water) with '4's (bridge) on the bottom right path!
        const levelData = [
            [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
            [3, 0, 0, 0, 0, 0, 3, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2],
            [3, 0, 3, 3, 0, 0, 1, 1, 0, 1, 1, 1, 0, 3, 3, 0, 0, 2, 2, 0],
            [3, 0, 3, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 2, 2, 0, 0],
            [3, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 2, 2, 0, 0, 3],
            [3, 1, 1, 1, 1, 1, 0, 3, 3, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 3],
            [3, 1, 0, 0, 0, 0, 0, 3, 3, 0, 0, 0, 0, 2, 2, 0, 0, 3, 3, 3],
            [3, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 3],
            [3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 4, 1, 1, 1, 1, 1, 0, 3], // Notice the 4, 4 here!
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

        // Only Water (2) and Trees (3) are solid. The Bridge (4) is safe to walk on!
        layer.setCollision([2, 3]); 

        // 🏠 Place our new House! (Coordinates X: 500, Y: 150)
        // We use staticSprite because the house never moves.
        const myHouse = this.physics.add.staticSprite(500, 150, 'house');
        myHouse.setScale(2); // Make the house nice and big!

        // Add the cat
        player = this.physics.add.sprite(200, 350, 'cat_stand');
        player.setScale(2); 
        player.setCollideWorldBounds(true); 

        // Collisions: Cat vs Map, and Cat vs House!
        this.physics.add.collider(player, layer);
        this.physics.add.collider(player, myHouse);

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
