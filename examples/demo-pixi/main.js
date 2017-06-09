(function (PIXI, requestAnimationFrame, Key, NFOV) {
  let renderer, stage, state, player, walls, enemies, fov, nfov, frameCount

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

  function chanceRoll (chance) {
    return chance > 0 && chance >= Math.random() * 100
  }

  function deg2Rad (deg) {
    return (deg * Math.PI) / 180
  }

  function configureEnemy (enemy, config) {
    enemy.vx = enemy.vy = 0

    if (chanceRoll(config.chance.move)) {
      if (chanceRoll(50)) {
        enemy.vx = config.speed
        enemy.rotation = 0
      } else {
        enemy.vy = config.speed * -1
        enemy.rotation = deg2Rad(90)
      }

      if (chanceRoll(50)) {
        enemy.vx *= -1
        enemy.vy *= -1
        enemy.rotation += deg2Rad(180)
      }
    }
  }

  function forEachSprite (sprites, callback) {
    if (sprites instanceof PIXI.Sprite) {
      return callback(sprites)
    } else if (sprites instanceof PIXI.Container) {
      sprites.children.forEach(function (sprite) {
        forEachSprite(sprite, callback)
      })
    }
  }

  function checkCollision (sprites1, sprites2, callback) {
    forEachSprite(sprites1, function (s1) {
      forEachSprite(sprites2, function (s2) {
        let x1 = s1.x - (s1.width / 2)
        let y1 = s1.y - (s1.height / 2)
        let x2 = s2.x - (s2.width / 2)
        let y2 = s2.y - (s2.height / 2)

        let collided =
          x1 < x2 + s2.width &&
          x1 + s1.width > x2 &&
          y1 < y2 + s2.height &&
          y1 + s1.height > y2

        if (collided) {
          if (s1.vx > 0) {
            s1.x = x2 - (s1.width / 2)
          } else if (s1.vx < 0) {
            s1.x = x2 + s2.width + (s1.width / 2)
          }

          if (s1.vy > 0) {
            s1.y = y2 - (s1.height / 2)
          } else if (s1.vy < 0) {
            s1.y = y2 + s2.height + (s1.height / 2)
          }

          s1.vx = s1.vy = 0

          if (typeof callback === 'function') {
            callback(s1, s2)
          }
        }
      })
    })
  }

  function play () {
    // const calculateNfov = frameCount % 2 === 0
    const calculateNfov = true

    player.vx = player.vy = 0

    if (Key.isDown(Key.LEFT)) {
      player.vx -= config.player.speed
      player.rotation = deg2Rad(180)
    } else if (Key.isDown(Key.RIGHT)) {
      player.vx += config.player.speed
      player.rotation = 0
    } else if (Key.isDown(Key.UP)) {
      player.vy -= config.player.speed
      player.rotation = deg2Rad(270)
    } else if (Key.isDown(Key.DOWN)) {
      player.vy += config.player.speed
      player.rotation = deg2Rad(90)
    }

    player.x += player.vx
    player.y += player.vy

    fov.position.x = player.position.x
    fov.position.y = player.position.y
    fov.rotation = player.rotation

    enemies.children.forEach(function (enemy) {
      enemy.x += enemy.vx
      enemy.y += enemy.vy

      if (calculateNfov) {
        enemy.setTexture(PIXI.loader.resources.enemy.texture)
      }
    })

    checkCollision(player, walls)

    checkCollision(enemies, walls, function (enemy) {
      if (enemy.rotation === 0) {
        enemy.vx = config.enemy.speed * -1
        enemy.rotation = deg2Rad(180)
      } else if (enemy.rotation === deg2Rad(180)) {
        enemy.vx = config.enemy.speed
        enemy.rotation = 0
      } else if (enemy.rotation === deg2Rad(270)) {
        enemy.vy = config.enemy.speed * -1
        enemy.rotation = deg2Rad(90)
      } else if (enemy.rotation === deg2Rad(90)) {
        enemy.vy = config.enemy.speed
        enemy.rotation = deg2Rad(270)
      }
    })

    if (calculateNfov) {
      nfov.detect(player, enemies.children, function (player, enemy) {
        enemy.setTexture(PIXI.loader.resources.enemyVisible.texture)
      })
    }
  }

  function gameLoop () {
    state()
    renderer.render(stage)
    requestAnimationFrame(gameLoop)
    frameCount++
  }

  function setup () {
    frameCount = 0
    stage = new PIXI.Container()

    player = new PIXI.Sprite(PIXI.loader.resources.player.texture)
    player.width = player.height = 24
    player.anchor.set(0.5, 0.5)
    stage.addChild(player)

    walls = new PIXI.Container()
    stage.addChild(walls)

    enemies = new PIXI.Container()
    stage.addChild(enemies)

    level.forEach(function (row, i) {
      row.forEach(function (block, j) {
        if (block === ' ') {
          if (chanceRoll(config.enemy.chance.spawn)) {
            block = 'O'
          }
        }

        switch (block) {
          case 'P':
            player.position.set((j * 32) + 16, (i * 32) + 16)
            break
          case 'X':
            let wall = new PIXI.Sprite(PIXI.loader.resources.wall.texture)
            wall.position.set((j * 32) + 16, (i * 32) + 16)
            wall.width = wall.height = 32
            wall.anchor.set(0.5, 0.5)
            walls.addChild(wall)
            break
          case 'O':
            let enemy = new PIXI.Sprite(PIXI.loader.resources.enemy.texture)
            enemy.position.set((j * 32) + 16, (i * 32) + 16)
            enemy.width = enemy.height = 24
            enemy.anchor.set(0.5, 0.5)
            configureEnemy(enemy, config.enemy)
            enemies.addChild(enemy)
            break
        }
      })
    })

    nfov = new NFOV({
      distance: 200,
      angle: deg2Rad(90),
      angleUnit: NFOV.RADIANS,
      orientation: NFOV.CLOCKWISE,
      grid: level,
      tileSize: {
        width: 32,
        height: 32
      },
      acceptableTiles: [' ', 'P', 'O']
    })

    let angle = nfov.getAngle(NFOV.RADIANS) / 2
    fov = new PIXI.Graphics()
    fov.position.set(player.position.x, player.position.y)
    fov.lineStyle(1, 0xFF00000)
    fov.moveTo(0, 0)
    fov.lineTo(nfov.getDistance() * Math.cos(angle), -nfov.getDistance() * Math.sin(angle))
    fov.arc(0, 0, nfov.getDistance(), -angle, nfov.getAngle(NFOV.RADIANS) - angle)
    fov.lineTo(0, 0)
    stage.addChild(fov)

    state = play
    gameLoop()
  }

  window.onload = function () {
    renderer = PIXI.autoDetectRenderer(level[0].length * 32, level.length * 32)
    renderer.backgroundColor = 0x999999
    document.body.appendChild(renderer.view)

    PIXI.loader
      .add('wall', 'assets/brick.svg')
      .add('enemy', 'assets/enemy.svg')
      .add('enemyVisible', 'assets/enemy-visible.svg')
      .add('player', 'assets/player.svg')
      .load(setup)
  }
}(window.PIXI, window.requestAnimationFrame, window.Key, window.nfov))
