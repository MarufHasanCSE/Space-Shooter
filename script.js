const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');

let score = 0;
const player = { x: 200, y: 500, w: 30, h: 30, speed: 5 };
const bullets = [];
const enemies = [];
const keys = {};

window.addEventListener('keydown', e => keys[e.code] = true);
window.addEventListener('keyup', e => keys[e.code] = false);

function spawnEnemy() {
    enemies.push({
        x: Math.random() * (canvas.width - 30),
        y: -30,
        w: 30,
        h: 30,
        speed: 2 + Math.random() * 2
    });
}

function update() {
    if (keys['ArrowLeft'] && player.x > 0) player.x -= player.speed;
    if (keys['ArrowRight'] && player.x < canvas.width - player.w) player.x += player.speed;
    if (keys['ArrowUp'] && player.y > 0) player.y -= player.speed;
    if (keys['ArrowDown'] && player.y < canvas.height - player.h) player.y += player.speed;
    
    if (keys['Space']) {
        if (bullets.length === 0 || bullets[bullets.length - 1].y < player.y - 20) {
            bullets.push({ x: player.x + player.w / 2 - 2, y: player.y, w: 4, h: 10 });
        }
    }

    bullets.forEach((b, bi) => {
        b.y -= 7;
        if (b.y < 0) bullets.splice(bi, 1);
    });

    enemies.forEach((e, ei) => {
        e.y += e.speed;
        
        if (e.y > canvas.height) {
            enemies.splice(ei, 1);
        }

        if (player.x < e.x + e.w && player.x + player.w > e.x && player.y < e.y + e.h && player.y + player.h > e.y) {
            alert("Game Over! Score: " + score);
            location.reload();
        }

        bullets.forEach((b, bi) => {
            if (b.x < e.x + e.w && b.x + b.w > e.x && b.y < e.y + e.h && b.y + b.h > e.y) {
                enemies.splice(ei, 1);
                bullets.splice(bi, 1);
                score += 10;
                scoreEl.textContent = score;
            }
        });
    });
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(player.x, player.y, player.w, player.h);

    ctx.fillStyle = '#fb7185';
    bullets.forEach(b => ctx.fillRect(b.x, b.y, b.w, b.h));

    ctx.fillStyle = '#facc15';
    enemies.forEach(e => ctx.fillRect(e.x, e.y, e.w, e.h));

    update();
    requestAnimationFrame(draw);
}

setInterval(spawnEnemy, 1000);
draw();