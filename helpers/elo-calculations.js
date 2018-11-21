
module.exports = {
  SENSITIVITY: 5,
  SENSITIVITY2: 250,


  getNewEloScores: function(tournament, places) {
    const eloScores = this.getOldScores(tournament)
    
    // append computer players to places object
    for (let i = 1; i <= 12; i++) {
      if (!Object.values(places).includes(i.toString())) {
        const compName = "_comp" + i.toString()
        places[compName] = i
      }
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
          // console.log(`${player}, ${opponent}`)
          const playerOldScore = playerIsComp ?
            eloScores["_comp"] : eloScores[player]
          const opponentOldScore = opponentIsComp ?
            eloScores["_comp"] : eloScores[opponent]
          const scoreChange = this.getPlayerScoreChange(
            playerOldScore,
            opponentOldScore,
            places[player],
            places[opponent]
          )
          scoreChanges[player] += scoreChange
          // console.log(`${playerOldScore}, ${opponentOldScore}, ${places[player]}, ${places[opponent]}, ${scoreChange}`)
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

  getOldScores: function(tournament) {
    let { scoreHistory } = tournament
    // get all player's old scores
    let oldScores = {}
    for (let i = 0; i < scoreHistory.length; i++) {
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
    return oldScores
  },

  getPlayerScoreChange: function(playerScore, opponentScore, playerPlace, opponentPlace) {
    // console.log(`${playerScore}, ${opponentScore}, ${playerPlace}, ${opponentPlace}`)
    const playerExpected = 1 / (1 + Math.pow(10, (opponentScore - playerScore) / this.SENSITIVITY2))
    let result
    if (playerPlace === opponentPlace) result = 0.5
    else if (playerPlace < opponentPlace) result = 1
    else result = 0
    // console.log(result)
    const scoreChange = this.SENSITIVITY * (result - playerExpected)
    return scoreChange
  },

  getUpdatedScoreHistory: function(tournament, places) {
    let { scoreHistory } = tournament
    const newEloScores = this.getNewEloScores(tournament, places)
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
  }
}

