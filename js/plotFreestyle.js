function plotFreestyle() {
  $('#menu').append("<input type='color'/>");

  var mousePressed = false;
  var lastX = 0, lastY = 0;

  $('#myCanvas').mousedown(function (e) {
    mousePressed = true;
    lastX = e.pageX - $(this).offset().left;
    lastY = e.pageY - $(this).offset().top;
  });

  $('#myCanvas').mousemove(function (e) {
    if (mousePressed) {
      Draw(lastX, lastY, e.pageX - $(this).offset().left, e.pageY - $(this).offset().top);
      lastX = e.pageX - $(this).offset().left;
      lastY = e.pageY - $(this).offset().top;
    }
  });

  $('#myCanvas').mouseup(function (e) {
    mousePressed = false;
  });

  $('#myCanvas').mouseleave(function (e) {
    mousePressed = false;
  });
}

function Draw(lastX, lastY, x, y) {
  ctx.beginPath();
  ctx.strokeStyle = $('#selColor').val();
  ctx.lineWidth = $('#selWidth').val();
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