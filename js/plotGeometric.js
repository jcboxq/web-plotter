function plotGeometric() {
  useGeometric = !useGeometric;
  if (useGeometric) {// 打开插图辅助功能
    // 关掉已打开的辅助功能事件
    if (useFreestyle) {
      // plotFreestyle();
      // $("#fsSwitch").click();
      document.getElementById("fsSwitch").click();
    }
    if (useText) {
      // plotText();
      // $("#textSwitch").click();
      document.getElementById("textSwitch").click();
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

    // 关掉图形随画布移动事件
    if (typeof (mvgeomMouseMove) != "undefined") {
      funCanvas.removeEventListener('mousemove', mvgeomMouseMove);
      funCanvas.removeEventListener('mouseleave', mvgeomMouseLeave);
      funCanvas.removeEventListener('mousewheel', mvgeomMouseWheel);
    }

    // 关掉文字随画布移动事件
    if (typeof(mvtextMouseMove) != "undefined") {
      funCanvas.removeEventListener('mousemove', mvtextMouseMove);
      funCanvas.removeEventListener('mouseleave', mvtextMouseLeave);
      funCanvas.removeEventListener('mousewheel', mvtextMouseWheel);
    }

    // 覆盖辅助功能面板
    $('#slavePanel').html('<br> <input id="geomColor" type="color"/> <select id="geomType"><option value = "直线" selected = "selected" >直线</option> <option value="向量">向量</option> <option value="矩形">矩形</option> <option value="圆">圆</option> </select> <br><br> <button onclick="addGeom()">插入图形</button> <br><br> 拖动图形修改位置<br>拖动蓝圈修改大小 <br><br> 选中图形后按 Delete<br>键可以删除图形');

    // 打开修改插图功能
    changeGeom();

  } else {// 关闭图形插入辅助功能
    // 关掉图形插入事件
    if (typeof(geomMouseDown) != "undefined") {
      funCanvas.removeEventListener('mousedown', geomMouseDown);
      funCanvas.removeEventListener('mousemove', geomMouseMove);
      funCanvas.removeEventListener('mouseup', geomMouseUp);
      funCanvas.removeEventListener('mouseleave', geomMouseLeave);

      geomEventAdded = false;
    }

    // 清空选中状态，清空控制画布
    selectedIndex = -1;
    ctxCtrl.clearRect(0, 0, funImgWidth, funImgHeight);

    // 关掉修改插图事件
    funCanvas.removeEventListener('mousedown', chgeomMouseDown);
    funCanvas.removeEventListener('mousemove', chgeomMouseMove);
    funCanvas.removeEventListener('mouseup', chgeomMouseUp);
    funCanvas.removeEventListener('mouseleave', chgeomMouseLeave);
    document.removeEventListener('keyup', chgeomDelete);

    // 清空辅助功能面板
    $('#slavePanel').html('');

    // 恢复主功能事件和网格功能事件
    plotFunction();
    if (useGrid) {
      useGrid = false;
      plotGrid();
    }

    // 恢复文字随画布移动事件
    movingText();

    // 恢复图形随画布移动事件
    movingGeom();
  }
}

function hitLine(x1, y1, x2, y2, x, y) {
  var d = Math.abs((y2 - y1) * x + (x1 - x2) * y + (x2 * y1 - x1 * y2)) / Math.sqrt(Math.pow(y2 - y1, 2) + Math.pow(x1 - x2, 2));
  if (((x > Math.min(x1,x2) && x < Math.max(x1,x2)) || (y > Math.min(y1,y2) && y < Math.max(y1,y2))) && d <= 3) {
    return true;
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
  var x0, y0;
  var r = Math.min(Math.abs(x1 - x2), Math.abs(y1 - y2)) / 2;
  if (x1 <= x2) {
    x0 = x1 + r;
    if (y1 <= y2) {
      y0 = y1 + r;
    } else {
      y0 = y1 - r;
    }
  } else {
    x0 = x1 - r;
    if (y1 <= y2) {
      y0 = y1 + r;
    } else {
      y0 = y1 - r;
    }
  }
  if (Math.pow(x - x0, 2) + Math.pow(y - y0, 2) < Math.pow(r, 2)) {
    return true;
  } else {
    return false;
  }
}

function hitControl(x0, y0, r, x, y) {
  if (Math.pow(x - x0, 2) + Math.pow(y - y0, 2) <= Math.pow(r, 2)) {
    return true;
  } else {
    return false;
  }
}

function findHitControl() {
  var x0, y0;
  for (var i = geomArray.length - 1; i >= 0; i--){
    x0 = (geomArray[i][4] - funXLeftValue) / (funXRightValue - funXLeftValue) * funImgWidth;
    y0 = (funYRightValue - geomArray[i][5]) / (funYRightValue - funYLeftValue) * funImgHeight;
    if (hitControl(x0, y0, 5, mouseX, mouseY)) {
      return i;
    }
  }
  return -1;
}

function findHitBody() {
  var x1, y1, x2, y2;
  for (var i = geomArray.length - 1; i >= 0; i--){
    x1 = (geomArray[i][2] - funXLeftValue) / (funXRightValue - funXLeftValue) * funImgWidth;
    y1 = (funYRightValue - geomArray[i][3]) / (funYRightValue - funYLeftValue) * funImgHeight;
    x2 = (geomArray[i][4] - funXLeftValue) / (funXRightValue - funXLeftValue) * funImgWidth;
    y2 = (funYRightValue - geomArray[i][5]) / (funYRightValue - funYLeftValue) * funImgHeight;
    switch (geomArray[i][1]) {
      case "直线": {
        if (hitLine(x1, y1, x2, y2, mouseX, mouseY)) {
          return i;
        }
        break;
      }
      case "向量": {
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

      if (indexControl != -1) {// 拖动控制点，更新选中状态，绘制控制画布，修改图形大小
        selectedIndex = indexControl;

        var x1 = (geomArray[indexControl][2] - funXLeftValue) / (funXRightValue - funXLeftValue) * funImgWidth;
        var y1 = (funYRightValue - geomArray[indexControl][3]) / (funYRightValue - funYLeftValue) * funImgHeight;
        var x2 = (geomArray[indexControl][4] - funXLeftValue) / (funXRightValue - funXLeftValue) * funImgWidth;
        var y2 = (funYRightValue - geomArray[indexControl][5]) / (funYRightValue - funYLeftValue) * funImgHeight;

        redrawCtrl(geomArray[indexControl][1], x1, y1, x2 + detx, y2 + dety, 5);

        const geomCanvas = document.getElementsByName('geomCanvas');
        const ctx = geomCanvas[indexControl].getContext("2d");
        redrawGeom(ctx, geomArray[indexControl][0], geomArray[indexControl][1], x1, y1, x2 + detx, y2 + dety);
      } else {
        if (indexBody != -1) {// 拖动主体，更新选中状态，绘制控制画布，移动图形
          selectedIndex = indexBody;

          var x1 = (geomArray[indexBody][2] - funXLeftValue) / (funXRightValue - funXLeftValue) * funImgWidth;
          var y1 = (funYRightValue - geomArray[indexBody][3]) / (funYRightValue - funYLeftValue) * funImgHeight;
          var x2 = (geomArray[indexBody][4] - funXLeftValue) / (funXRightValue - funXLeftValue) * funImgWidth;
          var y2 = (funYRightValue - geomArray[indexBody][5]) / (funYRightValue - funYLeftValue) * funImgHeight;

          redrawCtrl(geomArray[indexBody][1], x1 + detx, y1 + dety, x2 + detx, y2 + dety, 5);
  
          const geomCanvas = document.getElementsByName('geomCanvas');
          const ctx = geomCanvas[indexBody].getContext("2d");
          redrawGeom(ctx, geomArray[indexBody][0], geomArray[indexBody][1], x1 + detx, y1 + dety, x2 + detx, y2 + dety);
        }
      }
    }
  });

  funCanvas.addEventListener('mouseup', chgeomMouseUp = function (ob) {
    if (funStage == 1) {
      funStage = 0;

      var NoX, NoY, detx, dety;
      NoX = ob.offsetX + 1;
      NoY = ob.offsetY + 1;
      detx = NoX - mouseX;
      dety = NoY - mouseY;

      var indexControl = findHitControl(); //被选中控制点的图形的序号
      var indexBody = findHitBody(); //被选中主体的图形的序号

      if (indexControl != -1) {// 点击控制点，更新选中状态，将新的图形属性更新到图形数组，更新控制画布
        selectedIndex = indexControl;

        geomArray[indexControl][4] += detx / funImgWidth * (funXRightValue - funXLeftValue);
        geomArray[indexControl][5] -= dety / funImgHeight * (funYRightValue - funYLeftValue);

        var x1 = (geomArray[indexControl][2] - funXLeftValue) / (funXRightValue - funXLeftValue) * funImgWidth;
        var y1 = (funYRightValue - geomArray[indexControl][3]) / (funYRightValue - funYLeftValue) * funImgHeight;
        var x2 = (geomArray[indexControl][4] - funXLeftValue) / (funXRightValue - funXLeftValue) * funImgWidth;
        var y2 = (funYRightValue - geomArray[indexControl][5]) / (funYRightValue - funYLeftValue) * funImgHeight;
        redrawCtrl(geomArray[indexControl][1], x1, y1, x2, y2, 5);
      } else {
        if (indexBody != -1) {// 点击主体，更新选中状态，将新的图形属性更新到图形数组，更新控制画布
          selectedIndex = indexBody;

          geomArray[indexBody][2] += detx / funImgWidth * (funXRightValue - funXLeftValue);
          geomArray[indexBody][3] -= dety / funImgHeight * (funYRightValue - funYLeftValue);
          geomArray[indexBody][4] += detx / funImgWidth * (funXRightValue - funXLeftValue);
          geomArray[indexBody][5] -= dety / funImgHeight * (funYRightValue - funYLeftValue);

          var x1 = (geomArray[indexBody][2] - funXLeftValue) / (funXRightValue - funXLeftValue) * funImgWidth;
          var y1 = (funYRightValue - geomArray[indexBody][3]) / (funYRightValue - funYLeftValue) * funImgHeight;
          var x2 = (geomArray[indexBody][4] - funXLeftValue) / (funXRightValue - funXLeftValue) * funImgWidth;
          var y2 = (funYRightValue - geomArray[indexBody][5]) / (funYRightValue - funYLeftValue) * funImgHeight;

          redrawCtrl(geomArray[indexBody][1], x1, y1, x2, y2, 5);
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

      var NoX, NoY, detx, dety;
      NoX = ob.offsetX + 1;
      NoY = ob.offsetY + 1;
      detx = NoX - mouseX;
      dety = NoY - mouseY;

      var indexControl = findHitControl(); //被选中控制点的图形的序号
      var indexBody = findHitBody(); //被选中主体的图形的序号

      if (indexControl != -1) {// 点击控制点，更新选中状态，将新的图形属性更新到图形数组，更新控制画布
        selectedIndex = indexControl;

        geomArray[indexControl][4] += detx / funImgWidth * (funXRightValue - funXLeftValue);
        geomArray[indexControl][5] -= dety / funImgHeight * (funYRightValue - funYLeftValue);

        var x1 = (geomArray[indexControl][2] - funXLeftValue) / (funXRightValue - funXLeftValue) * funImgWidth;
        var y1 = (funYRightValue - geomArray[indexControl][3]) / (funYRightValue - funYLeftValue) * funImgHeight;
        var x2 = (geomArray[indexControl][4] - funXLeftValue) / (funXRightValue - funXLeftValue) * funImgWidth;
        var y2 = (funYRightValue - geomArray[indexControl][5]) / (funYRightValue - funYLeftValue) * funImgHeight;
        redrawCtrl(geomArray[indexControl][1], x1, y1, x2, y2, 5);
      } else {
        if (indexBody != -1) {// 点击主体，更新选中状态，将新的图形属性更新到图形数组，更新控制画布
          selectedIndex = indexBody;

          geomArray[indexBody][2] += detx / funImgWidth * (funXRightValue - funXLeftValue);
          geomArray[indexBody][3] -= dety / funImgHeight * (funYRightValue - funYLeftValue);
          geomArray[indexBody][4] += detx / funImgWidth * (funXRightValue - funXLeftValue);
          geomArray[indexBody][5] -= dety / funImgHeight * (funYRightValue - funYLeftValue);

          var x1 = (geomArray[indexBody][2] - funXLeftValue) / (funXRightValue - funXLeftValue) * funImgWidth;
          var y1 = (funYRightValue - geomArray[indexBody][3]) / (funYRightValue - funYLeftValue) * funImgHeight;
          var x2 = (geomArray[indexBody][4] - funXLeftValue) / (funXRightValue - funXLeftValue) * funImgWidth;
          var y2 = (funYRightValue - geomArray[indexBody][5]) / (funYRightValue - funYLeftValue) * funImgHeight;

          redrawCtrl(geomArray[indexBody][1], x1, y1, x2, y2, 5);
        } else {// 点击空白，清空选中状态，清空控制画布
          selectedIndex = -1;
          ctxCtrl.clearRect(0, 0, funImgWidth, funImgHeight);
        }
      }
    }
  });

  document.addEventListener('keyup', chgeomDelete = function (ob) {
    if (selectedIndex != -1 && ob.keyCode == 46) {
      var geomCanvas = document.getElementsByName('geomCanvas');
      var node = geomCanvas[selectedIndex];
      canvasDiv.removeChild(node);

      geomArray.splice(selectedIndex, 1);
      
      selectedIndex = -1;
      ctxCtrl.clearRect(0, 0, funImgWidth, funImgHeight);
    }
  });
}

function addGeom() {
  if (!geomEventAdded) {
    // 关掉修改插图事件
    funCanvas.removeEventListener('mousedown', chgeomMouseDown);
    funCanvas.removeEventListener('mousemove', chgeomMouseMove);
    funCanvas.removeEventListener('mouseup', chgeomMouseUp);
    funCanvas.removeEventListener('mouseleave', chgeomMouseLeave);
    document.removeEventListener('keyup', chgeomDelete);

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
          node.setAttribute("name", "geomCanvas");
          node.height = 500;
          node.width = 500;
          node.style.border = "2px solid #6699cc";
          node.style.position = "absolute";
          canvasDiv.insertBefore(node, funCanvas);
          $("[name = geomCanvas]").offset({ top: $("#gridCanvas").offset().top, left: $("#gridCanvas").offset().left });
          noGeomCanvas = false;
        }
        const geomCanvas = document.getElementsByName('geomCanvas');
        const ctx = geomCanvas[geomArray.length].getContext("2d");

        var NoX, NoY;
        NoX = ob.offsetX + 1;
        NoY = ob.offsetY + 1;

        redrawGeom(ctx, $('#geomColor').val(), $('#geomType').val(), mouseX, mouseY, NoX, NoY);
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
          geomAttrib[3] = funYRightValue - (mouseY / funImgHeight * (funYRightValue - funYLeftValue));
          geomAttrib[4] = NoX / funImgWidth * (funXRightValue - funXLeftValue) + funXLeftValue;
          geomAttrib[5] = funYRightValue - (NoY / funImgHeight * (funYRightValue - funYLeftValue));
          geomArray.push(geomAttrib);

          funCanvas.removeEventListener('mousedown', geomMouseDown);
          funCanvas.removeEventListener('mousemove', geomMouseMove);
          funCanvas.removeEventListener('mouseup', geomMouseUp);
          funCanvas.removeEventListener('mouseleave', geomMouseLeave);

          geomEventAdded = false;

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
          geomAttrib[3] = funYRightValue - (mouseY / funImgHeight * (funYRightValue - funYLeftValue));
          geomAttrib[4] = NoX / funImgWidth * (funXRightValue - funXLeftValue) + funXLeftValue;
          geomAttrib[5] = funYRightValue - (NoY / funImgHeight * (funYRightValue - funYLeftValue));
          geomArray.push(geomAttrib);

          funCanvas.removeEventListener('mousedown', geomMouseDown);
          funCanvas.removeEventListener('mousemove', geomMouseMove);
          funCanvas.removeEventListener('mouseup', geomMouseUp);
          funCanvas.removeEventListener('mouseleave', geomMouseLeave);

          geomEventAdded = false;

          changeGeom();

          noGeomCanvas = true;
        }
      }
    });

    geomEventAdded = true;
  }
}

function drawRect(ctx, x1, y1, x2, y2, color) {
  ctx.strokeStyle = color;
  ctx.beginPath();
  ctx.rect(Math.min(x1,x2), Math.min(y1,y2), Math.abs(x1-x2), Math.abs(y1-y2));
  ctx.stroke();
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
        break;
      }
    case "向量":
      {
        drawArrow(ctx, x1, y1, x2, y2, 30, 10, 1, color);
        break;
      }
    case "矩形":
      {
        drawRect(ctx, x1, y1, x2, y2, color);
        break;
      }
    case "圆":
      {
        var r = Math.min(Math.abs(x1 - x2), Math.abs(y1 - y2)) / 2;
        var x0, y0;
        if (x1 <= x2) {
          x0 = x1 + r;
          if (y1 <= y2) {
            y0 = y1 + r;
          } else {
            y0 = y1 - r;
          }
        } else {
          x0 = x1 - r;
          if (y1 <= y2) {
            y0 = y1 + r;
          } else {
            y0 = y1 - r;
          }
        }
        ctx.strokeStyle = color;
        ctx.beginPath();
        ctx.arc(x0, y0, r, 0, 2 * Math.PI);
        ctx.stroke();
        break;
      }
    default:
      {
        break;
      }
  }
}

function redrawCtrl(type, x1, y1, x2, y2, pr) {
  ctxCtrl.clearRect(0, 0, funImgWidth, funImgHeight);
  ctxCtrl.beginPath();
  ctxCtrl.arc(x2, y2, pr, 0, 2 * Math.PI);
  ctxCtrl.strokeStyle = "blue";
  ctxCtrl.stroke();
  if (type == "圆") {
    var x0, y0;
    var r = Math.min(Math.abs(x1 - x2), Math.abs(y1 - y2)) / 2;
    if (x1 <= x2) {
      x0 = x1 + r;
      if (y1 <= y2) {
        y0 = y1 + r;
      } else {
        y0 = y1 - r;
      }
    } else {
      x0 = x1 - r;
      if (y1 <= y2) {
        y0 = y1 + r;
      } else {
        y0 = y1 - r;
      }
    }
    // drawRect(ctxCtrl, x0 - r, y0 - r, x0 + r, y0 + r, "blue");
    drawRect(ctxCtrl, x1, y1, x2, y2, "blue");
  }
}

function movingGeom() {
  funCanvas.addEventListener('mousemove', mvgeomMouseMove = function (ob) {
    if (funStage == 1) {
      for (var i = geomArray.length - 1; i >= 0; i--){
        var x1 = (geomArray[i][2] - funXLeftValue) / (funXRightValue - funXLeftValue) * funImgWidth;
        var y1 = (funYRightValue - geomArray[i][3]) / (funYRightValue - funYLeftValue) * funImgHeight;
        var x2 = (geomArray[i][4] - funXLeftValue) / (funXRightValue - funXLeftValue) * funImgWidth;
        var y2 = (funYRightValue - geomArray[i][5]) / (funYRightValue - funYLeftValue) * funImgHeight;
        const geomCanvas = document.getElementsByName('geomCanvas');
        const ctx = geomCanvas[i].getContext("2d");
        redrawGeom(ctx, geomArray[i][0], geomArray[i][1], x1, y1, x2, y2);
      }
    }
  });

  funCanvas.addEventListener('mouseleave', mvgeomMouseLeave = function (ob) {
    if (funStage == 1) {
      funStage = 0;
      for (var i = geomArray.length - 1; i >= 0; i--){
        var x1 = (geomArray[i][2] - funXLeftValue) / (funXRightValue - funXLeftValue) * funImgWidth;
        var y1 = (funYRightValue - geomArray[i][3]) / (funYRightValue - funYLeftValue) * funImgHeight;
        var x2 = (geomArray[i][4] - funXLeftValue) / (funXRightValue - funXLeftValue) * funImgWidth;
        var y2 = (funYRightValue - geomArray[i][5]) / (funYRightValue - funYLeftValue) * funImgHeight;
        const geomCanvas = document.getElementsByName('geomCanvas');
        const ctx = geomCanvas[i].getContext("2d");
        redrawGeom(ctx, geomArray[i][0], geomArray[i][1], x1, y1, x2, y2);
      }
    }
  });

  funCanvas.addEventListener('mousewheel', mvgeomMouseWheel = function (ob) {
    for (var i = geomArray.length - 1; i >= 0; i--){
      var x1 = (geomArray[i][2] - funXLeftValue) / (funXRightValue - funXLeftValue) * funImgWidth;
      var y1 = (funYRightValue - geomArray[i][3]) / (funYRightValue - funYLeftValue) * funImgHeight;
      var x2 = (geomArray[i][4] - funXLeftValue) / (funXRightValue - funXLeftValue) * funImgWidth;
      var y2 = (funYRightValue - geomArray[i][5]) / (funYRightValue - funYLeftValue) * funImgHeight;
      const geomCanvas = document.getElementsByName('geomCanvas');
      const ctx = geomCanvas[i].getContext("2d");
      redrawGeom(ctx, geomArray[i][0], geomArray[i][1], x1, y1, x2, y2);
    }
  });
}

function drawGeom() {
  funXLeftValue = parseFloat(document.getElementById("funXLeftValue").value);
  funXRightValue = parseFloat(document.getElementById("funXRightValue").value);
  funYLeftValue = parseFloat(document.getElementById("funYLeftValue").value);
  funYRightValue = parseFloat(document.getElementById("funYRightValue").value);
  for (var i = geomArray.length - 1; i >= 0; i--){
    var x1 = (geomArray[i][2] - funXLeftValue) / (funXRightValue - funXLeftValue) * funImgWidth;
    var y1 = (funYRightValue - geomArray[i][3]) / (funYRightValue - funYLeftValue) * funImgHeight;
    var x2 = (geomArray[i][4] - funXLeftValue) / (funXRightValue - funXLeftValue) * funImgWidth;
    var y2 = (funYRightValue - geomArray[i][5]) / (funYRightValue - funYLeftValue) * funImgHeight;
    const geomCanvas = document.getElementsByName('geomCanvas');
    const ctx = geomCanvas[i].getContext("2d");
    redrawGeom(ctx, geomArray[i][0], geomArray[i][1], x1, y1, x2, y2);
  }
}

function resetGeom() {
  for (var i = geomArray.length - 1; i >= 0; i--){
    var x1 = (geomArray[i][2] - funXLeftValue) / (funXRightValue - funXLeftValue) * funImgWidth;
    var y1 = (funYRightValue - geomArray[i][3]) / (funYRightValue - funYLeftValue) * funImgHeight;
    var x2 = (geomArray[i][4] - funXLeftValue) / (funXRightValue - funXLeftValue) * funImgWidth;
    var y2 = (funYRightValue - geomArray[i][5]) / (funYRightValue - funYLeftValue) * funImgHeight;
    const geomCanvas = document.getElementsByName('geomCanvas');
    const ctx = geomCanvas[i].getContext("2d");
    redrawGeom(ctx, geomArray[i][0], geomArray[i][1], x1, y1, x2, y2);
  }
}