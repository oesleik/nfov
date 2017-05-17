const canvas = document.getElementById('gameCanvas')
const ctx = canvas.canvas.getContext('2d')
let lastUpdate = 0

function tick (timestamp) {
  if (lastUpdate) {
    update((timestamp - lastUpdate) / 1000)
    render()
  }

  lastUpdate = timestamp
  window.requestAnimationFrame(tick)
}

function update (elapsed) {

}

function render () {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
}

window.requestAnimationFrame(tick)
