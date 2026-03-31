const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

/* ================= PLAYER ================= */

let player = JSON.parse(localStorage.getItem("save")) || {
  x: 400,
  y: 300,
  size: 30,
  hp: 100,
  maxHp: 100,
  gold: 0,
  level: 1,
  atk: 10
};

const keys = {};

/* ================= MONSTERS ================= */

let monsters = [];

function spawnMonster() {
  monsters.push({
    x: Math.random()*2000,
    y: Math.random()*2000,
    size: 25,
    hp: 30
  });
}

setInterval(spawnMonster, 3000);

/* ================= INPUT ================= */

document.addEventListener("keydown", e=>{
  keys[e.key.toLowerCase()] = true;

  if(e.key === " ") attack();
  if(e.key.toLowerCase() === "e") toggleShop();
});

document.addEventListener("keyup", e=>{
  keys[e.key.toLowerCase()] = false;
});

/* ================= MOVEMENT ================= */

function movePlayer() {
  if(keys["w"]) player.y -= 3;
  if(keys["s"]) player.y += 3;
  if(keys["a"]) player.x -= 3;
  if(keys["d"]) player.x += 3;
}

/* ================= COMBAT ================= */

function attack(){
  monsters.forEach((m,i)=>{
    const dx = player.x - m.x;
    const dy = player.y - m.y;
    const dist = Math.sqrt(dx*dx+dy*dy);

    if(dist < 60){
      m.hp -= player.atk;

      if(m.hp <= 0){
        player.gold += 10;
        monsters.splice(i,1);
      }
    }
  });
}

/* ================= MONSTER AI ================= */

function updateMonsters(){
  monsters.forEach(m=>{
    const dx = player.x - m.x;
    const dy = player.y - m.y;
    const dist = Math.sqrt(dx*dx+dy*dy);

    if(dist < 300){
      m.x += dx/dist;
      m.y += dy/dist;
    }

    if(dist < 30){
      player.hp -= 0.1;
    }
  });
}

/* ================= SHOP ================= */

const shop = document.getElementById("shop");

function toggleShop(){
  shop.style.display =
    shop.style.display === "none" ? "block" : "none";
}

function buySword(){
  if(player.gold >= 50){
    player.gold -= 50;
    player.atk += 5;
  }
}

function buyPotion(){
  if(player.gold >= 20){
    player.gold -= 20;
    player.hp = Math.min(player.maxHp, player.hp+30);
  }
}

/* ================= SAVE ================= */

setInterval(()=>{
  localStorage.setItem("save", JSON.stringify(player));
},5000);

/* ================= DRAW ================= */

function drawPlayer(){
  ctx.fillStyle="lime";
  ctx.fillRect(
    canvas.width/2,
    canvas.height/2,
    player.size,
    player.size
  );
}

function drawMonsters(){
  ctx.fillStyle="red";

  monsters.forEach(m=>{
    ctx.fillRect(
      m.x-player.x+canvas.width/2,
      m.y-player.y+canvas.height/2,
      m.size,
      m.size
    );
  });
}

/* ================= UI ================= */

function updateUI(){
  hp.textContent = Math.floor(player.hp);
  gold.textContent = player.gold;
  level.textContent = player.level;
}

/* ================= GAME LOOP ================= */

function gameLoop(){

  ctx.clearRect(0,0,canvas.width,canvas.height);

  movePlayer();
  updateMonsters();

  drawMonsters();
  drawPlayer();
  updateUI();

  requestAnimationFrame(gameLoop);
}

gameLoop();
