function plotFreestyle() {
  useFreestyle = !useFreestyle;
  if (useFreestyle) {// 打开涂鸦板辅助功能
    // 关掉已打开的辅助功能事件
    if (useGeometric) {
      plotGeometric();
    }
    if (useText) {
      plotText();
    }

    // 创建涂鸦板画布,覆盖函数画布
    var node = document.createElement("CANVAS");
    node.id = "fsCanvas";
    node.height = 500;
    node.width = 500;
    node.style.border = "2px solid #6699cc";
    node.style.position = "absolute";
    canvasDiv.appendChild(node);
    $("#fsCanvas").offset({top:$("#gridCanvas").offset().top,left:$("#gridCanvas").offset().left});


    // 覆盖辅助功能面板
    $('#slavePanel').html('<br> Color: <input id="freestyleColor" type="color"/> <br><br> Line width: <select id="freestyleLinewidth"><option value = "1" selected = "selected" >1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option></select> <br><br> <button type="button" onclick="freestylePencil()">画笔</button> <br><br> <button type="button" onclick="freestyleEraser()">橡皮擦</button> <br><br> <button type="button" onclick="clearArea()" style="color:red">清屏!</button>');

    // 用画笔事件初始化当前辅助功能事件
    freestylePencil();
  } else {// 关闭涂鸦板辅助功能
    const fsCanvas = document.getElementById('fsCanvas');

    // 关掉画笔和橡皮擦事件
    if (typeof(fsPencilMouseDown) != "undefined") {
      fsCanvas.removeEventListener('mousedown', fsPencilMouseDown);
      fsCanvas.removeEventListener('mousemove', fsPencilMouseMove);
      fsCanvas.removeEventListener('mouseup', fsPencilMouseUp);
      fsCanvas.removeEventListener('mouseleave', fsPencilMouseLeave);
    }

    if (typeof(fsEraserMouseDown) != "undefined") {
      fsCanvas.removeEventListener('mousedown', fsEraserMouseDown);
      fsCanvas.removeEventListener('mousemove', fsEraserMouseMove);
      fsCanvas.removeEventListener('mouseup', fsEraserMouseUp);
      fsCanvas.removeEventListener('mouseleave', fsEraserMouseLeave);
    }

    // 清空辅助功能面板
    $('#slavePanel').html('');

    // 删除涂鸦板画布
    var node = document.getElementById('fsCanvas');
    canvasDiv.removeChild(node);
  }
}

function freestylePencil() {
  const fsCanvas = document.getElementById('fsCanvas');
  const ctxFs = fsCanvas.getContext("2d");
  
  // 关掉同级的橡皮擦事件
  if (typeof(fsEraserMouseDown) != "undefined") {
    fsCanvas.removeEventListener('mousedown', fsEraserMouseDown);
    fsCanvas.removeEventListener('mousemove', fsEraserMouseMove);
    fsCanvas.removeEventListener('mouseup', fsEraserMouseUp);
    fsCanvas.removeEventListener('mouseleave', fsEraserMouseLeave);
  }

  var mousePressed = false;
  var lastX = 0, lastY = 0;
  
  // 添加画笔事件
  fsCanvas.addEventListener('mousedown', fsPencilMouseDown = function (e) {
    mousePressed = true;
    lastX = e.pageX - $(this).offset().left;
    lastY = e.pageY - $(this).offset().top;
  });

  fsCanvas.addEventListener('mousemove', fsPencilMouseMove = function (e) {
    if (mousePressed) {
      ctxFs.beginPath();
      ctxFs.strokeStyle = $('#freestyleColor').val();
      ctxFs.lineWidth = $('#freestyleLinewidth').val();
      ctxFs.lineJoin = "round";
      ctxFs.moveTo(lastX, lastY);
      ctxFs.lineTo(e.pageX - $(this).offset().left, e.pageY - $(this).offset().top);
      ctxFs.closePath();
      ctxFs.stroke();
      lastX = e.pageX - $(this).offset().left;
      lastY = e.pageY - $(this).offset().top;
    }
  });

  fsCanvas.addEventListener('mouseup', fsPencilMouseUp = function (e) {
    mousePressed = false;
  });

  fsCanvas.addEventListener('mouseleave', fsPencilMouseLeave = function (e) {
    mousePressed = false;
  });
}

function freestyleEraser() {
  const fsCanvas = document.getElementById('fsCanvas');
  const ctxFs = fsCanvas.getContext("2d");

  // 关掉同级的画笔事件
  if (typeof(fsPencilMouseDown) != "undefined") {
    fsCanvas.removeEventListener('mousedown', fsPencilMouseDown);
    fsCanvas.removeEventListener('mousemove', fsPencilMouseMove);
    fsCanvas.removeEventListener('mouseup', fsPencilMouseUp);
    fsCanvas.removeEventListener('mouseleave', fsPencilMouseLeave);
  }

  var mousePressed = false;

  // 添加橡皮擦事件
  fsCanvas.addEventListener('mousedown', fsEraserMouseDown = function (e) {
    mousePressed = true;
    ctxFs.clearRect(e.pageX - $(this).offset().left - 10, e.pageY - $(this).offset().top - 10, 20, 20);
  });

  fsCanvas.addEventListener('mousemove', fsEraserMouseMove = function (e) {
    if (mousePressed) {
      ctxFs.clearRect(e.pageX - $(this).offset().left - 10, e.pageY - $(this).offset().top - 10, 20, 20);
    }
  });

  fsCanvas.addEventListener('mouseup', fsEraserMouseUp = function (e) {
    mousePressed = false;
  });

  fsCanvas.addEventListener('mouseleave', fsEraserMouseLeave = function (e) {
    mousePressed = false;
  });
}

function clearArea() {
  const fsCanvas = document.getElementById('fsCanvas');
  const ctxFs = fsCanvas.getContext("2d");
  
  // Use the identity matrix while clearing the canvas
  ctxFs.setTransform(1, 0, 0, 1, 0, 0);
  ctxFs.clearRect(0, 0, ctxFs.canvas.width, ctxFs.canvas.height);
} 