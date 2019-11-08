/**
 * 参数
 */
// canvas
let canvas, context, myCanvas;
// 动画
let animationInterval, time, position, dx;
// 线
let lineObj;
// 点
let cx, cy;
// 暂停or结束
let isGameOver;

/**
 * 初始化
 */
function init() {
  // canvas
  canvas = document.getElementById("canvasAnimation");
  context = canvas.getContext("2d");
  myCanvas = {
    width: canvas.width,
    height: canvas.height
  };
  // 动画
  dx = 5;
  time = 50;
  position = "right";
  // 线
  lineObj = {
    startX: 50,
    startY: 200,
    endX: 0,
    endY: 200,
    lineLength: 50,
    lineWidth: 5,
    pointList: []
  };
  // 点
  cx = Math.floor(Math.random() * (myCanvas.width - 100));
  cy = Math.floor(Math.random() * (myCanvas.height - 100));

  isGameOver = false;
}

/**
 * 画动画
 */
function drawAnimation() {
  fillCanvas();
  drawLine();
  drawC(cx, cy);
  isSnakeEatFood();
  isSnakeBumpIntoItself();
}

/**
 * 画画布
 */
function fillCanvas() {
  context.fillStyle = "#3385ff";
  context.fillRect(0, 0, myCanvas.width, myCanvas.height);
}

/**
 * 画线
 */
function drawLine() {
  context.beginPath();
  context.lineWidth = lineObj.lineWidth;
  context.strokeStyle = "#fff";
  context.lineCap = "round";
  context.lineJoin = "round";
  // 起点
  context.moveTo(lineObj.startX, lineObj.startY);
  // 拐点
  if (lineObj.pointList.length !== 0) {
    for (let n = lineObj.pointList.length - 1; n >= 0; n--) {
      context.lineTo(lineObj.pointList[n].x, lineObj.pointList[n].y);
    }
  }
  // 终点
  let lastPot = lineObj.pointList[0];
  if (lastPot) {
    if (lineObj.endX === lastPot.x && lineObj.endY === lastPot.y) {
      lineObj.pointList.shift();
    } else if (lineObj.endX === lastPot.x) {
      lineObj.endY += lineObj.endY > lastPot.y ? -dx : dx;
    } else if (lineObj.endY === lastPot.y) {
      lineObj.endX += lineObj.endX > lastPot.x ? -dx : dx;
    }
  } else {
    if (lineObj.endX === lineObj.startX) {
      lineObj.endY =
        lineObj.endY > lineObj.startY
          ? lineObj.startY + lineObj.lineLength
          : lineObj.startY - lineObj.lineLength;
    } else if (lineObj.endY === lineObj.startY) {
      lineObj.endX =
        lineObj.endX > lineObj.startX
          ? lineObj.startX + lineObj.lineLength
          : lineObj.startX - lineObj.lineLength;
    }
  }
  context.lineTo(lineObj.endX, lineObj.endY);
  context.stroke();
  context.closePath();
  // 👉
  if (position == "right") {
    if (lineObj.startX >= myCanvas.width) {
      isGameOver = true;
      stopGame();
    } else {
      lineObj.startX += dx;
    }
  }
  // 👈
  else if (position == "left") {
    if (lineObj.startX <= 0) {
      isGameOver = true;
      stopGame();
    } else {
      lineObj.startX -= dx;
    }
  }
  // 👆
  else if (position == "up") {
    if (lineObj.startY <= 0) {
      isGameOver = true;
      stopGame();
    } else {
      lineObj.startY -= dx;
    }
  }
  // 👇
  else if (position == "down") {
    if (lineObj.startY >= myCanvas.height) {
      isGameOver = true;
      stopGame();
    } else {
      lineObj.startY += dx;
    }
  }
}

/**
 * 画点
 */
function drawC(cx, cy) {
  context.beginPath();
  context.fillStyle = "#000";
  context.arc(cx, cy, 5, 0, Math.PI * 2, true);
  context.fill();
  context.closePath();
}

/**
 * 判断是否吃到点
 */
function isSnakeEatFood() {
  let dValueX = Math.abs(cx - lineObj.startX);
  let dValueY = Math.abs(cy - lineObj.startY);
  if (dValueX <= 5 && dValueY <= 5) {
    if (time !== 10) {
      time -= 5;
    }
    lineObj.lineLength += 25;
    cx = Math.floor(Math.random() * (myCanvas.width - 100));
    cy = Math.floor(Math.random() * (myCanvas.height - 100));
  }
}

/**
 * 判断是否撞到本身
 */
function isSnakeBumpIntoItself() {
  if (lineObj.pointList.length !== 0) {
    let verticalList = [];
    let horizontalList = [];
    let end = {
      x: lineObj.endX,
      y: lineObj.endY
    };
    for (let n = 0; n < lineObj.pointList.length; n++) {
      if (end.x == lineObj.pointList[n].x) {
        y2 = verticalList.push({
          x: end.x,
          y: [end.y, lineObj.pointList[n].y]
        });
      } else {
        horizontalList.push({
          y: end.y,
          x: [end.x, lineObj.pointList[n].x]
        });
      }
      end = lineObj.pointList[n];
    }
    if (position == "left" || position == "right") {
      verticalList.forEach(i => {
        if (
          lineObj.startX === i.x &&
          lineObj.startY < Math.max(...i.y) &&
          lineObj.startY > Math.min(...i.y)
        ) {
          isGameOver = true;
          stopGame();
        }
      });
    } else {
      horizontalList.forEach(i => {
        if (
          lineObj.startY === i.y &&
          lineObj.startX < Math.max(...i.x) &&
          lineObj.startX > Math.min(...i.x)
        ) {
          isGameOver = true;
          stopGame();
        }
      });
    }
  }
}

/**
 * 结束或暂停游戏
 */
function stopGame() {
  clearInterval(animationInterval);
  animationInterval = "";
  document.getElementById("startGame").innerHTML = "开始游戏";
  if (isGameOver) {
    alert("Game Over!");
    init();
  }
}

/**
 * 开始游戏
 */
function startGame() {
  animationInterval = setInterval(drawAnimation, time);
  document.getElementById("startGame").innerHTML = "暂停";
}

/**
 * 循环
 */
document.getElementById("startGame").addEventListener("click", function() {
  if (animationInterval) {
    stopGame();
  } else {
    startGame();
    document.addEventListener("keydown", function(e) {
      let oldPosition = position;
      let keyCodeList = [37, 38, 39, 40];
      // 👈
      if (e.keyCode == 37) {
        if (oldPosition == "right" || oldPosition == "left") {
          return;
        }
        position = "left";
      }
      // 👆
      else if (e.keyCode == 38) {
        if (oldPosition == "down" || oldPosition == "up") {
          return;
        }
        position = "up";
      }
      // 👉
      else if (e.keyCode == 39) {
        if (oldPosition == "left" || oldPosition == "right") {
          return;
        }
        position = "right";
      }
      // 👇
      else if (e.keyCode == 40) {
        if (oldPosition == "up" || oldPosition == "down") {
          return;
        }
        position = "down";
      }
      if (keyCodeList.indexOf(e.keyCode) !== -1) {
        lineObj.pointList.push({
          x: lineObj.startX,
          y: lineObj.startY
        });
      }
    });
  }
});

window.onload = function() {
  init();
  fillCanvas();
};
