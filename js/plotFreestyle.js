function plotFreestyle() {
  var mousePressed = false;
  var lastX, lastY;
  var ctx;
  InitThis(mousePressed, lastX, lastY, ctx);
}

function InitThis(mousePressed, lastX, lastY, ctx) {
  ctx = document.getElementById('myCanvas').getContext("2d");

  $('#myCanvas').mousedown(function (e) {
    mousePressed = true;
    Draw(e.pageX - $(this).offset().left, e.pageY - $(this).offset().top, false, mousePressed, lastX, lastY, ctx);
  });

  $('#myCanvas').mousemove(function (e) {
    if (mousePressed) {
      Draw(e.pageX - $(this).offset().left, e.pageY - $(this).offset().top, true, mousePressed, lastX, lastY, ctx);
    }
  });

  $('#myCanvas').mouseup(function (e) {
    mousePressed = false;
  });
    $('#myCanvas').mouseleave(function (e) {
    mousePressed = false;
  });
}

function Draw(x, y, isDown, mousePressed, lastX, lastY, ctx) {
  if (isDown) {
    ctx.beginPath();
    ctx.strokeStyle = $('#selColor').val();
    ctx.lineWidth = $('#selWidth').val();
    ctx.lineJoin = "round";
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(x, y);
    ctx.closePath();
    ctx.stroke();
  }
  lastX = x; lastY = y;
}

function clearArea(mousePressed, lastX, lastY, ctx) {
  // Use the identity matrix while clearing the canvas
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
} 