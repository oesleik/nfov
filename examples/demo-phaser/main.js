(function (Phaser) {
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
      speed: 300
    },
    enemy: {
      speed: 100,
      chance: {
        spawn: 1,
        move: 30
      }
    }
  }

  function mainState (game, level, config) {
    let cursors, player, walls, enemies

    function createEnemy (game, x, y, config) {
      let enemy = game.add.sprite(x, y, 'enemy')
      enemy.body.immovable = !Phaser.Utils.chanceRoll(config.chance.move)
      enemy.anchor.setTo(0.5, 0.5)

      if (!enemy.body.immovable) {
        if (Phaser.Utils.chanceRoll(50)) {
          enemy.body.velocity.x = config.speed
          enemy.angle = 0
        } else {
          enemy.body.velocity.y = config.speed * -1
          enemy.angle = 90
        }

        if (Phaser.Utils.chanceRoll(50)) {
          enemy.body.velocity.x *= -1
          enemy.body.velocity.y *= -1
          enemy.angle = enemy.angle === 0 ? 180 : 270
        }
      }

      return enemy
    }

    return {
      preload () {
        game.load.image('wall', 'assets/brick.svg', 32, 32)
        game.load.image('enemy', 'assets/enemy.svg', 24, 24)
        game.load.image('player', 'assets/player.svg', 24, 24)
      },

      create () {
        game.stage.backgroundColor = '#999'

        game.physics.startSystem(Phaser.Physics.ARCADE)
        game.world.enableBody = true

        walls = game.add.group()
        enemies = game.add.group()

        player = game.add.sprite(100, 100, 'player')
        player.body.collideWorldBounds = true
        player.anchor.setTo(0.5, 0.5)

        level.forEach(function (line, i) {
          line.split('').forEach(function (block, j) {
            if (block === ' ') {
              if (Phaser.Utils.chanceRoll(config.enemy.chance.spawn)) {
                block = 'O'
              }
            }

            switch (block) {
              case 'P':
                player.x = (j * 32) + 16
                player.y = (i * 32) + 16
                break
              case 'X':
                let wall = game.add.sprite(j * 32, i * 32, 'wall')
                wall.body.immovable = true
                walls.add(wall)
                break
              case 'O':
                enemies.add(createEnemy(game, (j * 32) + 16, (i * 32) + 16, config.enemy))
                break
            }
          })
        })

        cursors = game.input.keyboard.createCursorKeys()
      },

      update () {
        player.body.velocity.x = 0
        player.body.velocity.y = 0

        if (cursors.left.isDown) {
          player.body.velocity.x -= config.player.speed
          player.angle = 180
        } else if (cursors.right.isDown) {
          player.body.velocity.x += config.player.speed
          player.angle = 0
        } else if (cursors.up.isDown) {
          player.body.velocity.y -= config.player.speed
          player.angle = 270
        } else if (cursors.down.isDown) {
          player.body.velocity.y += config.player.speed
          player.angle = 90
        }

        game.physics.arcade.collide(player, walls)

        game.physics.arcade.collide(enemies, walls, function (enemy) {
          if (enemy.angle === 0) {
            enemy.body.velocity.x = config.enemy.speed * -1
            enemy.angle = 180
          } else if (Math.abs(enemy.angle) === 180) {
            enemy.body.velocity.x = config.enemy.speed
            enemy.angle = 0
          } else if (enemy.angle === -90) {
            enemy.body.velocity.y = config.enemy.speed * -1
            enemy.angle = 90
          } else if (enemy.angle === 90) {
            enemy.body.velocity.y = config.enemy.speed
            enemy.angle = 270
          }
        })
      }
    }
  }

  const game = new Phaser.Game(level[0].length * 32, level.length * 32)
  game.state.add('main', mainState(game, level, config))
  game.state.start('main')
}(window.Phaser))
