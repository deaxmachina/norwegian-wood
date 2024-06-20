/////////////////////////////
///// Draw the hexagons /////
/////////////////////////////
function drawHexes(side, horde) {
	const strokeHex = bgCol
	push()
	strokeWeight(10)
	// Center 
	push()
	stroke(strokeHex)
	fill('#dd125b')
	//fill(chosenCols[3])
	drawHexagon(0, 0, side)
	drawText('TORU トオル', 0, -horde, '#dd125b')
	pop()
	// Directly up 
	push()
	translate(0, -horde*2)
	drawHexagon(0, 0, side)
	pop()	
	// Right and up
	push()
	stroke(strokeHex)
	fill('#5c5368')
	translate(side*1.5, -horde)
	drawHexagon(0, 0, side)
	if (windowHeight <= 750) {
		drawText('NAOKO 直子', 0, -horde+30, '#988ea2')
	} else {
		drawText('NAOKO 直子', 0, -horde-3, '#5c5368')
	}
	pop()
	// Right and down
	push()
	stroke(strokeHex)
	fill('#5c5368')
	translate(side*1.5, horde)
	drawHexagon(0, 0, side)
	if (windowHeight <= 750) {
		drawText('REIKO 玲子', 0, horde - 13, '#988ea2')
	} else {
		drawText('REIKO 玲子', 0, horde+18, '#5c5368')
	}
	pop()
	// Dicrectly down
	push()
	translate(0, horde*2)
	drawHexagon(0, 0, side)
	pop()
	// Left and down
	push()
	translate(-side*1.5, horde)
	drawHexagon(0, 0, side)
	pop()
	// Left and up 
	push()
	stroke(strokeHex)
	fill('#5c5368')
	translate(-side*1.5, -horde)
	drawHexagon(0, 0, side)
	drawText('MIDORI 緑', 0, horde+25)
	pop()
	pop()
}