class Butterfly {
  constructor(
		name, // name of the butterfly-character, e.g. Naoko
		data, // dialogue lines for that chara, to use for the Voronoi tree
		ctx, // the drawing context
		colours,
		x, // x position of entire butterfly
		y, // y position of the entire butterfly
		scale=1, // scale of the entire butterfly
		rotate=0, // rotation of the entire butterfly
		rotateWings=-0.5*Math.PI, // rotation of the top right wing
		numPointsLowerWings=20, // constant number of points for the lower unfilled wings
		strokeFillUpperWings = '#efedf4',
		strokeFillLowerWings = '#efedf4',
		strokeFillBody = '#161212',
		backgroundFill = '#161212',
	) {
		this.name = name
		this.data = data
		this.dataTopRightWing = this.data
		this.dataTopLeftWing = this.data
		
    this.ctx = ctx
    this.x = x
    this.y = y
    this.scale = scale
		this.rotate = rotate
		
		this.scaleWings = 12
    this.rotateWings = rotateWings
		
		this.numPointsLowerWings = numPointsLowerWings
		
		this.voronoiClipShape = [
			[0, 0],
			[16, 6],
			[34, 34],
			[5, 24],
			[0, 10],
		]		
		this.butterflyWingPointsUpper = [
			{x: 0, y: 0},
			{x: 16, y: 6},
			{x: 34, y: 34},
			{x: 5, y: 24},
			{x: 0, y: 10},
		]	
		this.voronoiClipShapeLower = [
			[0, 0],
			[11, 0],
			[23, 7],
			[14, 20],
			[18, 30],
			[12, 23],
			[4, 17],
		]
		this.butterflyWingPointsLower = [
			{x: 0, y: 0},
			{x: 11, y: 0},
			{x: 23, y: 7},
			{x: 14, y: 20},
			{x: 18, y: 30},
			{x: 12, y: 23},
			{x: 4, y: 17},
		]	
		this.colours = colours
		this.strokeFillBody = strokeFillBody
    this.strokeFillUpperWings = strokeFillUpperWings
		this.strokeFillLowerWings = strokeFillLowerWings
    this.backgroundFill = backgroundFill
    this.bodyFill = _.sample(this.colours)
		this.gradation = 0
		
		// Initialise the top wings' tree map and corresponding paths (based on initial data)
		this.voronoiTreeMap = this.getVoronoiTreeMap(this.voronoiClipShape)
		this.voronoiPathsTopRightWing = this.getVoronoiPaths(this.voronoiTreeMap)	
		this.voronoiPathsTopLeftWing = this.getVoronoiPaths(this.voronoiTreeMap)	
		
		// Initialise the bottom wings' tree map and corresponding paths
		// Based on dummy data generated with fixed num points, which is initialised once 
		// and not updated ever again
		this.voronoiTreeMapLower = this.getVoronoiTreeMap(this.voronoiClipShapeLower)
		this.voronoiPathsLower = this.getVoronoiPaths(this.voronoiTreeMapLower, this.getDummyData(this.numPointsLowerWings))
		
  }
	
	// Helper function to generate some fake data (for lower wings)
	getDummyData(numPoints) {
		const types = ['A', 'B', 'C', 'D', 'E']
		const data = _.range(numPoints).map(i => {
		return {
			 type: _.sample(types),
			 col: _.sample(this.colours),
			 value: i === 0 ? 500 : i > this.numPoints * 0.8 ? map(Math.random(), 0, 1, 5, 20) : map(Math.random(), 0, 1, 10, 100),
		 }
		})
		return data
	}
	
	// Get the d3 voronoiMap given a clipping shape
	getVoronoiTreeMap(clipShape) {
		const voronoiTreeMap = d3.voronoiTreemap()
			.clip(clipShape)
			.convergenceRatio(0.01)
		return voronoiTreeMap
	}

	// Helper function to set data and update the paths based on the data
	setData(dataTopRightWing, dataTopLeftWing) {
		this.dataTopRightWing = dataTopRightWing
		this.dataTopLeftWing = dataTopLeftWing
		this.voronoiPathsTopRightWing = this.getVoronoiPaths(this.voronoiTreeMap, dataTopRightWing)	
		this.voronoiPathsTopLeftWing = this.getVoronoiPaths(this.voronoiTreeMap, dataTopLeftWing)	
	}
	
	// Using the voronoiTreeMap, get an array of the voroni-generated paths for the given data, 
	// as well as their style properties like fill, stroke, stroke width
  getVoronoiPaths(voronoiTreeMap, data=this.data) {
    const group = d3.group(data, d => d['type'])
    const hierarchy = d3.hierarchy(group).sum(d => d['value'])
    voronoiTreeMap(hierarchy)
    const voronoiPaths = hierarchy.descendants()
      .sort((a, b) => b.depth - a.depth)
      .map((d, i) => Object.assign({}, d, {id: i}))
    // Add the complete path string for the nodes 
    voronoiPaths.forEach(path => path.d = "M" + path.polygon.join("L") + "Z")
		// Compute the paths corresponding to the path strings
		voronoiPaths.forEach(path => path.path = new Path2D(path.d))
    // Add the stroke width and col for each of the paths: depth 0 is outer, 1 is dialogue, 2 is line 
    voronoiPaths.forEach(path => path.strokeWidth = path.depth === 0 
												? 0.6
												: path.depth === 1
												 ? 0.3
													: _.sample([0.3, 0.4, 0.5, 1, 1.5, 2, 2.5])/this.scaleWings)
    voronoiPaths.forEach((path, i) => path.fill = data[i]?.col || 'red') // TODO: make this an itial array of cols so they don't change
		// Select only the props that we need to return
	  const voronoiPathsLimited = voronoiPaths.map(d => {
        return { 
					value: d.value,
          path: d.path,
          strokeWidth: d.strokeWidth,
					height: d.height,
					depth: d.depth,
          fill: d.fill
      }
    })	
		return voronoiPathsLimited
  }
  
  // Draw the voronoi paths for a single wing - filled or just stroked
	// Note that will draw all the voronoi paths according to the supplied clipping path for the voronoi;
  drawVoronoiTree(voronoiPaths, filled=true) {
    voronoiPaths.forEach((path, i) => {
      this.ctx.save()
      if (filled) {
        this.ctx.fillStyle =  path.fill
      } else {
        this.ctx.fillStyle = this.backgroundFill
      } 
      this.ctx.strokeStyle = filled ? this.strokeFillUpperWings : this.strokeFillLowerWings
      this.ctx.lineWidth = path.strokeWidth
      this.ctx.beginPath()
      if (path.depth === 2) this.ctx.fill(path.path)
      this.ctx.stroke(path.path)
      this.ctx.closePath()
      this.ctx.restore()
    })
  }
	
	// Special case for Toru - don't draw a voronoi wing but a simple clipped shape
	drawKumikoWing(filled=true) {			
		this.ctx.save()
		
		// The clipping shape - same as the top wings
		this.ctx.strokeStyle = 'white'
		this.ctx.lineWidth = 1.5
		drawPolygon(this.ctx, this.butterflyWingPointsUpper, '#161212', 'white')
		this.ctx.clip()
		
		const noise1 = noise(0.003 * this.gradation)
		const noise2 = 1 - noise(0.01 * this.gradation)
		const noise3 = noise(0.006 * this.gradation)
		
		// Shape that will be clipped but the clipping wing shape - overlapping rects
		this.ctx.fillStyle = '#ad1450'
		this.ctx.fillRect(0, 0, 38 * noise1, 30 * noise1) 
		this.ctx.fillStyle ='#dd125b' 
		this.ctx.fillRect(0, 0, 27 * noise2, 26 * noise2) 
		this.ctx.fillStyle = '#e84688'
		this.ctx.fillRect(0, 0, 16 * noise3, 22 * noise3) 
		// this.ctx.fillStyle = '#161212'
		// this.ctx.fillRect(0, 0, 6, 8) 
		this.ctx.stroke()
		
		this.ctx.restore()
  }

  // Draw a single complete wing (voronoi + clipping mask)
  drawWing(voronoiPaths, rotate, wing='right', filled=true, specialCaseToru=false) {
    // This affects everything - both mask and following wing
    this.ctx.save()
		// Translate to adjust where the wings are
    this.ctx.translate(0, 100) // this number should be somehow programmatic
	
		// Scale the wings. Also use the scale to reflect the left wing
    if (wing === 'left') this.ctx.scale(-1*this.scaleWings, 1*this.scaleWings) 
    if (wing === 'right') this.ctx.scale(this.scaleWings, this.scaleWings) 
		
		// Rotate by the supplied rotation amount
    if (wing === 'left')  this.ctx.rotate(rotate)
    if (wing === 'right') this.ctx.rotate(rotate)
		
		if (!specialCaseToru) {
			this.drawVoronoiTree(voronoiPaths, filled)
		} else {
			this.drawKumikoWing(filled)
		}

    this.ctx.restore()
  }
  
  // Draw both left and right wing, up and down
  drawWings(specialCaseToru=false) {
    // Unfilled bottom right and left wings
    this.drawWing(this.voronoiPathsLower, 0.1*this.rotateWings, 'right', false, specialCaseToru) // 
    this.drawWing(this.voronoiPathsLower, 0.1*this.rotateWings, 'left', false, specialCaseToru)
    
		// Filled top right and left wings
    this.drawWing(this.voronoiPathsTopLeftWing, this.rotateWings, 'left', true, specialCaseToru)
		this.drawWing(this.voronoiPathsTopRightWing, this.rotateWings, 'right', true, specialCaseToru)
  }
  
  // Draw the body 
  drawBody(numSegments = 16, gap = 2) {
    const fill = this.bodyFill
    this.ctx.save()
    _.range(numSegments).forEach(i => {
      this.ctx.beginPath()
      this.ctx.arc(
				0, 
				(numSegments+gap)*i - 50, 
				Math.max(5, (numSegments - i))*this.scale*1.5, 
				0, Math.PI*2
			)
      this.ctx.fillStyle = fill
      this.ctx.strokeStyle = this.strokeFillBody
      this.ctx.fill()
      this.ctx.stroke()
    })
    this.ctx.restore()
  }
  
  // Draw everything 
  drawDragonfly() {
		this.ctx.translate(this.x, this.y)
		this.ctx.scale(this.scale, this.scale) 
		this.ctx.rotate(this.rotate)
    this.drawWings()
    this.drawBody()
  }
	
	// Special case for Toru
	drawDragonflyToru() {
		this.ctx.translate(this.x, this.y)
		this.ctx.scale(this.scale, this.scale) 
		this.ctx.rotate(this.rotate)
    this.drawWings(true)
    this.drawBody()
  }
  
  // Change the rotation - this is useful for animation
  setRotateWings(rotate) {
    this.rotateWings = rotate
  }
  
  // Check if the whole dragonfly is 'hovered'
	// TODO: This can be refactored to use the is point in path api
  clicked(x, y) {
    const d = dist(x, y, this.x, this.y)
    return (d < this.scale * 1000/2)
  }
}
