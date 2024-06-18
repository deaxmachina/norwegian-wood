// Experimenting with colour schemes
const numBinsDesired = 56

const getColsForScale = (numCols, colours) => {
		return [
			colours[0], 
			colours[1], 
			colours[2], 
			colours[3],
			colours[4], 
			colours[5], colours[5], colours[5], colours[5], colours[5], colours[5], colours[5], colours[5], colours[5], colours[5],
			colours[5], colours[5], colours[5], colours[5], colours[5], colours[5], colours[5], colours[5], colours[5], colours[5],
			colours[5], colours[5], colours[5], colours[5], colours[5], colours[5], colours[5], colours[5], colours[5], colours[5],
			colours[5], colours[5], colours[5], colours[5], colours[5], colours[5], colours[5], colours[5], colours[5], colours[5],
			colours[5], colours[5], colours[5], colours[5], colours[5], colours[5], colours[5], colours[5], colours[5], colours[5],
			colours[5], colours[5], colours[5], colours[5], colours[5], colours[5], colours[5], colours[5], colours[5], colours[5],
			colours[5], colours[5], colours[5], colours[5], colours[5], colours[5], colours[5], colours[5], colours[5], colours[5],
			colours[5], colours[5], colours[5], colours[5], colours[5], colours[5], colours[5], colours[5], colours[5], colours[5],
		]
}
const getBinsForLengthDialogue = (lengthsOfAllDialogues) => {
	return d3.bin().thresholds(numBinsDesired)(lengthsOfAllDialogues)
}
const getScaleCol = (bins, colsForScale, num) => {
	const idx = _.indexOf(bins, _.find(bins, d => d.includes(num)))
	return colsForScale[idx]
}
const getLengthsOfAllDialogues = (dialoguesDataArr) => {
	return _.flatten(dialoguesDataArr.map(d => d.dialogue)).map(d => d.text.length)
}


// Get all the lines in a flat list; use the page number to 
// essentially keep track if it's the same dialogue
const getAllDialogueLines = (dialoguesData, colours) => {
	const dialoguesDataArr = Object.values(dialoguesData).reverse()
	
	// For the colours
	const lengthsOfAllDialogues = getLengthsOfAllDialogues(dialoguesDataArr)
	const bins = getBinsForLengthDialogue(lengthsOfAllDialogues)
	const numBins = bins.length
	
	dialoguesDataArr.forEach((dialogue, i) => {
		dialogue.dialogue.forEach(d => {
			d.page = dialogue.page
			d.type = dialogue.page // use page as type for the voronoi
			d.lineLength = d.text.length // add just char count to be the num for now
			//d.col = _.sample(colours),
			d.col = getScaleCol(bins, getColsForScale(numBins, colours), d.text.length), 
			d.dialogueNumber = i
		})
	})
	const allDialogueLines = _.flatten(dialoguesDataArr.map(d => d.dialogue)).filter(d => d.person !== '')	
	
	// Normalise by length of lines
	const minLengthLines = 1 
	const maxLengthLines = _.maxBy(allDialogueLines, d => d.lineLength).lineLength
	allDialogueLines.forEach(d => {
		d.value = (d.lineLength - minLengthLines) / (maxLengthLines - minLengthLines)
	})
	return allDialogueLines
}
