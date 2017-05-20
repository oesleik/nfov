(function (requestAnimationFrame, Key, Image) {
  let canvas, ctx, lastUpdate, sprites, player, walls, enemies

  const level = [
    'XXXXXXXXXXXXXXXXXXXXXXXXX',
    'X      X                X',
    'X P    X                X',
    'X      X                X',
    'X      X                X',
    'X      X                X',
    'X      X                X',
    'X      X     XXXXXXXXXXXX',
    'X                       X',
    'X                       X',
    'X                       X',
    'X                       X',
    'X                       X',
    'X                       X',
    'X                       X',
    'X                       X',
    'X                       X',
    'X                       X',
    'XXXXXXXXXXXXXXXXXXXXXXXXX'
  ]

  const config = {
    player: {
      speed: 5
    },
    enemy: {
      speed: 2,
      chance: {
        spawn: 1,
        move: 30
      }
    }
  }

  function loadAsset (path) {
    const asset = new Image()
    asset.src = path
    return asset
  }

  function createSprite (x, y, width, height, image) {
    return {
      x: x,
      y: y,
      width: width,
      height: height,
      rotation: 0,
      image: image
    }
  }

  function chanceRoll (chance) {
    return chance >= Math.random() * 100
  }

  function deg2Rad (deg) {
    return (deg * Math.PI) / 180
  }

  function forEachSprite (sprites, callback) {
    if (Array.isArray(sprites)) {
      sprites.forEach(function (sprite) {
        forEachSprite(sprite, callback)
      })
    } else {
      return callback(sprites)
    }
  }

  function checkCollision (sprites1, sprites2, callback) {
    forEachSprite(sprites1, function (s1) {
      forEachSprite(sprites2, function (s2) {
        let collided =
          s1.x < s2.x + s2.width &&
          s1.x + s1.width > s2.x &&
          s1.y < s2.y + s2.height &&
          s1.y + s1.height > s2.y

        if (collided) {
          if (s1.vx > 0) {
            s1.x = s2.x - s1.width
          } else if (s1.vx < 0) {
            s1.x = s2.x + s2.width
          }

          if (s1.vy > 0) {
            s1.y = s2.y - s1.height
          } else if (s1.vy < 0) {
            s1.y = s2.y + s2.height
          }

          s1.vx = s1.vy = 0

          if (typeof callback === 'function') {
            callback(s1, s2)
          }
        }
      })
    })
  }

  function configureEnemy (enemy, config) {
    enemy.vx = enemy.vy = 0

    if (chanceRoll(config.chance.move)) {
      if (chanceRoll(50)) {
        enemy.vx = config.speed
        enemy.rotation = 0
      } else {
        enemy.vy = config.speed * -1
        enemy.rotation = 90
      }

      if (chanceRoll(50)) {
        enemy.vx *= -1
        enemy.vy *= -1
        enemy.rotation += 180
      }
    }
  }

  function update (elapsed) {
    player.vx = player.vy = 0

    if (Key.isDown(Key.LEFT)) {
      player.vx -= config.player.speed
      player.rotation = 180
    } else if (Key.isDown(Key.RIGHT)) {
      player.vx += config.player.speed
      player.rotation = 0
    } else if (Key.isDown(Key.UP)) {
      player.vy -= config.player.speed
      player.rotation = 270
    } else if (Key.isDown(Key.DOWN)) {
      player.vy += config.player.speed
      player.rotation = 90
    }

    player.x += player.vx
    player.y += player.vy

    enemies.forEach(function (enemy) {
      enemy.x += enemy.vx
      enemy.y += enemy.vy
    })

    checkCollision(player, walls)

    checkCollision(enemies, walls, function (enemy) {
      if (enemy.rotation === 0) {
        enemy.vx = config.enemy.speed * -1
        enemy.rotation = 180
      } else if (enemy.rotation === 180) {
        enemy.vx = config.enemy.speed
        enemy.rotation = 0
      } else if (enemy.rotation === 270) {
        enemy.vy = config.enemy.speed * -1
        enemy.rotation = 90
      } else if (enemy.rotation === 90) {
        enemy.vy = config.enemy.speed
        enemy.rotation = 270
      }
    })
  }

  function render () {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    sprites.forEach(function (sprite) {
      let centerX = sprite.x + (sprite.width / 2)
      let centerY = sprite.y + (sprite.height / 2)

      ctx.save()
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.translate(centerX, centerY)
      ctx.rotate(deg2Rad(sprite.rotation))
      ctx.translate(-centerX, -centerY)
      ctx.drawImage(sprite.image, sprite.x, sprite.y)
      ctx.restore()
    })
  }

  function create () {
    const assets = {
      player: loadAsset('assets/player.svg'),
      enemy: loadAsset('assets/enemy.svg'),
      wall: loadAsset('assets/brick.svg')
    }

    player = createSprite(0, 0, 24, 24, assets.player)
    player.vx = player.vy = 0

    walls = []
    enemies = []

    level.forEach(function (line, i) {
      line.split('').forEach(function (block, j) {
        if (block === ' ') {
          if (chanceRoll(config.enemy.chance.spawn)) {
            block = 'O'
          }
        }

        switch (block) {
          case 'P':
            player.x = (j * 32) + 4
            player.y = (i * 32) + 4
            break
          case 'X':
            let wall = createSprite(j * 32, i * 32, 32, 32, assets.wall)
            walls.push(wall)
            break
          case 'O':
            let enemy = createSprite((j * 32 + 4), (i * 32 + 4), 24, 24, assets.enemy)
            configureEnemy(enemy, config.enemy)
            enemies.push(enemy)
            break
        }
      })
    })

    sprites = walls.concat(enemies).concat([player])
  }

  function gameLoop (timestamp) {
    if (lastUpdate) {
      update((timestamp - lastUpdate) / 1000)
      render()
    }

    lastUpdate = timestamp
    requestAnimationFrame(gameLoop)
  }

  window.onload = function () {
    canvas = document.getElementById('canvas')
    ctx = canvas.getContext('2d')
    lastUpdate = 0

    canvas.style.backgroundColor = '#999999'
    canvas.width = level[0].length * 32
    canvas.height = level.length * 32

    create()
    requestAnimationFrame(gameLoop)
  }
}(window.requestAnimationFrame, window.Key, window.Image))
