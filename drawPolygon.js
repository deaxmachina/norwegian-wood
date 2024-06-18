// Function to draw a filled polygon from points
function drawPolygon(context, points, col, stroke) {
    if (points.length === 0) return;

    context.beginPath();
    context.moveTo(points[0].x, points[0].y);

    for (var i = 1; i < points.length; i++) {
        context.lineTo(points[i].x, points[i].y);
    }

    context.closePath()
    context.fillStyle = col
    context.fill()
}