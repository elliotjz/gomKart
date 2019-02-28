
module.exports = {
  SENSITIVITY: 5,
  SENSITIVITY2: 250,

  getUpdatedScoreHistory: function(tournament, places) {
    let { scoreHistory } = tournament
    const newEloScores = this.getNewEloScores(tournament,
      JSON.parse(JSON.stringify(places)))

    const playersInRace = Object.keys(newEloScores)
    if (newEloScores === undefined && playersInRace.length === 0) {
      throw "Error calculating new ELO scores"
    }
    
    const raceNumber = tournament.raceCounter + 1
    const raceNumberStr = raceNumber.toString()
    for (let i = 0; i < scoreHistory.length; i++) {
      const playerName = scoreHistory[i].name
      if (playersInRace.includes(playerName)) {
        // Update player score in tournament object
        scoreHistory[i].scores[raceNumberStr] = newEloScores[playerName]
      }
    }
    return scoreHistory
  },

  getNewEloScores: function(tournament, places) {
    const eloScores = this.getOldScores(tournament, places) // oldScores = { "Elliot": 210, "Jake": 220 }
    // append computer players to places object
    let i = 1
    while (Object.keys(places).length < 12) {
      const placeValues = Object.values(places)
      if (!placeValues.includes(i.toString())) {
        const compName = "_comp" + i.toString()
        places[compName] = i
      } else {
        // Check whether there are more than one players in
        // the previous position.
        const count = placeValues.reduce((n, val) => {
          return n + (val === i.toString())
        }, 0)
        if (count > 1) {
          // make sure a computer player is not added in the next position
          i += count - 1
        }
      }
      i += 1
    }

    // calculate the change in score for each player
    let scoreChanges = {}
    for (let player in places) {
      scoreChanges[player] = 0
      const playerIsComp = player.charAt(0) === '_'
      for (let opponent in places) {
        const opponentIsComp = opponent.charAt(0) === '_'
        if (player !== opponent && !(playerIsComp && opponentIsComp)) {
          // at least one of the players are not computers
          const playerOldScore = playerIsComp ?
            eloScores["_comp"] : eloScores[player]
          const opponentOldScore = opponentIsComp ?
            eloScores["_comp"] : eloScores[opponent]
          const scoreChange = this.getPlayerScoreChange(
            playerOldScore,
            opponentOldScore,
            parseInt(places[player]),
            parseInt(places[opponent])
          )
          scoreChanges[player] += scoreChange
        }
      }
    }

    // add score differences to old scores
    for (let player in places) {
      if (player.charAt(0) === '_') {
        // player is a computer
        eloScores["_comp"] += scoreChanges[player]
      } else {
        // player is not a computer
        eloScores[player] += scoreChanges[player]
      }
    }
    return eloScores
  },

  getOldScores: function(tournament, places) {
    let { scoreHistory } = tournament
    // get all player's old scores
    let oldScores = {}
    for (let i = 0; i < scoreHistory.length; i++) {
      const name = scoreHistory[i].name
      if (Object.keys(places).includes(name) || name === "_comp") {
        // find latest score
        let latestScore
        let j = tournament.raceCounter
        while (j >= 0 && latestScore === undefined) {
          if (j.toString() in scoreHistory[i].scores) {
            latestScore = scoreHistory[i].scores[j.toString()]
          }
          j -= 1
        }
        if (latestScore === undefined) throw "Couldn't find scores"
        oldScores[scoreHistory[i].name] = latestScore
      }
    }
    return oldScores
  },

  getPlayerScoreChange: function(playerScore, opponentScore, playerPlace, opponentPlace) {
    const playerExpected = 1 / (1 + Math.pow(10, (opponentScore - playerScore) / this.SENSITIVITY2))
    let result
    console.log(playerPlace + 1);
    console.log(opponentPlace + 1);
    if (playerPlace === opponentPlace) result = 0.5 // Draw
    else if (playerPlace < opponentPlace) result = 1 // Player won
    else result = 0 // Player lost
    const scoreChange = this.SENSITIVITY * (result - playerExpected)
    return scoreChange
  }
}

