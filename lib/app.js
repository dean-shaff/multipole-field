
const width = 800
const offsetWidth = width / 2
const height = 800
const offsetHeight = height / 2
const interval = 40

const canvas2Compute = function (pos) {
  return {
    x: (pos.x - width / 2),
    y: (pos.y - height / 2)
  }
}

const compute2Canvas = function (pos) {
  return {
    x: (pos.x + width / 2),
    y: (pos.y + height / 2)
  }
}


const state = {
  "slider": null,
  "canvasGrid": null,
  "computeGrid": null,
  "bodies": [
    // {
    //   strength: 1.0,
    //   diameter: 40,
    //   clicked: false,
    //   pos: {
    //     x: -200.1,
    //     y: 0
    //   },
    // },
    {
      strength: 1.0,
      diameter: 40,
      clicked: false,
      pos: {
        x: 200.1,
        y: 0
      }
    }
  ],
  "computeScaleFactor": 1000
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
  const nx = Math.floor(gridWidth / interval)
  const ny = Math.floor(gridHeight / interval)
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



const renderGrid = function (canvasGrid, computeGrid, bodies) {

  for (let idx=0; idx<canvasGrid.length; idx++) {
    let vec = calcField(computeGrid[idx], bodies)
    drawArrow(canvasGrid[idx], vec)
  }
}

const renderBodies = function (bodies) {
  for (let idx=0; idx < bodies.length; idx++) {
    let bodyItemCanvas = bodies[idx].canvasPos
    circle(
      bodyItemCanvas.x,
      bodyItemCanvas.y,
      bodies[idx].diameter)
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
  return false
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

let slider

function setup () {
  for (let idx = 0; idx<state.bodies.length; idx++) {
    state.bodies[idx].canvasPos = compute2Canvas(state.bodies[idx].pos)
  }

  const canvas = createCanvas(width, height)
  canvas.parent("app")
  const [canvasGrid, computeGrid] = makeGrids(width, height, interval)
  state.canvasGrid = canvasGrid
  state.computeGrid = computeGrid
  //
  // slider = createSlider(10000, 1000000, 10000);

  renderGrid(
    state.canvasGrid,
    state.computeGrid,
    state.bodies
  )
  renderBodies(state.bodies)

  slider = createSlider(0, 10, 1)
  slider.position(10, 10)
  slider.style('width', '200px')
}


function draw () {
  // let computeScaleFactor = state.computeScaleFactor
  val = slider.value()
  // console.log(val)
  //
  clear()
  renderGrid(
    state.canvasGrid,
    state.computeGrid,
    state.bodies
  )
  renderBodies(state.bodies)
  // background(220)
  // ellipse(50, 50, 80, 80)
}
