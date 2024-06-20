// Init the data
let dialoguesData
let allDialogueLines
// Keep track of dialogue data time goes
let dataNaokoLeftWing = []
let dataNaokoRightWing = []
let dataReikoLeftWing = []
let dataReikoRightWing = []
let dataMidoriLeftWing = []
let dataMidoriRightWing = []
let gradation = 0

// Positions for the songs - TODO: Change this later based on actual data
let musicData
let music

const butterflyCols = ['#988ea2', '#5c5368', '#161212','#e84688', '#dd125b', '#ad1450']
const flowerCols = ['#47b176', '#80ed99', '#2ec4b6'] // ['#47b176', '#5bb224', '#98c21d', '#2ec4b6']
const bgCol = '#161212'

// Init the 'butterflies' (named after the characters)
const butterflies = []
let toru 
let naoko 
let reiko 
let midori 

// Init vars that we need
let ctx
let side 
let horde
let simulation
let looping = false

///////////////////////////////
////////// Preload ////////////
///////////////////////////////
function preload() {
  dialoguesData = loadJSON('norwegian_wood_dialogues_4.json')
	musicData = loadJSON('norwegian_wood_music.json')
}


///////////////////////////////
/////////// Setup /////////////
///////////////////////////////
function setup() {	
	// Setup the canvas 
	createCanvas(windowWidth, windowHeight)
	background(0)
	frameRate(50)
	// pixelDensity(4)
	ctx = drawingContext // get the ctx of the new graphic
	
	// Setup drawing variables
	side = 200
	horde = side * sin(PI/3) // How much to translate from the center
	
	// Get all the data in a flat array
	allDialogueLines = getAllDialogueLines(dialoguesData, butterflyCols)

	// Initial data values = first line by each character
	const firstLineByNaoko = _.find(allDialogueLines, d => d.person === 'Naoko')
	dataNaokoRightWing.push(firstLineByNaoko)
	dataNaokoLeftWing.push(firstLineByNaoko)
	const firstLineByReiko = _.find(allDialogueLines, d => d.person === 'Reiko')
	dataReikoRightWing.push(firstLineByReiko)
	dataReikoLeftWing.push(firstLineByReiko)
	const firstLineByMidori = _.find(allDialogueLines, d => d.person === 'Midori')
	dataMidoriRightWing.push(firstLineByMidori)
	dataMidoriLeftWing.push(firstLineByMidori)
	
	// Create the character-butterflies, initialise with the initial data 
	// and save them into the butterflies array 
	toru = new Butterfly('Toru', [], ctx, butterflyCols, 0, -horde*0.32, 0.4, 0)
	naoko = new Butterfly('Naoko', dataNaokoRightWing, ctx, butterflyCols, side*1.7, -horde*1.1, 0.5, -PI*0.60)
	reiko = new Butterfly('Reiko', dataReikoRightWing, ctx, butterflyCols, side*1, horde*1.15, 0.45, -PI*0.15)
	midori = new Butterfly('Midori', dataMidoriRightWing, ctx, butterflyCols, -side*1.5, -horde*1, 0.6, PI*0.65)
	butterflies.push(toru)
	butterflies.push(naoko)
	butterflies.push(reiko)
	butterflies.push(midori)
	
	// Music data (flowers)
	music = Object.values(musicData).map(d => {
		return {
			...d,
			x: random([random(10, width * 0.4), random(10, width * 0.5), random(width*0.8, width-30)]),
			y: height*0.95 - random(height * 0.4),
			r: random(30, 100),
			fillA: d.song === 'Norwegian Wood' ? '#ad1450' : random(flowerCols),
			scaleA: d.song === 'Norwegian Wood' ? 0.7 : random(0.2, 0.7),
			opacityA: d.song === 'Norwegian Wood' ? 0.85 : random(0.18, 0.75),
			rotationA: random(0, 360),
			rotationFactor: random(0, 0.5)
		}
	})
	// Simulation to make the flowers overlap just a little bit less
	simulation = d3.forceSimulation(music)
    .force("collide", d3.forceCollide().radius(d => d.scaleA*60).strength(0.8))
    .on("tick", () => {
      music = [...music]
    })
	
		// Events
		const overlay = document.querySelector('.overlay')
		const wrapperAbout = document.querySelector('.wrapper-about')
		const bookPullout = document.querySelector('.pullout')
		const bookPulloutText = document.querySelector('.pullout span')
		overlay.addEventListener('click', () => {
			wrapperAbout.style.left = '100%'
			wrapperAbout.style.transform = 'translate(0%, -50%)'
			overlay.style.opacity = 0
			overlay.style.pointerEvents = 'none'
			bookPulloutText.style.opacity = 1
			looping = true
			loop()
		})
		bookPullout.addEventListener('click', () => {
			wrapperAbout.style.left = '50%'
			wrapperAbout.style.transform = 'translate(-50%, -50%)'
			overlay.style.opacity = 1
			overlay.style.pointerEvents = 'all'
			bookPulloutText.style.opacity = 0
			looping = false
			noLoop()
		})

		const radioButtonToPage1 = document.getElementById('page-1');
		const radioButtonToPage2 = document.getElementById('page-2');
    const pulloutInBook = document.querySelector('.pullout-in-book');
    radioButtonToPage2.addEventListener('change', () => {
      if (radioButtonToPage2.checked) {
        pulloutInBook.style.opacity = 0
      } 
    })
		radioButtonToPage1.addEventListener('change', () => {
      if (radioButtonToPage1.checked) {
        pulloutInBook.style.opacity = 1
      } 
    })
}



///////////////////////////////
//////////// Draw /////////////
///////////////////////////////
let currentLineInDailogue = 0
let frameCountToru = 0
let rotateToru = -0.5*Math.PI
let frameCountNaoko = 0
let rotateNaoko = -0.5*Math.PI
let frameCountReiko = 0
let rotateReiko = -0.5*Math.PI
let frameCountMidori = 0
let rotateMidori = -0.5*Math.PI

function draw() {
	background(bgCol)

	if (looping) {
		loop()
	} else {
		noLoop()
	}
	
	//////////////////////////////////
	///////// Kumiko pattern /////////
	//////////////////////////////////
	push()
	angleMode(DEGREES);
	translate(-width/2, -height/2)
	let r = 20;
	let padX = r + r * cos(60); 
	let padY = r * sin(60); 	
	let distX = r - r * cos(60);　
	
	for(let a=0; a<90; a++){
		for(let b=0; b<90; b++){
			noFill()
			stroke('#2e323a') 
			strokeWeight(0.5)

			if((a+b)%2 == 0){
				drawTriangle(b*padX, a*padY, r, 0)
			}else{
				drawTriangle(b*padX+distX, a*padY, r, 180)
			}
		}
	}
	pop()

	/////////////////////////////////
	/////// Mobile version //////////
	/////////////////////////////////
	if (windowHeight < 680 || windowWidth < 1150) {
		loop()
		push()
		toru.gradation = frameCount
		toru.setRotateWings(rotateToru)
		rotateToru= -0.5*Math.PI + sin(frameCountToru)*0.2
		frameCountToru++
		translate(width/2, height/2)
		toru.drawDragonflyToru()
		pop()
		return
	}
	

	angleMode(RADIANS);
	translate(width*0.5, height/2)
	noFill()
	noStroke()
	strokeWeight(4)
	drawHexes(side, horde)
	
	// Update the data: At each iteration of the draw loop, take the next line in the array of all dialogues lines 
	// (indexing by currentLineInDailogue), which updates by 1 each draw. Then check who that line is by and 
	// push that line to the data array for that character only. This triggers an update to the data and 
	// vornoi tree for that character only
	const currentLine = allDialogueLines[currentLineInDailogue]
	const currentLineAttribution = currentLine.person
	
	// Toru: special case - we don't draw voronoi but a special pattern
	if (currentLineAttribution === 'Toru') {
		toru.gradation = frameCount
		// To rotate the wings
		toru.setRotateWings(rotateToru)
		rotateToru= -0.5*Math.PI + sin(frameCountToru)*0.2
		frameCountToru++
	}
	if (currentLineAttribution === 'Naoko') {
		if (currentLine.dialogueNumber % 2 === 0) {
			dataNaokoLeftWing.push(currentLine)
		} else {
			dataNaokoRightWing.push(currentLine)
		}
		naoko.setData(dataNaokoLeftWing, dataNaokoRightWing)
		naoko.setRotateWings(rotateNaoko)
		rotateNaoko = -0.5*Math.PI + sin(frameCountNaoko)*0.2
		frameCountNaoko++
	}
	if (currentLineAttribution === 'Reiko') {
		if (currentLine.dialogueNumber % 2 === 0) {
			dataReikoLeftWing.push(currentLine)
		} else {
			dataReikoRightWing.push(currentLine)
		}
		reiko.setData(dataReikoLeftWing, dataReikoRightWing)
		reiko.setRotateWings(rotateReiko)
		rotateReiko = -0.5*Math.PI + sin(frameCountReiko)*0.2
		frameCountReiko++
	}
	if (currentLineAttribution === 'Midori') {
		if (currentLine.dialogueNumber % 2 === 0) {
			dataMidoriLeftWing.push(currentLine)
		} else {
			dataMidoriRightWing.push(currentLine)
		}
		midori.setData(dataMidoriLeftWing, dataMidoriRightWing)
		midori.setRotateWings(rotateMidori)
		rotateMidori = -0.5*Math.PI + sin(frameCountMidori)*0.2
		frameCountMidori++
	}
	if (currentLineInDailogue >= allDialogueLines.length-1) {
		// currentLineInDailogue = allDialogueLines.length-2
		noLoop()
	}
	currentLineInDailogue++
	//currentLineInDailogue += frameCount%3 === 0 ? 1 : 0 // to slow down the speed of data update

	/////////////////////////////
	//// Draw the butterflies ///
	/////////////////////////////
	// Center 
	push()
	toru.drawDragonflyToru()
	pop()
	// Right and up
	push()
	naoko.drawDragonfly()
	pop()	
	// Right and down
	push()
	reiko.drawDragonfly()
	pop()
	// Left and up 
	push()
	midori.drawDragonfly()
	pop()
	
	/////////////////////////////
	/////// Draw the songs //////
	/////////////////////////////
	// Draw songs that appear on the pages before the current page
	push()
	translate(-width/2, -height/2)
	music.forEach(({ x, y, r, fillA, scaleA, opacityA, rotationA, rotationFactor, page, artist, song, type }) => {
		if (page <= currentLine.page) {
			drawMusic(x, y, r, fillA, scaleA, opacityA, rotationA+frameCount*rotationFactor, artist, song, type)
		}
	})
	pop()


	/////////////////////////////
	////// Draw progress bar ////
	/////////////////////////////
	push()
	fill(red('#5c5368'), green('#5c5368'), blue('#5c5368'), 100)
	translate(-width/2, -height/2)	
	const barWidth = map(currentLineInDailogue, 0, allDialogueLines.length-1, 0, width)
	rect(0, 0, barWidth, 8)
	drawMusic(barWidth+6, 4, r, '#ad1450', 0.2, 0.8, frameCount, '', 'Norwegian Wood', '')
	pop()
}


// Resize the canvas when the browser's size changes.
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}