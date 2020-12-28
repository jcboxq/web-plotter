function plotText() {
  useText = !useText;
  if (useText) {// 打开插入文字辅助功能
    // 关掉已打开的辅助功能事件
    if (useFreestyle) {
      // plotFreestyle();
      // $("#fsSwitch").click();
      document.getElementById("fsSwitch").click();
    }
    if (useGeometric) {
      // plotGeometric();
      // $("#geomSwitch").click();
      document.getElementById("geomSwitch").click();
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
    $('#slavePanel').html('<br> <input id="textColor" type="color" value = "#0000ff"/> <br><br> Font Size: <select id="fontSize"><option value = "12px">1</option><option value="15px" selected = "selected">2</option><option value="18px">3</option><option value="21px">4</option><option value="24px">5</option></select> <br><br> <input id="inputText" type="text" style="text-align:center;" value="text"/> <br><br> <button onclick="addText()">插入文字</button> <br><br> 拖动文字修改位置 <br><br> 选中文字后按 Delete<br>键可以删除文字');

    // 打开修改文字功能
    changeText();
  } else {// 关闭文字插入辅助功能
    // 关掉文字插入事件
    if (typeof(textMouseDown) != "undefined") {
      funCanvas.removeEventListener('mousedown', textMouseDown);
      // funCanvas.removeEventListener('mousemove', textMouseMove);
      funCanvas.removeEventListener('mouseup', textMouseUp);
      funCanvas.removeEventListener('mouseleave', textMouseLeave);

      textEventAdded = false;
    }

    // 清空选中状态，清空控制画布
    selectedIndex = -1;
    ctxCtrl.clearRect(0, 0, funImgWidth, funImgHeight);

    // 关掉修改文字事件
    funCanvas.removeEventListener('mousedown', chtextMouseDown);
    funCanvas.removeEventListener('mousemove', chtextMouseMove);
    funCanvas.removeEventListener('mouseup', chtextMouseUp);
    funCanvas.removeEventListener('mouseleave', chtextMouseLeave);
    document.removeEventListener('keyup', chtextDelete);

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

function hitText(x1, y1, x2, y2, x, y) {
  if (x > Math.min(x1,x2) && x < Math.max(x1,x2) && y > Math.min(y1,y2) && y < Math.max(y1,y2)) {
    return true;
  } else {
    return false;
  }
}

function findHitText() {
  var x1, y1, x2, y2;
  for (var i = textArray.length - 1; i >= 0; i--){
    x1 = (textArray[i][2] - funXLeftValue) / (funXRightValue - funXLeftValue) * funImgWidth;
    y1 = (funYRightValue - textArray[i][3]) / (funYRightValue - funYLeftValue) * funImgHeight;
    x2 = x1 + textArray[i][4];
    y2 = y1 - textArray[i][5];
    if (hitText(x1, y1, x2, y2, mouseX, mouseY)) {
      return i;
    }
  }
  return -1;
}

function changeText() {
  // 添加修改文字事件
  funCanvas.addEventListener('mousedown', chtextMouseDown = function (ob) {
    mouseX = ob.offsetX + 1;
    mouseY = ob.offsetY + 1;
    funStage = 1;
  });

  funCanvas.addEventListener('mousemove', chtextMouseMove = function (ob) {
    if (funStage == 1) {
      var NoX, NoY, detx, dety;
      NoX = ob.offsetX + 1;
      NoY = ob.offsetY + 1;
      detx = NoX - mouseX;
      dety = NoY - mouseY;

      // var indexControl = findHitControl(); //被选中控制点的图形的序号
      var indexBody = findHitText(); //被选中主体的文字的序号

      if (indexBody != -1) {// 拖动主体，更新选中状态，绘制控制画布，移动文字
        selectedIndex = indexBody;

        var x1 = (textArray[indexBody][2] - funXLeftValue) / (funXRightValue - funXLeftValue) * funImgWidth;
        var y1 = (funYRightValue - textArray[indexBody][3]) / (funYRightValue - funYLeftValue) * funImgHeight;
        var textWidth = textArray[indexBody][4];
        var textHeight = textArray[indexBody][5];

        redrawTextCtrl(x1+detx, y1+dety, textWidth, textHeight);

        const textCanvas = document.getElementsByName('textCanvas');
        const ctx = textCanvas[indexBody].getContext("2d");
        redrawText(ctx, textArray[indexBody][0], textArray[indexBody][1], x1 + detx, y1 + dety, textArray[indexBody][6]);
      }
    }
  });

  funCanvas.addEventListener('mouseup', chtextMouseUp = function (ob) {
    if (funStage == 1) {
      funStage = 0;

      var NoX, NoY, detx, dety;
      NoX = ob.offsetX + 1;
      NoY = ob.offsetY + 1;
      detx = NoX - mouseX;
      dety = NoY - mouseY;

      // var indexControl = findHitControl(); //被选中控制点的图形的序号
      var indexBody = findHitText(); //被选中主体的文字的序号

      if (indexBody != -1) {// 点击主体，更新选中状态，将新的图形属性更新到图形数组，更新控制画布
        selectedIndex = indexBody;

        textArray[indexBody][2] += detx / funImgWidth * (funXRightValue - funXLeftValue);
        textArray[indexBody][3] -= dety / funImgHeight * (funYRightValue - funYLeftValue);

        var x1 = (textArray[indexBody][2] - funXLeftValue) / (funXRightValue - funXLeftValue) * funImgWidth;
        var y1 = (funYRightValue - textArray[indexBody][3]) / (funYRightValue - funYLeftValue) * funImgHeight;
        var textWidth = textArray[indexBody][4];
        var textHeight = textArray[indexBody][5];
        redrawTextCtrl(x1, y1, textWidth, textHeight);
      } else {// 点击空白，清空选中状态，清空控制画布
        selectedIndex = -1;
        ctxCtrl.clearRect(0, 0, funImgWidth, funImgHeight);
      }
    }
  });

  funCanvas.addEventListener('mouseleave', chtextMouseLeave = function (ob) {
    if (funStage == 1) {
      funStage = 0;

      var NoX, NoY, detx, dety;
      NoX = ob.offsetX + 1;
      NoY = ob.offsetY + 1;
      detx = NoX - mouseX;
      dety = NoY - mouseY;

      // var indexControl = findHitControl(); //被选中控制点的图形的序号
      var indexBody = findHitText(); //被选中主体的文字的序号

      if (indexBody != -1) {// 点击主体，更新选中状态，将新的图形属性更新到图形数组，更新控制画布
        selectedIndex = indexBody;

        textArray[indexBody][2] += detx / funImgWidth * (funXRightValue - funXLeftValue);
        textArray[indexBody][3] -= dety / funImgHeight * (funYRightValue - funYLeftValue);

        var x1 = (textArray[indexBody][2] - funXLeftValue) / (funXRightValue - funXLeftValue) * funImgWidth;
        var y1 = (funYRightValue - textArray[indexBody][3]) / (funYRightValue - funYLeftValue) * funImgHeight;
        var textWidth = textArray[indexBody][4];
        var textHeight = textArray[indexBody][5];
        redrawTextCtrl(x1, y1, textWidth, textHeight);
      } else {// 点击空白，清空选中状态，清空控制画布
        selectedIndex = -1;
        ctxCtrl.clearRect(0, 0, funImgWidth, funImgHeight);
      }
    }
  });

  document.addEventListener('keyup', chtextDelete = function (ob) {
    if (selectedIndex != -1 && ob.keyCode == 46) {
      var textCanvas = document.getElementsByName('textCanvas');
      var node = textCanvas[selectedIndex];
      canvasDiv.removeChild(node);

      textArray.splice(selectedIndex, 1);
      
      selectedIndex = -1;
      ctxCtrl.clearRect(0, 0, funImgWidth, funImgHeight);
    }
  });
}

function addText() {
  if (!textEventAdded) {
    // 关掉修改文字事件
    funCanvas.removeEventListener('mousedown', chtextMouseDown);
    funCanvas.removeEventListener('mousemove', chtextMouseMove);
    funCanvas.removeEventListener('mouseup', chtextMouseUp);
    funCanvas.removeEventListener('mouseleave', chtextMouseLeave);
    document.removeEventListener('keyup', chtextDelete);

    // 添加文字插入事件
    funCanvas.addEventListener('mousedown', textMouseDown = function (ob) {
      mouseX = ob.offsetX + 1;
      mouseY = ob.offsetY + 1;
      funStage = 1;
      if (noTextCanvas) {// 本次文字插入仍未创建画布
        // 创建画布并添加到函数画布之下
        var node = document.createElement("CANVAS");
        node.setAttribute("name", "textCanvas");
        node.height = 500;
        node.width = 500;
        node.style.border = "2px solid #6699cc";
        node.style.position = "absolute";
        canvasDiv.insertBefore(node, funCanvas);
        $("[name = textCanvas]").offset({ top: $("#gridCanvas").offset().top, left: $("#gridCanvas").offset().left });
        noTextCanvas = false;
      }
    });

    funCanvas.addEventListener('mouseup', textMouseUp = function (ob) {
      if (funStage == 1) {
        funStage = 0;
        if (!noTextCanvas) {
          const textCanvas = document.getElementsByName('textCanvas');
          const ctx = textCanvas[textArray.length].getContext("2d");

          var NoX, NoY;
          NoX = ob.offsetX + 1;
          NoY = ob.offsetY + 1;

          var textWidth;
          textWidth = redrawText(ctx, $('#textColor').val(), $('#fontSize').val(), mouseX, mouseY, $('#inputText').val());

          var textAttrib = new Array(7);
          textAttrib[0] = $('#textColor').val();
          textAttrib[1] = $('#fontSize').val();
          textAttrib[2] = mouseX / funImgWidth * (funXRightValue - funXLeftValue) + funXLeftValue;
          textAttrib[3] = funYRightValue - (mouseY / funImgHeight * (funYRightValue - funYLeftValue));
          textAttrib[4] = textWidth;
          textAttrib[5] = textWidth / $('#inputText').val().length;
          textAttrib[6] = $('#inputText').val();
          textArray.push(textAttrib);

          funCanvas.removeEventListener('mousedown', textMouseDown);
          funCanvas.removeEventListener('mouseup', textMouseUp);
          funCanvas.removeEventListener('mouseleave', textMouseLeave);

          textEventAdded = false;

          changeText();

          noTextCanvas = true;
        }
      }
    });

    funCanvas.addEventListener('mouseleave', textMouseLeave = function (ob) {
      if (funStage == 1) {
        funStage = 0;
        if (!noTextCanvas) {
          const textCanvas = document.getElementsByName('textCanvas');
          const ctx = textCanvas[textArray.length].getContext("2d");

          var NoX, NoY;
          NoX = ob.offsetX + 1;
          NoY = ob.offsetY + 1;

          var textWidth;
          textWidth = redrawText(ctx, $('#textColor').val(), $('#fontSize').val(), mouseX, mouseY, $('#inputText').val());

          var textAttrib = new Array(7);
          textAttrib[0] = $('#textColor').val();
          textAttrib[1] = $('#fontSize').val();
          textAttrib[2] = mouseX / funImgWidth * (funXRightValue - funXLeftValue) + funXLeftValue;
          textAttrib[3] = funYRightValue - (mouseY / funImgHeight * (funYRightValue - funYLeftValue));
          textAttrib[4] = textWidth;
          textAttrib[5] = textWidth / $('#inputText').val().length;
          textAttrib[6] = $('#inputText').val();
          textArray.push(textAttrib);

          funCanvas.removeEventListener('mousedown', textMouseDown);
          funCanvas.removeEventListener('mouseup', textMouseUp);
          funCanvas.removeEventListener('mouseleave', textMouseLeave);

          textEventAdded = false;

          changeText();

          noTextCanvas = true;
        }
      }
    });

    textEventAdded = true;
  }
}

function redrawText(ctx, color, size, x1, y1, text) {// 根据像素坐标绘制文字
  ctx.clearRect(0, 0, funImgWidth, funImgHeight);
  ctx.fillStyle = color;
  ctx.font = size + " 黑体";;
  ctx.fillText(text, x1, y1);
  return ctx.measureText(text).width;
}

function redrawTextCtrl(x, y, width, height) {
  ctxCtrl.clearRect(0, 0, funImgWidth, funImgHeight);
  ctxCtrl.beginPath();
  ctxCtrl.rect(x, y-height, width, height);
  ctxCtrl.strokeStyle = "blue";
  ctxCtrl.stroke()
}


function movingText() {
  funCanvas.addEventListener('mousemove', mvtextMouseMove = function (ob) {
    if (funStage == 1) {
      for (var i = textArray.length - 1; i >= 0; i--){
        var x1 = (textArray[i][2] - funXLeftValue) / (funXRightValue - funXLeftValue) * funImgWidth;
        var y1 = (funYRightValue - textArray[i][3]) / (funYRightValue - funYLeftValue) * funImgHeight;
        const textCanvas = document.getElementsByName('textCanvas');
        const ctx = textCanvas[i].getContext("2d");
        redrawText(ctx, textArray[i][0], textArray[i][1], x1, y1, textArray[i][6]);
      }
    }
  });

  funCanvas.addEventListener('mouseleave', mvtextMouseLeave = function (ob) {
    if (funStage == 1) {
      funStage = 0;
      for (var i = textArray.length - 1; i >= 0; i--){
        var x1 = (textArray[i][2] - funXLeftValue) / (funXRightValue - funXLeftValue) * funImgWidth;
        var y1 = (funYRightValue - textArray[i][3]) / (funYRightValue - funYLeftValue) * funImgHeight;
        const textCanvas = document.getElementsByName('textCanvas');
        const ctx = textCanvas[i].getContext("2d");
        redrawText(ctx, textArray[i][0], textArray[i][1], x1, y1, textArray[i][6]);
      }
    }
  });

  funCanvas.addEventListener('mousewheel', mvtextMouseWheel = function (ob) {
    for (var i = textArray.length - 1; i >= 0; i--){
      var x1 = (textArray[i][2] - funXLeftValue) / (funXRightValue - funXLeftValue) * funImgWidth;
      var y1 = (funYRightValue - textArray[i][3]) / (funYRightValue - funYLeftValue) * funImgHeight;
      const textCanvas = document.getElementsByName('textCanvas');
      const ctx = textCanvas[i].getContext("2d");
      redrawText(ctx, textArray[i][0], textArray[i][1], x1, y1, textArray[i][6]);
    }
  });
}

function drawText() {
  funXLeftValue = parseFloat(document.getElementById("funXLeftValue").value);
  funXRightValue = parseFloat(document.getElementById("funXRightValue").value);
  funYLeftValue = parseFloat(document.getElementById("funYLeftValue").value);
  funYRightValue = parseFloat(document.getElementById("funYRightValue").value);
  for (var i = textArray.length - 1; i >= 0; i--){
    var x1 = (textArray[i][2] - funXLeftValue) / (funXRightValue - funXLeftValue) * funImgWidth;
    var y1 = (funYRightValue - textArray[i][3]) / (funYRightValue - funYLeftValue) * funImgHeight;
    const textCanvas = document.getElementsByName('textCanvas');
    const ctx = textCanvas[i].getContext("2d");
    redrawText(ctx, textArray[i][0], textArray[i][1], x1, y1, textArray[i][6]);
  }
}

function resetText() {
  for (var i = textArray.length - 1; i >= 0; i--){
    var x1 = (textArray[i][2] - funXLeftValue) / (funXRightValue - funXLeftValue) * funImgWidth;
    var y1 = (funYRightValue - textArray[i][3]) / (funYRightValue - funYLeftValue) * funImgHeight;
    const textCanvas = document.getElementsByName('textCanvas');
    const ctx = textCanvas[i].getContext("2d");
    redrawText(ctx, textArray[i][0], textArray[i][1], x1, y1, textArray[i][6]);
  }
}