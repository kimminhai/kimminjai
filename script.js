const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 1200; // 맵 크기
canvas.height = 800;

// 플레이어 클래스
class Player {
  constructor() {
    this.width = 30; // 플레이어 크기 조정
    this.height = 30; // 플레이어 크기 조정
    this.x = canvas.width / 2 - this.width / 2;
    this.y = canvas.height / 2 - this.height / 2;
    this.speed = 5;
    this.autoShoot = false;
    this.shootTimer = 0;
    this.autoShootDuration = 0;
    this.tripleShot = false;
    this.tripleShotDuration = 0;
  }

  draw() {
    ctx.fillStyle = 'white';
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  update() {
    if (keys['ArrowLeft'] && this.x > 0) {
      this.x -= this.speed;
    }
    if (keys['ArrowRight'] && this.x < canvas.width - this.width) {
      this.x += this.speed;
    }
    if (keys['ArrowUp'] && this.y > 0) {
      this.y -= this.speed;
    }
    if (keys['ArrowDown'] && this.y < canvas.height - this.height) {
      this.y += this.speed;
    }

    if (this.autoShoot) {
      this.shootTimer++;
      if (this.shootTimer > 5) { // Auto-shoot interval (increased speed)
        this.shoot();
        this.shootTimer = 0;
      }
      this.autoShootDuration++;
      if (this.autoShootDuration > 300) { // Auto-shoot duration (5 seconds)
        this.autoShoot = false;
        this.autoShootDuration = 0;
      }
    }

    if (this.tripleShot) {
      this.tripleShotDuration++;
      if (this.tripleShotDuration > 300) { // Triple-shot duration (5 seconds)
        this.tripleShot = false;
        this.tripleShotDuration = 0;
      }
    }
  }

  shoot() {
    const closestEnemy = this.findClosestEnemy();
    if (this.tripleShot) {
      projectiles.push(new Projectile(this.x + this.width / 2, this.y, -1, closestEnemy));
      projectiles.push(new Projectile(this.x + this.width / 2, this.y, 0, closestEnemy));
      projectiles.push(new Projectile(this.x + this.width / 2, this.y, 1, closestEnemy));
    } else {
      projectiles.push(new Projectile(this.x + this.width / 2, this.y, 0, closestEnemy));
    }
  }

  findClosestEnemy() {
    let closestEnemy = null;
    let minDistance = Infinity;

    enemies.forEach(enemy => {
      const dx = enemy.x + enemy.width / 2 - this.x - this.width / 2;
      const dy = enemy.y + enemy.height / 2 - this.y - this.height / 2;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < minDistance) {
        minDistance = distance;
        closestEnemy = enemy;
      }
    });

    return closestEnemy;
  }
}

// 총알 클래스
class Projectile {
  constructor(x, y, direction, targetEnemy) {
    this.x = x;
    this.y = y;
    this.radius = 5;
    this.speed = 7;
    this.direction = direction;
    this.targetEnemy = targetEnemy;

    if (targetEnemy) {
      const dx = targetEnemy.x + targetEnemy.width / 2 - x;
      const dy = targetEnemy.y + targetEnemy.height / 2 - y;
      const magnitude = Math.sqrt(dx * dx + dy * dy);
      this.dx = (dx / magnitude) * this.speed;
      this.dy = (dy / magnitude) * this.speed;
    } else {
      this.dx = 0;
      this.dy = -this.speed;
    }
  }

  draw() {
    ctx.fillStyle = 'red';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
  }

  update() {
    this.x += this.dx;
    this.y += this.dy;
  }
}

// 적 클래스
class Enemy {
  constructor() {
    this.width = 50;
    this.height = 50;
    this.x = Math.random() * (canvas.width - this.width);
    this.y = Math.random() * (canvas.height - this.height);
    this.speed = 1;
    this.shootTimer = 0;
  }

  draw() {
    ctx.fillStyle = 'purple';
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  update() {
    const dx = player.x - this.x;
    const dy = player.y - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    this.x += (dx / distance) * this.speed;
    this.y += (dy / distance) * this.speed;

    this.shootTimer++;
    if (this.shootTimer > 20) { // Enemy shoot interval (increased speed)
      enemyProjectiles.push(new EnemyProjectile(this.x, this.y, dx, dy));
      this.shootTimer = 0;
    }
  }
}

// 적 총알 클래스
class EnemyProjectile {
  constructor(x, y, dx, dy) {
    this.x = x;
    this.y = y;
    this.radius = 5;
    this.speed = 5;
    this.dx = dx;
    this.dy = dy;
    const magnitude = Math.sqrt(dx * dx + dy * dy);
    this.dx /= magnitude; // 방향 정규화
    this.dy /= magnitude;
  }

  draw() {
    ctx.fillStyle = 'yellow';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
  }

  update() {
    this.x += this.dx * this.speed;
    this.y += this.dy * this.speed;
  }
}

// 보스 클래스
class Boss {
  constructor() {
    this.width = 100;
    this.height = 100;
    this.x = Math.random() * (canvas.width - this.width);
    this.y = Math.random() * (canvas.height - this.height);
    this.speedX = 2;
    this.speedY = 2;
    this.hitPoints = 10;
  }

  draw() {
    ctx.fillStyle = 'red';
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;

    if (this.x + this.width > canvas.width || this.x < 0) {
      this.speedX = -this.speedX;
    }
    if (this.y + this.height > canvas.height || this.y < 0) {
      this.speedY = -this.speedY;
    }
  }
}

// 타겟 클래스
class Target {
  constructor() {
    this.width = 50;
    this.height = 50;
    this.x = Math.random() * (canvas.width - this.width);
    this.y = 0;
    this.speed = 3;
  }

  draw() {
    ctx.fillStyle = 'green';
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  update() {
    this.y += this.speed;
  }
}

// 아이템 클래스
class Item {
  constructor(type) {
    this.width = 30;
    this.height = 30;
    this.x = Math.random() * (canvas.width - this.width);
    this.y = 0;
    this.speed = 2;
    this.type = type; // 0 for auto shoot, 1 for triple shot
  }

  draw() {
    ctx.fillStyle = this.type === 0 ? 'blue' : 'orange';
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  update() {
    this.y += this.speed;
  }
}

const player = new Player();
const projectiles = [];
const enemyProjectiles = [];
const targets = [];
const enemies = [];
const items = [];
const keys = {};
let score = 0;
let boss;
let enemyKillCount = 0;

function spawnTarget() {
  targets.push(new Target());
}

function spawnEnemy() {
  enemies.push(new Enemy());
}

function spawnItem() {
  items.push(new Item(Math.random() > 0.5 ? 0 : 1)); // Randomly spawn auto shoot or triple shot item
}

function spawnBoss() {
  boss = new Boss();
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  player.draw();
  player.update();

  projectiles.forEach((projectile, index) => {
    projectile.draw();
    projectile.update();

    enemies.forEach((enemy, eIndex) => {
      if (
        projectile.x > enemy.x &&
        projectile.x < enemy.x + enemy.width &&
        projectile.y > enemy.y &&
        projectile.y < enemy.y + enemy.height
      ) {
        score++;
        enemyKillCount++;
        projectiles.splice(index, 1);
        enemies.splice(eIndex, 1);

        if (enemyKillCount === 5) {
          spawnBoss();
        }
      }
    });

    if (boss) {
      if (
        projectile.x > boss.x &&
        projectile.x < boss.x + boss.width &&
        projectile.y > boss.y &&
        projectile.y < boss.y + boss.height
      ) {
        boss.hitPoints--;
        projectiles.splice(index, 1);

        if (boss.hitPoints === 0) {
          score += 10; // Extra score for killing boss
          boss = null;
        }
      }
    }

    targets.forEach((target, tIndex) => {
      if (
        projectile.x > target.x &&
        projectile.x < target.x + target.width &&
        projectile.y > target.y &&
        projectile.y < target.y + target.height
      ) {
        score++;
        projectiles.splice(index, 1);
        targets.splice(tIndex, 1);
      }
    });

    if (projectile.y + projectile.radius < 0) {
      projectiles.splice(index, 1);
    }
  });

  targets.forEach((target, index) => {
    target.draw();
    target.update();

    if (target.y + target.height > canvas.height) {
      targets.splice(index, 1);
    }
  });

  enemies.forEach((enemy, index) => {
    enemy.draw();
    enemy.update();

    if (enemy.y + enemy.height > canvas.height) {
      enemies.splice(index, 1);
    }
  });

  enemyProjectiles.forEach((enemyProjectile, index) => {
    enemyProjectile.draw();
    enemyProjectile.update();

    if (enemyProjectile.y - enemyProjectile.radius > canvas.height ||
      enemyProjectile.x < 0 ||
      enemyProjectile.x > canvas.width) {
      enemyProjectiles.splice(index, 1);
    }

    // Check collision with player
    if (
      enemyProjectile.x > player.x &&
      enemyProjectile.x < player.x + player.width &&
      enemyProjectile.y > player.y &&
      enemyProjectile.y < player.y + player.height
    ) {
      alert("Game Over");
      document.location.reload();
    }
  });

  items.forEach((item, index) => {
    item.draw();
    item.update();

    // Check collision with player
    if (
      item.x < player.x + player.width &&
      item.x + item.width > player.x &&
      item.y < player.y + player.height &&
      item.y + item.height > player.y
    ) {
      if (item.type === 0) {
        player.autoShoot = true;
        player.autoShootDuration = 0;
      } else {
        player.tripleShot = true;
        player.tripleShotDuration = 0;
      }
      items.splice(index, 1);
    }

    if (item.y + item.height > canvas.height) {
      items.splice(index, 1);
    }
  });

  if (boss) {
    boss.draw();
    boss.update();
  }

  requestAnimationFrame(animate);
}

animate();
setInterval(spawnTarget, 2000);
setInterval(spawnEnemy, 2000); // Shorter spawn interval for enemies
setInterval(spawnItem, 10000);

window.addEventListener('keydown', (e) => {
  keys[e.key] = true;
});

window.addEventListener('keyup', (e) => {
  keys[e.key] = false;
});

window.addEventListener('keydown', (e) => {
  if (e.key === 'z') {
    player.shoot();
  }
});
