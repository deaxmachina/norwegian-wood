function drawText(textA, x, y,  fillA='#5c5368', textSizeA=24) {
	push()
	textSize(textSizeA)
	noStroke()
	fill(fillA)
	// textStyle(BOLD)
	// textFont('job-clarendon, serif')
	// textFont('thrillers, sans-serif')
	// textFont('retiro-std-48pt, sans-serif')
	// textFont('niveau-grotesk, sans-serif')
	// textFont('Tulpen One, sans-serif')
	textFont('Cormorant Garamond, serif')
	textAlign(CENTER)
	text(textA, x, y)
	pop()
}