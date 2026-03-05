const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#222', 
    pixelArt: true, // Keeps our pixel art looking sharp
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);

// --- Step 1: Preload Assets ---
function preload() {
    console.log("Loading game assets...");
    
    // Load a placeholder image that contains all our tiny map pieces.
    // We give it the name 'tiles' so we can refer to it later.
    this.load.image('tiles', 'https://labs.phaser.io/assets/tilemaps/tiles/super-mario.png'); 
}

// --- Step 2: Create the World ---
function create() {
    console.log("Creating the relaxing world...");
    
    // Here is our map! It is an array of arrays.
    // Let's pretend 14 is a grass tile, and 15 is a dirt path tile.
    const levelData = [
        [14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14],
        [14, 15, 15, 15, 14, 14, 14, 14, 14, 14, 14, 14],
        [14, 14, 14, 15, 15, 15, 15, 14, 14, 14, 14, 14],
        [14, 14, 14, 14, 14, 14, 15, 15, 15, 15, 14, 14],
        [14, 14, 14, 14, 14, 14, 14, 14, 14, 15, 15, 14],
        [14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14]
    ];

    // 1. Tell Phaser to make a map out of our levelData numbers.
    // We tell it that each little picture in our loaded image is 16x16 pixels.
    const map = this.make.tilemap({ data: levelData, tileWidth: 16, tileHeight: 16 });

    // 2. Add our loaded 'tiles' image to this map.
    const tileset = map.addTilesetImage('tiles');

    // 3. Draw the map onto the screen! 
    // The '0' just means it's the first layer.
    const layer = map.createLayer(0, tileset, 0, 0);
    
    // 4. Scale it up by 4 times so it's big, cozy, and easy to see.
    layer.setScale(4); 
}

// --- Step 3: Update Loop ---
function update() {
    // We will leave this blank until we add our cat!
}
