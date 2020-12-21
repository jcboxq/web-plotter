function plotGrid() {
  useGrid = !useGrid;
  if (useGrid) {
    
  } else {
    $('#slavePanel').html('');
    plotFunction();
  }
}