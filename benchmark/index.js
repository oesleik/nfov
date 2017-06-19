const Benchmark = require('benchmark')
const bDistance = require('./distance')
const bAngle = require('./angle')
const bObstacles = require('./obstacles')
const suite = new Benchmark.Suite()

suite.add('distance 1 Player 1 Objects', bDistance(1, 1))
suite.add('distance 1 Player 100 Objects', bDistance(1, 100))
suite.add('distance 1 Player 1000 Objects', bDistance(1, 1000))

suite.add('distance 10 Players 1 Objects', bDistance(10, 1))
suite.add('distance 10 Players 100 Objects', bDistance(10, 100))
suite.add('distance 10 Players 1000 Objects', bDistance(10, 1000))

suite.add('distance 100 Players 1 Objects', bDistance(100, 1))
suite.add('distance 100 Players 100 Objects', bDistance(100, 100))
suite.add('distance 100 Players 1000 Objects', bDistance(100, 1000))

suite.add('angle 1 Player 1 Objects', bAngle(1, 1))
suite.add('angle 1 Player 100 Objects', bAngle(1, 100))
suite.add('angle 1 Player 1000 Objects', bAngle(1, 1000))

suite.add('angle 10 Players 1 Objects', bAngle(10, 1))
suite.add('angle 10 Players 100 Objects', bAngle(10, 100))
suite.add('angle 10 Players 1000 Objects', bAngle(10, 1000))

suite.add('angle 100 Players 1 Objects', bAngle(100, 1))
suite.add('angle 100 Players 100 Objects', bAngle(100, 100))
suite.add('angle 100 Players 1000 Objects', bAngle(100, 1000))

suite.add('obstacles 1 Player 1 Objects', bObstacles(1, 1))
suite.add('obstacles 1 Player 100 Objects', bObstacles(1, 100))
suite.add('obstacles 1 Player 1000 Objects', bObstacles(1, 1000))

suite.add('obstacles 10 Players 1 Objects', bObstacles(10, 1))
suite.add('obstacles 10 Players 100 Objects', bObstacles(10, 100))
suite.add('obstacles 10 Players 1000 Objects', bObstacles(10, 1000))

suite.add('obstacles 100 Players 1 Objects', bObstacles(100, 1))
suite.add('obstacles 100 Players 100 Objects', bObstacles(100, 100))
suite.add('obstacles 100 Players 1000 Objects', bObstacles(100, 1000))

suite.on('cycle', function (event) {
  console.log(String(event.target))
})

suite.run({ 'async': true })
