function plotFunction() {
  var funStage = 0, mouseX, mouseY;

  funCanvas.addEventListener('mousedown', funMouseDown = function (ob) {
    mouseX = ob.offsetX + 1;
    mouseY = ob.offsetY + 1;
    funStage = 1;
  });

  funCanvas.addEventListener('mousemove', funMouseMove = function (ob) {
    if (funStage != 1) {
      return;
    }
    var NoX, NoY, det;
    NoX = ob.offsetX + 1;
    NoY = ob.offsetY + 1;
    det = (mouseX - NoX) / funImgWidth * (funXRightValue - funXLeftValue);
    funXLeftValue += det;
    funXRightValue += det;
    det = (NoY - mouseY) / funImgHeight * (funYRightValue - funYLeftValue);
    funYLeftValue += det;
    funYRightValue += det;
    mouseX = NoX;
    mouseY = NoY;
    reDrawFun();
    updateText();
    if (useGrid) {
      reDrawGrid();
    }
  });

  funCanvas.addEventListener('mouseup', funMouseUp = function (ob) {
    if (funStage == 1) {
      funStage = 0;
    }
  });

  funCanvas.addEventListener('mouseleave', funMouseLeave = function (ob) {
    if (funStage == 1) {
      funStage = 0;
      reDrawFun();
      if (useGrid) {
        reDrawGrid();
      }
    }
  });

  funCanvas.addEventListener('mousewheel', funMouseWheel = function (ob) {
    // 取消事件的默认动作
    ob.preventDefault();
    // 放大的比例
    var ScaleRate = 0.9;
    var detail;
    if (ob.wheelDelta) {
      detail = ob.wheelDelta;
    } else if (ob.detail) {
      detail = ob.detail;
    }
    if (detail > 0) {
      scale(ob.layerX, funImgHeight - 1 - ob.layerY, ScaleRate);
    } else {
      scale(ob.layerX, funImgHeight - 1 - ob.layerY, 1 / ScaleRate);
    }
    reDrawFun();
    updateText();
    if (useGrid) {
      reDrawGrid();
    }
  });

  // 初始化
  updateText();
  drawFun();
  if (useGrid) {
    drawGrid();
  }
  // if (fun_num == 0) {
  //   addFun();
  // }
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

function reDrawFun() {
  ctx.clearRect(0, 0, funImgWidth, funImgHeight);
  getFunction();
}

function drawFun() {
  funXLeftValue = parseFloat(document.getElementById("funXLeftValue").value);
  funXRightValue = parseFloat(document.getElementById("funXRightValue").value);
  funYLeftValue = parseFloat(document.getElementById("funYLeftValue").value);
  funYRightValue = parseFloat(document.getElementById("funYRightValue").value);
  reDrawFun();
}

function drawFunAndGrid() {
  drawFun();
  if (useGrid) {
    drawGrid();
  }
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
    tmp, a, b, sign = 1,
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
      while((tmp = opt.pop()) != '(') {
        b = number.pop();
        a = number.pop();
        tmp = singleCal(tmp, a, b);
        number.push(tmp);
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
        tmp = singleCal(opt.pop(), a, b);
        number.push(tmp);
      }
      opt.push(fun[i]);
    }
  }
  number.push(now * sign);
  while(opt.length > 0) {
    b = number.pop();
    a = number.pop();
    tmp = singleCal(opt.pop(), a, b);
    number.push(tmp);
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
  var ValueL, ValueR, ValueS, isDrawLine, tmp, tmp;

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