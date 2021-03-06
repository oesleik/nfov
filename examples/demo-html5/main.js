(function (requestAnimationFrame, Key, Image, NFOV) {
  let canvas, ctx, lastUpdate, frameCount, assets, sprites, player, walls, enemies, nfov

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
  ].map(function (row) {
    return row.split('')
  })

  const config = {
    player: {
      speed: 5
    },
    enemy: {
      speed: 2,
      chance: {
        spawn: 15,
        move: 30
      }
    }
  }

  function loadAsset (path) {
    const asset = new Image()
    asset.src = path
    return asset
  }

  function createSprite (x, y, width, height, image, name) {
    return {
      x: x,
      y: y,
      width: width,
      height: height,
      rotation: 0,
      image: image,
      name: name
    }
  }

  function chanceRoll (chance) {
    return chance > 0 && chance >= Math.random() * 100
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
    // const calculateNfov = frameCount % 2 === 0
    const calculateNfov = true

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

      if (calculateNfov) {
        enemy.image = assets.enemy
      }
    })

    checkCollision(player, walls)

    checkCollision(enemies.filter((enemy) => enemy.vx + enemy.vy !== 0), walls, function (enemy) {
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

    if (calculateNfov) {
      nfov.detect(player, enemies, function (player, enemy) {
        enemy.image = assets.enemyVisible
      })
    }
  }

  function render () {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    sprites.forEach(function (sprite) {
      let center = {
        x: sprite.x + (sprite.width / 2),
        y: sprite.y + (sprite.height / 2)
      }

      ctx.save()
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.translate(center.x, center.y)
      ctx.rotate(deg2Rad(sprite.rotation))
      ctx.translate(-center.x, -center.y)
      ctx.drawImage(sprite.image, sprite.x, sprite.y)

      // draws the player fov
      if (sprite.name === 'player') {
        let angle = deg2Rad(sprite.rotation > 0 ? 360 - sprite.rotation : 0) + nfov.getAngle(NFOV.RADIANS) / 2
        ctx.setTransform(1, 0, 0, 1, 0, 0)
        ctx.beginPath()
        ctx.moveTo(center.x, center.y)
        ctx.lineTo(center.x + nfov.getDistance() * Math.cos(angle), center.y - nfov.getDistance() * Math.sin(angle))
        ctx.arc(center.x, center.y, nfov.getDistance(), -angle, nfov.getAngle(NFOV.RADIANS) - angle)
        ctx.lineTo(center.x, center.y)
        ctx.lineWidth = 1
        ctx.strokeStyle = 'red'
        ctx.stroke()
        ctx.closePath()
      }

      ctx.restore()
    })
  }

  function create () {
    assets = {
      player: loadAsset('assets/player.svg'),
      enemy: loadAsset('assets/enemy.svg'),
      enemyVisible: loadAsset('assets/enemy-visible.svg'),
      wall: loadAsset('assets/brick.svg')
    }

    player = createSprite(0, 0, 24, 24, assets.player, 'player')
    player.vx = player.vy = 0

    walls = []
    enemies = []

    level.forEach(function (row, i) {
      row.forEach(function (block, j) {
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
            let wall = createSprite(j * 32, i * 32, 32, 32, assets.wall, 'wall')
            walls.push(wall)
            break
          case 'O':
            let enemy = createSprite((j * 32 + 4), (i * 32 + 4), 24, 24, assets.enemy, 'enemy')
            configureEnemy(enemy, config.enemy)
            enemies.push(enemy)
            break
        }
      })
    })

    sprites = walls.concat(enemies).concat([player])

    nfov = new NFOV({
      distance: 200,
      angle: 90,
      angleUnit: NFOV.DEGREES,
      orientation: NFOV.CLOCKWISE,
      grid: level,
      tileSize: {
        width: 32,
        height: 32
      },
      acceptableTiles: [' ', 'P', 'O']
    })
  }

  function gameLoop (timestamp) {
    if (lastUpdate) {
      frameCount++
      update((timestamp - lastUpdate) / 1000)
      render()
    } else {
      frameCount = 0
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
}(window.requestAnimationFrame, window.Key, window.Image, window.nfov))
