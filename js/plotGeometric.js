function plotGeometric() {
  useGeometric = !useGeometric;
  if (useGeometric) {// 打开插图辅助功能
    // 关掉已打开的辅助功能事件
    if (useFreestyle) {
      plotFreestyle();
    }
    if (useText) {
      plotText();
    }

    // 关掉主功能事件和网格功能事件
    funCanvas.removeEventListener('mousedown', funMouseDown);
    funCanvas.removeEventListener('mousemove', funMouseMove);
    funCanvas.removeEventListener('mouseup', funMouseUp);
    funCanvas.removeEventListener('mouseleave', funMouseLeave);
    funCanvas.removeEventListener('mousewheel', funMouseWheel);

    funCanvas.removeEventListener('mousemove', gridMouseMove);
    funCanvas.removeEventListener('mouseleave', gridMouseLeave);
    funCanvas.removeEventListener('mousewheel', gridMouseWheel);

    // 覆盖辅助功能面板
    $('#slavePanel').html('<br> <button onclick="addGeom()">插入图形</button> <br><br> <input id="geomColor" type="color"/> <select id="geomType"><option value = "直线" selected = "selected" >直线</option> <option value="矩形">矩形</option> <option value="圆">圆</option> </select>');

    // 打开修改插图功能
    changeGeom();

  } else {// 关闭图形插入辅助功能
    // 关掉图形插入事件
    if (typeof(geomMouseDown) != "undefined") {
      funCanvas.removeEventListener('mousedown', geomMouseDown);
      funCanvas.removeEventListener('mousemove', geomMouseMove);
      funCanvas.removeEventListener('mouseup', geomMouseUp);
      funCanvas.removeEventListener('mouseleave', geomMouseLeave);
    }

    // 关掉修改插图事件
    funCanvas.removeEventListener('mousedown', chgeomMouseDown);
    funCanvas.removeEventListener('mousemove', chgeomMouseMove);
    funCanvas.removeEventListener('mouseup', chgeomMouseUp);
    funCanvas.removeEventListener('mouseleave', chgeomMouseLeave);

    // 清空辅助功能面板
    $('#slavePanel').html('');

    // 恢复主功能事件和网格功能事件
    plotFunction();
    useGrid = false;
    plotGrid();
  }
}

function hitLine(x1, y1, x2, y2, x, y) {
  if (x > Math.min(x1,x2) && x < Math.max(x1,x2) && y > Math.min(y1,y2) && y < Math.max(y1,y2)) {
    var d = Math.abs((y2 - y1) * x + (x1 - x2) * y + (x2 * y1 - x1 * y2)) / Math.sqrt((y2 - y1) ^ 2 + (x1 - x2) ^ 2);
    if (d <= 3) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
}

function hitRect(x1, y1, x2, y2, x, y) {
  if (x > Math.min(x1,x2) && x < Math.max(x1,x2) && y > Math.min(y1,y2) && y < Math.max(y1,y2)) {
    return true;
  } else {
    return false;
  }
}

function hitCircle(x1, y1, x2, y2, x, y) {
  var r = Math.abs(x2 - x1) / 2;
  var x0 = (x1 + x2) / 2;
  var y0 = (y1 + y2) / 2;
  if ((x - x0) ^ 2 + (y - y0) ^ 2 < r ^ 2) {
    return true;
  } else {
    return false;
  }
}

function hitControl(x0, y0, r, x, y) {
  if ((x - x0) ^ 2 + (y - y0) ^ 2 <= r ^ 2) {
    return true;
  } else {
    return false;
  }
}

function findHitControl() {
  var x0 = (geomArray[i][4] - funXLeftValue) / (funXRightValue - funXLeftValue) * funImgWidth;
  var y0 = (geomArray[i][5] - funYLeftValue) / (funYRightValue - funYLeftValue) * funImgHeight;
  for (var i = geomArray.length - 1; i >= 0; i--){
    if (hitControl(x0, y0, 5, mouseX, mouseY)) {
      return i;
    }
  }
  return -1;
}

function findHitBody() {
  var x1 = (geomArray[i][2] - funXLeftValue) / (funXRightValue - funXLeftValue) * funImgWidth;
  var y1 = (geomArray[i][3] - funYLeftValue) / (funYRightValue - funYLeftValue) * funImgHeight;
  var x2 = (geomArray[i][4] - funXLeftValue) / (funXRightValue - funXLeftValue) * funImgWidth;
  var y2 = (geomArray[i][5] - funYLeftValue) / (funYRightValue - funYLeftValue) * funImgHeight;
  for (var i = geomArray.length - 1; i >= 0; i--){
    switch (geomArray[i][1]) {
      case "直线": {
        if (hitLine(x1, y1, x2, y2, mouseX, mouseY)) {
          return i;
        }
        break;
      }
      case "矩形": {
        if (hitRect(x1, y1, x2, y2, mouseX, mouseY)) {
          return i;
        }
        break;
      }
      case "圆": {
        if (hitCircle(x1, y1, x2, y2, mouseX, mouseY)) {
          return i;
        }
        break;
      }
      default: {
        break;
      }
    }
  }
  return -1;
}

function changeGeom() {
  // 添加修改插图事件
  funCanvas.addEventListener('mousedown', chgeomMouseDown = function (ob) {
    mouseX = ob.offsetX + 1;
    mouseY = ob.offsetY + 1;
    funStage = 1;
  });

  funCanvas.addEventListener('mousemove', chgeomMouseMove = function (ob) {
    if (funStage == 1) {
      var NoX, NoY, detx, dety;
      NoX = ob.offsetX + 1;
      NoY = ob.offsetY + 1;

      detx = NoX - mouseX;
      dety = NoY - mouseY;

      var indexControl = findHitControl(); //被选中控制点的图形的序号
      var indexBody = findHitBody(); //被选中主体的图形的序号

      if (indexControl != -1) {// 拖动控制点，更新选中状态，绘制控制画布，修改图形大小,并将新的图形属性更新到图形数组
        selectedIndex = indexControl;

        var x1 = (geomArray[indexControl][2] - funXLeftValue) / (funXRightValue - funXLeftValue) * funImgWidth;
        var y1 = (geomArray[indexControl][3] - funYLeftValue) / (funYRightValue - funYLeftValue) * funImgHeight;
        var x2 = (geomArray[indexControl][4] - funXLeftValue) / (funXRightValue - funXLeftValue) * funImgWidth;
        var y2 = (geomArray[indexControl][5] - funYLeftValue) / (funYRightValue - funYLeftValue) * funImgHeight;

        redrawCtrl(x2+detx, y2+dety, 5);

        const geomCanvas = document.getElementsByName('geomCanvas');
        const ctx = geomCanvas[indexControl].getContext("2d");
        redrawGeom(ctx, geomArray[indexControl][0], geomArray[indexControl][1], x1, y1, x2 + detx, y2 + dety);
        
        geomArray[indexControl][4] += detx;//改成绝对
        geomArray[indexControl][5] += dety;
      } else {
        if (indexBody != -1) {// 拖动主体，更新选中状态，绘制控制画布，移动图形，并将新的图形属性更新到图形数组
          selectedIndex = indexBody;

          redrawCtrl(geomArray[indexBody][4]+detx, geomArray[indexBody][5]+dety, 5);
  
          const geomCanvas = document.getElementsByName('geomCanvas');
          const ctx = geomCanvas[indexBody].getContext("2d");
          redrawGeom(ctx, geomArray[indexBody][0], geomArray[indexBody][1], geomArray[indexBody][2] + detx, geomArray[indexBody][3] + dety, geomArray[indexBody][4] + detx, geomArray[indexBody][5] + dety);
          
          geomArray[indexBody][2] += detx;
          geomArray[indexBody][3] += dety;
          geomArray[indexBody][4] += detx;
          geomArray[indexBody][5] += dety;
        }
      }
    }
  });

  funCanvas.addEventListener('mouseup', chgeomMouseUp = function (ob) {
    if (funStage == 1) {
      funStage = 0;

      var indexControl = findHitControl(); //被选中控制点的图形的序号
      var indexBody = findHitBody(); //被选中主体的图形的序号

      if (indexControl != -1) {// 点击控制点，更新选中状态，绘制控制画布
        selectedIndex = indexControl;
        redrawCtrl(geomArray[indexControl][4], geomArray[indexControl][5], 5);
      } else {
        if (indexBody != -1) {// 点击主体，更新选中状态，绘制控制画布
          selectedIndex = indexBody;
          redrawCtrl(geomArray[indexBody][4], geomArray[indexBody][5], 5);
        } else {// 点击空白，清空选中状态，清空控制画布
          selectedIndex = -1;
          ctxCtrl.clearRect(0, 0, funImgWidth, funImgHeight);
        }
      }
    }
  });

  funCanvas.addEventListener('mouseleave', chgeomMouseLeave = function (ob) {
    if (funStage == 1) {
      funStage = 0;

      var indexControl = findHitControl(); //被选中控制点的图形的序号
      var indexBody = findHitBody(); //被选中主体的图形的序号

      if (indexControl != -1) {// 点击控制点，更新选中状态，绘制控制画布
        selectedIndex = indexControl;
        redrawCtrl(geomArray[indexControl][4], geomArray[indexControl][5], 5);
      } else {
        if (indexBody != -1) {// 点击主体，更新选中状态，绘制控制画布
          selectedIndex = indexBody;
          redrawCtrl(geomArray[indexBody][4], geomArray[indexBody][5], 5);
        } else {// 点击空白，清空选中状态，清空控制画布
          selectedIndex = -1;
          ctxCtrl.clearRect(0, 0, funImgWidth, funImgHeight);
        }
      }
    }
  });
}

function addGeom() {
  // 关掉修改插图事件
  funCanvas.removeEventListener('mousedown', chgeomMouseDown);
  funCanvas.removeEventListener('mousemove', chgeomMouseMove);
  funCanvas.removeEventListener('mouseup', chgeomMouseUp);
  funCanvas.removeEventListener('mouseleave', chgeomMouseLeave);

  // 添加图形插入事件
  funCanvas.addEventListener('mousedown', geomMouseDown = function (ob) {
    mouseX = ob.offsetX + 1;
    mouseY = ob.offsetY + 1;
    funStage = 1;
  });

  funCanvas.addEventListener('mousemove', geomMouseMove = function (ob) {
    if (funStage == 1) {
      if (noGeomCanvas) {// 本次图形插入仍未创建画布
        // 创建画布并添加到函数画布之下
        var node = document.createElement("CANVAS");
        node.setAttribute("name","geomCanvas");
        node.height = 500;
        node.width = 500;
        node.style.border = "2px solid #6699cc";
        node.style.position = "absolute";
        canvasDiv.insertBefore(node, funCanvas);
        $("[name = geomCanvas]").offset({ top: canvasTop, left: canvasLeft });
        noGeomCanvas = false;
      }
      const geomCanvas = document.getElementsByName('geomCanvas');
      const ctx = geomCanvas[geomArray.length].getContext("2d");

      var NoX, NoY;
      NoX = ob.offsetX + 1;
      NoY = ob.offsetY + 1;

      redrawGeom(ctx, $('#geomColor').val(), $('#geomType').val(), mouseX / funImgWidth * (funXRightValue - funXLeftValue) + funXLeftValue, mouseY / funImgHeight * (funYRightValue - funYLeftValue) + funYLeftValue, NoX / funImgWidth * (funXRightValue - funXLeftValue) + funXLeftValue, NoY / funImgHeight * (funYRightValue - funYLeftValue) + funYLeftValue);
      // mouseX = NoX;
      // mouseY = NoY;
    }
  });

  funCanvas.addEventListener('mouseup', geomMouseUp = function (ob) {
    if (funStage == 1) {
      funStage = 0;
      if (!noGeomCanvas) {
        var NoX, NoY;
        NoX = ob.offsetX + 1;
        NoY = ob.offsetY + 1;

        var geomAttrib = new Array(6);
        geomAttrib[0] = $('#geomColor').val();
        geomAttrib[1] = $('#geomType').val();
        geomAttrib[2] = mouseX / funImgWidth * (funXRightValue - funXLeftValue) + funXLeftValue;
        geomAttrib[3] = mouseY / funImgHeight * (funYRightValue - funYLeftValue) + funYLeftValue;
        geomAttrib[4] = NoX / funImgWidth * (funXRightValue - funXLeftValue) + funXLeftValue;
        geomAttrib[5] = NoY / funImgHeight * (funYRightValue - funYLeftValue) + funYLeftValue;
        geomArray.push(geomAttrib);

        funCanvas.removeEventListener('mousedown', geomMouseDown);
        funCanvas.removeEventListener('mousemove', geomMouseMove);
        funCanvas.removeEventListener('mouseup', geomMouseUp);
        funCanvas.removeEventListener('mouseleave', geomMouseLeave);

        changeGeom();

        noGeomCanvas = true;
      }
    }
  });

  funCanvas.addEventListener('mouseleave', geomMouseLeave = function (ob) {
    if (funStage == 1) {
      funStage = 0;
      if (!noGeomCanvas) {
        var NoX, NoY;
        NoX = ob.offsetX + 1;
        NoY = ob.offsetY + 1;

        var geomAttrib = new Array(6);
        geomAttrib[0] = $('#geomColor').val();
        geomAttrib[1] = $('#geomType').val();
        geomAttrib[2] = mouseX / funImgWidth * (funXRightValue - funXLeftValue) + funXLeftValue;
        geomAttrib[3] = mouseY / funImgHeight * (funYRightValue - funYLeftValue) + funYLeftValue;
        geomAttrib[4] = NoX / funImgWidth * (funXRightValue - funXLeftValue) + funXLeftValue;
        geomAttrib[5] = NoY / funImgHeight * (funYRightValue - funYLeftValue) + funYLeftValue;
        geomArray.push(geomAttrib);

        funCanvas.removeEventListener('mousedown', geomMouseDown);
        funCanvas.removeEventListener('mousemove', geomMouseMove);
        funCanvas.removeEventListener('mouseup', geomMouseUp);
        funCanvas.removeEventListener('mouseleave', geomMouseLeave);

        changeGeom();

        noGeomCanvas = true;
      }
    }
  });
}

function redrawGeom(ctx, color, type, x1, y1, x2, y2) {// 根据像素坐标绘制图形
  ctx.clearRect(0, 0, funImgWidth, funImgHeight);
  switch (type) {
    case "直线":
      {
        ctx.strokeStyle = color;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.closePath();
        ctx.stroke();
      }
    default:
      {
        break;
      }
  }
}

function redrawCtrl(x, y, pr) {
  ctxCtrl.clearRect(0, 0, funImgWidth, funImgHeight);
  ctxCtrl.beginPath();
  ctxCtrl.arc(px, py, pr, 0, 2 * Math.PI);
  ctxCtrl.strokeStyle = "blue";
  ctxCtrl.stroke()
}