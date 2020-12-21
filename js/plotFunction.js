function plotFunction() {

  $('#funCanvas').unbind();
  document.getElementById('funCanvas').onmousedown = null;
  document.getElementById('funCanvas').onmousemove = null;
  document.getElementById('funCanvas').onmouseup = null;
  document.getElementById('funCanvas').onmouseleave = null;
  document.getElementById('funCanvas').onmousewheel = null;

  var funStage = 0, mouseX, mouseY;

  document.getElementById('funCanvas').onmousedown = function (ob) {
    mouseX = ob.layerX;
    mouseY = ob.layerY;
    funStage = 1;
  }

  document.getElementById('funCanvas').onmousemove = function (ob) {
    if (funStage != 1) {
      return;
    }
    var NoX, NoY, det;
    NoX = ob.layerX;
    NoY = ob.layerY;
    det = (mouseX - NoX) / funImgWidth * (funXRightValue - funXLeftValue);
    funXLeftValue += det;
    funXRightValue += det;
    det = (NoY - mouseY) / funImgHeight * (funYRightValue - funYLeftValue);
    funYLeftValue += det;
    funYRightValue += det;
    mouseX = NoX;
    mouseY = NoY;
    reDraw();
    updateText();
  }

  document.getElementById('funCanvas').onmouseup = function (ob) {
    if (funStage == 1) {
      funStage = 0;
      drawFun();
    }
  }

  document.getElementById('funCanvas').onmouseleave = function (ob) {
    if (funStage == 1) {
      funStage = 0;
      reDraw();
    }
  }

  document.getElementById('funCanvas').onmousewheel = function(ob) {
    // 取消事件的默认动作
    ob.preventDefault();
    // 放大的比例
    var ScaleRate = 0.9;
    var detail;
    if(ob.wheelDelta) {
      detail = ob.wheelDelta;
    } else if(ob.detail) {
      detail = ob.detail;
    }
    if(detail > 0) {
      scale(ob.layerX, funImgHeight - 1 - ob.layerY, ScaleRate);
    } else {
      scale(ob.layerX, funImgHeight - 1 - ob.layerY, 1 / ScaleRate);
    }
    reDraw();
    updateText();
  }
  
  // 初始化
  // if (fun_num == 0) {
    
  // }
  updateText();
  drawFun();
  addFun();
}

//  获取随机颜色
function getRandomColor() {
  var color = '#' + ('00000' + (Math.random() * 0x1000000 << 0).toString(16)).substr(-6);
  return color;
}

//  根据“字符函数”和 x 计算 y
function charFunCal(f, x) {
  switch(f) {
    case "":
      {
        return x;
        break;
      }
    case "sin":
      {
        return Math.sin(x);
        break;
      }
    case "cos":
      {
        return Math.cos(x);
        break;
      }
    case "tan":
      {
        return Math.tan(x);
        break;
      }
    case "abs":
      {
        return Math.abs(x);
        break;
      }
    case "sqrt":
      {
        return Math.sqrt(x);
        break;
      }
    case "ln":
      {
        return Math.log(x);
        break;
      }
    case "log":
      {
        return Math.log(x) / Math.LN2;
        break;
      } //2为底
    case "lg":
      {
        return Math.log(x) / Math.LN10;
        break;
      } //10为底
    case "floor":
      {
        return Math.floor(x);
        break;
      }
    case "ceil":
      {
        return Math.ceil(x);
        break;
      }
    case "int":
      {
        return parseInt(x);
        break;
      }
    default:
      {
        return NaN;
        break;
      }
  }
}

//  将 y 的计算数值转化为画布上的 y 像素位置
function value2PointY(y) {
  return funImgHeight - 1 - parseInt((y - funYLeftValue) / (funYRightValue - funYLeftValue) * funImgHeight);
}

function isChar(c) {
  return(c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z');
}

function isDigit(c) {
  return c >= '0' && c <= '9';
}

//  判断优先级
function priority(c) {
  switch(c) {
    case '(':
      return 0;
      break;
    case '+':
      return 1;
      break;
    case '-':
      return 1;
      break;
    case '*':
      return 2;
      break;
    case '/':
      return 2;
      break;
    case '^':
      return 3;
      break;
    default:
      return -1;
      break;
  }
}
// 是运算符
function isOpt(c) {
  return priority(c) != -1;
}

function singleCal(c, a, b) {
  if(c == '+') {
    return a + b;
  } else
  if(c == '-') {
    return a - b;
  } else
  if(c == '*') {
    return a * b;
  } else
  if(c == '/') {
    return a / b;
  } else
  if(c == '^') {
    return Math.pow(a, b);
  } else {
    return NaN;
  }
}

function changeTable() {
  funWithTable = !funWithTable;
  if (funWithTable) {
    getTable();
  } else {
    clearTable();
    // drawFun();
  }
}

function getTable() {
  var tableX, tableY, countX, countY;
  funTmp = (funXRightValue - funXLeftValue + funEPS) / 20;

  tableX = 1;
  countX = 0;
  countY = 0;
  while(tableX < funTmp) {
    tableX *= 10;
  }
  while(tableX / 10 > funTmp) {
    tableX /= 10;
    countX++;
  }
  if(tableX >= 1) {
    countX = 0;
  }
  if(tableX / 5 > funTmp) {
    tableX /= 5;
    countX++;
  } else if(tableX / 2 > funTmp) {
    tableX /= 2;
    countX++;
  }
  var i = parseInt(funXLeftValue / tableX) + (funXLeftValue > 0)
  for(; i * tableX < funXRightValue; i++) {
    if(i == 0) {
      // y轴
      ctx.fillStyle = "black";
    } else {
      // 普通竖线
      ctx.fillStyle = "#CDB7B5";
    }
    funTmp = (i * tableX - funXLeftValue) / (funXRightValue - funXLeftValue) * funImgWidth;
    var _width = 1;
    var _height = funImgHeight;
    ctx.fillRect(funTmp, 0, _width, _height);
    // 竖线上的数字
    ctx.fillStyle = "blue";
    ctx.font = "10px 黑体";
    var _text = (i * tableX).toFixed(countX);
    var _x = funTmp + 2;
    var _y = 10;
    ctx.fillText(_text, _x, _y);
  }
  funTmp = (funYRightValue - funYLeftValue + funEPS) / 20;
  tableY = 1;

  while(tableY < funTmp) {
    tableY *= 10;
  }
  while(tableY / 10 > funTmp) {
    tableY /= 10, countY++;
  }
  if(tableY / 5 > funTmp) {
    tableY /= 5, countY++;
  } else if(tableY / 2 > funTmp) {
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
      ctx.fillStyle = "black";
    } else {
      // 普通横线
      ctx.fillStyle = "#CDB7B5";
    }
    funTmp = (i * tableY - funYLeftValue) / (funYRightValue - funYLeftValue) * funImgHeight;
    ctx.fillRect(0, funImgHeight - 1 - funTmp, funImgWidth, 1);
    // 横线上的数字
    ctx.fillStyle = "blue";
    ctx.font = "10px 黑体";
    ctx.fillText((i * tableY).toFixed(countY), 0, funImgHeight - 1 - funTmp);
  }
}

function clearTable() {
  var tableX, tableY, countX, countY;
  funTmp = (funXRightValue - funXLeftValue + funEPS) / 20;

  tableX = 1;
  countX = 0;
  countY = 0;
  while(tableX < funTmp) {
    tableX *= 10;
  }
  while(tableX / 10 > funTmp) {
    tableX /= 10;
    countX++;
  }
  if(tableX >= 1) {
    countX = 0;
  }
  if(tableX / 5 > funTmp) {
    tableX /= 5;
    countX++;
  } else if(tableX / 2 > funTmp) {
    tableX /= 2;
    countX++;
  }
  var i = parseInt(funXLeftValue / tableX) + (funXLeftValue > 0)
  for (; i * tableX < funXRightValue; i++) {
    //清除竖线
    funTmp = (i * tableX - funXLeftValue) / (funXRightValue - funXLeftValue) * funImgWidth;
    var _width = 3;
    var _height = funImgHeight;
    ctx.clearRect(funTmp-1, 0, _width, _height);
    //清除竖线上的数字
    ctx.fillStyle = "white";
    ctx.font = "10px 黑体";
    var _text = (i * tableX).toFixed(countX);
    var _x = funTmp + 2;
    var _y = 10;
    ctx.fillText(_text, _x, _y);
  }
  funTmp = (funYRightValue - funYLeftValue + funEPS) / 20;
  tableY = 1;

  while(tableY < funTmp) {
    tableY *= 10;
  }
  while(tableY / 10 > funTmp) {
    tableY /= 10, countY++;
  }
  if(tableY / 5 > funTmp) {
    tableY /= 5, countY++;
  } else if(tableY / 2 > funTmp) {
    tableY /= 2, countY++;
  }
  if(tableY >= 1) {
    countY = 0;
  }
  var i = parseInt(funYLeftValue / tableY) + (funYLeftValue > 0);
  for(; i * tableY < funYRightValue; i++) {
    //清除横线
    funTmp = (i * tableY - funYLeftValue) / (funYRightValue - funYLeftValue) * funImgHeight;
    ctx.clearRect(0, funImgHeight - 1 - (funTmp + 1), funImgWidth, 3);
    //清除横线上的数字
    ctx.fillStyle = "white";
    ctx.font = "10px 黑体";
    ctx.fillText((i * tableY).toFixed(countY), 0, funImgHeight - 1 - funTmp);
  }
}

function drawArc(x, y) {
  ctx.beginPath();
  // arc(弧形),画圆
  ctx.arc(x, y, 1, 0, Math.PI * 2);
  ctx.closePath();
  ctx.fill();
}

function drawLine(lx, ly, px, py) {
  ctx.beginPath();
  ctx.moveTo(lx, ly);
  ctx.lineTo(px, py);
  ctx.closePath();
  ctx.stroke(); // 绘制
}

function reDraw() {
  ctx.clearRect(0, 0, funImgWidth, funImgHeight);
  if (funWithTable) {
    getTable();
  }
  getFunction();
}

function drawFun() {
  funXLeftValue = parseFloat(document.getElementById("funXLeftValue").value);
  funXRightValue = parseFloat(document.getElementById("funXRightValue").value);
  funYLeftValue = parseFloat(document.getElementById("funYLeftValue").value);
  funYRightValue = parseFloat(document.getElementById("funYRightValue").value);
  reDraw();
}

function updateText() {
  document.getElementById("funXLeftValue").value = funXLeftValue;
  document.getElementById("funXRightValue").value = funXRightValue;
  document.getElementById("funYLeftValue").value = funYLeftValue;
  document.getElementById("funYRightValue").value = funYRightValue;
}

function scale(x, y, times) {
  if(x < 0 || x >= funImgWidth || y < 0 || y >= funImgHeight) return;

  if(times < 1 && (funXRightValue - funXLeftValue < funMin || funYRightValue - funYLeftValue < funMin)) {
    return;
  }
  if(times > 1 && (funXRightValue - funXLeftValue > funMax || funYRightValue - funYLeftValue > funMax)) {
    return;
  }

  x = funXLeftValue + (funXRightValue - funXLeftValue) / funImgWidth * x;
  y = funYLeftValue + (funYRightValue - funYLeftValue) / funImgHeight * y;
  funXLeftValue = x - (x - funXLeftValue) * times;
  funXRightValue = x + (funXRightValue - x) * times;
  funYLeftValue = y - (y - funYLeftValue) * times;
  funYRightValue = y + (funYRightValue - y) * times;
}

function Calc(fun, X, Value) {
  var number = new Array(),
    opt = new Array(),
    F = new Array(),
    now = 0,
    f = "",
    funTmp, a, b, sign = 1,
    base = 0,
    j;
  for(var i = 0; i < fun.length; i++) {
    for(j = 0; j < X.length; j++)
      if(X[j] == fun[i]) {
        if(i == 0 || isOpt(fun[i - 1])) now = Value[j];
        else now *= Value[j];
        break;
      }
    if(j == X.length)
      if(fun[i] == '(') F.push(f), f = "", opt.push('(');
      else
    if(fun[i] == ')') {
      number.push(now * sign);
      now = 0;
      sign = 1;
      base = 0;
      while((funTmp = opt.pop()) != '(') {
        b = number.pop();
        a = number.pop();
        funTmp = singleCal(funTmp, a, b);
        number.push(funTmp);
      }
      now = charFunCal(F.pop(), number.pop());
    } else
    if(fun[i] == '.') base = 1;
    else
    if(fun[i] == '+' && (i == 0 || priority(fun[i - 1]) != -1));
    else
    if(fun[i] == '-' && (i == 0 || priority(fun[i - 1]) != -1)) sign = -1;
    else
    if(fun[i] == 'e')
      if(i == 0 || isOpt(fun[i - 1])) now = Math.E;
      else now *= Math.E;
    else
    if(fun[i] == 'p' && fun[i + 1] == 'i') {
      if(i == 0 || isOpt(fun[i - 1])) now = Math.PI;
      else now *= Math.PI;
      i += 1;
    } else
    if(isDigit(fun[i]))
      if(base == 0) now = now * 10 + (fun[i] - '0');
      else base /= 10, now += base * (fun[i] - '0');
    else
    if(isChar(fun[i])) f += fun[i];
    else if(isOpt(fun[i])) {
      number.push(now * sign);
      now = 0;
      sign = 1;
      base = 0;
      var s = priority(fun[i]);
      if(s == -1) return 0;
      while(s <= priority(opt[opt.length - 1])) {
        b = number.pop();
        a = number.pop();
        funTmp = singleCal(opt.pop(), a, b);
        number.push(funTmp);
      }
      opt.push(fun[i]);
    }
  }
  number.push(now * sign);
  while(opt.length > 0) {
    b = number.pop();
    a = number.pop();
    funTmp = singleCal(opt.pop(), a, b);
    number.push(funTmp);
  }
  return number.pop();
}

function getFunction() {
  // group：函数（可能是复数）
  var group = document.getElementsByName("Fun");
  var x, y;
  var lax, lay;
  var px, py
  var color, outSide, type
  var ValueL, ValueR, ValueS, isDrawLine, funTmp, funTmp;

  for(var k = 1; k < group.length; k++) {

    var _funcItem = group[k].parentNode;

    outSide = 1;
    //type = _funcItem.children[0].value;
    // 颜色
    color = _funcItem.children[0].value;
    // 函数表达式
    funcExpression = group[k].value;
    // 是否画线（默认画点）
    isDrawLine = _funcItem.children[3].checked;

    ctx.fillStyle = ctx.strokeStyle = color;
    ctx.lineWidth = "1";

    for(var i = 0; i < funImgWidth; i++) {
      x = funXLeftValue + (funXRightValue - funXLeftValue) / funImgWidth * i;
      y = Calc(funcExpression, ['x'], [x]);
      if(isNaN(y)) {
        continue;
      }
      px = i;
      py = value2PointY(y);
      if(y >= funYLeftValue && y < funYRightValue) {
        // 画圆
        drawArc(px, py);
        if(isDrawLine) {
          drawLine(lax, lay, px, py);
        }
        outSide = 0;
      } else {
        if(isDrawLine) {
          if(!outSide) {
            drawLine(lax, lay, px, py);
          }
        } else {}
        outSide = 1;
      }
      lax = px;
      lay = py;
    }
  }
}

function addFun() {
  var newInput = document.getElementById("mod").cloneNode(true);
  newInput.style.display = "block";
  newInput.children[0].value = getRandomColor();
  document.getElementById("masterPanel").appendChild(newInput);
}

function deleteFun(node) {
  node.parentNode.removeChild(node);
  drawFun();
}