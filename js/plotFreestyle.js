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
    
    // 根据当前辅助功能事件和主功能事件的关系处理主功能事件，涂鸦板要求关掉主功能事件
    funCanvas.removeEventListener('mousedown', funMouseDown);
    funCanvas.removeEventListener('mousemove', funMouseMove);
    funCanvas.removeEventListener('mouseup', funMouseUp);
    funCanvas.removeEventListener('mouseleave', funMouseLeave);
    funCanvas.removeEventListener('mousewheel', funMouseWheel);

    // 覆盖辅助功能面板
    $('#slavePanel').html('<br> Color: <input id="freestyleColor" type="color"/> <br><br> Line width: <select id="freestyleLinewidth"><option value = "1" selected = "selected" >1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option></select> <br><br> <button type="button" onclick="freestylePencil()">画笔</button> <br><br> <button type="button" onclick="freestyleEraser()">橡皮擦</button>');

    // 用画笔事件初始化当前辅助功能事件
    freestylePencil();
  } else {// 关闭涂鸦板辅助功能

    // 关掉画笔和橡皮擦事件
    funCanvas.removeEventListener('mousedown', fsPencilMouseDown);
    funCanvas.removeEventListener('mousemove', fsPencilMouseMove);
    funCanvas.removeEventListener('mouseup', fsPencilMouseUp);
    funCanvas.removeEventListener('mouseleave', fsPencilMouseLeave);

    funCanvas.removeEventListener('mousedown', fsEraserMouseDown);
    funCanvas.removeEventListener('mousemove', fsEraserMouseMove);
    funCanvas.removeEventListener('mouseup', fsEraserMouseUp);
    funCanvas.removeEventListener('mouseleave', fsEraserMouseLeave);

    // 清空辅助功能面板
    $('#slavePanel').html('');

    // 恢复主功能事件
    plotFunction();
  }
}

function freestylePencil() {
  // 关掉同级的橡皮擦事件
  funCanvas.removeEventListener('mousedown', fsEraserMouseDown);
  funCanvas.removeEventListener('mousemove', fsEraserMouseMove);
  funCanvas.removeEventListener('mouseup', fsEraserMouseUp);
  funCanvas.removeEventListener('mouseleave', fsEraserMouseLeave);

  var mousePressed = false;
  var lastX = 0, lastY = 0;
  
  // 添加画笔事件
  funCanvas.addEventListener('mousedown', fsPencilMouseDown = function (e) {
    mousePressed = true;
    lastX = e.pageX - $(this).offset().left;
    lastY = e.pageY - $(this).offset().top;
  });

  funCanvas.addEventListener('mousemove', fsPencilMouseMove = function (e) {
    if (mousePressed) {
      ctx.beginPath();
      ctx.strokeStyle = $('#freestyleColor').val();
      ctx.lineWidth = $('#freestyleLinewidth').val();
      ctx.lineJoin = "round";
      ctx.moveTo(lastX, lastY);
      ctx.lineTo(e.pageX - $(this).offset().left, e.pageY - $(this).offset().top);
      ctx.closePath();
      ctx.stroke();
      lastX = e.pageX - $(this).offset().left;
      lastY = e.pageY - $(this).offset().top;
    }
  });

  funCanvas.addEventListener('mouseup', fsPencilMouseUp = function (e) {
    mousePressed = false;
  });

  funCanvas.addEventListener('mouseleave', fsPencilMouseLeave = function (e) {
    mousePressed = false;
  });
}

function freestyleEraser() {
  // 关掉同级的画笔事件
  funCanvas.removeEventListener('mousedown', fsPencilMouseDown);
  funCanvas.removeEventListener('mousemove', fsPencilMouseMove);
  funCanvas.removeEventListener('mouseup', fsPencilMouseUp);
  funCanvas.removeEventListener('mouseleave', fsPencilMouseLeave);

  var mousePressed = false;

  // 添加橡皮擦事件
  funCanvas.addEventListener('mousedown', fsEraserMouseDown = function (e) {
    mousePressed = true;
    ctx.clearRect(e.pageX - $(this).offset().left - 10, e.pageY - $(this).offset().top - 10, 20, 20);
  });

  funCanvas.addEventListener('mousemove', fsEraserMouseMove = function (e) {
    if (mousePressed) {
      ctx.clearRect(e.pageX - $(this).offset().left - 10, e.pageY - $(this).offset().top - 10, 20, 20);
    }
  });

  funCanvas.addEventListener('mouseup', fsEraserMouseUp = function (e) {
    mousePressed = false;
  });

  funCanvas.addEventListener('mouseleave', fsEraserMouseLeave = function (e) {
    mousePressed = false;
  });
}

function clearArea() {
  // Use the identity matrix while clearing the canvas
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
} 