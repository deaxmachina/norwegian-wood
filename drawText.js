function drawText(textA, x, y,  fillA='#5c5368', textSizeA=26) {
	push()
	textSize(textSizeA)
	noStroke()
	fill(fillA)
	textFont('job-clarendon, serif')
	//textFont('thrillers, sans-serif')
	//textFont('retiro-std-48pt, sans-serif')
	//textFont('niveau-grotesk, sans-serif')
	textAlign(CENTER)
	text(textA, x, y)
	pop()
}