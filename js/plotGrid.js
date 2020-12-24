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
  for(; i * tableX < funXRightValue; i++) {
    if(i == 0) {
      // y轴
      ctxGrid.fillStyle = "black";
    } else {
      // 普通竖线
      ctxGrid.fillStyle = "#CDB7B5";
    }
    tmp = (i * tableX - funXLeftValue) / (funXRightValue - funXLeftValue) * funImgWidth;
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
  for(; i * tableY < funYRightValue; i++) {
    // 横线
    if(i == 0) {
      // x轴
      ctxGrid.fillStyle = "black";
    } else {
      // 普通横线
      ctxGrid.fillStyle = "#CDB7B5";
    }
    tmp = (i * tableY - funYLeftValue) / (funYRightValue - funYLeftValue) * funImgHeight;
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