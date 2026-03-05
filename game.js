// This tells Phaser how to set up our game window
const config = {
    type: Phaser.AUTO, // Automatically chooses the best way to draw the graphics
    width: 800,        // Game width in pixels (similar to your image's wide view)
    height: 600,       // Game height in pixels
    backgroundColor: '#5C94FC', // A placeholder blue sky/water color
    pixelArt: true,    // VERY IMPORTANT: Keeps our pixel art crisp, not blurry!
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

// Start the game with the configuration above
const game = new Phaser.Game(config);

// Step 1: Preload - We will load our images here later
function preload() {
    console.log("Loading game assets...");
    // Soon, we'll write code here to load the cat and map images
}

// Step 2: Create - We set up the world and character here once at the start
function create() {
    console.log("Creating the relaxing world...");
    // Let's paint the whole screen a grassy green color for now
    this.cameras.main.setBackgroundColor('#78C850'); 
    
    // We can add some welcoming text
    this.add.text(20, 20, 'Our Relaxing Cat World is Starting!', { 
        fontSize: '24px', 
        fill: '#ffffff' 
    });
}

// Step 3: Update - This runs continuously (60 times a second) to handle movement
function update() {
    // We will add the cat's movement controls here soon
}
