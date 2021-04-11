const dot = function (vec0, vec1) {
  return vec0.x*vec1.x + vec0.y*vec1.y
}

const sub = function (vec0, vec1) {
  return {
    x: vec0.x - vec1.x,
    y: vec0.y - vec1.y
  }
}

const mag = function (vec) {
  return Math.sqrt(dot(vec, vec))
}

const angle = function (vec) {
  // return Math.atan(vec.y / vec.x)
  return Math.atan2(vec.y, vec.x)
}


/**
 * Calculate the field at position pos, given a list of charges/masses bodies
 * @param  {[type]} pos    [description]
 * @param  {[type]} bodies [description]
 * @return {[type]}        [description]
 */
const calcField = function (pos, bodies, offset) {

  let res = {x: 0.0, y: 0.0}
  for (let idx=0; idx<bodies.length; idx++) {
    let body = bodies[idx]
    let bodyPos = body.pos
    let bodyStrength = body.strength

    let diff = sub(pos, bodyPos)
    // let denom = mag(diff)
    let sqrMag = dot(diff, diff)
    // let denom = Math.pow(sqrMag, 1.5)
    let denom = sqrMag

    res.x += bodyStrength * diff.x / (denom + offset)
    res.y += bodyStrength * diff.y / (denom + offset)
  }

  return res
}

if (typeof window === "undefined") {
  exports.calcField = calcField
}
