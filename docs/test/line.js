const grid = getGrid(9, 12)
const agent = { x: 1, y: 1 }
const target = { x: 10, y: 6 }
const tileSize = { width: 25, height: 25 }

grid[agent.y][agent.x] = 'orange'
agent.x *= tileSize.width
agent.y *= tileSize.height

grid[target.y][target.x] = 'red'
target.x *= tileSize.width
target.y *= tileSize.height

drawDDA(grid, agent, target, tileSize)
drawBresenham(grid, agent, target, tileSize)
drawAmanatidesWoo(grid, agent, target, tileSize)

function drawDDA (gridDDA, agent, target, tileSize) {
  const grid = gridDDA.map(function (row) { return row.slice() })
  const dda = makeDDA(agent, target, tileSize)
  let point = dda.next()

  while (point) {
    if (grid[point.y][point.x] === 'white') {
      grid[point.y][point.x] = '#ccc'
    }

    point = dda.next()
  }

  drawCanvas('DDA', 'canvasDDA', grid, agent, target, tileSize)
}

function drawBresenham (gridBresenham, agent, target, tileSize) {
  const grid = gridBresenham.map(function (row) { return row.slice() })
  const bresenham = makeBresenham(agent, target, tileSize)
  let point = bresenham.next()

  while (point) {
    if (grid[point.y][point.x] === 'white') {
      grid[point.y][point.x] = '#ccc'
    }

    point = bresenham.next()
  }

  drawCanvas('Bresenham', 'canvasBresenham', grid, agent, target, tileSize)
}

function drawAmanatidesWoo (gridRay, agent, target, tileSize) {
  const grid = gridRay.map(function (row) { return row.slice() })
  const rayCast = makeAmanatidesWoo(agent, target, tileSize)
  let point = rayCast.next()

  while (point) {
    if (grid[point.y][point.x] === 'white') {
      grid[point.y][point.x] = '#ccc'
    }

    point = rayCast.next()
  }

  drawCanvas('Amanatides & Woo', 'canvasRay', grid, agent, target, tileSize)
}

function makeDDA (_agent, _target, tileSize) {
  const agent = {
    x: _agent.x / tileSize.width,
    y: _agent.y / tileSize.height
  }

  const target = {
    x: _target.x / tileSize.width,
    y: _target.y / tileSize.height
  }

  const delta = {
    x: target.x - agent.x,
    y: target.y - agent.y
  }

  let steps = Math.abs(delta.x) > Math.abs(delta.y) ? Math.abs(delta.x) : Math.abs(delta.y)

  const step = {
    x: steps > 0 ? delta.x / steps : 0,
    y: steps > 0 ? delta.y / steps : 0
  }

  const point = {
    x: agent.x,
    y: agent.y
  }

  return {
    next: function next () {
      // ignore last step (target position)
      if (steps > 1) {
        point.x += step.x
        point.y += step.y
        steps--

        return {
          x: Math.floor(point.x),
          y: Math.floor(point.y)
        }
      } else {
        return false
      }
    }
  }
}

function makeBresenham (_agent, _target, tileSize) {
  const agent = {
    x: _agent.x / tileSize.width,
    y: _agent.y / tileSize.height
  }

  const target = {
    x: _target.x / tileSize.width,
    y: _target.y / tileSize.height
  }

  const delta = {
    x: Math.floor(Math.abs(target.x - agent.x)),
    y: Math.floor(Math.abs(target.y - agent.y))
  }

  const step = {
    x: target.x >= agent.x ? 1 : -1,
    y: target.y >= agent.y ? 1 : -1
  }

  let error = delta.x - delta.y

  const point = {
    x: agent.x,
    y: agent.y
  }

  return {
    next: function next () {
      if (point.x === target.x && point.y === target.y) {
        return false
      } else if (error > delta.y * -1) {
        error -= delta.y
        point.x += step.x
      } else if (error < delta.x) {
        error += delta.x
        point.y += step.y
      } else {
        return false
      }

      return {
        x: point.x,
        y: point.y
      }
    }
  }
}

function makeAmanatidesWoo (_agent, _target, tileSize) {
  const agent = {
    x: _agent.x / tileSize.width,
    y: _agent.y / tileSize.height
  }

  const target = {
    x: _target.x / tileSize.width,
    y: _target.y / tileSize.height
  }

  const direction = {
    x: target.x - agent.x,
    y: target.y - agent.y
  }

  const delta = {
    x: direction.x === 0 ? 0 : Math.abs(1 / direction.x),
    y: direction.y === 0 ? 0 : Math.abs(1 / direction.y)
  }

  const over = {
    x: agent.x - Math.floor(agent.x),
    y: agent.y - Math.floor(agent.y)
  }

  const current = {
    x: direction.x === 0 ? 2 : (direction.x > 0 ? 1 - over.x : over.x) * delta.x,
    y: direction.y === 0 ? 2 : (direction.y > 0 ? 1 - over.y : over.y) * delta.y
  }

  const step = {
    x: direction.x >= 0 ? 1 : -1,
    y: direction.y >= 0 ? 1 : -1
  }

  const point = {
    x: Math.floor(agent.x),
    y: Math.floor(agent.y)
  }

  return {
    next: function next () {
      if (current.x > 1 && current.y > 1) {
        return false
      }

      if (current.x <= current.y) {
        current.x += delta.x
        point.x += step.x
      } else {
        current.y += delta.y
        point.y += step.y
      }

      return {
        x: point.x,
        y: point.y
      }
    }
  }
}

function drawCanvas (legend, id, grid, agent, target, tileSize) {
  const canvas = document.getElementById(id)
  const ctx = canvas.getContext('2d')

  canvas.width = grid[0].length * tileSize.width
  canvas.height = grid.length * tileSize.height

  grid.forEach(function (row, idxRow) {
    row.forEach(function (tile, idxCol) {
      const pos = {
        x: idxCol * tileSize.width + 1,
        y: idxRow * tileSize.height + 1
      }

      const border = {
        right: idxCol === row.length - 1 ? 2 : 1,
        bottom: idxRow === grid.length - 1 ? 2 : 1
      }

      ctx.beginPath()
      ctx.rect(pos.x, pos.y, tileSize.width - border.right, tileSize.height - border.bottom)
      ctx.strokeStyle = '#888'
      ctx.fillStyle = tile
      ctx.stroke()
      ctx.fill()
      ctx.closePath()
    })
  })

  ctx.beginPath()
  ctx.moveTo(agent.x + tileSize.width / 2, agent.y + tileSize.height / 2)
  ctx.lineTo(target.x + tileSize.width / 2, target.y + tileSize.height / 2)
  ctx.strokeStyle = 'black'
  ctx.stroke()
  ctx.closePath()

  ctx.fillStyle = 'black'
  ctx.font = '20px serif'
  ctx.clearRect(0, grid.length * tileSize.width - 32, grid[0].length * tileSize.width, 32)
  ctx.fillText(legend, 10, grid.length * tileSize.width - 10)
}

function getGrid (rows, cols) {
  const grid = []

  for (var i = 0; i < rows; i++) {
    grid[i] = []

    for (var j = 0; j < cols; j++) {
      grid[i][j] = 'white'
    }
  }

  return grid
}
