const { calcField }= require('./../lib/calcField.js')


const main = function () {
  let bodies = [
    {
      strength: 1.0,
      pos: {
        x: -5,
        y: 0
      }
    },
    {
      strength: 1.0,
      pos: {
        x: 5,
        y: 0
      }
    }
  ]
  let testChargePos = {x: -10, y: -10}
  let res = calcField(testChargePos, bodies)
  console.log(res)
}

main()
