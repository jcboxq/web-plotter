function plotFunction() {

  //添加主功能事件
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
  });

  // 初始化
  updateText();
  drawFun();
}

//  获取随机颜色
function getRandomColor() {
  var color = '#' + ('00000' + (Math.random() * 0x1000000 << 0).toString(16)).substr(-6);
  return color;
}

//  根据函数名称和 x 值计算 y
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
  ctxFun.beginPath();
  // arc(弧形),画圆
  ctxFun.arc(x, y, 1, 0, Math.PI * 2);
  ctxFun.closePath();
  ctxFun.fill();
}

function drawLine(lx, ly, px, py) {
  ctxFun.beginPath();
  ctxFun.moveTo(lx, ly);
  ctxFun.lineTo(px, py);
  ctxFun.closePath();
  ctxFun.stroke(); // 绘制
}

function reDrawFun() {
  ctxFun.clearRect(0, 0, funImgWidth, funImgHeight);
  getFunction();
}

function drawFun() {
  funXLeftValue = parseFloat(document.getElementById("funXLeftValue").value);
  funXRightValue = parseFloat(document.getElementById("funXRightValue").value);
  funYLeftValue = parseFloat(document.getElementById("funYLeftValue").value);
  funYRightValue = parseFloat(document.getElementById("funYRightValue").value);
  reDrawFun();
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

function calculate(fun, X, Value) {
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
  // group：函数组
  var group = document.getElementsByName("Fun");
  var x, y;
  var px, py;
  var color, outSide, funcExpression;

  for (var k = 1; k < group.length; k++) {
    var lax=undefined, lay=undefined;

    var _funcItem = group[k].parentNode;

    outSide = 1;
    // 颜色
    color = _funcItem.children[0].value;
    // 函数表达式
    funcExpression = group[k].value;

    ctxFun.fillStyle = ctxFun.strokeStyle = color;
    ctxFun.lineWidth = "1";

    for(var i = 0; i < funImgWidth; i++) {
      x = funXLeftValue + (funXRightValue - funXLeftValue) / funImgWidth * i;
      y = calculate(funcExpression, ['x'], [x]);
      if(isNaN(y)) {
        continue;
      }
      px = i;
      py = value2PointY(y);
      if(y >= funYLeftValue && y < funYRightValue) {
        drawLine(lax, lay, px, py);
        outSide = 0;
      } else {
        if (!outSide) {
          drawLine(lax, lay, px, py);
        }
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
  addLegend(newInput.children[0].value, "sin(x)");
}

function deleteFun(node) {
  node.parentNode.removeChild(node);
  drawFun();
  delLegend();
}

function resetFun() {
  funXLeftValue = -funImgWidth / 100;  // x 初始范围左边界
  funXRightValue = -funXLeftValue;  // x 初始范围右边界
  funYLeftValue = -funImgHeight / 100;  // y 初始范围左边界
  funYRightValue = -funYLeftValue;  // y 初始范围右边界
  reDrawFun();
  updateText();
}

function addLegend(color, text) {
  var textnode=document.createTextNode("y="+text);
  var node = document.getElementById("legendTemp").cloneNode(true);
  node.setAttribute("name", "funLegend");
  node.style.display = "";
  node.children[0].children[0].children[0].style.border = "5px solid " + color;
  node.children[1].appendChild(textnode);
  document.getElementById("legendTable").children[0].appendChild(node);
}

function delLegend() {
  var funLegend = document.getElementsByName("funLegend");
  var node = funLegend[0];
  node.parentNode.removeChild(node);
  updateLegend();
}

function updateLegend() {
  var color, text;
  var group = document.getElementsByName("Fun");
  var legend = document.getElementsByName("funLegend");
  for (var k = 1; k < group.length; k++) {
    var _funcItem = group[k].parentNode;
    // 颜色
    color = _funcItem.children[0].value;
    // 函数表达式
    text = "y=" + group[k].value;

    legend[k - 1].children[0].children[0].children[0].style.border = "5px solid " + color;
    legend[k - 1].children[1].innerHTML = text;
  }
}