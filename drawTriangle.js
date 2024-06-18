function drawTriangle(x, y, r, rot){
	let aX = x + r*cos(rot+0); 
	let aY = y + r*sin(rot+0);
	let bX = x + r*cos(rot+120); 
	let bY = y + r*sin(rot+120);
	let cX = x + r*cos(rot+240); 
	let cY = y + r*sin(rot+240);

	triangle(x, y, bX, bY, cX, cY)
	triangle(aX, aY, x, y, cX, cY)
	triangle(aX, aY, bX, bY, x,y)
}