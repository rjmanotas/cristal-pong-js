// Constantes para crear el Canvas
const canvas = document.querySelector("#canvas");
const context = canvas.getContext("2d");

// Constantes del juego ==================
const COM_LEVEL = 0.2;
const PADDLE_HEIGHT = 100;
const PADDLE_WIDTH = 20;
const BALL_START_SPEED = 0.5;
const BALL_DELTA_SPEED = 0.1;

// Objetos del juego ======================
const player = {
  x: 0,
  y: canvas.height / 2 - PADDLE_HEIGHT / 2,
  width: PADDLE_WIDTH,
  height: PADDLE_HEIGHT,
  color: "#12F007",
  score: 0,
};

const computer = {
  x: canvas.width - PADDLE_WIDTH,
  y: canvas.height / 2 - PADDLE_HEIGHT / 2,
  width: PADDLE_WIDTH,
  height: PADDLE_HEIGHT,
  color: "#F00000",
  score: 0,
};

const ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  radius: 10,
  speed: BALL_START_SPEED,
  velocityX: 5,
  velocityY: 5,
  color: "#F5C400",
};

const net = {
  x: canvas.width / 2 - 1,
  y: 0,
  width: 3,
  height: 10,
  color: "#6A05F5",
};

// Dibujar figuras y Funciones de texto ==============
function drawRect(x, y, w, h, color) {
  context.fillStyle = color;
  context.fillRect(x, y, w, h);
}
// drawRect(0, 0, canvas.width, canvas.height, "COLOR");

function drawCircle(x, y, r, color) {
  context.fillStyle = color;
  context.beginPath();
  context.arc(x, y, r, 0, Math.PI * 2, false);
  context.closePath();
  context.fill();
}
// drawCircle(100, 100, 50, "COLOR");

function drawText(text, x, y, color) {
  context.fillStyle = color;
  context.font = "45px fantasy";
  context.fillText(text, x, y);
}
// drawText("Text", 200, 300, "COLOR");

function drawNet() {
  for (let i = 0; i <= canvas.height; i += 15) {
    drawRect(net.x, net.y + i, net.width, net.height, net.color);
  }
}

// Canvas =================
function render() {
  // Dibujar Canvas
  drawRect(0, 0, canvas.width, canvas.height, "#E8F9FD");
  //Hacer canvas transparente
  //context.clearRect(0, 0, canvas.width, canvas.height);

  // Red
  drawNet();

  // Puntuación
  drawText(player.score, canvas.width / 4.5, canvas.height / 5, player.color);
  drawText(
    computer.score,
    (3 * canvas.width) / 4,
    canvas.height / 5,
    computer.color
  );

  // Jugador y máquina
  drawRect(player.x, player.y, player.width, player.height, player.color);
  drawRect(
    computer.x,
    computer.y,
    computer.width,
    computer.height,
    computer.color
  );

  // Pelota
  drawCircle(ball.x, ball.y, ball.radius, ball.color);
}

// Revisar colisiones
function collision(b, p) {
  b.top = b.y - b.radius;
  b.bottom = b.y + b.radius;
  b.left = b.x - b.radius;
  b.right = b.x + b.radius;

  p.top = p.y;
  p.bottom = p.y + p.height;
  p.left = p.x;
  p.right = p.x + p.width;

  return (
    b.right > p.left && b.bottom > p.top && b.left < p.right && b.top < p.bottom
  );
}

// Reiniciar la pelota
function resetBall() {
  ball.x = canvas.width / 2;
  ball.y = canvas.height / 2;
  ball.speed = BALL_START_SPEED;
  ball.velocityX = -ball.velocityX;
}

// Movimiento del jugador
canvas.addEventListener("mousemove", (e) => {
  if (paused) return;

  let rect = canvas.getBoundingClientRect();

  player.y = e.clientY - rect.top - player.height / 2;
});

function lerp(a, b, t) {
  return a + (b - a) * t; // t=0 (a) , t=1 (b)
}

// Actualizar : posición, movimiento, puntuación, .... ==========
let paused = false;
function update() {
  if (paused) return;

  // movimiento de la pelota
  ball.x += ball.velocityX * ball.speed;
  ball.y += ball.velocityY * ball.speed;

  // colisión de la pelota con los bordes superior e inferior
  if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
    ball.velocityY = -ball.velocityY;
  }

  // colisión de la pelota con los jugadores
  // ¿cuál jugador?
  let selectedPlayer = ball.x < canvas.width / 2 ? player : computer;
  if (collision(ball, selectedPlayer)) {
    ball.velocityX = -ball.velocityX;

    // La pelota incrementa la velocidad cada vez que golpea una paleta
    ball.speed += BALL_DELTA_SPEED;
  }

  // Movimiento del jugador "máquina"
  let targetPos = ball.y - computer.height / 2;
  let currentPos = computer.y;
  computer.y = lerp(currentPos, targetPos, COM_LEVEL);

  // Actualizar puntuación
  if (ball.x - ball.radius < 0) {
    // incrementar puntuación de la máquina
    computer.score++;
    resetBall();
  } else if (ball.x + ball.radius > canvas.width) {
    // incrementar puntuación del jugador
    player.score++;
    resetBall();
  }
}

// Inicialización del juego =====================
function game() {
  update();
  render();
}

// loop
const FPS = 60;
setInterval(game, 1000 / FPS);

const pauseBtn = document.querySelector("#pause");
pauseBtn.addEventListener("click", () => {
  if (pauseBtn.innerHTML === "Continuar") {
    pauseBtn.innerHTML = "Pausar";
    paused = false;
  } else {
    pauseBtn.innerHTML = "Continuar";
    paused = true;
  }
});


const restart = document.getElementById('restart');
restart.addEventListener('click', _ => {
            location.reload();
})
