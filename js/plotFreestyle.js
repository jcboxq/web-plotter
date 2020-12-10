function plotFreestyle() {
  //  线段开始位置
  startP = {x: 0, y: 0};
  //  线段结束位置
  endP = {x: 0, y: 0};
  //  添加 mousedown 事件
  canvas.addEventListener('mousedown', mousedown);
  //  添加 mouseup 事件
  canvas.addEventListener('mouseup', mouseup);
  //  添加 mouseleave 事件
  canvas.addEventListener('mouseleave',mouseleave);
}

/**
 * @summary 按下鼠标右键发生的事件
 */
function mousedown(e) {
  //  将线段开始位置设为鼠标点击的位置
  startP = {x:e.clientX,y:e.clientY};
  //  将画笔移到始点
  ctx.moveTo(startP.x, startP.y);
  console.log('Mouse down.');
  canvas.addEventListener('mousemove', mousemove);
}

/**
 * mouse move event
 * @param e
 */
function mousemove(e) {
      ctx.beginPath();
      ctx.moveTo(startP.x, startP.y);
      //  设置线段终点
      endP = {x:e.clientX,y:e.clientY};
      console.log(JSON.stringify(startP) + ',' + JSON.stringify(endP));
      //  告诉画笔线段终点位置
      ctx.lineTo(endP.x, endP.y);
      //  画线段
      ctx.stroke();
      //  将下一条线段起点设置为当前线段的终点
      startP = endP;
      ctx.moveTo(startP.x, startP.y);
}

/**
 * @summary 鼠标释放时后，停止画图
 * @param e mouseup event handler
 */
function mouseup(e) {
  console.log('Mouse up.');
  canvas.removeEventListener('mousemove', mousemove);
  //clearInterval(interval);
}

/**
 * @summary 鼠标离开画布后，停止画图
 * @param e
 */
function mouseleave(e) {
  canvas.removeEventListener('mousemove',mousemove);
  console.log('Mouse leave.')
}
