function plotFreestyle() {
  useFreestyle = !useFreestyle;
  if (useFreestyle) {
    $('#funCanvas').unbind();
    document.getElementById('funCanvas').onmousedown = null;
    document.getElementById('funCanvas').onmousemove = null;
    document.getElementById('funCanvas').onmouseup = null;
    document.getElementById('funCanvas').onmouseleave = null;
    document.getElementById('funCanvas').onmousewheel = null;

    $('#slavePanel').html('<br> Color: <input id="freestyleColor" type="color"/> <br><br> Line width: <select id="freestyleLinewidth"><option value = "1" selected = "selected" >1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option></select> <br><br> <button type="button" onclick="freestylePencil()">画笔</button> <br><br> <button type="button" onclick="freestyleEraser()">橡皮擦</button>');
    freestylePencil();
  } else {
    $('#slavePanel').html('');
    plotFunction();
  }
}

function freestylePencil() {
  var mousePressed = false;
  var lastX = 0, lastY = 0;

  $('#funCanvas').unbind();

  $('#funCanvas').mousedown(function (e) {
    mousePressed = true;
    lastX = e.pageX - $(this).offset().left;
    lastY = e.pageY - $(this).offset().top;
  });

  $('#funCanvas').mousemove(function (e) {
    if (mousePressed) {
      pencilDraw(lastX, lastY, e.pageX - $(this).offset().left, e.pageY - $(this).offset().top);
      lastX = e.pageX - $(this).offset().left;
      lastY = e.pageY - $(this).offset().top;
    }
  });

  $('#funCanvas').mouseup(function (e) {
    mousePressed = false;
  });

  $('#funCanvas').mouseleave(function (e) {
    mousePressed = false;
  });
}

function pencilDraw(lastX, lastY, x, y) {
  ctx.beginPath();
  ctx.strokeStyle = $('#freestyleColor').val();
  ctx.lineWidth = $('#freestyleLinewidth').val();
  ctx.lineJoin = "round";
  ctx.moveTo(lastX, lastY);
  ctx.lineTo(x, y);
  ctx.closePath();
  ctx.stroke();
}

function freestyleEraser() {
  var mousePressed = false;
  var lastX = 0, lastY = 0;

  $('#funCanvas').unbind();

  $('#funCanvas').mousedown(function (e) {
    mousePressed = true;
    lastX = e.pageX - $(this).offset().left;
    lastY = e.pageY - $(this).offset().top;
  });

  $('#funCanvas').mousemove(function (e) {
    if (mousePressed) {
      eraserDraw(lastX, lastY, e.pageX - $(this).offset().left, e.pageY - $(this).offset().top);
      lastX = e.pageX - $(this).offset().left;
      lastY = e.pageY - $(this).offset().top;
    }
  });

  $('#funCanvas').mouseup(function (e) {
    mousePressed = false;
  });

  $('#funCanvas').mouseleave(function (e) {
    mousePressed = false;
  });
}

function eraserDraw(lastX, lastY, x, y) {
  ctx.beginPath();
  ctx.strokeStyle = "white";
  ctx.lineWidth = "9";
  ctx.lineJoin = "round";
  ctx.moveTo(lastX, lastY);
  ctx.lineTo(x, y);
  ctx.closePath();
  ctx.stroke();
}

function clearArea() {
  // Use the identity matrix while clearing the canvas
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
} 