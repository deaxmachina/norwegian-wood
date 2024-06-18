function drawHexagon(x, y, side) {
  beginShape();
  for (let i = 0; i < 6; i++) {
    let angle = PI / 3 * i;
    let px = x + cos(angle) * side;
    let py = y + sin(angle) * side;
    vertex(px, py);
  }
  endShape(CLOSE);
}

