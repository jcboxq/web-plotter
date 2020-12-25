function plotGrid() {
  useGrid = !useGrid;
  if (useGrid) {//显示网格
  
    //添加网格事件
    funCanvas.addEventListener('mousemove', gridMouseMove = function (ob) {
      if (funStage == 1) {
        reDrawGrid();
      }
    });
  
    funCanvas.addEventListener('mouseleave', gridMouseLeave = function (ob) {
      if (funStage == 1) {
        funStage = 0;
        reDrawGrid();
      }
    });
  
    funCanvas.addEventListener('mousewheel', gridMouseWheel = function (ob) {
      reDrawGrid();
    });

    // 初始化
    drawGrid();
  } else {//隐藏网格
    clearGrid();

    // 关掉网格事件
    if (typeof(gridMouseMove) != "undefined") {
      funCanvas.removeEventListener('mousemove', gridMouseMove);
      funCanvas.removeEventListener('mouseleave', gridMouseLeave);
      funCanvas.removeEventListener('mousewheel', gridMouseWheel);
    }
  }
}

function reDrawGrid() {
  ctxGrid.clearRect(0, 0, funImgWidth, funImgHeight);
  getGrid();
}

function drawGrid() {
  funXLeftValue = parseFloat(document.getElementById("funXLeftValue").value);
  funXRightValue = parseFloat(document.getElementById("funXRightValue").value);
  funYLeftValue = parseFloat(document.getElementById("funYLeftValue").value);
  funYRightValue = parseFloat(document.getElementById("funYRightValue").value);
  reDrawGrid();
}

function getGrid() {
  var tableX, tableY, countX, countY;
  var tmp = (funXRightValue - funXLeftValue + funEPS) / 20;

  tableX = 1;
  countX = 0;
  countY = 0;
  while(tableX < tmp) {
    tableX *= 10;
  }
  while(tableX / 10 > tmp) {
    tableX /= 10;
    countX++;
  }
  if(tableX >= 1) {
    countX = 0;
  }
  if(tableX / 5 > tmp) {
    tableX /= 5;
    countX++;
  } else if(tableX / 2 > tmp) {
    tableX /= 2;
    countX++;
  }
  var i = parseInt(funXLeftValue / tableX) + (funXLeftValue > 0)
  for (; i * tableX < funXRightValue; i++) {
    tmp = (i * tableX - funXLeftValue) / (funXRightValue - funXLeftValue) * funImgWidth;
    if(i == 0) {
      // y轴
      ctxGrid.fillStyle = "black";
      drawArrow(ctxGrid, tmp, funImgHeight, tmp,0,30,15,1,'black');
    } else {
      // 普通竖线
      ctxGrid.fillStyle = "#CDB7B5";
    }
    var _width = 1;
    var _height = funImgHeight;
    ctxGrid.fillRect(tmp, 0, _width, _height);
    // 竖线上的数字
    ctxGrid.fillStyle = "blue";
    ctxGrid.font = "10px 黑体";
    var _text = (i * tableX).toFixed(countX);
    var _x = tmp + 2;
    var _y = 10;
    ctxGrid.fillText(_text, _x, _y);
  }
  tmp = (funYRightValue - funYLeftValue + funEPS) / 20;
  tableY = 1;

  while(tableY < tmp) {
    tableY *= 10;
  }
  while(tableY / 10 > tmp) {
    tableY /= 10, countY++;
  }
  if(tableY / 5 > tmp) {
    tableY /= 5, countY++;
  } else if(tableY / 2 > tmp) {
    tableY /= 2, countY++;
  }
  if(tableY >= 1) {
    countY = 0;
  }
  var i = parseInt(funYLeftValue / tableY) + (funYLeftValue > 0);
  for (; i * tableY < funYRightValue; i++) {
    tmp = (i * tableY - funYLeftValue) / (funYRightValue - funYLeftValue) * funImgHeight;
    // 横线
    if(i == 0) {
      // x轴
      ctxGrid.fillStyle = "black";
      drawArrow(ctxGrid, 0, funImgHeight - 1 - tmp, funImgWidth, funImgHeight - 1 - tmp,30,15,1,'black');
    } else {
      // 普通横线
      ctxGrid.fillStyle = "#CDB7B5";
    }
    ctxGrid.fillRect(0, funImgHeight - 1 - tmp, funImgWidth, 1);
    // 横线上的数字
    ctxGrid.fillStyle = "blue";
    ctxGrid.font = "10px 黑体";
    ctxGrid.fillText((i * tableY).toFixed(countY), 0, funImgHeight - 1 - tmp);
  }
}

function clearGrid() {
  ctxGrid.clearRect(0, 0, funImgWidth, funImgHeight);
}

function resetGrid() {
  reDrawGrid();
}

function drawArrow(ctx, fromX, fromY, toX, toY,theta,headlen,width,color) {
  theta = typeof(theta) != 'undefined' ? theta : 30;
  headlen = typeof(theta) != 'undefined' ? headlen : 10;
  width = typeof(width) != 'undefined' ? width : 1;
  color = typeof(color) != 'color' ? color : '#000';

  // 计算各角度和对应的P2,P3坐标
  var angle = Math.atan2(fromY - toY, fromX - toX) * 180 / Math.PI,
      angle1 = (angle + theta) * Math.PI / 180,
      angle2 = (angle - theta) * Math.PI / 180,
      topX = headlen * Math.cos(angle1),
      topY = headlen * Math.sin(angle1),
      botX = headlen * Math.cos(angle2),
      botY = headlen * Math.sin(angle2);

  ctx.save();
  ctx.beginPath();

  var arrowX = fromX - topX,
      arrowY = fromY - topY;

  ctx.moveTo(arrowX, arrowY);
  ctx.moveTo(fromX, fromY);
  ctx.lineTo(toX, toY);
  arrowX = toX + topX;
  arrowY = toY + topY;
  ctx.moveTo(arrowX, arrowY);
  ctx.lineTo(toX, toY);
  arrowX = toX + botX;
  arrowY = toY + botY;
  ctx.lineTo(arrowX, arrowY);
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.stroke();
  ctx.restore();
}