function plotFreestyle() {
  useGrid = !useGrid;
  if (useFreestyle) {
    $('#myCanvas').unbind();
    document.getElementById('myCanvas').onmousedown = null;
    document.getElementById('myCanvas').onmousemove = null;
    document.getElementById('myCanvas').onmouseup = null;
    document.getElementById('myCanvas').onmouseleave = null;
    document.getElementById('myCanvas').onmousewheel = null;

    $('#slavePanel').html('<br> Color: <input id="freestyleColor" type="color"/> <br><br> Line width: <select id="freestyleLinewidth"><option value = "1" selected = "selected" >1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option></select> <br><br> <button type="button" onclick="freestylePencil()">画笔</button> <br><br> <button type="button" onclick="freestyleEraser()">橡皮擦</button>');
    freestylePencil();
  } else {
    $('#slavePanel').html('');
    plotFunction();
  }
}