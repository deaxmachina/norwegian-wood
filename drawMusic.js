

function drawRhombus() {
  // Define the coordinates for the vertices of the rhombus
	const x = 50
	const y = x * 0.5
	
  let x1 = 0
  let y1 = -y
	
  let x2 = x
  let y2 = 0
	
  let x3 = 0
  let y3 = y
	
  let x4 = -x
  let y4 = 0

  // Draw the rhombus using the quad() function
  quad(x1, y1, x2, y2, x3, y3, x4, y4);
}

function drawMusic(x, y, r, fillA, scaleA, opacityA, rotationA, artist, song, type) {
	let angle = -18;
	let radius = 50;
	// let numPetals = artist === 'the Beatles' ? 5 : 7;
	let numPetals = song === 'Norwegian Wood' ? 5 : 7;
	push()
	translate(x, y)
	scale(scaleA)
	fill(red(fillA), green(fillA), blue(fillA), opacityA*255)
	noStroke()
	angleMode(DEGREES);
	rotate(rotationA)
	// rotate(-10)
	for (let i = 0; i < numPetals; i++) {
			let x = cos(angle) * radius;
			let y = sin(angle) * radius;
			push();
			translate(x, y);
			rotate(angle);
			drawRhombus();
			pop();

			angle += 360 / numPetals;
	}
	pop()
}