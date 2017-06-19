const playerPool = [{
  x: 100,
  y: 50,
  width: 32,
  height: 32,
  direction: 5
}, {
  x: 500,
  y: 320,
  width: 32,
  height: 32,
  direction: 1
}, {
  x: 150,
  y: 450,
  width: 32,
  height: 32,
  direction: 3
}, {
  x: 615,
  y: 15,
  width: 32,
  height: 32,
  direction: 0
}, {
  x: 153,
  y: 135,
  width: 32,
  height: 32,
  direction: 2
}, {
  x: 684,
  y: 161,
  width: 32,
  height: 32,
  direction: 4
}, {
  x: 465,
  y: 181,
  width: 32,
  height: 32,
  direction: 1
}]

const objectPool = [{
  x: 15,
  y: 156,
  width: 32,
  height: 32
}, {
  x: 165,
  y: 81,
  width: 32,
  height: 32
}, {
  x: 654,
  y: 182,
  width: 32,
  height: 32
}, {
  x: 467,
  y: 358,
  width: 32,
  height: 32
}, {
  x: 153,
  y: 294,
  width: 32,
  height: 32
}, {
  x: 581,
  y: 451,
  width: 32,
  height: 32
}, {
  x: 716,
  y: 515,
  width: 32,
  height: 32
}, {
  x: 168,
  y: 235,
  width: 32,
  height: 32
}]

module.exports = {
  getPlayer () {
    return playerPool[0]
  },

  getObject () {
    return objectPool[0]
  },

  getListPlayers (nPlayers) {
    const players = []
    let idxPlayer = 0

    for (let i = 0; i < nPlayers; i++) {
      players.push(playerPool[idxPlayer++])
      idxPlayer = idxPlayer < playerPool.length ? idxPlayer : 0
    }

    return players
  },

  getListObjects (nObjects) {
    const objects = []
    let idxObject = 0

    for (let i = 0; i < nObjects; i++) {
      objects.push(objectPool[idxObject++])
      idxObject = idxObject < objectPool.length ? idxObject : 0
    }

    return objects
  }
}
