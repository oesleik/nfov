let Key = {
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40,
  ENTER: 13,
  P: 80,
  R: 82,

  pressed: {},
  isDown: function isDown (keyCode) {
    return !!this.pressed[keyCode]
  }
}

window.addEventListener('keydown', function (event) {
  Key.pressed[event.keyCode] = true
}, false)

window.addEventListener('keyup', function (event) {
  Key.pressed[event.keyCode] = false
}, false)
