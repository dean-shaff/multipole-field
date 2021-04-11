const state = {
  height: null,
  width: null,
  interval: 40,
  "slider": null,
  "canvasGrid": null,
  "computeGrid": null,
  "bodies": [
    {
      strength: 1.0,
      diameter: 40,
      clicked: false,
      pos: {
        x: -0.5,
        y: 0
      }
    },
    {
      strength: 1.0,
      diameter: 40,
      clicked: false,
      pos: {
        x: 0.5,
        y: 0
      }
    }
  ],
  "computeScaleFactor": 2,
  "computeOffset": 0.001
}


const canvas2Compute = function (pos) {
  let halfWidth = state.width / 2
  let halfHeight = state.height / 2
  return {
    x: (pos.x - halfWidth)/halfWidth,
    y: (pos.y - halfHeight)/halfHeight
  }
}

const compute2Canvas = function (pos) {
  let halfWidth = state.width / 2
  let halfHeight = state.height / 2
  return {
    x: (pos.x*halfWidth + halfWidth),
    y: (pos.y*halfHeight + halfHeight)
  }
}

const drawArrow = function (pos, vec) {
  const width = state.computeScaleFactor * mag(vec)
  const height = width / 5
  const triWidth = 2.0 * height
  const angleVec = angle(vec)
  push()
  translate(pos.x, pos.y)
  rotate(angle(vec))
  fill(0)
  rect(0, -height/2, width, height)
  triangle(width, -triWidth/2, width, triWidth/2, width + triWidth, 0)
  pop()

}



const makeGrids = function (gridWidth, gridHeight, interval) {
  const nx = Math.ceil(gridWidth / interval)
  const ny = Math.ceil(gridHeight / interval)
  const canvasGrid = new Array(nx * ny)
  const computeGrid = new Array(nx * ny)


  for (let idx=0; idx<nx; idx++) {
    let gridIdx = idx*interval
    for (let idy=0; idy<ny; idy++) {
      let gridIdy = idy*interval
      let arrIdx = idx*ny + idy
      canvasGrid[arrIdx] = {x: gridIdx, y: gridIdy}
      computeGrid[arrIdx] = canvas2Compute(canvasGrid[arrIdx])
    }
  }

  return [canvasGrid, computeGrid]
}

const initBodies = function (bodies) {
  if (bodies === undefined) {
    state.bodies = initBodies(state.bodies)
    return
  }

  return bodies.map(body => {
    body.canvasPos = compute2Canvas(body.pos)
    return body
  })
}

const initGrid = function () {
  const [canvasGrid, computeGrid] = makeGrids(
    state.width, state.height, state.interval)
  state.canvasGrid = canvasGrid
  state.computeGrid = computeGrid
}


const renderGrid = function (canvasGrid, computeGrid, bodies) {
  for (let idx=0; idx<canvasGrid.length; idx++) {
    let vec = calcField(computeGrid[idx], bodies, state.computeOffset)
    drawArrow(canvasGrid[idx], vec)
  }
}

const renderBodies = function (bodies) {
  for (let idx=0; idx < bodies.length; idx++) {
    let bodyItemCanvas = bodies[idx].canvasPos
    let size = bodies[idx].diameter
    circle(
      bodyItemCanvas.x,
      bodyItemCanvas.y,
      size)
    let bodyText = bodies[idx].strength > 0 ? "+" : "-"
    let offset = bodies[idx].strength > 0 ? 0.05*size : 0.0
    textSize(size * 0.8)
    textAlign(CENTER, CENTER)
    text(
      bodyText,
      bodyItemCanvas.x,
      bodyItemCanvas.y + offset)
  }
}


function mousePressed () {
  const mouseCoord = {x: mouseX, y: mouseY}
  for (let idx = 0; idx<state.bodies.length; idx++) {
    let body = state.bodies[idx]
    let pos = body.canvasPos
    let radius = body.diameter / 2
    let diff = sub(pos, mouseCoord)
    let magDiff = mag(diff)
    if (magDiff < radius) {
      state.bodies[idx].clicked = true
      break // only one at a time
      // state.bodies[idx].canvasPos = mouseCoord
      // state.bodies[idx].pos = canvas2Compute(state.bodies[idx].canvasPos)
    }
  }
}

function mouseDragged () {
  const mouseCoord = {x: mouseX, y: mouseY}
  for (let idx = 0; idx<state.bodies.length; idx++) {
    if (state.bodies[idx].clicked) {
      state.bodies[idx].canvasPos = mouseCoord
      state.bodies[idx].pos = canvas2Compute(state.bodies[idx].canvasPos)
    }
  }
}

function mouseReleased () {
  for (let idx = 0; idx<state.bodies.length; idx++) {
    state.bodies[idx].clicked = false
  }
}

function windowResized () {
  console.log("windowResized")
  state.width = windowWidth
  state.height = windowHeight
  resizeCanvas(state.width, state.height)
  initGrid()
}

let slider

function setup () {
  state.width = windowWidth
  state.height = windowHeight

  const canvas = createCanvas(state.width, state.height)
  canvas.parent("app")

  initGrid()
  initBodies()

  renderGrid(
    state.canvasGrid,
    state.computeGrid,
    state.bodies
  )
  renderBodies(state.bodies)
  // slider = createSlider(0.1, 10, 0.1, 0.1);
  // slider.position(10, 10)
  // slider.style('width', '200px')
}


function draw () {
  // state.computeScaleFactor = slider.value();

  clear()
  renderGrid(
    state.canvasGrid,
    state.computeGrid,
    state.bodies
  )
  renderBodies(state.bodies)

}
