const grid = document.querySelector(".grid");
const scoreDisplay = document.querySelector("#score");
const blockWidth = 100;
const blockHeight = 20;
const ballDiameter = 20;
const boardWidth = 560;
const boardHeight = 300;
let xDirection = 4;
let yDirection = 4;

const userStart = [230, 10];
let currentPosition = userStart;

const ballStart = [270, 40];
let ballCurrentPosition = ballStart;

let timerID;
let score = 0;

//Play Button
function play() {
  cancelAnimationFrame(game.requestID);
  resetBall();
  Animate();
}

//Reset Button
function reset() {
  rounds = 0;
  userScore = 0;
  userScoreButton.innerHTML = "0";
}

//Create Block
class Block {
  constructor(xAxis, yAxis) {
    this.bottomLeft = [xAxis, yAxis];
    this.bottomRight = [xAxis + blockWidth, yAxis];
    this.topLeft = [xAxis, yAxis + blockHeight];
    this.topRight = [xAxis + blockWidth, yAxis + blockHeight];
  }
}

//All my Blocks
const blocks = [
  new Block(10, 270),
  new Block(120, 270),
  new Block(230, 270),
  new Block(340, 270),
  new Block(450, 270),
  new Block(10, 240),
  new Block(120, 240),
  new Block(230, 240),
  new Block(340, 240),
  new Block(450, 240),
  new Block(10, 210),
  new Block(120, 210),
  new Block(230, 210),
  new Block(340, 210),
  new Block(450, 210),
];

//Draw my block
function addBlocks() {
  for (let i = 0; i < blocks.length; i++) {
    const block = document.createElement("div");
    block.classList.add("block");
    block.style.left = blocks[i].bottomLeft[0] + "px";
    block.style.bottom = blocks[i].bottomLeft[1] + "px";
    grid.appendChild(block);
    console.log(blocks[i].bottomLeft);
  }
}

addBlocks();

//Add User - User Section Starts Here
const user = document.createElement("div");
user.classList.add("user");
grid.appendChild(user);
drawUser();

//Draw the User
function drawUser() {
  user.style.left = currentPosition[0] + "px";
  user.style.bottom = currentPosition[1] + "px";
}

//Move User - Key inputs Left and Right
function moveUser(e) {
  switch (e.key) {
    case "ArrowLeft":
      if (currentPosition[0] > 0) {
        currentPosition[0] -= 10;
        console.log(currentPosition[0] > 0);
        drawUser();
      }
      break;
    case "ArrowRight":
      if (currentPosition[0] < boardWidth - blockWidth) {
        currentPosition[0] += 10;
        console.log(currentPosition[0]);
        drawUser();
      }
      break;
  }
}

document.addEventListener("keydown", moveUser);

// User Section Ends Here

//Add Ball - Ball Section Starts Here
const ball = document.createElement("div");
ball.classList.add("ball");
grid.appendChild(ball);
drawBall();

//Draw Ball
function drawBall() {
  ball.style.left = ballCurrentPosition[0] + "px";
  ball.style.bottom = ballCurrentPosition[1] + "px";
}

//Move the ball
function moveBall() {
  ballCurrentPosition[0] += xDirection;
  ballCurrentPosition[1] += yDirection;
  drawBall();
  checkForCollisions();
}

timerID = setInterval(moveBall, 30);

//Ball Section Ends Here

//Check for Collisions Section
function checkForCollisions() {
  //Check for Block Collision
  for (let i = 0; i < blocks.length; i++) {
    if (
      ballCurrentPosition[0] > blocks[i].bottomLeft[0] &&
      ballCurrentPosition[0] < blocks[i].bottomRight[0] &&
      ballCurrentPosition[1] + ballDiameter > blocks[i].bottomLeft[1] &&
      ballCurrentPosition[1] < blocks[i].topLeft[1]
    ) {
      const allBlocks = Array.from(document.querySelectorAll(".block"));
      allBlocks[i].classList.remove("block");
      blocks.splice(i, 1);
      changeDirection();
      score++;
      scoreDisplay.innerHTML = score;
      if (blocks.length == 0) {
        scoreDisplay.innerHTML = "You Win!";
        clearInterval(timerID);
        document.removeEventListener("keydown", moveUser);
      }
    }
  }

  // Check for Wall Hits
  if (
    ballCurrentPosition[0] >= boardWidth - ballDiameter ||
    ballCurrentPosition[0] <= 0 ||
    ballCurrentPosition[1] >= boardHeight - ballDiameter
  ) {
    changeDirection();
  }

  //Check for User Collision
  if (
    ballCurrentPosition[0] > currentPosition[0] &&
    ballCurrentPosition[0] < currentPosition[0] + blockWidth &&
    ballCurrentPosition[1] > currentPosition[1] &&
    ballCurrentPosition[1] < currentPosition[1] + blockHeight
  ) {
    changeDirection();
  }

  //Game over
  if (ballCurrentPosition[1] <= 0) {
    clearInterval(timerID);
    scoreDisplay.innerHTML = "You lose!";
    document.removeEventListener("keydown", moveUser);
  }
}

//Ball Change Direction & Size
function changeDirection() {
  if (xDirection === 4 && yDirection === 4) {
    yDirection = -4;
    return;
  }
  if (xDirection === 4 && yDirection === -4) {
    xDirection = -4;
    return;
  }
  if (xDirection === -4 && yDirection === -4) {
    yDirection = 4;
    return;
  }
  if (xDirection === -4 && yDirection === 4) {
    xDirection = 4;
    return;
  }
}

const resetButton = document.querySelector(".resetButton");

const refreshPage = () => {
  location.reload();
};

resetButton.addEventListener("click", refreshPage);
