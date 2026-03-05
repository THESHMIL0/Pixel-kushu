// We added the "physics" block here!
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#222', 
    pixelArt: true,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 }, // No gravity for top-down games!
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);

// We define these variables out here so both create() and update() can use them
let player;
let cursors;

// --- Step 1: Preload Assets ---
function preload() {
    console.log("Loading game assets...");
    
    // Our map tiles
    this.load.image('tiles', 'https://labs.phaser.io/assets/tilemaps/tiles/super-mario.png'); 
    
    // Our temporary Cat placeholder (a 32x32 pixel spritesheet)
    // Replace this URL later with your own cute cat image!
    this.load.spritesheet('cat', 'https://labs.phaser.io/assets/sprites/baddie.png', { 
        frameWidth: 32, 
        frameHeight: 32 
    });
}

// --- Step 2: Create the World and Player ---
function create() {
    console.log("Creating the relaxing world...");
    
    // 1. Build the Map (Same as before)
    const levelData = [
        [14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14],
        [14, 15, 15, 15, 14, 14, 14, 14, 14, 14, 14, 14],
        [14, 14, 14, 15, 15, 15, 15, 14, 14, 14, 14, 14],
        [14, 14, 14, 14, 14, 14, 15, 15, 15, 15, 14, 14],
        [14, 14, 14, 14, 14, 14, 14, 14, 14, 15, 15, 14],
        [14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14]
    ];
    const map = this.make.tilemap({ data: levelData, tileWidth: 16, tileHeight: 16 });
    const tileset = map.addTilesetImage('tiles');
    const layer = map.createLayer(0, tileset, 0, 0);
    layer.setScale(4); 

    // 2. Add our Cat Player
    // We place the cat at coordinates x=100, y=100
    player = this.physics.add.sprite(100, 100, 'cat');
    player.setScale(2); // Make the cat a bit bigger so it's easy to see

    // 3. Simple Animations (Left and Right)
    this.anims.create({
        key: 'walk-left',
        frames: this.anims.generateFrameNumbers('cat', { start: 0, end: 1 }),
        frameRate: 5,
        repeat: -1
    });
    this.anims.create({
        key: 'walk-right',
        frames: this.anims.generateFrameNumbers('cat', { start: 2, end: 3 }),
        frameRate: 5,
        repeat: -1
    });

    // 4. Set up Keyboard Controls
    // This tells Phaser to listen for Up, Down, Left, and Right arrows
    cursors = this.input.keyboard.createCursorKeys();
}

// --- Step 3: Update Loop (Runs continuously) ---
function update() {
    // 1. Stop the cat from moving when no keys are pressed
    player.setVelocity(0);

    // 2. Check which keys are pressed and move the cat!
    // We use a gentle speed of 150 to keep it relaxing.
    if (cursors.left.isDown) {
        player.setVelocityX(-150);
        player.anims.play('walk-left', true);
    } else if (cursors.right.isDown) {
        player.setVelocityX(150);
        player.anims.play('walk-right', true);
    } else if (cursors.up.isDown) {
        player.setVelocityY(-150);
    } else if (cursors.down.isDown) {
        player.setVelocityY(150);
    } else {
        // Stop the animation if we aren't moving left or right
        player.anims.stop();
    }
}
